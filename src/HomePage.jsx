import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import useAuthStore from "./store/authStore";
import Dashboard from "./features/dashboard/DashboardPage";
import Container from "./components/ui/Container";
import Navbar from "./components/ui/Navbar";
import PageShell from "./components/ui/PageShell";
import Header from "./components/ui/Header";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

const provider = new GoogleAuthProvider();

function Home() {
  const isAuthenticated = useAuthStore((state) => Boolean(state.user));
  const authLogin = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        authLogin(result.user);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <PageShell>
      {isAuthenticated ? (
        <>
          <Navbar />
          <Dashboard />
        </>
      ) : (
        <Container>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-12 w-12 rounded-full border-4 border-border border-t-primary animate-spin" />
            </div>
          ) : (
            <Card className="ticket-perf w-full rounded-[4px] border-border/70 shadow-xl">
              <CardHeader className="space-y-3">
                <Header title="Expense Tracker" />
                <CardTitle className="text-base font-medium text-muted-foreground">
                  Track your monthly expenditure, set your income and a budget for yourself.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button type="button" onClick={login} className="w-full" size="lg">
                  Login with Google
                </Button>
              </CardContent>
            </Card>
          )}
        </Container>
      )}
    </PageShell>
  );
}

export default Home;