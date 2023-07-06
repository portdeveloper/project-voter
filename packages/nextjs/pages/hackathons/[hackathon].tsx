import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useAccount, useContractEvent, useContractRead } from "wagmi";
import {
  Leaderboard,
  ProjectsManager,
  RemoveProjectButton,
  VoteButton,
  VotersManager,
} from "~~/components/project-voter/";
import { abi } from "~~/generated/ProjectVoterAbi";

// @todo use unwatch for cleanup in useContractEvent

const HackathonPage: NextPage = () => {
  const router = useRouter();
  const { hackathon } = router.query;
  const [activeTab, setActiveTab] = useState<"vote" | "add" | "leaderboard">("vote");
  const [contractConfig, setContractConfig] = useState<{ address: string; abi: any } | null>(null);

  const { address } = useAccount();

  const { data: hackathonProjects, refetch } = useContractRead({
    ...contractConfig,
    functionName: "getProjects",
  });

  const { data: ownerAddress } = useContractRead({
    ...contractConfig,
    functionName: "owner",
  });

  const isOwner = address === ownerAddress;

  useContractEvent({
    ...contractConfig,
    eventName: "VoteCast",
    listener(log: any) {
      console.log(log);
      refetch();
    },
  });

  useContractEvent({
    ...contractConfig,
    eventName: "ProjectRemoved",
    listener(log: any) {
      console.log(log);
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
      <div className="mx-auto mt-5 flex w-full flex-col items-center space-y-2">
        <div className="mb-4 flex items-center justify-center">
          <ul className="menu rounded-box menu-horizontal bg-base-100">
            <li onClick={() => setActiveTab("vote")}>
              <a className={activeTab === "vote" ? "active" : ""}>Vote for Projects</a>
            </li>
            {isOwner && (
              <li onClick={() => setActiveTab("add")}>
                <a className={activeTab === "add" ? "active" : ""}>Add Voters/Projects</a>
              </li>
            )}
            <li onClick={() => setActiveTab("leaderboard")}>
              <a className={activeTab === "leaderboard" ? "active" : ""}>Leaderboard</a>
            </li>
          </ul>
        </div>

        {activeTab === "vote" ? (
          <div className="flex w-full flex-col items-center">
            <table className="table-zebra table  w-full max-w-screen-xl shadow-lg">
              <thead>
                <tr>
                  <th className="w-3/6 bg-primary">Project Name</th>
                  <th className="w-2/6 bg-primary">Project URL</th>
                  <th className="w-1/6 bg-primary">Vote Count</th>
                  <th className="w-1/6 bg-primary text-end">Vote</th>
                  {isOwner && <th className="w-1/6 bg-primary">Remove project</th>}
                </tr>
              </thead>
              <tbody>
                {hackathonProjects?.map((project: any, index: number) => (
                  <tr key={index}>
                    <td className="w-2/6">{project.name}</td>
                    <td className="w-2/6">
                      <a href={project.url} target="_blank" rel="noreferrer" className="text-blue-700 underline ">
                        {project.url}
                      </a>
                    </td>
                    <td className="w-1/6">{BigInt(project.voteCount).toString()}</td>
                    <td className="w-1/6 text-right">
                      <VoteButton index={index} contractConfig={contractConfig} />
                    </td>
                    {isOwner && (
                      <td>
                        <RemoveProjectButton index={index} contractConfig={contractConfig} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "add" ? (
          <div className="flex w-full gap-10 px-10">
            <div className="w-1/2">
              <ProjectsManager contractConfig={contractConfig} />
            </div>
            <div className="w-1/2">
              <VotersManager contractConfig={contractConfig} />
            </div>
          </div>
        ) : activeTab === "leaderboard" ? (
          <Leaderboard contractConfig={contractConfig} />
        ) : (
          <div className="rounded-lg bg-red-500 p-4 text-white">Error: Invalid hackathon address</div>
        )}
      </div>
    </div>
  );
};

export default HackathonPage;
