// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract DappContract{

    //id counter
    uint public idCounter = 0;

    constructor(){
        createItem("first item", "first description");
    }

//event 

    event ItemCreated(
        uint id,
        string title,
        string description,
        bool checked,
        uint createdAt
    );

    event ItemToggleChecked(uint id, bool checked);

//Structure data (interface)
    struct Item {
        uint256 id;
        string title;
        string description;
        bool checked;
        uint256 createdAt;
    }

    mapping (uint256 => Item) public items;

//functions

//create new Item
    function createItem(string memory _title, string memory _description) public {
        idCounter++;
        items[idCounter] = Item(idCounter, _title, _description, false, block.timestamp);
        emit ItemCreated(idCounter, _title, _description, false, block.timestamp);
    }

    function toggleChecked(uint _id) public {
        Item memory _item = items[_id];
        _item.checked = !_item.checked;
        items[_id] = _item;
        emit ItemToggleChecked(_id, _item.checked);
    }

}