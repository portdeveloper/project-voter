import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useContractRead, useContractWrite } from "wagmi";
import { AddVotersAndProjects } from "~~/components/project-voter/AddVotersAndProjects";
import { abi } from "~~/generated/ProjectVoterAbi";

const HackathonPage: NextPage = () => {
  const router = useRouter();
  const { hackathon } = router.query;
  const [activeTab, setActiveTab] = useState<"vote" | "add">("vote");
  const [contractConfig, setContractConfig] = useState<{ address: string; abi: any } | null>(null);

  useEffect(() => {
    if (router.isReady && hackathon) {
      setContractConfig({
        address: hackathon as string,
        abi: abi,
      });
    }
  }, [router.isReady, hackathon]);

  const { data: hackathonProjects } = useContractRead({
    ...contractConfig,
    functionName: "getProjects",
  });

  const { write } = useContractWrite({
    ...contractConfig,
    mode: "recklesslyUnprepared",
    functionName: "vote",
    args: [ethers.BigNumber.from("0")],
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-6xl  space-y-2 rounded-lg bg-white p-4 shadow">
      <div className="mb-4 flex">
        <button
          className={`px-4 py-2 ${activeTab === "vote" ? "border-b-2 border-blue-500 font-medium text-blue-500" : ""}`}
          onClick={() => setActiveTab("vote")}
        >
          Vote
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "add" ? "border-b-2 border-blue-500 font-medium text-blue-500" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Add Voters/Projects
        </button>
      </div>

      {activeTab === "vote" ? (
        <div>
          This is for voting
          {hackathonProjects?.map((project: any, index) => {
            return (
              <div key={index}>
                <h2>{project.name}</h2>
                <p>{project.url}</p>
                <button onClick={() => write?.()}>Vote</button>
              </div>
            );
          })}
        </div>
      ) : typeof hackathon === "string" ? (
        <AddVotersAndProjects contractConfig={contractConfig} />
      ) : (
        <div>Error: Invalid hackathon address</div>
      )}
    </div>
  );
};

export default HackathonPage;
