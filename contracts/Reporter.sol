pragma solidity ^0.4.18;
pragma experimental ABIEncoderV2;

contract Reporter {

    struct Stake{
        address user;
        uint value;
        uint opinion; //1=>in support of , 0 => against
    }


    mapping(uint => Stake[]) complaint_stakes;


    struct Complaint {
        uint id;
        address admin; //adhaar card of person registering complaint.
        bytes32 complaint;
        uint contact_info;
        // string address_info;
        string proposed_solution;
        // bytes32 documents;
        uint status;//0-> pending/open 1-> in process 2->closed/resolved
        uint upvotes;
        bytes32 solved_by; //adhaar_card of person who solved it
        bytes32 location;//In the form of longitude latitude
        bytes32 date_of_crime;
        uint visibility;//0 -> closed 1-> open
        uint type_of_complaint;// 0-> criminal cases eg(Theft) 1->civil cases( Consumer court )2->enforcement( debt issue )
        bytes32 crime_time;
    }
    //Mapping of address to array of complaint id;
    mapping(address => uint[]) public solved_complaints; //solved by me
    //Mapping of adhaar card to array of lodged solved_complaints
    //To retreive complaints a person has lodged
    mapping(address => uint[]) public lodged_complaints; // lodged by me
    mapping(address => uint[]) public process_complaints; //under me


    //All complaints
    Complaint[] all_complaints;

    function bytesToAddress(bytes _address) public returns (address) {
    uint160 m = 0;
    uint160 b = 0;

    for (uint8 i = 0; i < 20; i++) {
      m *= 256;
      b = uint160(_address[i]);
      m += (b);
    }

    return address(m);
  }

  //address addr = bytesToAddress("0x5794ff959eb9c6a2afe82f8ed30e0973b40c8842");

    //Getter for all_complaints
    function get_all_complaints() public returns (bytes32[],uint[], uint[], uint[],uint[], bytes32[]){
        bytes32[] memory title = new bytes32[](all_complaints.length);
        uint[] memory contact_info = new uint[](all_complaints.length);
        uint[] memory upvotes = new uint[](all_complaints.length);
        uint[] memory visibility = new uint[](all_complaints.length);
        bytes32[] memory crime_time = new bytes32[](all_complaints.length);
        // address[] memory admin = new address[](all_complaints.length);
        uint[] memory status = new uint[](all_complaints.length);
        for(uint i=0;i<all_complaints.length;i++){
            Complaint storage c = all_complaints[i];
            //id[i] = c.id;
            title[i] = c.complaint;
            contact_info[i] = c.contact_info;
            upvotes[i] = c.upvotes;
            visibility[i] = c.visibility;
            status[i] = c.status;
         //   location[i] = c.location;
            crime_time[i] = c.crime_time;
        }

        return(title, contact_info, upvotes, visibility, status, crime_time);
    }
    
// uint id,string documents,uint type_of_complaint, uint visibility,  bytes32 admin, string title, string contact_info, string address_info, uint256 time, string location
    function register_complaint(uint type_of_complaint, uint visibility, bytes32 complaint, uint contact_info, bytes32 crime_time, bytes32 location) public payable{
        Complaint memory newcomplaint;
        uint id = all_complaints.length + 1;
        newcomplaint.id = id;
        newcomplaint.admin = msg.sender;
        newcomplaint.complaint = bytes32(complaint);
        newcomplaint.contact_info = contact_info;
        newcomplaint.proposed_solution = '';
        newcomplaint.status = 0;
        newcomplaint.upvotes = 0;
        newcomplaint.solved_by = '';
        // newcomplaint.time = time;
        newcomplaint.location = bytes32(location);
        newcomplaint.type_of_complaint = type_of_complaint;
        newcomplaint.visibility = visibility;
        newcomplaint.crime_time = crime_time;

        //Add this complaint to array of lodged complaints by the adhaar number
        lodged_complaints[msg.sender].push(id);
        //Add this complaint to array of all complaints
        all_complaints.push(newcomplaint);

    }

    function get_upvotes_status(uint id) public returns(uint[], uint[]){
        uint[] memory upvotes = new uint[](all_complaints.length);
        uint[] memory status = new uint[](all_complaints.length);
        for(uint i=0;i<all_complaints.length;i++){
            Complaint storage c = all_complaints[i];
            upvotes[i] = c.upvotes;
            status[i] = c.status;
        }       
        return (upvotes, status);
    }

    // function accept_complaint(address police, uint id) public{
    //     process_complaints[police].push(id);Complaint memory newcomplaint;
    //     all_complaints[id].status = 1;//in process
    // }

    function upvote(uint id, uint opinion) public payable{
        all_complaints[id].upvotes += msg.value;
        //add to complaint_stakes and totalStakes;
        Stake memory stake;
        stake.user = msg.sender;
        stake.value = msg.value;
        stake.opinion = opinion;
        complaint_stakes[id].push(stake);
    }

    function downvote(uint id, uint opinion) public payable{
        all_complaints[id].upvotes += msg.value;
        Stake memory stake;
        stake.user = msg.sender;
        stake.value = msg.value;
        stake.opinion = opinion;
        complaint_stakes[id].push(stake);        
    }

    function accept_complaint(uint id) public{
        all_complaints[id].status = 1;//pending
    }
    function close_complaint(uint id) public{
        all_complaints[id].status = 2;
        
    }

    function returnTotalStakes(uint id) public returns(uint) {
        uint256 totalStakes = 0;
        for(uint i=0;i<complaint_stakes[id].length;i++) {
            totalStakes += complaint_stakes[id][i].value;
        }
        return totalStakes;
    }

    function return_votes(uint id) public returns(address[]){
     address [] all;
     if(id == complaint_stakes[id].length)
        return all;
     for(uint i=0;i<complaint_stakes[id].length;i++){
        if(complaint_stakes[id][i].opinion == 1)
            all.push(complaint_stakes[id][i].user);
     }   
     return all;
    }

    function process_refund(uint id, uint actual_opinion) public returns(uint ) {
        address [] correct_guess;
        uint amt = 1;
        address addr = 0x5794fF959EB9C6a2aFE82F8Ed30e0973B40c8842;
        if(!addr.send(amt)){
            throw;
        }
        // uint extra_refund=0;
        // uint right_guess_count=0;
        // for(uint i=0;i<complaint_stakes[id].length;i++){
        //     if(complaint_stakes[id][i].opinion == 1){
        //         correct_guess.push(complaint_stakes[id][i].user);
        //         right_guess_count++;
        //         extra_refund = 1;
        //         if(complaint_stakes[id][i].user.send(extra_refund)){
        //             extra_refund = 3;
        //             return extra_refund;
        //         }
        //     }
        //     else{
        //         extra_refund += complaint_stakes[id][i].value;
        //     }
        // }
        // for(i=0;i<correct_guess.length;i++){
        //     correct_guess[i].send(extra_refund/right_guess_count);
        // }
    }

    // function proposed_solution(bytes32 proposed_solution,uint id) public{
    //     solved_by = bytes32(msg.sender);
    //     all_complaints[id].proposed_solution = proposed_solution;
    //     all_complaints[id].status = 1;
    // }

    // function closeComplain(address admin,uint id,uint status) public{
    //     all_complaints[id].status = status;
    // }




}