import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeExpense, makeUser } from "@/test/factories";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@/firebase", () => ({ auth: {}, db: {} }));

const { useDashboardData } = vi.hoisted(() => ({
  useDashboardData: vi.fn(),
}));
vi.mock("./useDashboardData", () => ({ default: useDashboardData }));

const { default: useAuthStore } = await import("@/store/authStore");
const { default: DashboardPage } = await import("./DashboardPage");

const emptyData = {
  loading: false,
  totalInCents: 0,
  categoryBreakdown: [],
  monthlyTrend: [],
  recentItems: [],
  topCategory: null,
  averageDailyCents: 0,
  percentChange: null,
};

function renderPage() {
  const history = createMemoryHistory({ initialEntries: ["/"] });
  render(
    <Router history={history}>
      <DashboardPage />
    </Router>
  );
  return { history };
}

describe("DashboardPage", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: makeUser({ uid: "user-1" }),
      isLoading: false,
    });
    useDashboardData.mockReset();
  });

  it("shows loading placeholders while data is loading", () => {
    useDashboardData.mockReturnValue({ ...emptyData, loading: true });
    renderPage();
    expect(screen.getAllByText("Loading…").length).toBeGreaterThan(0);
  });

  it("shows the total, average per day, top category, and recent items", () => {
    useDashboardData.mockReturnValue({
      ...emptyData,
      totalInCents: 15000,
      averageDailyCents: 500,
      topCategory: {
        category: "Food",
        label: "Food",
        color: "#000",
        amountInCents: 15000,
        percent: 100,
      },
      categoryBreakdown: [
        {
          category: "Food",
          label: "Food",
          color: "#000",
          amountInCents: 15000,
          percent: 100,
        },
      ],
      recentItems: [makeExpense({ id: "1", desc: "Coffee" })],
    });

    renderPage();

    expect(screen.getByText("150.00")).toBeInTheDocument();
    expect(screen.getByText("S$ 5.00")).toBeInTheDocument();
    // "Food" appears both as the top category and in the breakdown list.
    expect(screen.getAllByText("Food")).toHaveLength(2);
    expect(screen.getByText("Coffee")).toBeInTheDocument();
  });

  it("hides the vs-last-month figure when there is no percent change", () => {
    useDashboardData.mockReturnValue(emptyData);
    renderPage();
    expect(screen.queryByText("Vs. last month")).not.toBeInTheDocument();
  });

  it("shows the vs-last-month figure when a percent change is available", () => {
    useDashboardData.mockReturnValue({ ...emptyData, percentChange: 25 });
    renderPage();
    expect(screen.getByText("Vs. last month")).toBeInTheDocument();
    expect(screen.getByText("+25%")).toBeInTheDocument();
  });

  it("shows an empty state for the recent list when there's no spend", () => {
    useDashboardData.mockReturnValue(emptyData);
    renderPage();

    // The same empty-state copy also appears in the category breakdown
    // panel, so scope the query to the Recent section specifically.
    const recentPanel = screen.getByText("Recent").closest("div")!
      .nextElementSibling as HTMLElement;
    expect(
      within(recentPanel).getByText("No expenses logged this month yet.")
    ).toBeInTheDocument();
  });

  it("navigates to the add-expense page from the bottom button", async () => {
    const user = userEvent.setup();
    useDashboardData.mockReturnValue(emptyData);
    const { history } = renderPage();

    await user.click(screen.getByRole("button", { name: "+ Add expense" }));

    expect(history.location.pathname).toBe("/expenses/new");
  });

  it("navigates to the full expenses list from 'View all'", async () => {
    const user = userEvent.setup();
    useDashboardData.mockReturnValue(emptyData);
    const { history } = renderPage();

    await user.click(screen.getByRole("button", { name: "View all" }));

    expect(history.location.pathname).toBe("/expenses");
  });
});
