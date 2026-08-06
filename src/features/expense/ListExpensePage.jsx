import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { List, message, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useAuthStore from "../../store/authStore";
import Container from "../../components/ui/Container";
import MonthSum from "../../components/ui/MonthSum";
import ExpenseItem from "./ExpenseItem";
import { subscribeToCurrentMonthExpenses } from "./expenseApi";

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

    setLoading(true);

    const unsubscribe = subscribeToCurrentMonthExpenses(
      uid,
      (expenses) => {
        const total = expenses.reduce((sum, item) => sum + item.amountInCents, 0);
        setItems(expenses);
        setTotalAmount(total);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        message.error("Couldn't load expenses. Please try again.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  const navigate = (route) => () => {
    history.push(route);
  };

  // inside the component
  const handleRemove = (itemId) => async () => {
    try {
      await removeExpense(uid, itemId);
      message.success("Expense removed");
    } catch (err) {
      console.error(err);
      message.error("Couldn't remove expense. Please try again.");
    }
  };

  return (
    <div>
      {uid ? (
        <React.Fragment>
          <Container>
            <ArrowLeftOutlined onClick={navigate("/")} style={{ marginTop: 30 }} />

            <MonthSum loading={loading} totalAmountInCents={totalAmount} title="Expenses" />

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
                  removeItem={handleRemove}
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