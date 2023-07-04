import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useContractRead } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { DeployVoterForm } from "~~/components/project-voter/";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [tab, setTab] = useState("ongoing");

  let HVFAddress: any;
  let HVFAbi: any;

  const { data: deployedContractData } = useDeployedContractInfo("HackathonVoterFactory");
  if (deployedContractData) {
    ({ address: HVFAddress, abi: HVFAbi } = deployedContractData);
  }

  const { data: hackathons, refetch } = useContractRead({
    address: HVFAddress,
    abi: HVFAbi,
    functionName: "getHackathons",
  });

  useEffect(() => {
    if (tab === "ongoing") {
      refetch();
    }
  }, [tab]);

  const { address } = useAccount();

  const { data: ownerAddress } = useContractRead({
    address: HVFAddress,
    abi: HVFAbi,
    functionName: "owner",
  });

  const isOwner = address === ownerAddress;

  const ongoingHackathons = hackathons?.filter(
    (hackathon: any) => new Date() < new Date(parseInt(hackathon.endTime._hex, 16) * 1000),
  );
  const pastHackathons = hackathons?.filter(
    (hackathon: any) => new Date() > new Date(parseInt(hackathon.endTime._hex, 16) * 1000),
  );

  const hackathonsToDisplay = tab === "ongoing" ? ongoingHackathons : pastHackathons;

  return (
    <>
      <MetaHeader />
      <div className="mx-auto mt-10 w-full max-w-6xl space-y-2 rounded-lg p-4 bg-secondary shadow">
        <div className="tabs">
          <button className={`tab ${tab === "ongoing" ? "tab-active" : ""}`} onClick={() => setTab("ongoing")}>
            Ongoing Hackathons
          </button>
          <button className={`tab ${tab === "past" ? "tab-active" : ""}`} onClick={() => setTab("past")}>
            Past Hackathons
          </button>
          {isOwner && (
            <button className={`tab ${tab === "deploy" ? "tab-active" : ""}`} onClick={() => setTab("deploy")}>
              Deploy HackathonVoter
            </button>
          )}
        </div>
        {tab === "deploy" ? (
          <DeployVoterForm HVFAddress={HVFAddress} HVFAbi={HVFAbi} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {hackathonsToDisplay && hackathonsToDisplay.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {hackathonsToDisplay.map((hackathon: any) => {
                  const startTime = new Date(parseInt(hackathon.startTime._hex, 16) * 1000).toLocaleDateString();
                  const endTime = new Date(parseInt(hackathon.endTime._hex, 16) * 1000).toLocaleDateString();

                  return (
                    <div key={hackathon.name} className="card m-2 shadow-sm">
                      <div className="card-body bg-base-300">
                        <h2 className="card-title">{hackathon.name}</h2>
                        <p className="m-0 p-0">Start time: {startTime}</p>
                        <p className="m-0 p-0">End time: {endTime}</p>
                        <div className="card-actions mt-2 justify-end">
                          <Link href={`/hackathons/${encodeURIComponent(hackathon.hackathonVoterAddress)}`}>
                            <button className="btn btn-primary">Vote</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4">No hackathons available at the moment.</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
