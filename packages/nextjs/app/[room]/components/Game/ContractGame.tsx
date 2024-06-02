import { parseEther } from "viem";
import Match from "~~/components/Match";
import { useScaffoldReadContract, useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";

export default function ContractGame() {
  const { targetNetwork } = useTargetNetwork();
  const { writeContractAsync: writeEscrowAsync } = useScaffoldWriteContract("Escrow");
  const { data: allEscrowIds } = useScaffoldReadContract({
    contractName: "Escrow",
    functionName: "getAllEscrows",
  });
  return (
    <>
      <div className="justify-center flex flex-col">
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await writeEscrowAsync({
                functionName: "depositEth",
                value: parseEther("0.1"),
              });
            } catch (e) {
              console.error("Error creating escrow:", e);
            }
          }}
        >
          Start .1 ETH Match - Best of 3
        </button>

        <div className="flex justify-center w-full flex-wrap flex-col-reverse mt-4">
          {allEscrowIds &&
            allEscrowIds?.map((escrowId: any) => {
              return (
                <div key={escrowId} className="card card-compact w-full bg-base-100 shadow-xl mb-4">
                  <div className="card-body">
                    <Match key={escrowId} id={escrowId} chainId={targetNetwork.id} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
