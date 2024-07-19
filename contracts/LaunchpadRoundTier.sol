// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./interface/IGroFiStakingManager.sol";
import "./interface/ILaunchpadManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LaunchpadRoundTier is AccessControl {
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  address public launchpadContract;
  uint256 public minStake;
  uint256 public maxStake;
  uint256 public maxBuyPerUser;
  uint256 public start;
  uint256 public end;
  uint256 public maxCommitAmount;
  uint256 public currentCommit;
  uint256 public startCancel;
  uint256 public endCancel;
  uint256 public percentCancel;
  uint256 public lastCurrentCommit;
  uint256 public tierNumber;
  string public roundType = "TIER"; ///TIER, WHITELIST, COMMUNITY

  mapping(address => UserCommit) public userCommit;

  event Commit(address indexed committer, address indexed launchpadContract, uint256 indexed amount);
  event CancelCommit(address indexed committer, address indexed launchpadContract, uint256 indexed amount, uint256 fee);
  event ClaimGiveBack(address indexed committer, address indexed launchpadContract, uint256 indexed amount);

  constructor(
    address _admin
  ) {
    _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    _grantRole(OPERATOR_ROLE, _admin);
  }

  function getConfigInfo() public view returns(ConfigInfo memory) {
    return ConfigInfo(
      minStake,
      maxStake,
      maxBuyPerUser,
      start,
      end,
      0,
      0,
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

  function updateConfig(
    address _launchpadContract,
    uint256 _minStake,
    uint256 _maxStake,
    uint256 _maxBuyPerUser,
    uint256 _start,
    uint256 _end,
    uint256 _maxCommitAmount,
    uint256 _startCancel,
    uint256 _endCancel,
    uint256 _percentCancel,
    uint256 _tierNumber
  ) public onlyRole(OPERATOR_ROLE) {
    launchpadContract = _launchpadContract;
    minStake = _minStake;
    maxStake = _maxStake;
    maxBuyPerUser = _maxBuyPerUser;
    start = _start;
    end = _end;
    maxCommitAmount = _maxCommitAmount;
    startCancel = _startCancel;
    endCancel = _endCancel;
    percentCancel = _percentCancel;
    tierNumber = _tierNumber;
  }

  struct UserCommit {
    uint256 u2uCommited;
    uint256 giveBackAmount;
    bool isWhiteList;
  }

  function checkTier(address account) public view returns(bool) {
    if (maxStake != 0) return getBalanceSnapShot(account) >= minStake && getBalanceSnapShot(account) < maxStake;
    return getBalanceSnapShot(account) >= minStake;
  }

  function commit() public payable {
    require(block.timestamp >= start && block.timestamp < end, "E1");
    if (maxStake != 0) require(getBalanceSnapShot(msg.sender) >= minStake && getBalanceSnapShot(msg.sender) < maxStake, "E2");
    else require(getBalanceSnapShot(msg.sender) >= minStake, "E2");
    uint256 availCommit = msg.value;
    require(availCommit + userCommit[msg.sender].u2uCommited <= maxBuyPerUser, "E3");
    currentCommit += availCommit;
    userCommit[msg.sender].u2uCommited += availCommit;
    ILaunchpadManager(launchpadContract).plusCommit(msg.sender, availCommit);
    emit Commit(msg.sender, launchpadContract, availCommit);
  }

  function getBalanceSnapShot(address account) public view returns(uint256) {
    if (ILaunchpadManager(launchpadContract).snapshotId() == 0) return IGroFiStakingManager(ILaunchpadManager(launchpadContract).stakingContract()).stakeOf(account);
    return IGroFiStakingManager(ILaunchpadManager(launchpadContract).stakingContract()).stakeOfAt(account, ILaunchpadManager(launchpadContract).snapshotId());
  }

  function cancelCommit() public {
    require(userCommit[msg.sender].u2uCommited != 0, "E3");
    uint256 realCommit = userCommit[msg.sender].u2uCommited;
    uint256 fee;
    require(block.timestamp < endCancel && block.timestamp >= startCancel, "E1");
    if (lastCurrentCommit == 0) lastCurrentCommit = currentCommit;
    if (lastCurrentCommit > maxCommitAmount) realCommit = getCommitedForCancel(msg.sender);
    fee = realCommit * percentCancel / 100 ether;
    payable(msg.sender).transfer(userCommit[msg.sender].u2uCommited - fee - userCommit[msg.sender].giveBackAmount);
    ILaunchpadManager(launchpadContract).depositValue{value: fee}();
    currentCommit -= userCommit[msg.sender].u2uCommited;
    ILaunchpadManager(launchpadContract).minusCommit(msg.sender, userCommit[msg.sender].u2uCommited);
    emit CancelCommit(msg.sender, launchpadContract, userCommit[msg.sender].u2uCommited, fee);
    userCommit[msg.sender].u2uCommited = 0;
  }

  function getCommitedForCancel(address account) internal view returns(uint256) {
    if (end > block.timestamp || lastCurrentCommit <= maxCommitAmount) return 0;
    uint256 ratio = maxCommitAmount * 1 ether / lastCurrentCommit;
    return userCommit[account].u2uCommited * ratio / 1 ether;
  }

  function claimGiveBack() public {
    require(block.timestamp > endCancel, "E1");
    uint256 amount = getGiveBackAmountTier(msg.sender);
    require(amount != 0 && userCommit[msg.sender].giveBackAmount == 0, "E3");
    if (amount > address(this).balance) payable(msg.sender).transfer(address(this).balance);
    else payable(msg.sender).transfer(amount);
    userCommit[msg.sender].giveBackAmount = amount;
    // currentCommit -= amount;
    // totalCommitByUser[msg.sender] -= amount;
    ILaunchpadManager(launchpadContract).minusGiveBack(msg.sender, amount);
    emit ClaimGiveBack(msg.sender, launchpadContract, amount);
  }

  function claimGiveBackFromManager(address user) public returns(uint256) {
    require(msg.sender == launchpadContract);
    require(block.timestamp > endCancel, "E1");
    uint256 amount = getGiveBackAmountTier(user);
    require(amount != 0 && userCommit[user].giveBackAmount == 0, "E3");
    if (amount > address(this).balance) payable(user).transfer(address(this).balance);
    else payable(user).transfer(amount);
    userCommit[user].giveBackAmount = amount;
    // currentCommit -= amount;
    // totalCommitByUser[msg.sender] -= amount;
    // ILaunchpadManager(launchpadContract).minusCommit(user, amount);
    emit ClaimGiveBack(user, launchpadContract, amount);
    return amount;
  }

  function getGiveBackAmountTier(address account) public view returns(uint256) {
    if (endCancel > block.timestamp || currentCommit <= maxCommitAmount) return 0;
    uint256 ratio = maxCommitAmount * 1 ether / currentCommit;
    return userCommit[account].u2uCommited - (userCommit[account].u2uCommited * ratio / 1 ether);
  }

  function calculatorPhase(address nextRound) public onlyRole(OPERATOR_ROLE) {
    require(block.timestamp > endCancel, "E1");
    if (maxCommitAmount > currentCommit) {
      ILaunchpadManager(launchpadContract).transferCommit{value: currentCommit}(0);
      if (nextRound != address(0)) ILaunchpadManager(launchpadContract).plusLimitForNextRound(nextRound, maxCommitAmount - currentCommit);
      maxCommitAmount = currentCommit;
    }
    else {
      ILaunchpadManager(launchpadContract).transferCommit{value: maxCommitAmount}(currentCommit - maxCommitAmount);
    }
  }

  function receiptLimitCommit(uint256 amount) public {
    require(msg.sender == launchpadContract);
    maxCommitAmount += amount;
  }

  function givebackStatus(address account) public view returns(uint256, uint256) {
    return(getGiveBackAmountTier(account), userCommit[account].giveBackAmount);
  }

  function getGiveBack(address account) public view returns(uint256) {
    return getGiveBackAmountTier(account) - userCommit[account].giveBackAmount;
  }
}