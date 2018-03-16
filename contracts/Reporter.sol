pragma solidity ^0.4.18;

contract Reporter {
    struct Complaint {
        uint id;
        bytes64 admin; //uportId of person registering complaint.
        bytes64 complaint;
        bytes32 contact_info;
        // string address_info;
        bytes64 proposed_solution;
        bytes32 documents;
        uint status;//0-> pending/open 1-> in process 2->closed/resolved
        uint upvotes;
        bytes64 location;//In the form of longitude latitude
        bytes32 date_of_crime;
        uint visibility;//0 -> closed 1-> open
        uint type_of_complaint;// 0-> criminal cases eg(Theft) 1->civil cases( Consumer court )2->enforcement( debt issue )
        // uint256 time;
    }


	//Mapping of uportid to an integer array of complaint ids
	mapping(bytes256 => uint[]) my_complaints;

	//Array of all_complaints
	Complaint[] all_complaints;

	//Mapping of uportid to and integer array of complaint ids
	mapping(bytes256 => uint[]) my_solved_complaints;




}