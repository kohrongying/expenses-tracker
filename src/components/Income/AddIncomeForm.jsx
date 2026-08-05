import React, { useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/database";
import GeneralForm from "../UI/GeneralForm";
import { useHistory } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { message } from "antd";

const year = new Date().getFullYear();
const month = new Date().getMonth();

function AddIncomeForm() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const history = useHistory();
  const formRef = useRef();

  const handleSubmit = (values) => {
    values.date = Date.now();

    firebase
      .database()
      .ref(`users/${uid}/${year}/${month}/income`)
      .push(values)
      .then(() => {
        message.success(`Added $${values.amount} to income successfully`);
        if (formRef.current) {
          formRef.current.resetFields();
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Something went wrong. Please try again.");
      });
  };

  const navigateHome = () => {
    history.push("/");
  };

  return (
    <GeneralForm
      formRef={formRef}
      navigateHome={navigateHome}
      title="Add Income"
      handleSubmit={handleSubmit}
      placeholderText="Income Source"
    />
  );
}

export default AddIncomeForm;
