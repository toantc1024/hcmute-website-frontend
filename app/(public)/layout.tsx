import React from "react";
import { Navbar } from "@/components/layout/navbar/navbar";
import { Footer } from "@/components/blocks";

const Layout = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 relative z-0">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
