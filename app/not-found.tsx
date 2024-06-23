import Link from "next/link";
import React from "react";

const notFound = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Link href="/" className="hover:border-b-4 border-white ">
        Try again!
      </Link>
    </div>
  );
};

export default notFound;
