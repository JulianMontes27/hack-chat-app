import React from "react";

import Sidebar from "@/components/navigation/sidebar";

interface MainRoutesLayoutProps {
  children: React.ReactNode;
}

const MainRoutesLayout: React.FC<MainRoutesLayoutProps> = async ({
  children,
}) => {
  return (
    <div className="flex flex-row h-full w-full">
      <section className="hidden md:flex flex-col h-full border w-[104px] overflow-x-hidden z-30">
        <Sidebar />
      </section>
      <main className="w-full h-full ">{children}</main>
    </div>
  );
};

export default MainRoutesLayout;
