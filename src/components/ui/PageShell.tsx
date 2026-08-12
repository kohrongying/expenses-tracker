import React from "react";

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">{children}</div>
);

export default PageShell;
