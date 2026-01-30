import DiscoverNFTs from "@/components/home/DiscoverNFTs";
import FeaturedNFT from "@/components/home/FeaturedNFT";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import TopCreators from "@/components/home/TopCreators";
import TrendingCollection from "@/components/home/TrendingColections";
import WeeklyDigest from "@/components/home/WeeklyDigest";
export default function Home() {
  return <>
  <HeroSection />
  <TrendingCollection/>
  <TopCreators/>
  <DiscoverNFTs/>
  <FeaturedNFT/>
  <HowItWorks/>
  <WeeklyDigest/>
  </>
}
