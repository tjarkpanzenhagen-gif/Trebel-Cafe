import Hero from "@/components/home/Hero";
import Promise from "@/components/home/Promise";
import WeeklyMenu from "@/components/home/WeeklyMenu";
import AboutTeaser from "@/components/home/AboutTeaser";
import BuffetDates from "@/components/home/BuffetDates";
import FewoTeaser from "@/components/home/FewoTeaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Promise />
      <WeeklyMenu />
      <AboutTeaser />
      <BuffetDates />
      <FewoTeaser />
    </>
  );
}
