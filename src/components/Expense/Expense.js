import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { List, message, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Container from "../UI/Container";
import MonthSum from "../UI/MonthSum";
import ExpenseItem from "./ExpenseItem";

const year = new Date().getFullYear();
const month = new Date().getMonth();

class Expense extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    items: [],
    totalAmount: 0,
    loading: true
  }

  componentDidMount() {
    if (this.props.uid) {
      firebase.database()
        .ref(`/users/${this.props.uid}/${year}/${month}/items`)
        .on("value", snapshot => {
          if (snapshot.exists()) {
            const items = snapshot.val();
            const itemIDs = Object.keys(items);
            let totalAmount = 0;

            const parsedItems = itemIDs.map(id => {
              const item = items[id];
              totalAmount += parseFloat(item.amount);
              item["id"] = id;
              return item;
            });

            this.setState({
              items: parsedItems.reverse(),
              totalAmount,
              loading: false,
            });
          } else {
            this.setState({
              loading: false,
              items: [],
              totalAmount: 0 });
          }
        });
    }
  }

  componentWillUnmount() {
    firebase.database().ref(`/users/${this.props.uid}/${year}/${month}/items`)
      .off();
  }

  removeItem = (itemID) => () => {
    firebase.database()
      .ref(`users/${this.props.uid}/${year}/${month}/items/${itemID}`).remove()
      .catch(err => {
        message.error(err);
      });
  }

  navigate = (route) => () => {
    this.props.history.push(route);
  }

  render(){
    return (
      <div>
        {this.props.uid ?
          <React.Fragment>

            <Container>
              <ArrowLeftOutlined
                onClick={this.navigate("/")}
                style={{ marginTop: 30 }}
              />

              <MonthSum
                loading={this.state.loading}
                totalAmount={this.state.totalAmount}
                title="Expenses"
              />

              <Button
                block
                type="link"
                style={{ marginTop: 30, marginBottom: 20, color: "black" }}
                onClick={this.navigate("/expenses/new")}
              >
                Add Expense
              </Button>

              <List
                loading={this.state.loading}
                dataSource={this.state.items}
                renderItem={item => (
                  <ExpenseItem
                    key={item.id}
                    item={item}
                    removeItem={this.removeItem}
                  />
                )}
              />
            </Container>
          </React.Fragment>
          :
          <p>You must be logged in.</p>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps)(withRouter(Expense));