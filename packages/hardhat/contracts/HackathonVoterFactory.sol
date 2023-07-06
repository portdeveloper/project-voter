// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./HackathonVoter.sol";

contract HackathonVoterFactory {
	struct Hackathon {
		uint id;
		address hackathonVoterAddress;
		string name;
		uint startTime;
		uint endTime;
	}
	address public owner;
	Hackathon[] public hackathons;
	mapping(string => bool) public hackathonNames;

	constructor(address _owner) {
		owner = _owner;
	}

	modifier onlyOwner() {
		require(msg.sender == owner, "Only the owner can perform this action");
		_;
	}

	event HackathonVoterCreated(
		address indexed owner,
		address hackathonVoterAddress,
		string hackathonName
	);
	event HackathonRemoved(uint indexed hackathonId);

	function createHackathonVoter(
		address _owner,
		uint _startTime,
		uint _endTime,
		string memory _hackathonName
	) public onlyOwner {
		require(_startTime < _endTime, "Start time must be before end time");
		HackathonVoter newHackathonVoter = new HackathonVoter(
			_owner,
			_startTime,
			_endTime,
			_hackathonName
		);
		require(
			hackathonNames[_hackathonName] == false,
			"Hackathon name already exists"
		);
		hackathons.push(
			Hackathon({
				id: hackathons.length,
				hackathonVoterAddress: address(newHackathonVoter),
				name: _hackathonName,
				startTime: _startTime,
				endTime: _endTime
			})
		);
		emit HackathonVoterCreated(
			msg.sender,
			address(newHackathonVoter),
			_hackathonName
		);
	}

	function removeHackathon(uint _hackathonId) public onlyOwner {
		require(_hackathonId < hackathons.length, "Invalid hackathon ID");
		if (_hackathonId < hackathons.length - 1) {
			hackathons[_hackathonId] = hackathons[hackathons.length - 1];
		}
		hackathons.pop();

		emit HackathonRemoved(_hackathonId);
	}

	function getHackathons() public view returns (Hackathon[] memory) {
		return hackathons;
	}
}
