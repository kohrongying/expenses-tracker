import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeUser } from "@/test/factories";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@/firebase", () => ({ auth: {}, db: {} }));

const { useAnalyticsData } = vi.hoisted(() => ({
  useAnalyticsData: vi.fn(),
}));
vi.mock("./useAnalyticsData", () => ({ default: useAnalyticsData }));

const { default: useAuthStore } = await import("@/store/authStore");
const { default: AnalyticsPage } = await import("./AnalyticsPage");

const emptyData = {
  loading: false,
  categoryTrend: [],
  dayOfWeek: [],
  biggestExpenses: [],
  categoryChange: [],
};

function renderPage() {
  const history = createMemoryHistory({ initialEntries: ["/analytics"] });
  render(
    <Router history={history}>
      <AnalyticsPage />
    </Router>
  );
  return { history };
}

describe("AnalyticsPage", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: makeUser({ uid: "user-1" }),
      isLoading: false,
    });
    useAnalyticsData.mockReset();
  });

  it("shows loading placeholders while data is loading", () => {
    useAnalyticsData.mockReturnValue({ ...emptyData, loading: true });
    renderPage();
    expect(screen.getAllByText("Loading…").length).toBeGreaterThan(0);
  });

  it("shows an empty state for biggest expenses when there's no spend", () => {
    useAnalyticsData.mockReturnValue(emptyData);
    renderPage();
    expect(
      screen.getByText("No expenses in the last 6 months.")
    ).toBeInTheDocument();
  });

  it("shows an empty state for category change when there's nothing to compare", () => {
    useAnalyticsData.mockReturnValue(emptyData);
    renderPage();
    expect(
      screen.getByText("Not enough data yet to compare months.")
    ).toBeInTheDocument();
  });

  it("navigates back to the dashboard from the back button", async () => {
    const user = userEvent.setup();
    useAnalyticsData.mockReturnValue(emptyData);
    const { history } = renderPage();

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(history.location.pathname).toBe("/");
  });
});
