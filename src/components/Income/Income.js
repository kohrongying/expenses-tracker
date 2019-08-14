import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import { List, message, Icon } from "antd";
import Container from "../UI/Container";
import MonthSum from "../UI/MonthSum";
import GeneralItem from "../UI/GeneralItem";
import { withRouter } from "react-router-dom";

const year = new Date().getFullYear();
const month = new Date().getMonth();

class Income extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    loading: true,
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

  navigate = (route) => () => {
    this.props.history.push(route);
  }

  render() {
    return this.props.uid ?
      <React.Fragment>
        <Container>
          <Icon
            type="arrow-left"
            onClick={this.navigate("/")}
          />

          <MonthSum
            loading={this.state.loading}
            totalAmount={this.state.totalAmount}
            title="Income"
          />

          <p
            style={{ marginTop: 30, marginBottom: 20, textAlign: "center" }}
            onClick={this.navigate("/income/new")}
          >
                Add Income
          </p>

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
      <p>You must be logged in.</p>;
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps)(withRouter(Income));