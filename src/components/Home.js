import React, { Component } from "react";
import PropTypes from "prop-types";
import AddExpenseForm from "./Expense/AddExpenseForm";
import Expense from "./Expense/Expense";
import firebase from "firebase/app";
import "firebase/database";
import Banner from "./UI/Banner";
import { getMonth, formatNumber, getMonthYear } from "../helpers/common";
import { connect } from "react-redux";

const year = new Date().getFullYear();
const month = getMonth();

class Home extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
  }

  state = {
    items: [],
    totalAmount: 0,
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
            for (let item in items){
              newState.push({
                id: item,
                amount: items[item].amount,
                category: items[item].category,
                remarks: items[item].remarks,
                date: items[item].date,
              });
            }

            this.setState({
              items: newState.reverse(),
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

  removeItem = (itemID, itemAmt) => () => {
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

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps)(Home);