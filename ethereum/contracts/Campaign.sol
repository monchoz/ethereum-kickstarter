// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract CampaignFactory {
    // A factory contributes to the deployment automation of smart contracts
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    } // manager's request to send spend money

    Request[] public requests;
    address public manager; // campaign manager
    uint public minimumContribution; // minimum donation required to be considered a contribution
    mapping(address => bool) public approvers; // addresses who have donated money
    uint public approversCount; // keeps track of donators

    modifier restricted() {
        // whoever calls a function should be the same as the manager
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address sender) {
        manager = sender;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        // register contibutor account
        approvers[msg.sender] = true;
        // increase the number of contributors
        approversCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient)
        public restricted
    {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    // lookup the request wanting to be approved
    function approveRequest(uint index) public {
        // instantiate the target request to save gas
        Request storage request = requests[index];
        // user must be a donnator
        require(approvers[msg.sender]);
        // prevent duplicate votes
        require(!request.approvals[msg.sender]);
        // mark user's vote
        request.approvals[msg.sender] = true;
        // increase the number of approvals stored
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        // avoid spending gas by saving storage
        Request storage request = requests[index];
        // prevent completing a request more than once
        require(!request.complete);
        // more than 50% of votes required to finalize
        require(request.approvalCount > (approversCount / 2));
        // pass the amount of money to send
        request.recipient.transfer(request.value);
        // set a request as complete
        requests[index].complete = true;
    }

    /* This function returns various statistics about campaigns */
    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            // amount of money that the contract has available
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}