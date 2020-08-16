//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.8;
import "@nomiclabs/buidler/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

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
    string private uri;
    address public proxyRegistryAddress;

    modifier creatorsOnly(uint256 _id) {
        address creator;
        for (uint256 i = 0; i < creators[_id].length; i++) {
            if (creators[_id][i] == msg.sender) {
                creator = creators[_id][i];
            }
        }
        require(msg.sender == creator);
        _;
    }

    modifier idInRange(uint256 _id) {
        require(_id >= 0 && _id < 5);
        _;
    }

    modifier valuesInRange(uint256[] memory _values) {
        bool tester = true;
        for (uint256 i = 0; i < _values.length; i++) {
            if (_values[i] < 0 || _values[i] > 4) {
                tester = false;
            }
        }
        require(tester == true);
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint256[] memory _idValues,
        address _proxyRegistryAddress,
        string memory _uri
    ) public valuesInRange(_idValues) ERC1155(_uri) {
        for (uint256 i = 0; i < _idValues.length; i++) {
            creators[_idValues[i]].push(msg.sender);
        }
        name = _name;
        symbol = _symbol;
        proxyRegistryAddress = _proxyRegistryAddress;
    }

    function mint(uint256 _id, uint256 _amount)
        public
        idInRange(_id)
        creatorsOnly(_id)
    {
        _mint(msg.sender, _id, _amount, "");
        tokenSupply[_id] = _amount;
    }

    function mintBatch(uint256[] memory _ids, uint256[] memory _amount)
        public
        valuesInRange(_ids)
    {
        _mintBatch(msg.sender, _ids, _amount, "");
    }
    // function setURI(string memory _newuri, uint256 _id)
    //     public
    //     creatorsOnly(_id)
    // {
    //     _setURI(_newuri);
    // }

    // function burn(address _owner, uint256 _id, uint256 _value) public {
    //     _burn(_owner, _id, _value);
    // }

    // function burnBatch(address _owner, uint256[] memory _ids, uint256[] memory _values) public {
    //     _burnBatch(_owner, _ids, _values);
    // }
}
