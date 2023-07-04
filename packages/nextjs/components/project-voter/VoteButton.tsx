import { ethers } from "ethers";
import { useContractWrite } from "wagmi";
import { getParsedWagmiError } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const VoteButton = ({ index, contractConfig }: { index: number; contractConfig: any }) => {
  const { write } = useContractWrite({
    ...contractConfig,
    functionName: "vote",
    mode: "recklesslyUnprepared",
    args: [ethers.BigNumber.from(index)],
    onError: error => {
      const simplifiedMessage = getParsedWagmiError(error.message);
      notification.error(simplifiedMessage);
    },
  });

  return (
    <button
      onClick={() => {
        write?.();
      }}
      className="btn btn-primary"
    >
      Vote
    </button>
  );
};
