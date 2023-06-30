// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./ProjectVoter.sol";

contract ProjectVoterFactory {
  struct Hackathon {
    address projectVoterAddress;
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

  event ProjectVoterCreated(address indexed owner, address projectVoterAddress, string hackathonName);

  function createProjectVoter(address _owner, uint _votingPeriodInDays, string memory _hackathonName) public onlyOwner {
    ProjectVoter newProjectVoter = new ProjectVoter(_owner, _votingPeriodInDays, _hackathonName);
    hackathons.push(
      Hackathon({
        projectVoterAddress: address(newProjectVoter),
        name: _hackathonName,
        startTime: block.timestamp,
        endTime: block.timestamp + (_votingPeriodInDays * 1 days)
      })
    );
    emit ProjectVoterCreated(msg.sender, address(newProjectVoter), _hackathonName);
  }

  function getHackathons() public view returns (Hackathon[] memory) {
    return hackathons;
  }
}
