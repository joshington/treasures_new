// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

//import "@openzeppelin/contracts/access/Ownable.sol";


// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
  a structure to store document metadata including the IPFS hash.
  a mapping from document ID to document metadata
  a mapping to track document owners and trustees

  ==>funcs===
  funcs to upload a document and store its IPFS hash
  funcs to retrieve a document's IPFS hash
  funcs to add and remove trustees for a doc.
  funcs to verify doc ownership and trustee permission
*/

contract DocStorage  {
    struct Document {
        string ipfsHash;
        address owner;
        bool exists;
        uint256 uploadTime;
        uint256 subscriptionEndTime;
    }

    struct User {
        string email;
        bool exists;
    }

    uint256 public monthlySubscriptionFee = 1 ether; //set subscription fee
    uint256 public retrievalFee = 2 ether; //retrieval fee is twice the monthly fee
    uint256 public freeTrialPeriod = 14 days;// 2 weeks free trial period
    address public owner;

    mapping(address => User) private users;
    mapping(uint256 => Document) private documents; //this here maps document IDs to their metadata
    mapping(address => uint256[]) private userDocuments;
    mapping(address => uint256) private userLastPayment; //tracks the last payment timestamp of each user.
    mapping(uint256 => address[]) private documentTrustees; // maps document IDs to a list of trustee addresses
    
    mapping(uint256 => mapping(address => bool)) private trustees;  //maps document IDs to trustee permission
    uint256 private nextDocumentId;


    event UserCreated(address indexed user, string email);
    event DocumentUploaded(uint256 documentId, address indexed owner, string ipfsHash); 
    event TrusteeAdded(uint256 documentId, address indexed trustee);
    event TrusteeRemoved(uint256 documentId, address indexed trustee);
    event EmailNotification(address indexed user, string email, string subject, string body);


    constructor() payable {
        owner = payable(msg.sender);
        //transferOwnership(msg.sender);
    }

    modifier onlyOwner(uint256 documentId) {
        require(documents[documentId].owner == msg.sender, "Not the owner"); //func caller is owner of the doc.
        _;
    }

    modifier documentExists(uint256 documentId){
        require(documents[documentId].exists, "Document does not exist"); //ensure the doc exists
        _;
    }

    modifier userExists(address user){
        require(users[user].exists, "User does not exist");
        _;
    }

    modifier hasActiveSubscription() {
        uint256 lastPayment = userLastPayment[msg.sender];
        require(
            lastPayment + freeTrialPeriod >= block.timestamp || 
            lastPayment + 30 days >= block.timestamp,
            "Subscription inactive"
        );
        _;
    }

    function createUser(string memory email) public {
        require(!users[msg.sender].exists, "User already exists");
        users[msg.sender] = User(email, true);
        userLastPayment[msg.sender] = block.timestamp; //start free trial
        emit UserCreated(msg.sender, email);
        emit EmailNotification(owner, email, "Welcome to Treasures", "Your account has been created successfully");   
    }

    function uploadDocument(string memory ipfsHash) public hasActiveSubscription   returns (uint256) {
        uint256 documentId = nextDocumentId++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + 30 days;
        documents[documentId] = Document(ipfsHash, msg.sender, true, startTime,endTime);
        //on uploading u are supposed to add the doc amongst docs of the user list
        userDocuments[msg.sender].push(documentId);
        emit DocumentUploaded(documentId, owner, ipfsHash);
        return documentId;
    }
    //above allows users to upload a doc by providing its IPFS hash.

    function addTrustee(uint256 documentId, address trustee) 
    public onlyOwner(documentId) documentExists(documentId) {
        require(!trustees[documentId][trustee], "Trustee already added");
        trustees[documentId][trustee] = true;
        documentTrustees[documentId].push(trustee);
        emit TrusteeAdded(documentId, trustee);
        emit EmailNotification(trustee, users[trustee].email, "Added as Trustee", "You have been added as a trustee for a document.");
   
    }


    function removeTrustee(uint256 documentId, address trustee) public onlyOwner(documentId) documentExists(documentId) {
        require(trustees[documentId][trustee], "Trustee not found");
        trustees[documentId][trustee] = false;

        //remove the trustee from the documentTrustee list
        address[] storage trusteesList = documentTrustees[documentId];

        for(uint256 i = 0; i < trusteesList.length; i++) {
            if (trusteesList[i] == trustee) {
                trusteesList[i] = trusteesList[trusteesList.length - 1];
                trusteesList.pop();
                break;
            }
        }
        emit TrusteeRemoved(documentId, trustee);
        emit EmailNotification(trustee, users[trustee].email, "Removed as Trustee", "You have been removed as a trustee for a document.");
    }

    function getDocument(uint256 documentId) public payable documentExists(documentId) returns (string memory) {
        require(msg.sender == documents[documentId].owner || trustees[documentId][msg.sender], "Not authorized");
        require(msg.value == retrievalFee, "Incorrect retrieval fee");
        return documents[documentId].ipfsHash;
    }

    function getUserDocuments() public view userExists(msg.sender) returns (uint256[] memory) {
        return userDocuments[msg.sender];
    }

    //get all trustees of the do

    function paySubscription() public payable {
        require(msg.value == monthlySubscriptionFee, "Incorrect subscription fee");
        userLastPayment[msg.sender] = block.timestamp;
    }
    
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }


    function isTrustee(uint256 documentId, address trustee) public view documentExists(documentId) returns (bool) {
        return trustees[documentId][trustee];
    }
    //check if an address is a trustee for a specific doc

    function getUserEmail(address user) public view userExists(user) returns (string memory) {
       return users[user].email;
    }
    function getDocumentTrustees(uint256 documentId)
    public view documentExists(documentId) returns (address[] memory) {
        return documentTrustees[documentId];
    }
}