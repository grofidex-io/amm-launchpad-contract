// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./interface/IGroFiStakingManager.sol";
import "./interface/ILaunchpadManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LaunchpadRoundWhitelistPrivate is AccessControl {
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  address public launchpadContract;
  uint256 public startAddWhiteList;
  uint256 public endAddWhiteList;
  uint256 public maxBuyPerUser;
  uint256 public start;
  uint256 public end;
  uint256 public maxCommitAmount;
  uint256 public currentCommit;
  uint256 public startCancel;
  uint256 public endCancel;
  uint256 public percentCancel;
  uint256 public lastCurrentCommit;
  string constant public roundType = "WHITELIST"; ///TIER, WHITELIST, COMMUNITY

  mapping(address => UserCommit) public userCommit;

  mapping(address => bool) public addWhiteListAvail;

  event Commit(address indexed committer, address indexed launchpadContract, uint256 indexed amount);
  event CancelCommit(address indexed committer, address indexed launchpadContract, uint256 indexed amount, uint256 fee);
  event ClaimGiveBack(address indexed committer, address indexed launchpadContract, uint256 indexed amount);
  event ApplyWhiteList(address indexed user);
  event UpdateLimitCommit(uint256 indexed limitCommit);

  function getConfigInfo() public view returns(ConfigInfo memory) {
    return ConfigInfo(
      0,
      0,
      maxBuyPerUser,
      start,
      end,
      startAddWhiteList,
      endAddWhiteList,
      maxCommitAmount,
      startCancel,
      endCancel,
      roundType
    );
  }

  struct ConfigInfo {
    uint256 minStake;
    uint256 maxStake;
    uint256 maxBuyPerUser;
    uint256 start;
    uint256 end;
    uint256 startAddWhiteList;
    uint256 endAddWhiteList;
    uint256 maxCommitAmount;
    uint256 startCancel;
    uint256 endCancel;
    string typeRound;
  }

  constructor(
    address _admin
  ) {
    _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    _grantRole(OPERATOR_ROLE, _admin);
  }

  function updateConfig(
    address _launchpadContract,
    uint256 _startAddWhiteList,
    uint256 _endAddWhiteList,
    uint256 _maxBuyPerUser,
    uint256 _start,
    uint256 _end,
    uint256 _maxCommitAmount,
    uint256 _startCancel,
    uint256 _endCancel,
    uint256 _percentCancel
  ) public onlyRole(OPERATOR_ROLE) {
    launchpadContract = _launchpadContract;
    startAddWhiteList = _startAddWhiteList;
    endAddWhiteList = _endAddWhiteList;
    maxBuyPerUser = _maxBuyPerUser;
    start = _start;
    end = _end;
    maxCommitAmount = _maxCommitAmount;
    startCancel = _startCancel;
    endCancel = _endCancel;
    percentCancel = _percentCancel;
  }

  struct UserCommit {
    uint256 u2uCommited;
    uint256 giveBackAmount;
    bool isWhiteList;
  }

  function commit() public payable {
    require(block.timestamp > start && block.timestamp < end, "E1");
    require(userCommit[msg.sender].isWhiteList, "E5");
    uint256 availCommit = msg.value;
    require(currentCommit < maxCommitAmount, "E4");
    if (msg.value > maxCommitAmount - currentCommit) {
      availCommit = maxCommitAmount - currentCommit;
      safeTransferU2U(msg.sender, msg.value - availCommit);
    }
    require(availCommit + userCommit[msg.sender].u2uCommited <= maxBuyPerUser, "E3");
    currentCommit += availCommit;
    userCommit[msg.sender].u2uCommited += availCommit;
    ILaunchpadManager(launchpadContract).plusCommit(msg.sender, availCommit);
    emit Commit(msg.sender, launchpadContract, availCommit);
  }

  function cancelCommit() public {
    require(userCommit[msg.sender].u2uCommited != 0, "E3");
    uint256 realCommit = userCommit[msg.sender].u2uCommited;
    uint256 fee;
    require(block.timestamp < endCancel && block.timestamp > startCancel, "E1");
    fee = realCommit * percentCancel / 100 ether;
    currentCommit -= realCommit;
    ILaunchpadManager(launchpadContract).minusCommit(msg.sender, realCommit);
    emit CancelCommit(msg.sender, launchpadContract, realCommit, fee);
    userCommit[msg.sender].u2uCommited = 0;
    safeTransferU2U(msg.sender, realCommit - fee);
    safeTransferU2U(launchpadContract, fee);
  }

  function addToWhitelistByOperator(address[] memory users) public onlyRole(OPERATOR_ROLE) {
    for (uint16 i = 0; i < users.length; i++) {
      if (addWhiteListAvail[users[i]] == false) addWhiteListAvail[users[i]] = true;
    }
  }

  function addWhiteList() public {
    require(block.timestamp < endAddWhiteList && block.timestamp > startAddWhiteList, "E1");
    require(addWhiteListAvail[msg.sender], "E3");
    require(userCommit[msg.sender].isWhiteList == false);
    userCommit[msg.sender].isWhiteList = true;
    emit ApplyWhiteList(msg.sender);
  }

  function calculatorPhase(address nextRound) public onlyRole(OPERATOR_ROLE) {
    require(block.timestamp > endCancel, "E1");
    if (maxCommitAmount > currentCommit) {
      ILaunchpadManager(launchpadContract).transferCommit{value: currentCommit}(0);
      if (nextRound != address(0)) ILaunchpadManager(launchpadContract).plusLimitForNextRound(nextRound, maxCommitAmount - currentCommit);
      maxCommitAmount = currentCommit;
    }
    else {
      ILaunchpadManager(launchpadContract).transferCommit{value: maxCommitAmount}(0);
    }
  }

  function receiptLimitCommit(uint256 amount) public {
    require(msg.sender == launchpadContract);
    maxCommitAmount += amount;
    emit UpdateLimitCommit(maxCommitAmount);
  }

  function safeTransferU2U(address to, uint256 value) internal {
    (bool success, ) = to.call{value: value}(new bytes(0));
    require(success, 'STE');
  }
}