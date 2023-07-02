import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useContractEvent, useContractRead } from "wagmi";
import { ProjectsManager, VoteButton, VotersManager } from "~~/components/project-voter/";
import { abi } from "~~/generated/ProjectVoterAbi";

const HackathonPage: NextPage = () => {
  const router = useRouter();
  const { hackathon } = router.query;
  const [activeTab, setActiveTab] = useState<"vote" | "add">("vote");
  const [contractConfig, setContractConfig] = useState<{ address: string; abi: any } | null>(null);

  const { data: hackathonProjects, refetch } = useContractRead({
    ...contractConfig,
    functionName: "getProjects",
  });

  useContractEvent({
    ...contractConfig,
    eventName: "VoteCast",
    listener(voter, projectId) {
      console.log(`Voted! name: ${voter} - url: ${projectId}`);
      refetch();
    },
  });

  useEffect(() => {
    if (router.isReady && hackathon) {
      setContractConfig({
        address: hackathon as string,
        abi: abi,
      });
    }
  }, [router.isReady, hackathon]);

  return (
    <div className="flex justify-center">
      <div className="mx-auto mt-5 w-full space-y-2 flex flex-col items-center">
        <div className="mb-4 flex justify-center items-center">
          <ul className="menu rounded-box menu-horizontal bg-base-100">
            <li onClick={() => setActiveTab("vote")}>
              <a className={activeTab === "vote" ? "active" : ""}>Vote for Projects</a>
            </li>
            <li onClick={() => setActiveTab("add")}>
              <a className={activeTab === "add" ? "active" : ""}>Add Voters/Projects</a>
            </li>
          </ul>
        </div>

        {activeTab === "vote" ? (
          <div className="w-full flex flex-col items-center">
            <table className="table table-zebra  w-full max-w-screen-xl shadow-lg">
              <thead>
                <tr>
                  <th className="bg-primary">Project Name</th>
                  <th className="bg-primary">Project URL</th>
                  <th className="bg-primary">Vote Count</th>
                  <th className="bg-primary text-end">Vote</th>
                </tr>
              </thead>
              <tbody>
                {hackathonProjects?.map((project: any, index) => (
                  <tr key={index}>
                    <td>{project.name}</td>
                    <td>{project.url}</td>
                    <td>{ethers.BigNumber.from(project.voteCount._hex).toString()}</td>
                    <td className="text-right">
                      <VoteButton index={index} contractConfig={contractConfig} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : typeof hackathon === "string" ? (
          <div className="w-full px-10 flex gap-10">
            <div className="w-1/2">
              <ProjectsManager contractConfig={contractConfig} />
            </div>
            <div className="w-1/2">
              <VotersManager contractConfig={contractConfig} />
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-red-500 p-4 text-white">Error: Invalid hackathon address</div>
        )}
      </div>
    </div>
  );
};

export default HackathonPage;
