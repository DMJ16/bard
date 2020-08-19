// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;
import "@nomiclabs/buidler/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract BardFactory {
    Bard[] public deployedBards;

    function createBard(
        string memory _contractName,
        string memory _contractSymbol,
        string memory _newuri
    ) public {
        Bard newBard = new Bard(
            _contractName,
            _contractSymbol,
            _newuri,
            msg.sender
        );
        deployedBards.push(newBard);
    }

    function getDeployedBards() public view returns (Bard[] memory) {
        return deployedBards;
    }
}

contract Bard is ERC1155 {
    uint256 public constant ALBUM = 0;
    uint256 public constant SONG = 1;
    uint256 public constant VIDEO = 2;
    uint256 public constant SCREENPLAY = 3;
    uint256 public constant BOOK = 4;

    address public manager;
    string public name;
    string public symbol;
    string private _uri;
    uint256
        private constant PACK_INDEX = 0x00000000000000000000000000000000000000000000000000000000000007FF;

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    constructor(
        string memory _contractName,
        string memory _contractSymbol,
        string memory _newURI,
        address _deployerAddress
    ) public ERC1155(_newURI) {
        manager = _deployerAddress;
        setApprovalForAll(_deployerAddress, true);
        name = _contractName;
        symbol = _contractSymbol;
    }

    function mint(uint256 _id, uint256 _amount) public managerOnly() {
        _mint(msg.sender, _id, _amount, "");
    }

    function mintBatch(uint256[] memory _ids, uint256[] memory _amounts)
        public
        managerOnly()
    {
        _mintBatch(msg.sender, _ids, _amounts, "");
    }

    function getURI(string memory uri, uint256 _id)
        public
        pure
        returns (string memory)
    {
        return toFullURI(uri, _id);
    }

    function setURI(string memory _newURI) public managerOnly() {
        _setURI(_newURI);
    }

    function uint2str(uint256 _i)
        private
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }

        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }

        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }

        return string(bstr);
    }

    function toFullURI(string memory uri, uint256 _id)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(uri, "/", uint2str(_id & PACK_INDEX), ".json")
            );
    }
}
