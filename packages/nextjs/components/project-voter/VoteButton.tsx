import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

export const VoteButton = ({ index, contractConfig }: { index: number; contractConfig: any }) => {
  const { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "vote",
    args: [ethers.BigNumber.from(index)],
  });

  const { write } = useContractWrite(config as any);

  return (
    <button
      onClick={() => {
        write?.();
      }}
      className="btn rounded bg-blue-500 px-4 py-2 text-white"
    >
      Vote
    </button>
  );
};
