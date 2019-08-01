import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import { List, message } from "antd";
import Container from "../UI/Container";
import MonthSum from "../UI/MonthSum";
import GeneralForm from "../UI/GeneralForm";
import GeneralItem from "../UI/GeneralItem";

const year = new Date().getFullYear();
const month = new Date().getMonth();

class Income extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
  }

  state = {
    loading: true,
    amount: 0,
    incomeSource: "",
    items: [],
    totalAmount: 0
  }

  componentDidMount() {
    if (this.props.uid) {
      firebase.database().ref(`users/${this.props.uid}/${year}/${month}/income`)
        .on("value", (snapshot)=> {

          if (snapshot.exists()) {
            let totalAmount = 0;
            const items = snapshot.val();
            const itemIds = Object.keys(items);
            const parsedItems = itemIds.map(id => {
              const item = items[id];
              item["id"] = id;
              totalAmount += parseFloat(item.amount);
              return item;
            });
            this.setState({ items: parsedItems, totalAmount, loading: false });
          } else {
            this.copyMonthlyIncome();
          }
        });
    }
  }

  copyMonthlyIncome = () => {
    firebase.database().ref(`users/${this.props.uid}/monthlyIncome`)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          const incomeItems = snapshot.val();
          return firebase.database().ref(`users/${this.props.uid}/${year}/${month}/income`)
            .update(incomeItems);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(err => message.error(err));
  }

  componentWillUnmount(){
    firebase.database().ref(`users/${this.props.uid}/${year}/${month}/income`).off();
  }

  removeItem = (id) => () => {
    firebase.database().ref(`users/${this.props.uid}/${year}/${month}/income/${id}`).remove();
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSelect = name => value => {
    this.setState({ [name]: parseFloat(value) });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const item = {
      amount: this.state.amount,
      date: Date.now(),
      source: this.state.incomeSource,
    };
    firebase.database()
      .ref(`users/${this.props.uid}/${year}/${month}/income`)
      .push(item)
      .then(() => {
        this.setState({
          amount: 0,
          incomeSource: "",
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        {this.props.uid ?
          <React.Fragment>

            <Container>
              <MonthSum
                loading={this.state.loading}
                totalAmount={this.state.totalAmount}
                title="Income"
              />
            </Container>

            <GeneralForm
              title="Add Income"
              handleSubmit={this.handleSubmit}
              amount={this.state.amount}
              handleAmountchange={this.handleSelect("amount")}
              text={this.state.incomeSource}
              placeholderText="Income Source"
              handleTextChange={this.handleChange("incomeSource")}
            />

            <Container>
              <List
                loading={this.state.loading}
                dataSource={this.state.items}
                renderItem={item => (
                  <GeneralItem
                    key="item"
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

export default connect(mapStateToProps)(Income);