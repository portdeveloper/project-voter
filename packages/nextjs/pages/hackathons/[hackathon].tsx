import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useContractEvent, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { AddVotersAndProjects } from "~~/components/project-voter/AddVotersAndProjects";
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

  const { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "vote",
    args: [ethers.BigNumber.from("0")],
  });

  const { write } = useContractWrite(config);

  // const { write } = useContractWrite({
  //   ...contractConfig,
  //   mode: "recklesslyUnprepared",
  //   functionName: "vote",
  //   // args: [ethers.BigNumber.from("0")],
  // });

  return (
    <div className="flex justify-center">
      <div className="mx-auto mt-10 w-full max-w-6xl space-y-2">
        <div className="mb-4 flex justify-center">
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
          <table className="table-zebra table w-full shadow-lg">
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
                    <button
                      onClick={() => {
                        (write as any)?.({ args: [ethers.BigNumber.from(1)] });
                      }}
                      className="btn rounded bg-blue-500 px-4 py-2 text-white"
                    >
                      Vote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : typeof hackathon === "string" ? (
          <AddVotersAndProjects contractConfig={contractConfig} />
        ) : (
          <div className="rounded-lg bg-red-500 p-4 text-white">Error: Invalid hackathon address</div>
        )}
      </div>
    </div>
  );
};

export default HackathonPage;
