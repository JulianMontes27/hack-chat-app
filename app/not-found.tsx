import Link from "next/link";
import React from "react";

const notFound = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Link href="/">Go back</Link>
    </div>
  );
};

export default notFound;
