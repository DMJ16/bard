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
    uint256
        private constant PACK_INDEX = 0x00000000000000000000000000000000000000000000000000000000000007FF;
    address payable public manager;
    string public name;
    string public symbol;
    string private _uri;
    mapping(uint256 => uint256) public tokenSupply;
    mapping(uint256 => uint256) public tokenPrices;
    mapping(address => mapping(uint256 => uint256)) private _orderBook;

    event Order(
        address indexed _customer,
        uint256 indexed _id,
        uint256 indexed _amount
    );

    event OrderBatch(
        address indexed _customer,
        uint256[] indexed _ids,
        uint256[] indexed _amounts
    );

    modifier onlyManager() {
        require(msg.sender == manager, "caller is not the manager");
        _;
    }

    constructor(
        string memory _contractName,
        string memory _contractSymbol,
        string memory _newURI,
        address payable _deployerAddress
    ) public ERC1155(_newURI) {
        manager = _deployerAddress;
        name = _contractName;
        symbol = _contractSymbol;
    }

    function setPrice(uint256 _id, uint256 _price) public onlyManager() {
        tokenPrices[_id] = _price;
    }

    function mint(uint256 _id, uint256 _amount) public onlyManager() {
        _mint(manager, _id, _amount, "");
        tokenSupply[_id] = _amount;
    }

    function mintBatch(uint256[] memory _ids, uint256[] memory _amounts)
        public
        onlyManager()
    {
        _mintBatch(manager, _ids, _amounts, "");
        for (uint256 i = 0; i < _ids.length; i++) {
            tokenSupply[_ids[i]] = _amounts[i];
        }
    }

    function getCustomerDeposit(address _customer, uint256 _id)
        public
        view
        onlyManager()
        returns (uint256)
    {
        return _orderBook[_customer][_id];
    }

    function customerDeposit(uint256 _id, uint256 _amount) external payable {
        uint256 payment = msg.value;
        require(payment >= tokenPrices[_id].mul(_amount));
        require(manager != address(0));

        _orderBook[msg.sender][_id] = _amount;

        emit Order(msg.sender, _id, _amount);
    }

    function fillOrder(
        address payable _customer,
        uint256 _id,
        uint256 _amount
    ) public onlyManager() {
        safeTransferFrom(msg.sender, _customer, _id, _amount, "");
        tokenSupply[_id] -= _amount;
        _orderBook[_customer][_id] = 0;
    }

    function customerDepositBatch(
        uint256[] calldata _ids,
        uint256[] calldata _amounts
    ) external payable {
        require(manager != address(0));
        require(_ids.length == _amounts.length);

        uint256 payment = msg.value;
        uint256 cost;
        for (uint256 i = 0; i < _ids.length; i++) {
            cost += _ids[i].mul(_amounts[i]);
            _orderBook[msg.sender][_ids[i]] = _amounts[i];
        }
        require(payment >= cost);

        emit OrderBatch(msg.sender, _ids, _amounts);
    }

    function fillOrderBatch(
        address payable _customer,
        uint256[] memory _ids,
        uint256[] memory _amounts
    ) public onlyManager() {
        safeBatchTransferFrom(msg.sender, _customer, _ids, _amounts, "");
        for (uint256 i = 0; i < _ids.length; i++) {
            tokenSupply[_ids[i]] -= _amounts[i];
            _orderBook[_customer][_ids[i]] = 0;
        }
    }

    function getURI(string memory uri, uint256 _id)
        public
        pure
        returns (string memory)
    {
        return toFullURI(uri, _id);
    }

    function setURI(string memory _newURI) public onlyManager() {
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
