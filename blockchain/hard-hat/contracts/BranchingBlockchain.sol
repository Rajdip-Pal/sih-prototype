// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BranchingBlockchain {

    struct BlockData {
        uint256 timestamp;
        string data;
        uint256 prevBlock;
        uint256[] children; // store indices of child blocks
    }

    BlockData[] public blocks;

    constructor() {
        // Genesis block
        blocks.push(BlockData(block.timestamp, "Genesis Block", type(uint256).max, new uint256[](0)));
    }

    // Add a new block on top of a parent block
    function addBlock(uint256 parentIndex, string memory data) public {
        require(parentIndex < blocks.length, "Parent block does not exist");
        blocks.push(BlockData(block.timestamp, data, parentIndex, new uint256[](0)));

        // Add this block as a child to its parent
        blocks[parentIndex].children.push(blocks.length - 1);
    }

    // Get block info
    function getBlock(uint256 index) public view returns (uint256, string memory, uint256, uint256[] memory) {
        require(index < blocks.length, "Block does not exist");
        BlockData storage b = blocks[index];
        return (b.timestamp, b.data, b.prevBlock, b.children);
    }

    function getLatestBlockIndex() public view returns (uint256) {
        return blocks.length - 1;
    }
}
