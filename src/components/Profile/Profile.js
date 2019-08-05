import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Icon, List, Collapse, Modal, InputNumber, Input, Row, Col } from "antd";
import Container from "../UI/Container";
import { logout } from "../../actions";
import GeneralItem from "../UI/GeneralItem";

const { Panel } = Collapse;

class Profile extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  }

  state = {
    income: [],
    investments: [],
    showModal: false,
    modalTitle: "",
    modalFunc: () => {},
    amount: 0,
    source: "",
  }

  componentDidMount() {
    this.watchRecurringIncome();
    this.watchRecurringInvestments();
  }

  componentWillUnmount() {
    firebase.database().ref(`users/${this.props.uid}/monthlyIncome`).off();
    firebase.database().ref(`users/${this.props.uid}/monthlyInvestmentss`).off();
  }

  watchRecurringIncome = () => {
    firebase.database().ref(`users/${this.props.uid}/monthlyIncome`).on("value", snapshot => {
      if (snapshot.exists()) {
        const itemObj = snapshot.val();
        const income = Object.keys(itemObj).map(key => {
          let item = itemObj[key];
          item["id"] = key;
          return item;
        });
        this.setState({ income });
      }
    });
  }

  watchRecurringInvestments = () => {
    firebase.database().ref(`users/${this.props.uid}/monthlyInvestments`).on("value", snapshot => {
      if (snapshot.exists()) {
        const itemObj = snapshot.val();
        const investments = Object.keys(itemObj).map(key => {
          let item = itemObj[key];
          item["id"] = key;
          return item;
        });
        this.setState({ investments });
      }
    });
  }

  removeIncome = (id) => () => {
    firebase.database().ref(`users/${this.props.uid}/monthlyIncome/${id}`).remove();
  }

  removeInvestment = (id) => () => {
    firebase.database().ref(`users/${this.props.uid}/monthlyInvestments/${id}`).remove();
  }

  showModal = (showModal) => () => {
    this.setState({ showModal });
  }

  showModalIncome = () => {
    this.setState({
      showModal: true,
      modalTitle: "Add Recurring Income",
      modalFunc: this.addRecurringItem("monthlyIncome"),
    });
  }

  showModalInvestment = () => {
    this.setState({
      showModal: true,
      modalTitle: "Add Recurring Investment",
      modalFunc: this.addRecurringItem("monthlyInvestments"),
    });
  }

  addRecurringItem = (ref) => () => {
    firebase.database().ref(`users/${this.props.uid}/${ref}`)
      .push({
        amount: this.state.amount,
        source: this.state.source,
      })
      .then(() => {
        this.setState({
          amount: 0,
          source: "",
          showModal: false,
        });
      });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSelect = name => value => {
    this.setState({ [name]: parseFloat(value) });
  }

  navigateHome = () => {
    this.props.history.push("/");
  }

  logout = () => {
    firebase.auth().signOut()
      .then(() => this.props.logout() );
  }

  render() {
    return (
      <Container>
        <Icon
          type="arrow-left"
          onClick={this.navigateHome}
        />
        <h3 style={{ paddingTop: 20 }}>Profile</h3>

        <Row type="flex" justify="center">
          <Col style={{ padding: 15, borderRadius: "50%", backgroundColor: "#5cdbd3", marginBottom: 20 }}>
            <Icon type="user" style={{ fontSize: 60 }}  />
          </Col>
        </Row>

        <Collapse
          bordered={false}
          expandIconPosition="right"
        >
          <Panel
            header="Recurring Income"
            key="1"
            extra={<Icon type="plus" onClick={this.showModalIncome} />}
          >
            <List
              dataSource={this.state.income}
              renderItem={item => (
                <GeneralItem
                  key="item"
                  item={item}
                  removeItem={this.removeIncome}
                />
              )}
            />
          </Panel>

          <Panel
            header="Recurring investments"
            key="2"
            extra={<Icon type="plus" onClick={this.showModalInvestment} />}
          >
            <List
              dataSource={this.state.investments}
              renderItem={item => (
                <GeneralItem
                  key="item"
                  item={item}
                  removeItem={this.removeInvestment}
                />
              )}
            />
          </Panel>
        </Collapse>

        <Modal
          title={this.state.modalTitle}
          centered
          visible={this.state.showModal}
          onOk={this.state.modalFunc}
          okButtonProps={{
            disabled: this.state.source === "" || this.state.amount === 0
          }}
          onCancel={this.showModal(false)}
        >
          <Row gutter={8}>
            <Col xs={12}>
              <InputNumber
                value={this.state.amount}
                style={{ width: "100%" }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={value => value.replace(/\$\s?|(,*)/g, "")}
                onChange={this.handleSelect("amount")}
              />
            </Col>

            <Col xs={12}>
              <Input
                placeholder="Source"
                value={this.state.source}
                onChange={this.handleChange("source")}
              />
            </Col>
          </Row>
        </Modal>

        <div style={{ display: "flex", justifyContent: "center", margin: 30 }}>
          <Button onClick={this.logout}>Logout</Button>
        </div>
      </Container>
    );
  }
}


const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps, { logout })(withRouter(Profile));