// Allows us to use ES6 in our migrations and tests.
require('babel-register')
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "during below diary sunset language system mutual retire track ocean filter grab" 

module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/GT650Dz4fUm2eSgLUfX8")
      },
      network_id: 3,
      gas: 4600000
    },
  	development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*",
      gas: 4600000// Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/GT650Dz4fUm2eSgLUfX8")
      },
      network_id: 4,
      gas: 4600000
    }   
  }
};