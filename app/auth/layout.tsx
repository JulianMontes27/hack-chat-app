import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}
//layout for Clerk auth flow
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <section className="h-screen bg-foreground">
      <div className="flex items-center justify-center h-full w-full">
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;
