// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./LaunchpadRoundCommunity.sol";
import "./LaunchpadRoundTier.sol";
import "./LaunchpadRoundWhiteList.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract FactoryLaunchpadRound is AccessControl {
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  event TierCreated(address contractAddress);
  event WhiteListCreated(address contractAddress);
  event CommunityCreated(address contractAddress);

  constructor(address _admin) {
    _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    _grantRole(OPERATOR_ROLE, _admin);
  }


  function deployTier(address admin) public onlyRole(OPERATOR_ROLE) returns (address) {
    LaunchpadRoundTier contractManager = new LaunchpadRoundTier(admin);
    emit TierCreated(address(contractManager));
    return address(contractManager);
  }

  function deployWhiteList(address admin) public onlyRole(OPERATOR_ROLE) returns (address) {
    LaunchpadRoundWhiteList contractManager = new LaunchpadRoundWhiteList(admin);
    emit WhiteListCreated(address(contractManager));
    return address(contractManager);
  }

  function deployCommunity(address admin) public onlyRole(OPERATOR_ROLE) returns (address) {
    LaunchpadRoundCommunity contractManager = new LaunchpadRoundCommunity(admin);
    emit CommunityCreated(address(contractManager));
    return address(contractManager);
  }
}