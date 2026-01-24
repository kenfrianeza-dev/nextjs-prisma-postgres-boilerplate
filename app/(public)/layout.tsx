import React from "react";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  return <main>{children}</main>;
};

export default PublicLayout;
