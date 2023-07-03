import { useEffect, useState } from "react";
// Import useState
import { ethers } from "ethers";
import { useContractRead } from "wagmi";

export const Leaderboard = ({ contractConfig }: { contractConfig: { address: string; abi: any } | null }) => {
  const { data: projectArray } = useContractRead({
    ...contractConfig,
    functionName: "getProjects",
  });

  // Assign returned projectArray to a state variable instead of a constant
  const [projects, setProjects] = useState<any[]>(projectArray as any[]);

  // Sort projects by vote count
  useEffect(() => {
    if (projects) {
      const sortedProjects = [...projects].sort(
        (
          a: any,
          b: any, // Copy the array before sorting
        ) => (ethers.BigNumber.from(a.voteCount._hex).lt(ethers.BigNumber.from(b.voteCount._hex)) ? 1 : -1),
      );
      setProjects(sortedProjects); // setProjects is the setter function from useState
    }
  }, [projectArray]);

  return (
    <div className="w-full flex flex-col items-center">
      <table className="table table-zebra w-full max-w-screen-xl shadow-lg">
        <thead>
          <tr>
            <th className="bg-primary">Rank</th>
            <th className="bg-primary">Project Name</th>
            <th className="bg-primary">Project URL</th>
            <th className="bg-primary">Vote Count</th>
          </tr>
        </thead>
        <tbody>
          {projects?.map((project: any, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{project.name}</td>
              <td>{project.url}</td>
              <td>{ethers.BigNumber.from(project.voteCount._hex).toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
