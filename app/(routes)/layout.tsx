import React from "react";

import Sidebar from "@/components/navigation/sidebar";
import ServerChannels from "@/components/navigation/nav-actions";

interface MainRoutesLayoutProps {
  children: React.ReactNode;
}

const MainRoutesLayout: React.FC<MainRoutesLayoutProps> = ({ children }) => {
  return (
    <main className="flex flex-row h-full">
      <section className="hidden md:flex flex-col h-full border w-[104px] overflow-x-hidden z-30">
        <Sidebar />
      </section>
      <div>
        {children}
        </div>
    </main>
  );
};

export default MainRoutesLayout;
