// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./interface/ILaunchpadRound.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LaunchpadManager is AccessControl {
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  uint256 public start;
  uint256 public end;
  uint256 public softcap;
  uint256 public tokenAmountBelongToPublisher;
  uint256 public u2uBelongToPublisher;
  address public publisher;
  address public stakingContract;
  address public tokenLaunchpad;
  uint256 public snapshotId;
  uint256 public totalCommit;
  uint256 public tokenRate;
  address[] public rounds;

  mapping(address => uint256) public totalCommitByUser;

  mapping(address => bool) public isCalculator;

  event ClaimToken(address indexed committer, address indexed launchpadContract, uint256 indexed tokenAmount);
  event Refund(address indexed committer, address indexed launchpadContract, uint256 indexed amount);

  constructor (
    address _admin
  ) {
    _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    _grantRole(OPERATOR_ROLE, _admin);
  }

  function updateConfig (
    address _publisher,
    address _stakingAddress,
    address _tokenLaunchpad,
    uint256 _rateToken,
    uint256 _startProject,
    uint256 _endProject,
    uint256 _softcap
  ) public onlyRole(OPERATOR_ROLE) {
    stakingContract = _stakingAddress;
    tokenLaunchpad = _tokenLaunchpad;
    publisher = _publisher;
    tokenRate = _rateToken;
    start = _startProject;
    end = _endProject;
    softcap = _softcap;
  }

  function updateSnapshotId(uint256 _snapshotId) public {
    snapshotId = _snapshotId;
  }

  function plusCommit(address user, uint256 amount) public {
    require(checkRound(msg.sender), "E10");
    totalCommitByUser[user] += amount;
    totalCommit += amount;
  }

  function minusCommit(address user, uint256 amount) public {
    require(checkRound(msg.sender), "E10");
    totalCommitByUser[user] -= amount;
    totalCommit -= amount;
  }

  function minusGiveBack(address user, uint256 amount) public {
    require(checkRound(msg.sender), "E10");
    totalCommitByUser[user] -= amount;
  }

  function plusLimitForNextRound(address nextRound, uint256 amount) public {
    require(checkRound(msg.sender), "E10");
    ILaunchpadRound(nextRound).receiptLimitCommit(amount);
  }

  function addRound(address[] memory _rounds) public onlyRole(OPERATOR_ROLE) {
    for (uint256 i = 0; i < _rounds.length; i++) {
      rounds.push(_rounds[i]);
    }
  }

  function checkRound(address _round) view public returns(bool) {
    for (uint256 i = 0; i < rounds.length; i++) {
      if (_round == rounds[i]) return true;
    }
    return false;
  }

  function checkAmountGiveBack(address _user) internal {
    for (uint256 i = 0; i < rounds.length; i++) {
      if (keccak256(abi.encodePacked(ILaunchpadRound(rounds[i]).roundType())) == keccak256(abi.encodePacked("TIER"))) {
        (uint256 giveBackAmount, uint256 gaveBackAmount) = ILaunchpadRound(rounds[i]).givebackStatus(_user);
        if (giveBackAmount != 0 && gaveBackAmount == 0) {
          uint256 amount = ILaunchpadRound(rounds[i]).claimGiveBackFromManager(_user);
          totalCommitByUser[_user] -= amount;
          return;
        }
      }
    }
  }

  function claimToken() external {
    require(totalCommitByUser[msg.sender] != 0);
    checkAmountGiveBack(msg.sender);
    if (block.timestamp > end) {
      require(totalCommit > softcap, "E6");
      IERC20(tokenLaunchpad).transfer(msg.sender, totalCommitByUser[msg.sender] * tokenRate / 1 ether);
      emit ClaimToken(msg.sender, address(this), totalCommitByUser[msg.sender] * tokenRate / 1 ether);
      totalCommitByUser[msg.sender] = 0;
    }
  }

  function withdrawSoftCap() external {
    require(block.timestamp > end, "E2");
    require(totalCommit < softcap);
    require(totalCommitByUser[msg.sender] != 0);
    
    emit Refund(msg.sender, address(this), totalCommitByUser[msg.sender]);
    uint256 getGiveBack = checkWithdrawSoftCapGiveBack();
    payable(msg.sender).transfer(totalCommitByUser[msg.sender] - getGiveBack);
    totalCommit -= (totalCommitByUser[msg.sender] - getGiveBack);
    totalCommitByUser[msg.sender] = 0;
  }

  function checkWithdrawSoftCapGiveBack() internal returns(uint256) {
    for (uint256 i = 0; i < rounds.length; i++) {
      if (keccak256(abi.encodePacked(ILaunchpadRound(rounds[i]).roundType())) == keccak256(abi.encodePacked("TIER"))) {
        (uint256 giveBackAmount, uint256 gaveBackAmount) = ILaunchpadRound(rounds[i]).givebackStatus(msg.sender);
        if (giveBackAmount != 0 && gaveBackAmount == 0) {
          uint256 amount = ILaunchpadRound(rounds[i]).claimGiveBackFromManager(msg.sender);
          return amount;
        }
      }
    }
    return 0;
  }

  function transferLaunchpadToken(address receiver, uint256 amount) public onlyRole(OPERATOR_ROLE) {
    IERC20(tokenLaunchpad).transfer(receiver, amount);
  }

  function transferU2U(address receiver, uint256 amount) public onlyRole(OPERATOR_ROLE) {
    payable(receiver).transfer(amount);
  }

  function depositToken(uint256 amount) public {
    require(msg.sender == publisher);
    tokenAmountBelongToPublisher += amount;
    IERC20(tokenLaunchpad).transferFrom(msg.sender, address(this), amount);
  }

  // receive() external payable {}

  function removeRound(address _round) external onlyRole(OPERATOR_ROLE){
    uint counter = rounds.length;
    for (uint i; i < counter; i++) {
      if (rounds[i] == _round) {
        for(uint j = i; j < counter - 1; j++) {
          rounds[j] = rounds[j + 1];
        }
        rounds.pop();
        break;
      }
    }
  }

  function viewRounds() external view returns(address[] memory) {
    return rounds;
  }

  function transferCommit(uint256 amountGiveBack) public payable {
    require(checkRound(msg.sender));
    totalCommit -= amountGiveBack;
    isCalculator[msg.sender] = true;
    u2uBelongToPublisher += msg.value;
  }

  function withdrawCommit(uint256 amount) public {
    require(msg.sender == publisher);
    require(u2uBelongToPublisher >= amount);
    u2uBelongToPublisher -= amount;
    payable(msg.sender).transfer(amount);
  }

  function viewTierPharse(address account) public view returns(address) {
    for (uint256 i = 0; i < rounds.length; i++) {
      if (keccak256(abi.encodePacked(ILaunchpadRound(rounds[i]).roundType())) == keccak256(abi.encodePacked("TIER"))) {
        if (ILaunchpadRound(rounds[i]).checkTier(account)) return rounds[i];
      }
    }
    return address(0);
  }

  function depositValue() public payable {}

}