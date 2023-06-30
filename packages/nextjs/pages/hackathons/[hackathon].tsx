import { useState } from "react";
import { useRouter } from "next/router";
import { abi } from "../../generated/ProjectVoterAbi";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useContractRead, useContractWrite } from "wagmi";

const HackathonPage: NextPage = () => {
  const router = useRouter();
  const { hackathonAddress } = router.query;
  const [activeTab, setActiveTab] = useState<"vote" | "add">("vote");

  const contractConfig = {
    address: hackathonAddress as string,
    abi: abi,
  };

  const { data: hackathonProjects } = useContractRead({
    ...contractConfig,
    functionName: "projects",
  });

  const { write } = useContractWrite({
    ...contractConfig,
    mode: "recklesslyUnprepared",
    functionName: "vote",
    args: [ethers.BigNumber.from("0")],
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2 w-full max-w-6xl mx-auto mt-10">
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 ${activeTab === "vote" ? "text-blue-500 border-b-2 border-blue-500 font-medium" : ""}`}
          onClick={() => setActiveTab("vote")}
        >
          Vote
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "add" ? "text-blue-500 border-b-2 border-blue-500 font-medium" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Add Voters/Projects
        </button>
      </div>
      {activeTab === "vote" ? (
        <div>
          This is for voting
          {hackathonProjects?.map((project: any) => {
            return (
              <div key={project.name}>
                <h2>{project.name}</h2>
                <p>{project.url}</p>
                <button onClick={() => write?.()}>Vote</button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>This is for adding voters/projects</div>
      )}
    </div>
  );
};

export default HackathonPage;
