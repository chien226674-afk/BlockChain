type CreatorRowProps = {
  rank: number;
  name: string;
  avatar: string;
  change: string;
  sold: number;
  volume: string;
};

export default function CreatorRow({
  rank,
  name,
  avatar,
  change,
  sold,
  volume,
}: CreatorRowProps) {
  return (
    <div className="grid grid-cols-[60px_1fr_150px_150px_150px] items-center bg-[#3b3b3b] rounded-2xl px-6 py-4 cursor-pointer hover:scale-102 transition transform: duration-200">
      {/* Rank */}
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2b2b2b] text-gray-300">
        {rank}
      </div>

      {/* Artist */}
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="font-semibold">{name}</span>
      </div>

      {/* Change */}
      <span className="text-green-400 font-medium">{change}</span>

      {/* Sold */}
      <span>{sold}</span>

      {/* Volume */}
      <span>{volume}</span>
    </div>
  );
}
