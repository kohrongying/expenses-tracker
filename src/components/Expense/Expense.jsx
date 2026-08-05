import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/database";
import { useHistory } from "react-router-dom";
import { List, message, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useAuthStore from "../../store/authStore";
import Container from "../UI/Container";
import MonthSum from "../UI/MonthSum";
import ExpenseItem from "./ExpenseItem";

const year = new Date().getFullYear();
const month = new Date().getMonth();

function Expense() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setItems([]);
      setTotalAmount(0);
      setLoading(false);
      return;
    }

    const ref = firebase.database().ref(`/users/${uid}/${year}/${month}/items`);

    const handleValue = (snapshot) => {
      if (snapshot.exists()) {
        const itemsVal = snapshot.val();
        const itemIDs = Object.keys(itemsVal);
        let total = 0;

        const parsedItems = itemIDs.map((id) => {
          const item = itemsVal[id];
          total += parseFloat(item.amount);
          item.id = id;
          return item;
        });

        setItems(parsedItems.reverse());
        setTotalAmount(total);
      } else {
        setItems([]);
        setTotalAmount(0);
      }
      setLoading(false);
    };

    ref.on("value", handleValue);
    return () => ref.off("value", handleValue);
  }, [uid]);

  const removeItem = (itemID) => () => {
    firebase.database().ref(`users/${uid}/${year}/${month}/items/${itemID}`).remove().catch((err) => {
      message.error(err);
    });
  };

  const navigate = (route) => () => {
    history.push(route);
  };

  return (
    <div>
      {uid ? (
        <React.Fragment>
          <Container>
            <ArrowLeftOutlined onClick={navigate("/")} style={{ marginTop: 30 }} />

            <MonthSum loading={loading} totalAmount={totalAmount} title="Expenses" />

            <Button block type="link" style={{ marginTop: 30, marginBottom: 20, color: "black" }} onClick={navigate("/expenses/new")}>Add Expense</Button>

            <List loading={loading} dataSource={items} renderItem={(item) => <ExpenseItem key={item.id} item={item} removeItem={removeItem} />} />
          </Container>
        </React.Fragment>
      ) : (
        <p>You must be logged in.</p>
      )}
    </div>
  );
}

export default Expense;