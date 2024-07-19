// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.13;
pragma abicoder v2;

interface IGroFiStakingManager {

    function stakeOfAt(address account, uint256 snapshotId) external view returns (uint256);

    function stakeOf(address account) external view returns (uint256);
    
}
