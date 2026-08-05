import React, { useEffect, useState } from "react";
import { Row, Col, List, Slider, Button } from "antd";
import { UserOutlined, PlusCircleOutlined } from "@ant-design/icons";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/database";
import { useHistory } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Container from "../UI/Container";
import Header from "../UI/Header";
// import ExpensesSummary from "./ExpensesSummary";
// import MonthBreakdown from "./MonthBreakdown";
import ExpenseItem from "../Expense/ExpenseItem";

const year = new Date().getFullYear();
const month = new Date().getMonth();
const NAVBAR = [
  {
    url: "/expenses/new",
    label: "Add Expense",
    icon: <PlusCircleOutlined />,
    color: "#ff85c0",
  },
  {
    url: "/profile",
    label: "Profile",
    icon: <UserOutlined />,
    color: "#5cdbd3",
  },
];

function Dashboard() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const history = useHistory();
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expenseBudget, setExpenseBudget] = useState(0);

  useEffect(() => {
    if (!uid) {
      setExpenses([]);
      setTotalExpense(0);
      setExpenseBudget(0);
      setLoading(false);
      return;
    }

    const fetchExpenses = async () => {
      try {
        const snapshot = await firebase
          .database()
          .ref(`/users/${uid}/${year}/${month}/items`)
          .once("value");
        if (snapshot.exists()) {
          const items = snapshot.val();
          const itemIDs = Object.keys(items);
          let total = 0;

          const parsedItems = itemIDs.map((id) => {
            const item = items[id];
            total += parseFloat(item.amount);
            item.id = id;
            return item;
          });

          setExpenses(parsedItems.reverse().slice(0, 3));
          setTotalExpense(total);
        } else {
          setExpenses([]);
          setTotalExpense(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchBudget = async () => {
      try {
        const snapshot = await firebase
          .database()
          .ref(`/users/${uid}/profile/expenseBudget`)
          .once("value");
        if (snapshot.exists()) {
          setExpenseBudget(snapshot.val());
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpenses();
    fetchBudget();
  }, [uid]);

  const linkTo = (url) => () => {
    history.push(url);
  };

  const marks = {
    [expenseBudget]: `$${expenseBudget}`,
  };

  return (
    <React.Fragment>
      <Container>
        <Header title="Dashboard" />

        <Row
          gutter={16}
          style={{
            padding: 10,
            borderRadius: 10,
            boxShadow: "0px 3px 16px 0px rgba(0,0,0,0.16)",
          }}
        >
          {NAVBAR.map((nav) => (
            <Col xs={12} key={nav.label}>
              <div onClick={linkTo(nav.url)} style={{ cursor: "pointer" }}>
                {nav.icon}
                <div style={{ fontSize: 14 }}>{nav.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        <h6 style={{ marginTop: 20 }}>Expenses</h6>
        <Row type="flex" align="middle">
          <Col xs={9}>
            <h4>$ {totalExpense.toFixed(2)}</h4>
          </Col>
          <Col xs={15}>
            {expenseBudget > 0 && (
              <Slider
                value={Math.min(expenseBudget, totalExpense)}
                max={expenseBudget}
                tooltipVisible={false}
                marks={marks}
              />
            )}
          </Col>
        </Row>

        {/* <h6 style={{ marginTop: 20, marginBottom: 15 }}>
          This month's breakdown
        </h6>
        <MonthBreakdown />

        <h6 style={{ marginTop: 20, marginBottom: 15 }}>
          The last 6 months
        </h6>
        <ExpensesSummary /> */}

        <div
          style={{
            marginTop: 20,
            marginBottom: 15,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h6>Expenses</h6>
          <Button
            type="link"
            style={{ marginBottom: 8, color: "rgba(0, 0, 0, 0.65)" }}
            onClick={linkTo("/expenses")}
          >
            View All
          </Button>
        </div>
        <List
          loading={loading}
          dataSource={expenses}
          renderItem={(item) => (
            <ExpenseItem dashboard key={item.id} item={item} />
          )}
        />
      </Container>
    </React.Fragment>
  );
}

export default Dashboard;
