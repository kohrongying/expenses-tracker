import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import AddExpenseForm from "./AddExpenseForm";
import ExpenseItem from "./ExpenseItem";
import { List, message } from "antd";
import Container from "../UI/Container";
import Header from "../UI/Header";
import MonthSum from "../UI/MonthSum";

const year = new Date().getFullYear();
const month = new Date().getMonth();

class Expense extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
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

  render(){
    return (
      <div>
        {this.props.uid ?

          <Container>
            <Header title="Expenses" />

            <MonthSum
              loading={this.state.loading}
              totalAmount={this.state.totalAmount}
            />

            <AddExpenseForm totalAmount={this.state.totalAmount}/>

            <List
              itemLayout="horizontal"
              loading={this.state.loading}
              dataSource={this.state.items}
              renderItem={item => (
                <ExpenseItem
                  key="item"
                  item={item}
                  removeItem={this.removeItem}
                />
              )}
            />

          </Container>
          :
          <p>You must be logged in.</p>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps)(Expense);