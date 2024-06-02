import Leaderboard from "./components/Leaderboard";
import Tournament from "./components/Tournament";

export default async function LeaderboardPage() {
  return (
    <main className="flex flex-col gap-4 justify-center p-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center">Leaderboard</h1>
      <Leaderboard />
      <Tournament />
    </main>
  );
}
