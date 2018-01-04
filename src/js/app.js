App = {
  web3Provider: null,
  contracts: {},
  
  init: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('PenguinFactory.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PenguinFactoryArtifact = data;
      console.log(PenguinFactoryArtifact);
      App.contracts.PenguinFactory = TruffleContract(PenguinFactoryArtifact);
    
      // Set the provider for our contract
      App.contracts.PenguinFactory.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and list the adopted pets
      return App.listPenguin();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-create', App.generatePenguin);
  },

  listPenguin: function(penguinCount,account) {
    var penguinInstance;

    App.contracts.PenguinFactory.deployed().then(function(instance) {
      penguinInstance = instance;
      penguinInstance.penguins(0,function(error,result){
        console.log(result);
      });
      return penguinInstance.getPenguinCount.call();
    }).then(function(penguinCount) {
      console.log(penguinCount.toString());
      
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  generatePenguin: function(event) {
    event.preventDefault();
    var name = $('#name').val();

    var penguinInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.PenguinFactory.deployed().then(function(instance) {
        penguinInstance = instance;
        
        return penguinInstance.createRandomPenguin(name, {from: account});
      }).then(function(result) {
        return App.listPenguin();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  renderPenguin: function(id, name, dna) {
    let dnaStr = String(dna)
    while (dnaStr.length < 16)
      dnaStr = "0" + dnaStr

    let penguinDetails = {
      bodyChoice: dnaStr.substring(0, 2) % 11 + 1,
      eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
      handChoice: dnaStr.substring(4, 6) % 11 + 1,
      mouseChoice: dnaStr.substring(6, 8) % 11 + 1,
      penguinName: name,
      penguinDescription: "A Level 1 CryptoPenguin",
    }
    return penguinDetails
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
