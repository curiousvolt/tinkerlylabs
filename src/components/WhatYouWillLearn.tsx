import { motion } from "motion/react";
import CohortGrid from "./CohortGrid";

export default function WhatYouWillLearn() {
  return (
    <section
      id="syllabus"
      className="pt-4 pb-16 relative overflow-visible w-full bg-gradient-to-b from-[#F9FAF7] via-[#F4F6F2] to-[#F9FAF7]"
    >
      <CohortGrid />
    </section>
  );
}
