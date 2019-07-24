import React, { Component } from "react";
import PropTypes from "prop-types";
import AddExpenseForm from "./Expense/AddExpenseForm";
import Expense from "./Expense/Expense";
import firebase from "../firebase.js";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import { CreditCard, Money } from "@material-ui/icons";
import green from "@material-ui/core/colors/green";
import Banner from "./UI/Banner";
import { getMonth, formatNumber, getMonthYear } from "../helpers/common";

const year = new Date().getFullYear();
const month = getMonth();

export default class Home extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
  }

  state = {
    items: [],
    totalAmount: 0,
    cashExpense: "$0",
    cardExpense: "$0"
  }

  componentDidMount() {
    if (this.props.uid) {

      firebase
        .database()
        .ref(`/users/${this.props.uid}/${year}/${month}`)
        .on("value", snapshot => {
          if (snapshot.val() !== null){
            let items = snapshot.val().items;
            let newState = [];
            let cashExpense = 0;
            let cardExpense = 0;
            for (let item in items){
              newState.push({
                id: item,
                amount: items[item].amount,
                category: items[item].category,
                remarks: items[item].remarks,
                date: items[item].date,
                paymentType: items[item].paymentType ? items[item].paymentType : "Cash"
              });
              if (items[item].paymentType === "Credit Card") {
                cardExpense += parseFloat(items[item].amount);
              } else {
                cashExpense += parseFloat(items[item].amount);
              }
            }

            this.setState({
              items: newState.reverse(),
              cashExpense: formatNumber(cashExpense),
              cardExpense: formatNumber(cardExpense),
              totalAmount: formatNumber(snapshot.val().totalAmount)
            });
          }
        });


    }
  }

  componentWillUnmount() {
    firebase.database().ref(`/users/${this.props.uid}/${year}/${month}`)
      .off();
  }

  removeItem(itemID, itemAmt){
    firebase
      .database()
      .ref(`users/${this.props.uid}/${year}/${month}`)
      .update({
        totalAmount: parseFloat(this.state.totalAmount) - parseFloat(itemAmt)
      });
    firebase.database().ref(`users/${this.props.uid}/${year}/${month}/items/${itemID}`).remove();
  }

  render(){
    return (
      <div>
        {this.props.uid ?

          <div>
            <Banner
              title={getMonthYear()}
              secondaryText={`S$${this.state.totalAmount}`} />

            <AddExpenseForm uid={this.props.uid} totalAmount={this.state.totalAmount} />

            <div className="container d-flex justify-content-around">
              <Chip
                avatar={<Avatar style={{ backgroundColor: green[500], color: "white" }}><CreditCard /></Avatar>}
                label={`$${this.state.cardExpense}`}
              />
              <Chip
                avatar={<Avatar style={{ backgroundColor: green[500], color: "white" }}><Money /></Avatar>}
                label={`$${this.state.cashExpense}`}
              />
            </div>

            <section className='display-item'>
              <div className='container'>
                <ul className="display-list">
                  {this.state.items.map((item, index)=>{
                    return (
                      <Expense
                        key={index}
                        item={item}
                        removeItem={this.removeItem}
                      />
                    );
                  })}
                </ul>
              </div>
            </section>

          </div>
          :
          <p>You must be logged in.</p>
        }
      </div>
    );
  }
}