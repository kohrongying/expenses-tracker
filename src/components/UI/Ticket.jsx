import { cn } from "@/lib/utils";

// Card with a punched-paper top edge (see .ticket-perf in index.css).
const Ticket = ({ className, children, ...props }) => (
  <div
    className={cn("ticket-perf rounded-[4px] border border-border/70 bg-card shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
);

export default Ticket;
