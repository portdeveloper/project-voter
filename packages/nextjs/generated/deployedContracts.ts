const contracts = {
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        HackathonVoterFactory: {
          address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "hackathonVoterAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "hackathonName",
                  type: "string",
                },
              ],
              name: "HackathonVoterCreated",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_startTime",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_endTime",
                  type: "uint256",
                },
                {
                  internalType: "string",
                  name: "_hackathonName",
                  type: "string",
                },
              ],
              name: "createHackathonVoter",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "getHackathons",
              outputs: [
                {
                  components: [
                    {
                      internalType: "address",
                      name: "hackathonVoterAddress",
                      type: "address",
                    },
                    {
                      internalType: "string",
                      name: "name",
                      type: "string",
                    },
                    {
                      internalType: "uint256",
                      name: "startTime",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "endTime",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct HackathonVoterFactory.Hackathon[]",
                  name: "",
                  type: "tuple[]",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              name: "hackathonNames",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "hackathons",
              outputs: [
                {
                  internalType: "address",
                  name: "hackathonVoterAddress",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "startTime",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "endTime",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
