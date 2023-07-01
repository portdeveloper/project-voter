import { useContractEvent } from "wagmi";

export const AddVotersAndProjects = ({ contractConfig }: { contractConfig: { address: string; abi: any } | null }) => {
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
