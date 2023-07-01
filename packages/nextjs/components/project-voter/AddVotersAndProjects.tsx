import { useContractEvent } from "wagmi";
import { abi } from "~~/generated/ProjectVoterAbi";

export const AddVotersAndProjects = ({ address }: { address: string | undefined }) => {
  const contractConfig = {
    address: address,
    abi: abi,
  } as const;

  useContractEvent({
    ...contractConfig,

    eventName: "VoteCast",

    listener(log) {
      console.log(log);
    },
  });

  // useEffect(() => {
  //   return () => {
  //     unwatch?.();
  //   };
  // }, []);

  return (
    <div>
      <p>This is a page for adding voters and projects</p>
      <div>Testing...</div>
    </div>
  );
};
