import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import useAuthStore from "./store/authStore";
import Dashboard from "./components/Dashboard/Dashboard";
import Container from "./components/UI/Container";
import Header from "./components/UI/Header";
import { Button, Spin } from "antd";

const provider = new firebase.auth.GoogleAuthProvider();

function Home() {
  const isAuthenticated = useAuthStore((state) => Boolean(state.user));
  const authLogin = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    firebase.auth().signInWithPopup(provider)
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
                <p>Track your monthly expenditure, set your income and a budget for yourself. Do not be stupid.</p>
                <Button type="primary" onClick={login}>Login with Google</Button>
              </>
            )}
          </Container>
        )}
      </div>
    </React.Fragment>
  );
}

export default Home;