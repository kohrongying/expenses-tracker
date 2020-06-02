import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import { List, message, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons"
import Container from "../UI/Container";
import MonthSum from "../UI/MonthSum";
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
    firebase.database().ref(`users/${this.props.uid}/profile/monthlyInvestments`)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          const investmentItems = snapshot.val();
          return firebase.database().ref(`users/${this.props.uid}/${year}/${month}/investments`)
            .update(investmentItems);
        } else {
          this.setState({ loading: false, items: [], totalAmount: 0 });
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

  navigate = (route) => () => {
    this.props.history.push(route);
  }

  render(){
    return this.props.uid ?
      <React.Fragment>

        <Container>
          <ArrowLeftOutlined
                onClick={this.navigate("/")}
              />

          <MonthSum
            loading={this.state.loading}
            totalAmount={this.state.totalAmount}
            title="Investment"
          />

          <Button
            block
            type="link"
            style={{ marginTop: 30, marginBottom: 20, color: "black" }}
            onClick={this.navigate("/investment/new")}
          >
                Add Investment
          </Button>

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

export default connect(mapStateToProps)(withRouter(Investment));