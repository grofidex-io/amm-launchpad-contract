// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.13;
pragma abicoder v2;

interface ILaunchpadManager {
    function stakingContract() external view returns (address);

    function snapshotId() external view returns (uint256);

    function isCaculator(address sender) external view returns (bool);

    function plusCommit(address user, uint256 amount) external;

    function minusCommit(address user, uint256 amount) external;

    function minusGiveBack(address user, uint256 amount) external;

    function plusLimitForNextRound(address nextRound, uint256 amount) external;

    function transferCommit(uint256 amountGiveBack) external payable;

    function depositValue() external payable;
}
