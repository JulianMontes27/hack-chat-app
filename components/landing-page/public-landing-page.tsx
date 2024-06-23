import React from "react";

import Footer from "./footer";
import Navbar from "./navbar";
import Hero from "./hero";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const LandingPage = async () => {
  const user = await currentUser();
  if (user) {
    return notFound();
  }
  return (
    <main className="">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
};

export default LandingPage;
