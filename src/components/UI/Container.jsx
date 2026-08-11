import React from "react";
import { cn } from "@/lib/utils";

// Shared so a fixed-position bar (which sits outside Container's own box)
// can still line up with the page's content width at every breakpoint.
export const CONTAINER_WIDTH = "max-w-md sm:max-w-lg md:max-w-2xl";

const Container = ({ children, className }) => (
  <div className={cn("mx-auto w-full", CONTAINER_WIDTH, "px-5 py-8 sm:px-6 md:px-8 md:py-10", className)}>
    {children}
  </div>
);

export default Container;
