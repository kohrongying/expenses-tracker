import { LogOut } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { CONTAINER_WIDTH } from "./Container";

const Navbar = () => {
  const signOutUser = useAuthStore((state) => state.signOutUser);

  return (
    <div className="border-b border-border/70 bg-card">
      <div
        className={`mx-auto flex w-full ${CONTAINER_WIDTH} items-center justify-between px-5 py-3 sm:px-6 md:px-8`}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-primary font-mono text-[11px] font-extrabold text-primary-foreground">
            S$
          </span>
          <span className="text-[0.84375rem] font-bold tracking-tight">
            Expense Tracker
          </span>
        </div>
        <button
          type="button"
          onClick={signOutUser}
          aria-label="Log out"
          title="Log out"
          className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[6px] border border-border/70 bg-card text-ink-soft"
        >
          <LogOut className="h-[15px] w-[15px]" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
