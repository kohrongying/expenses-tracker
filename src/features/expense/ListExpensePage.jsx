import React, { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { useHistory } from "react-router-dom";
import { List, message, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { db } from "../../firebase";
import useAuthStore from "../../store/authStore";
import Container from "../../components/ui/Container";
import MonthSum from "../../components/ui/MonthSum";
import ExpenseItem from "./ExpenseItem";

const year = new Date().getFullYear();
const month = new Date().getMonth();

function ListExpensePage() {
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

    const itemsRef = ref(db, `/users/${uid}/${year}/${month}/items`);

    const unsubscribe = onValue(itemsRef, (snapshot) => {
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
    });

    return () => unsubscribe();
  }, [uid]);

  const removeItem = (itemID) => () => {
    remove(ref(db, `users/${uid}/${year}/${month}/items/${itemID}`)).catch(
      (err) => {
        message.error(err);
      }
    );
  };

  const navigate = (route) => () => {
    history.push(route);
  };

  return (
    <div>
      {uid ? (
        <React.Fragment>
          <Container>
            <ArrowLeftOutlined
              onClick={navigate("/")}
              style={{ marginTop: 30 }}
            />

            <MonthSum
              loading={loading}
              totalAmount={totalAmount}
              title="Expenses"
            />

            <Button
              block
              type="link"
              style={{ marginTop: 30, marginBottom: 20, color: "black" }}
              onClick={navigate("/expenses/new")}
            >
              Add Expense
            </Button>

            <List
              loading={loading}
              dataSource={items}
              renderItem={(item) => (
                <ExpenseItem
                  key={item.id}
                  item={item}
                  removeItem={removeItem}
                />
              )}
            />
          </Container>
        </React.Fragment>
      ) : (
        <p>You must be logged in.</p>
      )}
    </div>
  );
}

export default ListExpensePage;