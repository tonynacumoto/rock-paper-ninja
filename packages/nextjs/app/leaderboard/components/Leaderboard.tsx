import Image from "next/image";

export default function Leaderboard() {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Number of wins</th>
            <th>Favourite hand</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <td>
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <Image src="/logo.png" width={100} height={100} alt="Avatar Tailwind CSS Component" />
                  </div>
                </div>
                <div>
                  <div className="font-bold">t0xny.ninja</div>
                  <div className="text-sm opacity-50">0x...043</div>
                </div>
              </div>
            </td>
            <td>420</td>
            <td>Rock</td>
          </tr>
          {/* row 2 */}
          <tr>
            <td>
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <Image src="/logo.png" width={100} height={100} alt="Avatar Tailwind CSS Component" />
                  </div>
                </div>
                <div>
                  <div className="font-bold">romreactor.ninja</div>
                  <div className="text-sm opacity-50">0x...043</div>
                </div>
              </div>
            </td>
            <td>69</td>
            <td>Ninja</td>
          </tr>

          {/* row 3 */}
          <tr>
            <td>
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <Image src="/logo.png" width={100} height={100} alt="Avatar Tailwind CSS Component" />
                  </div>
                </div>
                <div>
                  <div className="font-bold">sergiy.ninja</div>
                  <div className="text-sm opacity-50">0x...043</div>
                </div>
              </div>
            </td>
            <td>43</td>
            <td>Paper</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
