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
    <div className="flex justify-center">
      <div className="mx-auto mt-10 w-full max-w-6xl space-y-2">
        <div className="mb-4 flex justify-center">
          <ul className="menu menu-horizontal bg-base-100 rounded-box">
            <li onClick={() => setActiveTab("vote")}>
              <a className={activeTab === "vote" ? "active" : ""}>Vote for Projects</a>
            </li>
            <li onClick={() => setActiveTab("add")}>
              <a className={activeTab === "add" ? "active" : ""}>Add Voters/Projects</a>
            </li>
          </ul>
        </div>

        {activeTab === "vote" ? (
          <table className="table table-zebra w-full shadow-lg">
            <thead>
              <tr>
                <th className="bg-primary">Project Name</th>
                <th className="bg-primary">Project URL</th>
                <th className="bg-primary text-end">Vote</th>
              </tr>
            </thead>
            <tbody>
              {hackathonProjects?.map((project: any, index) => (
                <tr key={index}>
                  <td>{project.name}</td>
                  <td>{project.url}</td>
                  <td className="text-right">
                    <button onClick={() => write?.()} className="btn px-4 py-2 bg-blue-500 text-white rounded">
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
          <div className="p-4 bg-red-500 text-white rounded-lg">Error: Invalid hackathon address</div>
        )}
      </div>
    </div>
  );
};

export default HackathonPage;
