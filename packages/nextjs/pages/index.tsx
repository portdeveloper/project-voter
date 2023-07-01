import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useContractRead } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  let PVFAddress: any;
  let PVFAbi: any;

  const { data: deployedContractData } = useDeployedContractInfo("ProjectVoterFactory");
  if (deployedContractData) {
    ({ address: PVFAddress, abi: PVFAbi } = deployedContractData);
  }

  const { data: hackathons } = useContractRead({
    address: PVFAddress,
    abi: PVFAbi,
    functionName: "getHackathons",
  });

  const [tab, setTab] = useState("ongoing");

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
      <div className="mx-auto mt-10 w-full max-w-6xl space-y-2 rounded-lg bg-white p-4 shadow">
        <div className="tabs">
          <button className={`tab ${tab === "ongoing" ? "tab-active" : ""}`} onClick={() => setTab("ongoing")}>
            Ongoing Hackathons
          </button>
          <button className={`tab ${tab === "past" ? "tab-active" : ""}`} onClick={() => setTab("past")}>
            Past Hackathons
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {hackathonsToDisplay?.map((hackathon: any) => {
            const startTime = new Date(parseInt(hackathon.startTime._hex, 16) * 1000).toLocaleDateString();
            const endTime = new Date(parseInt(hackathon.endTime._hex, 16) * 1000).toLocaleDateString();

            return (
              <div key={hackathon.name} className="card m-2 shadow-sm">
                <div className="card-body bg-base-300">
                  <h2 className="card-title">{hackathon.name}</h2>
                  <p className="m-0 p-0">Start time: {startTime}</p>
                  <p className="m-0 p-0">End time: {endTime}</p>
                  <div className="card-actions mt-2 justify-end">
                    <Link href={`/hackathons/${encodeURIComponent(hackathon.projectVoterAddress)}`}>
                      <button className="btn btn-primary">Vote</button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
