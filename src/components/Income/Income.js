import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import { Row, Col, Card, List, message } from "antd";
import Container from "../UI/Container";
import Header from "../UI/Header";
import { formatNumber, getMonthYear } from "../../helpers/common";
import IncomeItem from "./IncomeItem";
import AddIncomeForm from "./AddIncomeForm";

const year = new Date().getFullYear();
const month = new Date().getMonth();

class Income extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
  }

  state = {
    loading: true,
    amount: "",
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
            const itemIds = Object.keys(snapshot.val());
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

  render() {
    return (
      <div>
        {this.props.uid ?
          <Container>
            <Header title="Income" />
            <Card loading={this.state.loading}>
              <Row type="flex" justify="space-around" align="middle">
                <Col xs={12}>
                  {getMonthYear()}
                </Col>
                <Col xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <h3 style={{ marginBottom: 0 }}>$ {formatNumber(this.state.totalAmount)}</h3>
                </Col>
              </Row>
            </Card>

            <AddIncomeForm />

            <List
              itemLayout="horizontal"
              loading={this.state.loading}
              dataSource={this.state.items}
              renderItem={item => (
                <IncomeItem
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

export default connect(mapStateToProps)(Income);