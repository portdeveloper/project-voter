// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./HackathonVoter.sol";

contract HackathonVoterFactory {
	struct Hackathon {
		address hackathonVoterAddress;
		string name;
		uint startTime;
		uint endTime;
	}
	address public owner;

	constructor(address _owner) {
		owner = _owner;
	}

	modifier onlyOwner() {
		require(msg.sender == owner, "Only the owner can perform this action");
		_;
	}

	Hackathon[] public hackathons;

	event HackathonVoterCreated(
		address indexed owner,
		address hackathonVoterAddress,
		string hackathonName
	);

	function createHackathonVoter(
		address _owner,
		uint _votingPeriodInDays,
		string memory _hackathonName
	) public onlyOwner {
		HackathonVoter newHackathonVoter = new HackathonVoter(
			_owner,
			_votingPeriodInDays,
			_hackathonName
		);
		hackathons.push(
			Hackathon({
				hackathonVoterAddress: address(newHackathonVoter),
				name: _hackathonName,
				startTime: block.timestamp,
				endTime: block.timestamp + (_votingPeriodInDays * 1 days)
			})
		);
		emit HackathonVoterCreated(
			msg.sender,
			address(newHackathonVoter),
			_hackathonName
		);
	}

	function getHackathons() public view returns (Hackathon[] memory) {
		return hackathons;
	}
}
