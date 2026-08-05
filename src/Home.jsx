import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button, Spin } from "antd";
import { auth } from "./firebase";
import useAuthStore from "./store/authStore";
import Dashboard from "./components/Dashboard/Dashboard";
import Container from "./components/UI/Container";
import Header from "./components/UI/Header";

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
    <React.Fragment>
      <div className="App">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <Container>
            {loading ? (
              <Spin size="large" />
            ) : (
              <>
                <Header title="Expense Tracker" />
                <p>
                  Track your monthly expenditure, set your income and a budget
                  for yourself. Do not be stupid.
                </p>
                <Button type="primary" onClick={login}>
                  Login with Google
                </Button>
              </>
            )}
          </Container>
        )}
      </div>
    </React.Fragment>
  );
}

export default Home;