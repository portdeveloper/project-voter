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
      <div className="bg-white p-4 rounded-lg shadow space-y-2 w-full max-w-6xl mx-auto mt-10">
        <div className="tabs">
          <button className={`tab ${tab === "ongoing" ? "tab-active" : ""}`} onClick={() => setTab("ongoing")}>
            Ongoing Hackathons
          </button>
          <button className={`tab ${tab === "past" ? "tab-active" : ""}`} onClick={() => setTab("past")}>
            Past Hackathons
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {hackathonsToDisplay?.map((hackathon: any) => {
            const startTime = new Date(parseInt(hackathon.startTime._hex, 16) * 1000).toLocaleDateString();
            const endTime = new Date(parseInt(hackathon.endTime._hex, 16) * 1000).toLocaleDateString();

            console.log(hackathon.projectVoterAddress);
            return (
              <div key={hackathon.name} className="card shadow-sm m-2">
                <div className="card-body bg-base-300">
                  <h2 className="card-title">{hackathon.name}</h2>
                  <p className="p-0 m-0">Start time: {startTime}</p>
                  <p className="p-0 m-0">End time: {endTime}</p>
                  <div className="card-actions justify-end mt-2">
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
