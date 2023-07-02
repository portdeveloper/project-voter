// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract ProjectVoter {
	struct Project {
		uint id;
		string name;
		string url;
		uint voteCount;
	}

	string public hackathonName;
	address public owner;
	mapping(address => bool) public voters;
	mapping(address => bool) public hasVoted; // Added line
	address[] public voterAddresses;
	Project[] public projects;
	uint public voteStart;
	uint public voteEnd;

	event VoterAdded(address indexed voter);
	event ProjectAdded(uint indexed projectId, string name, string url);
	event VoteCast(address indexed voter, uint indexed projectId);

	modifier onlyOwner() {
		require(msg.sender == owner, "Only the owner can perform this action");
		_;
	}

	modifier onlyVoters() {
		require(voters[msg.sender], "Only voters can perform this action");
		_;
	}

	modifier inVotingPeriod() {
		require(
			block.timestamp >= voteStart && block.timestamp <= voteEnd,
			"Voting is not currently allowed"
		);
		_;
	}

	constructor(
		address _owner,
		uint _votingPeriodInDays,
		string memory _hackathonName
	) {
		owner = _owner;
		hackathonName = _hackathonName;
		voteStart = block.timestamp;
		voteEnd = voteStart + (_votingPeriodInDays * 1 days);
	}

	function addVoters(address[] calldata _voters) public onlyOwner {
		for (uint i = 0; i < _voters.length; i++) {
			voters[_voters[i]] = true;
			voterAddresses.push(_voters[i]);
			emit VoterAdded(_voters[i]);
		}
	}

	function addProjects(
		string[] calldata _names,
		string[] calldata _urls
	) public onlyOwner {
		require(
			_names.length == _urls.length,
			"Names and URLs arrays should have the same length"
		);

		for (uint i = 0; i < _names.length; i++) {
			projects.push(
				Project({
					id: projects.length,
					name: _names[i],
					url: _urls[i],
					voteCount: 0
				})
			);
			emit ProjectAdded(projects.length - 1, _names[i], _urls[i]);
		}
	}

	function vote(uint _projectId) public onlyVoters inVotingPeriod {
		require(_projectId < projects.length, "Invalid project ID");
		require(!hasVoted[msg.sender], "You have already voted"); // Check if voter has already voted
		hasVoted[msg.sender] = true; // Mark as voted
		projects[_projectId].voteCount += 1;
		emit VoteCast(msg.sender, _projectId);
	}

	function getProjects() public view returns (Project[] memory) {
		return projects;
	}

	function getVoters() public view returns (address[] memory) {
		return voterAddresses;
	}
}
