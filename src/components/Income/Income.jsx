import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/database";
import { List, message, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Container from "../UI/Container";
import MonthSum from "../UI/MonthSum";
import GeneralItem from "../UI/GeneralItem";

const year = new Date().getFullYear();
const month = new Date().getMonth();

function Income() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      setItems([]);
      setTotalAmount(0);
      return;
    }

    const ref = firebase.database().ref(`users/${uid}/${year}/${month}/income`);

    const handleValue = (snapshot) => {
      if (snapshot.exists()) {
        let total = 0;
        const incomeItems = snapshot.val();
        const itemIds = Object.keys(incomeItems);
        const parsedItems = itemIds.map((id) => {
          const item = incomeItems[id];
          item.id = id;
          total += parseFloat(item.amount);
          return item;
        });
        setItems(parsedItems);
        setTotalAmount(total);
        setLoading(false);
      } else {
        copyMonthlyIncome();
      }
    };

    const copyMonthlyIncome = async () => {
      try {
        const snapshot = await firebase
          .database()
          .ref(`users/${uid}/profile/monthlyIncome`)
          .once("value");
        if (snapshot.exists()) {
          const incomeItems = snapshot.val();
          await firebase
            .database()
            .ref(`users/${uid}/${year}/${month}/income`)
            .update(incomeItems);
        } else {
          setItems([]);
          setTotalAmount(0);
          setLoading(false);
        }
      } catch (err) {
        message.error(err);
      }
    };

    ref.on("value", handleValue);
    return () => ref.off("value", handleValue);
  }, [uid]);

  const removeItem = (id) => () => {
    firebase
      .database()
      .ref(`users/${uid}/${year}/${month}/income/${id}`)
      .remove();
  };

  const navigate = (route) => () => {
    history.push(route);
  };

  return uid ? (
    <React.Fragment>
      <Container>
        <ArrowLeftOutlined onClick={navigate("/")} />

        <MonthSum loading={loading} totalAmount={totalAmount} title="Income" />

        <Button
          block
          type="link"
          style={{ marginTop: 30, marginBottom: 20, color: "black" }}
          onClick={navigate("/income/new")}
        >
          Add Income
        </Button>

        <List
          loading={loading}
          dataSource={items}
          renderItem={(item) => (
            <GeneralItem key={item.id} item={item} removeItem={removeItem} />
          )}
        />
      </Container>
    </React.Fragment>
  ) : (
    <p>You must be logged in.</p>
  );
}

export default Income;
