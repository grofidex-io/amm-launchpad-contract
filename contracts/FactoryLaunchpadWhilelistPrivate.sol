// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./LaunchpadRoundWhitelistPrivate.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract FactoryLaunchpadWhilelistPrivate is AccessControl {
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  event WhiteListCreated(address contractAddress);

  constructor(address _admin) {
    _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    _grantRole(OPERATOR_ROLE, _admin);
  }

  function deployWhitelist(address admin) public onlyRole(OPERATOR_ROLE) returns (address) {
    LaunchpadRoundWhitelistPrivate contractManager = new LaunchpadRoundWhitelistPrivate(admin);
    emit WhiteListCreated(address(contractManager));
    return address(contractManager);
  }

}