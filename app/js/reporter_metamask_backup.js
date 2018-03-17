// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
// import "../css/main.css";
import "../css/util.css";
import "../css/dashboard.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'



import reporter_artifacts from '../../build/contracts/Reporter.json'

var Reporter = contract(reporter_artifacts);


window.registerComplaint = function(form) {
  console.log(form);
  let title = $('#title').val();
  let visibility = parseInt($("#visibility").val());
  let type = parseInt($("#type_of_crime").val());
  let admin = $("#admin").val();
  // console.log(title, typeof(visibility), typeof(type), admin);
  // console.log(web3.eth.accounts[0]);
  Reporter.deployed().then(function(contractInstance){
    console.log(contractInstance);
    contractInstance.register_complaint(type, visibility, admin, title,{gas: 1400000, from: web3.eth.accounts[0]})
    .then(function(){
      console.log("Complaint registered");
    })
    .catch(function(){
      console.log("Complaint failed");
    })
  })
}
window.displayComplaints = function(){
  console.log("HEllo");
  let $div = $("#div");
  let fields = ['id','title','contact_info','type_of_complaint','visibility'];
  let complaints = {};
  Reporter.deployed().then(function(contractInstance){
    contractInstance.get_all_complaints.call()
    .then(function(res){
      console.log(res);
      for(let i=0;i<res[i].length;i++){
        let obj = {};
        for(let j=0;j<fields.length;j++){

          obj[fields[j]] = res[j][i].toString();
          if ( j==1 || j==2)
          {
            obj[fields[j]] = web3.toAscii(obj[fields[j]]);
          }
          //console.log(i,j, obj[fields[j]]);
        }
        complaints[i]=obj;
      }
      console.log(complaints);
    })
  })
}


/* Setting web3 provider */
$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Reporter.setProvider(web3.currentProvider);
  console.log(web3.currentProvider);


});