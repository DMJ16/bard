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
    string private _uri;
    uint256
        private constant PACK_INDEX = 0x00000000000000000000000000000000000000000000000000000000000007FF;
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
        string memory _newuri
    ) public valuesInRange(_idValues) ERC1155(_newuri) {
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

    function mintBatch(uint256[] memory _ids, uint256[] memory _amounts)
        public
        valuesInRange(_ids)
    {
        _mintBatch(msg.sender, _ids, _amounts, "");
        for (uint256 i = 0; i < _ids.length; i++) {
            tokenSupply[_ids[i]] = _amounts[i];
        }
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

    function getURI(string memory uri, uint256 _id)
        public
        view
        creatorsOnly(_id)
        returns (string memory)
    {
        return toFullURI(uri, _id);
    }
}
