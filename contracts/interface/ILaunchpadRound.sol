// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.13;
pragma abicoder v2;

interface ILaunchpadRound {
    function receiptLimitCommit(uint256 amount) external;

    function givebackStatus(address user) external view returns(uint256, uint256);

    function roundType() external view returns(string memory);

    function claimGiveBackFromManager(address user) external returns(uint256);

    function checkTier(address account) external view returns(bool);
    
    function maxCommitAmount() external view returns(uint256);

    function currentCommit() external view returns(uint256);

}
