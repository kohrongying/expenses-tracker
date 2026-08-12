import React from "react";

const Header = ({ title }: { title: React.ReactNode }) => (
  <h2 className="text-3xl font-semibold text-foreground mt-8 mb-4">{title}</h2>
);

export default Header;
