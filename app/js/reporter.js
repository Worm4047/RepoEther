// Import the page's CSS. Webpack will know what to do with it.
// import "../stylesheets/app.css";
import "../css/main.css";
import "../css/util.css";
import "../css/dashboard.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'



import reporter_artifacts from '../../build/contracts/Reporter.json'

var Reporter = contract(reporter_artifacts);


window.registerComplaint = function(form) {
  console.log(form);
  let complaint = $('#complaint').val();
  let contact_info = parseInt($('#contact_info').val());
 // let crime_date = 
  let type_of_complaint = parseInt($('#type_of_complaint').val());
  let complaint_visibility = $('#complaint_visibility').val() == 'on'?1:0;
  let crime_time = $('#crime_date').val();
  let location = 'allahabad'; 
  let admin = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
  console.log(type_of_complaint, complaint_visibility, admin, complaint, contact_info, crime_time);
  console.log("ip1=" + ip1 )
  // console.log(title, typeof(visibility), typeof(type), admin);
  // console.log(web3.eth.accounts[0]);
  //uint type_of_complaint, uint visibility,  address admin, bytes32 complaint, bytes32 contact_info, bytes32 crime_time, bytes32 location
  

  Reporter.deployed().then(function(contractInstance){
    console.log(contractInstance);
    contractInstance.register_complaint(type_of_complaint, complaint_visibility, complaint, contact_info, crime_time,location,ip1,ip2,{gas: 1400000, from: web3.eth.accounts[0]})
    .then(function(){
      console.log("Complaint registered");
      displayComplaints();
    })
    .catch(function(){
      console.log("Complaint failed");
    })
  })
}

window.displayComplaints = function(){

  console.log("HEllo");
  let $div = $("#div");
  let fields = [ 'admin', 'title', 'contact_info', 'type_of_complaint', 'visibility', 'crime_time','ip1','ip2'];
  let complaints = {};
  Reporter.deployed().then(function(contractInstance){
    contractInstance.get_all_complaints.call()
    .then(function(res){
      // console.log(res);
      contractInstance.get_ip2.call()
      .then(function(res2){
        console.log("res",res[0].length, res2);
        // console.log("res2",res2);
        for(let i=0;i<res[0].length;i++){
        let obj = {};
        for(let j=0;j<fields.length;j++){
           if(j == fields.length-1){
             obj[fields[j]] = web3.toAscii(res2[i]);
           }else{
            //console.log("tes",res[i][j])
            obj[fields[j]] = res[j][i];
            //console.log(obj);
             if(j==1 || j == fields.length-2)
               obj[fields[j]] = web3.toAscii(obj[fields[j]]);
            }
        }
        complaints[i]=obj;
      }
    })

  });
      
});
      console.log("Complaints",complaints['admin']);
      

      var status='Pending';
      var stakes=0;
      var id=0
      var total_str='';
      console.log("ssasc");
      for(var key in complaints){
        let address = complaints[key].admin;
        let title = complaints[key].title;
        console.log("title",title);
        let contact_info = complaints[key].contact_info;
        let visibility = complaints[key].visibility;
        let type_of_complaint = complaints[key].type_of_complaint;
        let crime_date = complaints[key].crime_time;
        console.log("compkey:",complaints[key]);
        var str = `
            <div class="col m-t-20 complaint_card">
              <div class="card horizontal">
                <div class="card-stacked">
                  <div class="card-content fs-20">
                    <p class="complaint-title fs-24">
                      <span class="title">${crime_date}</span> 
                      <span class="badge right status">${status}</span>

                    </p>
                    <div class="complaint_description">${title}
                    <div class="complaint-btns m-t-20">
                      <a class="waves-effect waves-teal btn-flat red m-r-10 m-t-10">
                        <span class="badge">Total stake : ${stakes}</span>
                        <i class="material-icons text-white upvote">thumb_up</i>
                      </a>
                      <a class="waves-effect waves-teal btn-flat red m-r-10 m-t-10">
                        <span class="badge">1200</span>
                        <i class="material-icons text-white upvote">thumb_up</i>
                      </a>
                      <a class="waves-effect waves-teal btn-flat red m-r-10 m-t-10" disabled>
                        <span class="badge">100</span>
                        <i class="material-icons text-white downvote">thumb_down</i>
                      </a>
                      <a data=${id} data2=${address} class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white accept_complaint" >
                        Solve this problem.
                      </a>                  
                  </div>                
                  </div>
                </div>
              </div>
            </div>
            `;
          total_str += str;
      }
     console.log("total_str",total_str);
      $('.complaints').html(total_str);
}


/* Setting web3 provider */
$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
  }

  Reporter.setProvider(web3.currentProvider);
  console.log(web3.currentProvider);
});