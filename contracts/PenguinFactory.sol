pragma solidity ^0.4.18;

contract PenguinFactory {

    event NewPenguin(uint penguinId, string name, uint dna);

    uint dnaDigits = 6;
    uint dnaModulus = 10 ** dnaDigits;

    struct Penguin {
        string name;
        uint dna;
    }

    Penguin[] public penguins;

    function _createPenguin(string _name, uint _dna) private {
        uint id = penguins.push(Penguin(_name, _dna)) - 1;
        NewPenguin(id, _name, _dna);
    } 

    function _generateRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
    }

    function createRandomPenguin(string _name) public {
        uint randDna = _generateRandomDna(_name);
        _createPenguin(_name, randDna);
    }

    function getPenguinCount() public constant returns(uint) {
        return penguins.length;
    }

    function getPenguin(uint index) public constant returns(string, uint) {
        return (penguins[index].name, penguins[index].dna);
    }
}
