// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./LaunchpadManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract FactoryLaunchpadManager is AccessControl {
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  event ManagerCreated(address contractAddress);

  constructor(address _admin) {
    _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    _grantRole(OPERATOR_ROLE, _admin);
  }


  function deployManager(address admin) public onlyRole(OPERATOR_ROLE) returns (address) {
    LaunchpadManager contractManager = new LaunchpadManager(admin);
    emit ManagerCreated(address(contractManager));
    return address(contractManager);
  }
}