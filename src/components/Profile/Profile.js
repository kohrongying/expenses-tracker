import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, List, Collapse, Modal, InputNumber, Input, Row, Col, Avatar } from "antd";
import { ArrowLeftOutlined, EditOutlined, PlusCircleOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons"
import Container from "../UI/Container";
import { logout } from "../../actions";
import { formatNumber } from "../../helpers/common";

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
    showBudgetModal: false,
    expenseBudget: "",
  }

  componentDidMount() {
    this.watchProfile();
  }

  componentWillUnmount() {
    firebase.database().ref(`users/${this.props.uid}/profile`).off();
  }

  watchProfile = () => {
    firebase.database().ref(`users/${this.props.uid}/profile`).on("value", snapshot => {
      if (snapshot.exists()) {
        const profile = snapshot.val();
        const incomeItems = profile.monthlyIncome || {};
        const investmentItems = profile.monthlyInvestments || {};
        const expenseBudget = profile.expenseBudget || "";
        const income = Object.keys(incomeItems).map(key => {
          let item = incomeItems[key];
          item["id"] = key;
          return item;
        });
        const investments = Object.keys(investmentItems).map(key => {
          let item = investmentItems[key];
          item["id"] = key;
          return item;
        });
        this.setState({ investments, income, expenseBudget });
      }
    });
  }

  removeIncome = (id) => () => {
    firebase.database().ref(`users/${this.props.uid}/profile/monthlyIncome/${id}`).remove();
  }

  removeInvestment = (id) => () => {
    firebase.database().ref(`users/${this.props.uid}/profile/monthlyInvestments/${id}`).remove();
  }

  showBudgetModal = (showBudgetModal) => () => {
    this.setState({ showBudgetModal });
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
    firebase.database().ref(`users/${this.props.uid}/profile/${ref}`)
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

  updateBudget = () => {
    firebase.database().ref(`users/${this.props.uid}/profile`)
      .update({
        expenseBudget: this.state.expenseBudget,
      })
      .then(() => {
        this.setState({
          showBudgetModal: false,
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
      .then(() => {
        this.props.logout();
        this.props.history.push("/");
      });
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <ArrowLeftOutlined
                onClick={this.navigateHome}
              />
          <h3 style={{ paddingTop: 20 }}>Profile</h3>

          <Row type="flex" justify="center">
            <Col style={{ padding: 15, borderRadius: "50%", backgroundColor: "#5cdbd3", marginBottom: 20 }}>
              <UserOutlined style={{ fontSize: 60 }}  />
            </Col>
          </Row>

          <Collapse
            bordered={false}
            expandIconPosition="right"
          >
            <Panel
              header="Budget"
              key="1"
              extra={this.state.expenseBudget==="" ? <PlusOutlined onClick={this.showBudgetModal(true)} /> : <EditOutlined onClick={this.showBudgetModal(true)} /> }
            >
              <List
                dataSource={[this.state.expenseBudget]}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar size="large" icon={<UserOutlined />} />}
                      title="Budget"
                      style={{ alignItems: "center" }}
                    />
                    <div>{item ? `S$ ${formatNumber(item)}` : "Not set yet"}</div>
                  </List.Item>
                )}
              />
            </Panel>

            <Panel
              header="Recurring Income"
              key="2"
              extra={<PlusOutlined onClick={this.showModalIncome}/>}
            >
              <List
                dataSource={this.state.income}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <DeleteOutlined type="delete" onClick={this.removeIncome(item.id)} />
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar size="large" icon="dollar" />}
                      title={item.source}
                      style={{ alignItems: "center" }}
                    />
                    <div>{`S$ ${formatNumber(item.amount)}`}</div>
                  </List.Item>
                )}
              />
            </Panel>

            <Panel
              header="Recurring investments"
              key="3"
              extra={<PlusCircleOutlined onClick={this.showModalInvestment} />}
            >
              <List
                dataSource={this.state.investments}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <DeleteOutlined type="delete" onClick={this.removeInvestment(item.id)}/>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar size="large" icon="dollar" />}
                      title={item.source}
                      style={{ alignItems: "center" }}
                    />
                    <div>{`S$ ${formatNumber(item.amount)}`}</div>
                  </List.Item>
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

          <Modal
            title="Update Monthly Expense Budget"
            centered
            visible={this.state.showBudgetModal}
            onOk={this.updateBudget}
            okButtonProps={{
              disabled: this.state.expenseBudget === "" || this.state.expenseBudget === 0
            }}
            onCancel={this.showBudgetModal(false)}
          >
            <InputNumber
              value={this.state.expenseBudget}
              style={{ width: "100%" }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              onChange={this.handleSelect("expenseBudget")}
            />
          </Modal>

          <div style={{ display: "flex", justifyContent: "center", margin: 30 }}>
            <Button onClick={this.logout}>Logout</Button>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps, { logout })(withRouter(Profile));