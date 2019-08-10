import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import { List, message, Icon } from "antd";
import Container from "../UI/Container";
import MonthSum from "../UI/MonthSum";
import GeneralForm from "../UI/GeneralForm";
import GeneralItem from "../UI/GeneralItem";
import { withRouter } from "react-router-dom";

const year = new Date().getFullYear();
const month = new Date().getMonth();

class Investment extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    loading: true,
    amount: 0,
    investment: "",
    items: [],
    totalAmount: 0,
  }
  componentDidMount() {
    if (this.props.uid) {
      firebase.database().ref(`users/${this.props.uid}/${year}/${month}/investments`)
        .on("value", (snapshot)=> {
          if (snapshot.exists()) {
            let totalAmount = 0;
            let items = snapshot.val();
            const itemIds = Object.keys(items);
            const parsedItems = itemIds.map(id => {
              const item = items[id];
              item["id"] = id;
              totalAmount += parseFloat(item.amount);
              return item;
            });
            this.setState({ items: parsedItems, totalAmount, loading: false });
          } else {
            this.copyMonthlyInvestment();
          }
        });
    }
  }

  copyMonthlyInvestment = () => {
    firebase.database().ref(`users/${this.props.uid}/monthlyInvestments`)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          const investmentItems = snapshot.val();
          return firebase.database().ref(`users/${this.props.uid}/${year}/${month}/investments`)
            .update(investmentItems);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(err => message.error(err));
  }

  componentWillUnmount(){
    firebase.database().ref(`users/${this.props.uid}/${year}/${month}/investments`).off();
  }

  removeItem = (id) => () => {
    firebase.database().ref(`users/${this.props.uid}/${year}/${month}/investments/${id}`).remove();
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
      source: this.state.investment,
    };
    firebase.database()
      .ref(`users/${this.props.uid}/${year}/${month}/investments`)
      .push(item)
      .then(() => {
        this.setState({
          amount: 0,
          investment: "",
        });
      })
      .catch(err => console.error(err));
  }

  navigateHome = () => {
    this.props.history.push("/");
  }

  render(){
    return (
      <div>
        {this.props.uid ?
          <React.Fragment>

            <Container>
              <Icon
                type="arrow-left"
                onClick={this.navigateHome}
              />

              <MonthSum
                loading={this.state.loading}
                totalAmount={this.state.totalAmount}
                title="Investment"
              />
            </Container>

            <GeneralForm
              title="Add Investment"
              handleSubmit={this.handleSubmit}
              amount={this.state.amount}
              handleAmountchange={this.handleSelect("amount")}
              text={this.state.investment}
              placeholderText="Investment"
              handleTextChange={this.handleChange("investment")}
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

export default connect(mapStateToProps)(withRouter(Investment));