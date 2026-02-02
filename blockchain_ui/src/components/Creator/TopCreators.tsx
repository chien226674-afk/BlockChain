import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import CreatorRow from "./CreatorRow";

const creators = [
  {
    rank: 1,
    name: "Jaydon Ekstrom Bothman",
    avatar: "/avatars/1.png",
    change: "+1.41%",
    sold: 602,
    volume: "12.4 ETH",
  },
  {
    rank: 2,
    name: "Ruben Carder",
    avatar: "/avatars/2.png",
    change: "+1.41%",
    sold: 602,
    volume: "12.4 ETH",
  },
  {
    rank: 3,
    name: "Alfredo Septimus",
    avatar: "/avatars/3.png",
    change: "+1.41%",
    sold: 602,
    volume: "12.4 ETH",
  },
];

const tabs = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
];

export default function TopCreators() {
    const [active, setActive] = React.useState("today");

  return (
    <section className="bg-[#2b2b2b] text-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-4xl font-semibold">Top Creators</h2>
        <p className="text-gray-400 mt-2">
          Check out top ranking NFT artists on the NFT Marketplace.
        </p>

        {/* Tabs */}
       <Tabs value={active} onValueChange={setActive} className="mt-10">
      <TabsList className="relative flex w-full justify-between bg-transparent border-b border-gray-600 rounded-none">
        {tabs.map((tab) => (
          <TabsTrigger
value={tab.value}
  className="
    relative px-6 pb-3 text-xl font-medium
    text-gray-400
    data-[state=active]:text-white
    data-[state=active]:bg-transparent
    bg-transparent
    shadow-none
    rounded-none
    cursor-pointer
  "
>
            {tab.label}

            {active === tab.value && (
              <motion.div
                layoutId="tab-underline"
                className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#858585]"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>

        {/* Table Header */}
        <div className="grid grid-cols-[60px_1fr_150px_150px_150px] text-gray-400 text-sm mt-8 px-6">
          <span>#</span>
          <span>Artist</span>
          <span>Change</span>
          <span>NFTs Sold</span>
          <span>Volume</span>
        </div>

        {/* List */}
        <div className="mt-4 space-y-4">
          {creators.map((c) => (
            <CreatorRow key={c.rank} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
