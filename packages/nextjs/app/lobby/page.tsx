import CreateGame from "./components/CreateGame";
import type { NextPage } from "next";

export const revalidate = 0;

const Lobby: NextPage = async () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center text-2xl font-bold">Game lobby</h1>
          <div className="flex justify-center items-center space-y-2 flex-col">
            <CreateGame />

            <p className="text-center text-sm">Or you can join one of the active games below</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobby;
