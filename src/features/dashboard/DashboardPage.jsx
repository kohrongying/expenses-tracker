import React, { useEffect, useState } from "react";
import { Row, Col, List, Slider, Button } from "antd";
import { UserOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Container from "../../components/ui/Container";
import Header from "../../components/ui/Header";
// import ExpensesSummary from "./ExpensesSummary";
// import MonthBreakdown from "./MonthBreakdown";
import ExpenseItem from "../expense/ExpenseItem";
import { subscribeToRecentExpenses } from "../expense/expenseApi";
import { formatCentsToString } from "../../helpers/common";

const NAVBAR = [
  {
    url: "/expenses/new",
    label: "Add Expense",
    icon: <PlusCircleOutlined />,
    color: "#ff85c0",
  },
];

function Dashboard() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const history = useHistory();
  const [expenses, setExpenses] = useState([]);
  const [totalExpenseInCents, setTotalExpenseInCents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expenseBudget, setExpenseBudget] = useState(500);

  useEffect(() => {
    if (!uid) {
      setExpenses([]);
      setTotalExpenseInCents(0);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToRecentExpenses(
      uid,
      3,
      (items) => {
        const totalInCents = items.reduce((sum, item) => sum + item.amountInCents, 0);
        setExpenses(items);
        setTotalExpenseInCents(totalInCents);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
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
            <h4>S$ {formatCentsToString(totalExpenseInCents)}</h4>
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
