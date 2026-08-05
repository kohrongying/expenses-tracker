import React from "react";
import { Button } from "antd";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import useAuthStore from "../../store/authStore";

const provider = new firebase.auth.GoogleAuthProvider();

function Login() {
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    firebase.auth().signInWithRedirect(provider)
      .then((result)=>{
        const user = result.user;
        login(user);
      })
      // eslint-disable-next-line no-console
      .catch(err => console.log(err));
  }

  return (
      <div>
        <Button onClick={handleLogin}>Login</Button>
      </div>
    );
}

export default Login;