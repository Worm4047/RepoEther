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
  // console.log(title, typeof(visibility), typeof(type), admin);
  // console.log(web3.eth.accounts[0]);
  //uint type_of_complaint, uint visibility,  address admin, bytes32 complaint, bytes32 contact_info, bytes32 crime_time, bytes32 location
  Reporter.deployed().then(function(contractInstance){
    console.log(contractInstance);
    contractInstance.register_complaint(type_of_complaint, complaint_visibility, complaint, contact_info, crime_time,location,{gas: 1400000, from: web3.eth.accounts[0]})
    .then(function(){
      console.log("Complaint registered");
      location.reload();
    })
    .catch(function(){
      console.log("Complaint failed");
    })
  })
}

window.upvote = function(){

  var id = $('.upvote_class').attr('data');
  Reporter.deployed().then(function(contractInstance){
    contractInstance.upvote(id,{gas: 1400000, from: web3.eth.accounts[0],value:web3.toWei(0.00000001, "ether")})
    .then(function(){
      console.log("Upvoted");
      location.reload();
    })
    .catch(function(){
      console.log("Failed to upvote");
    })
  })
}



window.accept_complaint = function(){
  if(sessvars.isPolice == 0)
    alert('Only police allowed !!!!');
  var id = $('.accept_complaint').attr('data');
  Reporter.deployed().then(function(contractInstance){
    contractInstance.accept_complaint(id, {gas: 1400000, from: web3.eth.accounts[0]})
    .then(function(){
      console.log("Accepted");
      location.reload();
    })
    .catch(function(){
      console.log("Failed to accept");
    })
  })
}

window.close_complaint = function(){
  if(sessvars.isPolice == 0)
    alert('Only police allowed !!!!');
  var id = $('.close_complaint').attr('data');
  Reporter.deployed().then(function(contractInstance){
    contractInstance.close_complaint(id, {gas: 1400000, from: web3.eth.accounts[0]})
    .then(function(){
      console.log("Closed");
      location.reload();
    })
    .catch(function(){
      console.log("Failed to close");
    })
  })
}


window.displayComplaints = function(){

  console.log("HEllo");
  let $div = $("#div");
  let fields = [ 'title', 'contact_info', 'upvotes', 'visibility', 'status', 'crime_time'];
  let fields2 = ['upvotes', 'status']
  let complaints = {};
  Reporter.deployed().then(function(contractInstance){
    contractInstance.get_all_complaints.call()
    .then(function(res){
      console.log(res);
      for(let i=0;i<res[i].length;i++){
        let obj = {};
        for(let j=0;j<fields.length;j++){

          obj[fields[j]] = res[j][i].toString();
            if(j==5 || j==0)
            obj[fields[j]] = web3.toAscii(obj[fields[j]]);

        }
        complaints[i]=obj;
      }
      var status='Pending';
      var stakes=0;
      var id=0
      var total_str='';
      var count=0;

      console.log(complaints);
      for(var key in complaints){
        // let address = complaints[key].admin;
        let title = complaints[key].title;
        let contact_info = complaints[key].contact_info;
        let visibility = complaints[key].visibility;
        // let type_of_complaint = complaints[key].type_of_complaint;
        let crime_date = complaints[key].crime_time;
        let status = complaints[key].status == 1?'In process':'Pending';
        let upvotes = complaints[key].upvotes;
        let display_accept = '';
        if(complaints[key].status == 1 ||  complaints[key].status == 2)
          display_accept = 'none';
        let display_close = '';
        if(complaints[key].status == 1 ||  complaints[key].status == 0)
          display_close = 'none';
        console.log(complaints[key]);
        var str = `
            <div class="col m-t-20 complaint_card">
              <div class="card horizontal">
                <div class="card-stacked">
                  <div class="card-content fs-20">
                    <p class="complaint-title fs-24">
                      <span class="title">${crime_date}</span> 
                      <div class="divider"></div>
                      <span class="badge right status">${status}</span>

                    </p>
                    <div class="complaint_description">${title}</div>
                    <div class="complaint-btns m-t-20">
                          <div class="chip">
                            Total stakes : ${upvotes}
                          </div>
                          <div class="chip">
                            Status : ${status}
                          </div>
                    </div>

                      <a data=${id} onclick="accept_complaint();return false;"class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white accept_complaint" style="border-radius:3px;display:${display_accept}">
                        Solve this problem.
                      </a>
                      <a data=${id} onclick="close_complaint();return false;"class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white close_complaint" style="border-radius:3px;display:${display_close}">
                        Mark this problem closed.
                      </a>
                      <a data=${id}  onclick="upvote()" class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white upvote_class"  style="border-radius:3px;">
                        Upvote
                      </a> 
                      <a data=${id}   class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white add_to_stake"  style="border-radius:3px;">
                        Downvote
                      </a>                                         
                  </div>                
                  </div>
                </div>
              </div>
            </div>
            `;
          total_str += str;
          count=1;
      }
      if(count == 0)
        $('.complaints').html('<center><h3>No complaints found</h3></center>');
      else
        $('.complaints').html(total_str);
    })
  })
}

window.policeReturnProcessRequest = function(){
  let fields = [ 'admin', 'title', 'contact_info', 'type_of_complaint', 'visibility', 'crime_time'];
  let complaints = {};
  Reporter.deployed().then(function(contractInstance){
    contractInstance.get_all_complaints.call()
    .then(function(res){
      console.log(res);
      for(let i=0;i<res[i].length;i++){
        let obj = {};
        for(let j=0;j<fields.length;j++){
          obj[fields[j]] = res[j][i].toString();
            if(j==5 || j==1)
            obj[fields[j]] = web3.toAscii(obj[fields[j]]);
        }
        complaints[i]=obj;
      }
      var status='Pending';
      var stakes=0;
      var id=0
      var total_str='';
      var count=0;
      console.log(complaints);
      for(var key in complaints){
        let address = complaints[key].admin;
        let title = complaints[key].title;
        let contact_info = complaints[key].contact_info;
        let visibility = complaints[key].visibility;
        let type_of_complaint = complaints[key].type_of_complaint;
        let crime_date = complaints[key].crime_time;
        console.log(complaints[key]);
        var str = `
            <div class="col m-t-20 complaint_card">
              <div class="card horizontal">
                <div class="card-stacked">
                  <div class="card-content fs-20">
                    <p class="complaint-title fs-24">
                      <span class="title">${crime_date}</span> 
                      <div class="divider"></div>
                      <span class="badge right status">${status}</span>

                    </p>
                    <div class="complaint_description">${title}</div>
                    <div class="complaint-btns m-t-20">
                          <div class="chip">
                            Total stakes : ${upvotes}
                          </div>
                          <div class="chip">
                            Status : ${status}
                          </div>
                    </div>

                      <a data=${id} onclick="accept_complaint();return false;"class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white accept_complaint" style="border-radius:3px;display:${display_accept}">
                        Solve this problem.
                      </a>
                      <a data=${id} onclick="close_complaint();return false;"class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white close_complaint" style="border-radius:3px;display:${display_close}">
                        Mark this problem closed.
                      </a>
                      <a data=${id}  onclick="upvote()" class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white upvote_class"  style="border-radius:3px;">
                        Upvote
                      </a> 
                      <a data=${id}   class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white add_to_stake"  style="border-radius:3px;">
                        Downvote
                      </a>                                         
                  </div>                
                  </div>
                </div>
              </div>
            </div>
`;
          total_str += str;
          count=1;
      }
      if(count == 0)
        $('.complaints').html('<center><h3>No complaints found</h3></center>');
      else
        $('.complaints').html(total_str);
    })
  })
}



window.displayMyComplaints = function(){

console.log("HEllo");
  let $div = $("#div");
  let fields = [ 'title', 'contact_info', 'upvotes', 'visibility', 'status', 'crime_time'];
  let fields2 = ['upvotes', 'status']
  let complaints = {};
  Reporter.deployed().then(function(contractInstance){
    contractInstance.get_all_complaints.call()
    .then(function(res){
      console.log(res);
      for(let i=0;i<res[i].length;i++){
        let obj = {};
        for(let j=0;j<fields.length;j++){

          obj[fields[j]] = res[j][i].toString();
            if(j==5 || j==0)
            obj[fields[j]] = web3.toAscii(obj[fields[j]]);

        }
        complaints[i]=obj;
      }
      var status='Pending';
      var stakes=0;
      var id=0
      var total_str='';
      var count=0;

      console.log(complaints);
      for(var key in complaints){
        let address = complaints[key].admin;
        let title = complaints[key].title;
        let contact_info = complaints[key].contact_info;
        let visibility = complaints[key].visibility;
        let type_of_complaint = complaints[key].type_of_complaint;
        let crime_date = complaints[key].crime_time;
        console.log(complaints[key]);
        var str =             `<div class="col m-t-20 complaint_card">
              <div class="card horizontal">
                <div class="card-stacked">
                  <div class="card-content fs-20">
                    <p class="complaint-title fs-24">
                      <span class="title">${crime_date}</span> 
                      <div class="divider"></div>
                      <span class="badge right status">${status}</span>

                    </p>
                    <div class="complaint_description">${title}</div>
                    <div class="complaint-btns m-t-20">
                          <div class="chip">
                            Total stakes : ${upvotes}
                          </div>
                          <div class="chip">
                            Status : ${status}
                          </div>
                    </div>

                      <a data=${id} onclick="accept_complaint();return false;"class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white accept_complaint" style="border-radius:3px;display:${display_accept}">
                        Solve this problem.
                      </a>
                      <a data=${id} onclick="close_complaint();return false;"class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white close_complaint" style="border-radius:3px;display:${display_close}">
                        Mark this problem closed.
                      </a>
                      <a data=${id}  onclick="upvote()" class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white upvote_class"  style="border-radius:3px;">
                        Upvote
                      </a> 
                      <a data=${id}   class="waves-effect waves-teal btn-flat blue m-r-10 m-t-10 text-white add_to_stake"  style="border-radius:3px;">
                        Downvote
                      </a>                                         
                  </div>                
                  </div>
                </div>
              </div>
            </div>
            `;
          total_str += str;
          count=1;
      }
      if(count == 0)
        $('.complaints').html('<center><h3>No complaints found</h3></center>');
      else
        $('.complaints').html(total_str);
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
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
  }

  Reporter.setProvider(web3.currentProvider);
  console.log(web3.currentProvider);
  $('.complaint.accept_complaint').click(function(event){
    accept_complaint(event.target);
  })

  sessvars.policeAccount = '0x8bc74771b0290810845b21e976dd8ab7b3a551e6';
  if(sessvars.policeAccount == web3.eth.accounts[0]){
    alert('Logged in as police');
    sessvars.isPolice=1;
  }
  else{
    alert('LOgged in as user'); 
    sessvars.isPolice=0;
  }
});