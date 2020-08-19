// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;
import "@nomiclabs/buidler/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract BardFactory {
    Bard[] public deployedBards;

    function createBard(
        string memory _contractName,
        string memory _contractSymbol,
        uint256[] memory _idValues,
        address _deployerAddress,
        string memory _newuri
    ) public {
        Bard newBard = new Bard(
            _contractName,
            _contractSymbol,
            _idValues,
            _deployerAddress,
            _newuri
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

    mapping(uint256 => address[]) public creators;
    mapping(uint256 => uint256) public tokenSupply;
    string public name;
    string public symbol;
    address private _creator;
    string private _uri;
    uint256
        private constant PACK_INDEX = 0x00000000000000000000000000000000000000000000000000000000000007FF;

    modifier creatorsOnly(uint256 _id) {
        bool isCreator = false;
        for (uint256 i = 0; i < creators[_id].length; i++) {
            if (creators[_id][i] == msg.sender) {
                isCreator = true;
                break;
            }
        }
        require(isCreator);
        _;
    }

    modifier creatorsOnlyMultiID(uint256[] memory _ids) {
        uint256 i = 0;
        uint256 j = 0;
        uint256 count = 0;
        while (i < _ids.length && j < creators[_ids[i]].length) {
            if (count == _ids.length) {
                break;
            }
            if (creators[_ids[i]][j] == msg.sender) {
                count++;
                i++;
                j = 0;
            } else {
                j++;
            }
        }
        require(count == _ids.length);
        _;
    }

    modifier idInRange(uint256 _id) {
        require(_id >= 0 && _id < 5);
        _;
    }

    modifier idValuesInRange(uint256[] memory _values) {
        bool valueInRange = true;
        for (uint256 i = 0; i < _values.length; i++) {
            if (_values[i] < 0 || _values[i] > 4) {
                valueInRange = false;
            }
        }
        require(valueInRange == true);
        _;
    }

    constructor(
        string memory _contractName,
        string memory _contractSymbol,
        uint256[] memory _idValues,
        address _deployerAddress,
        string memory _newURI
    ) public idValuesInRange(_idValues) ERC1155(_newURI) {
        _creator = _deployerAddress;
        setCreators(_creator, _idValues);
        name = _contractName;
        symbol = _contractSymbol;
    }

    function setCreators(address _deployerAddress, uint256[] memory _idValues)
        private
    {
        for (uint256 i = 0; i < _idValues.length; i++) {
            creators[_idValues[i]].push(_deployerAddress);
        }
    }

    function mint(uint256 _id, uint256 _amount)
        public
        idInRange(_id)
        creatorsOnly(_id)
    {
        _mint(msg.sender, _id, _amount, "");
        tokenSupply[_id] = _amount;
    }

    function mintBatch(uint256[] memory _ids, uint256[] memory _amounts)
        public
        idValuesInRange(_ids)
        creatorsOnlyMultiID(_ids)
    {
        _mintBatch(msg.sender, _ids, _amounts, "");
        for (uint256 i = 0; i < _ids.length; i++) {
            tokenSupply[_ids[i]] = _amounts[i];
        }
    }

    function getURI(string memory uri, uint256 _id)
        public
        pure
        returns (string memory)
    {
        return toFullURI(uri, _id);
    }

    function setURI(string memory _newURI) public {
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
