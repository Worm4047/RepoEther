pragma solidity ^0.4.18;
pragma experimental ABIEncoderV2;

contract Reporter {

    struct Complaint {
        uint id;
        address admin; //adhaar card of person registering complaint.
        bytes32 complaint;
        uint contact_info;
        // string address_info;
        string proposed_solution;
        // bytes32 documents;
        uint status;//0-> pending/open 1-> in process 2->closed/resolved
        uint256 upvotes;
        bytes32 solved_by; //adhaar_card of person who solved it
        bytes32 location;//In the form of longitude latitude
        bytes32 date_of_crime;
        uint visibility;//0 -> closed 1-> open
        uint type_of_complaint;// 0-> criminal cases eg(Theft) 1->civil cases( Consumer court )2->enforcement( debt issue )
        bytes32 crime_time;
    }
    //Mapping of adhaar card to array of complaint id;
    mapping(address => uint[]) public solved_complaints;

    //Mapping of adhaar card to array of lodged solved_complaints
    //To retreive complaints a person has lodged
    mapping(address => uint[]) public lodged_complaints;

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
    function get_all_complaints() public returns (address[], bytes32[],uint[], uint[], uint[], bytes32[]){
        bytes32[] memory title = new bytes32[](all_complaints.length);
        uint[] memory contact_info = new uint[](all_complaints.length);
        uint[] memory type_of_complaint = new uint[](all_complaints.length);
        uint[] memory visibility = new uint[](all_complaints.length);
        bytes32[] memory crime_time = new bytes32[](all_complaints.length);
        address[] memory admin = new address[](all_complaints.length);
        for(uint i=0;i<all_complaints.length;i++){
            Complaint storage c = all_complaints[i];
            //id[i] = c.id;
            title[i] = c.complaint;
            contact_info[i] = c.contact_info;
            type_of_complaint[i] = c.type_of_complaint;
            visibility[i] = c.visibility;
         //   location[i] = c.location;
            crime_time[i] = c.crime_time;
        }

        return(admin, title, contact_info, type_of_complaint, visibility, crime_time);
    }
    
// uint id,string documents,uint type_of_complaint, uint visibility,  bytes32 admin, string title, string contact_info, string address_info, uint256 time, string location
    function register_complaint(uint type_of_complaint, uint visibility, bytes32 complaint, uint contact_info, bytes32 crime_time, bytes32 location) public payable{
        Complaint memory newcomplaint;
        uint id = all_complaints.length+1;
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

}