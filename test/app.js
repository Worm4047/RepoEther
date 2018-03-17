import "../css/util.css";
import "../css/main.css";
import "../css/dashboard.css";


import { Connect, SimpleSigner, MNID } from 'uport-connect'
// import { default as contract } from 'truffle-contract'
import reporter_artifacts from '../../build/contracts/Reporter.json'

// var Reporter = contract(reporter_artifacts);

const uport = new Connect('Tushalien \'s new app', {
  clientId: '2otuaQSRzeDaUTBSYScEUctSnjFL2KwSFiH',
  network: 'rinkeby',
  signer: SimpleSigner('d41df28a2404ae1ccafed0f032b495c8d38371567ff003cea859035b8b2b2c7a')
})

ABI = "sdf";
const web3 = uport.getWeb3();
const reporterContract = web3.eth.contract(ABI);
const reporterInstance = reporterContract.at('0xc7a151613095d1638b03963146da043970528d7c')


var decodedId, specificNetworkAddress

// Request credentials to login
window.loginUport = function(){
  uport.requestCredentials({requested: ['name', 'avatar', 'phone', 'country'], notifications: true})
  .then((userProfile) => {
    // Do something
    console.log("Recieved credentials", userProfile);
    decodedId = MNID.decode(userProfile.address)
    specificNetworkAddress = decodedId.address
    console.log(decodedId, specificNetworkAddress);
    sessvars.userProfile = userProfile;
    sessvars.decodedId = decodedId;
    sessvars.specificNetworkAddress = specificNetworkAddress;
    window.location = "/dashboard.html";
  }) 
}
