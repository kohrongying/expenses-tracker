import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, List, Slider, Button } from "antd";
import { UserOutlined, PlusCircleOutlined } from "@ant-design/icons";
import firebase from "firebase/app";
import "firebase/database";
import { withRouter } from "react-router-dom";
import Container from "../UI/Container";
import Header from "../UI/Header";
import ExpensesSummary from "./ExpensesSummary";
import MonthBreakdown from "./MonthBreakdown";
import ExpenseItem from "../Expense/ExpenseItem";

const year = new Date().getFullYear();
const month = new Date().getMonth();
const NAVBAR = [
  // { url: "/expenses", label: "Expenses", icon: <DashboardOutlined />, color: "#ff85c0" },
  // { url: "/income", label: "Income", icon: <DollarOutlined />, color: "#597ef7" },
  // { url: "/investment", label: "Investment", icon: <BankOutlined />, color: "#ffd666" },
  { url: "/expenses/new", label: "Add Expense", icon: <PlusCircleOutlined />, color: "#ff85c0" },
  { url: "/profile", label: "Profile", icon: <UserOutlined />, color: "#5cdbd3" },
  // { url: "/income/new", label: "Add Income", icon: <PlusCircleOutlined />, color: "#ff85c0" },
  // { url: "/profile", label: "Add Budget", icon: <PlusCircleOutlined />, color: "#ff85c0" },
];

class Dashboard extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    uid: PropTypes.string.isRequired,
  }

  state = {
    uid: "",
    expenses: [],
    totalExpense: 0,
    loading: true,
    expenseBudget: 0,
  }

  componentDidMount() {
    this.getExpenses();
    this.getBudget();
  }

  linkTo = url => () => {
    this.props.history.push(url);
  }

  getExpenses = () => {
    firebase.database()
      .ref(`/users/${this.props.uid}/${year}/${month}/items`)
      .once("value", snapshot => {
        if (snapshot.exists()) {
          const items = snapshot.val();
          const itemIDs = Object.keys(items);
          let totalExpense = 0;

          const parsedItems = itemIDs.map(id => {
            const item = items[id];
            totalExpense += parseFloat(item.amount);
            item["id"] = id;
            return item;
          });

          this.setState({
            expenses: parsedItems.reverse().slice(0, 3),
            totalExpense,
            loading: false,
          });
        } else {
          this.setState({ loading: false, expenses: []});
        }
      })
      .catch(err => console.error(err));
  }

  getBudget = () =>{
    firebase.database()
      .ref(`/users/${this.props.uid}/profile/expenseBudget`)
      .once("value", snapshot => {
        if (snapshot.exists()) {
          this.setState({ expenseBudget: snapshot.val() });
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    const marks = {
      [this.state.expenseBudget]: `$${this.state.expenseBudget}`
    };
    return (
      <React.Fragment>
        <Container>
          <Header title="Dashboard" />
          
          <Row gutter={16}
            style={{ padding: 10, borderRadius: 10, boxShadow: "0px 3px 16px 0px rgba(0,0,0,0.16)" }}>
            {NAVBAR.map(nav => (
              <Col xs={12} key={nav.label}>
                <div
                  onClick={this.linkTo(nav.url)}
                  style={{ cursor: "pointer" }}
                >
                  {nav.icon}
                  <div style={{ fontSize: 14 }}>{nav.label}</div>
                </div>
              </Col>
            ))}
          </Row>

          <h6 style={{ marginTop: 20 }}>Expenses</h6>
          <Row type="flex" align="middle">
            <Col xs={9}>
              <h4>$ {this.state.totalExpense.toFixed(2)}</h4>
            </Col>
            <Col xs={15}>
              {this.state.expenseBudget > 0 &&
                <Slider value={Math.min(this.state.expenseBudget, this.state.totalExpense)} max={this.state.expenseBudget} tooltipVisible={false} marks={marks}/>
              }
            </Col>
          </Row>

          <h6 style={{ marginTop: 20, marginBottom: 15 }}>
            This month's breakdown
          </h6>
          <MonthBreakdown />

          <h6 style={{ marginTop: 20, marginBottom: 15 }}>
            The last 6 months
          </h6>
          <ExpensesSummary />

          <div style={{ marginTop: 20, marginBottom: 15, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <h6>Expenses</h6>
            <Button type="link" style={{ marginBottom: 8, color: "rgba(0, 0, 0, 0.65)" }} onClick={this.linkTo("/expenses")}>View All</Button>
          </div>
          <List
            loading={this.state.loading}
            dataSource={this.state.expenses}
            renderItem={item => (
              <ExpenseItem
                dashboard
                key={item.id}
                item={item}
              />
            )}
          />
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps)(withRouter(Dashboard));