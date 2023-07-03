import { useEffect } from "react";
import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

export const VoteButton = ({ index, contractConfig }: { index: number; contractConfig: any }) => {
  const { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "vote",
    args: [ethers.BigNumber.from(index)],
  });

  const { write, error } = useContractWrite(config as any);

  useEffect(() => {
    if (error && error.message) {
      const errorMsg = error.message;
      const customErrorStart = "reverted with custom error '";
      const customErrorEndIndex = errorMsg.indexOf(customErrorStart);

      if (customErrorEndIndex !== -1) {
        const start = customErrorEndIndex + customErrorStart.length;
        const end = errorMsg.indexOf("'", start);
        const customError = errorMsg.slice(start, end);

        switch (customError) {
          case "AlreadyVoted()":
            notification.error(<p>You have already voted!</p>);
            break;
          // Add cases for other custom errors here
          default:
            // Handle unknown custom errors
            notification.error(<p>Unknown error: {customError}</p>);
        }
      }
    }
  }, [error]);

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
