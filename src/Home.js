import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "./actions";
import { Typography, Row, Col, Icon, Divider, Button } from "antd";
import firebase from "firebase/app";
import "firebase/auth";
import { withRouter } from "react-router-dom";
import Container from "./components/UI/Container";import ExpensesSummary from "./components/History/ExpensesSummary";

const { Title } = Typography;

const NAVBAR = [
  { url: "/expenses", label: "Expenses", icon: "dashboard", color: "#ff85c0" },
  // { url: "/history", label: "History", icon: "history", color: "#5cdbd3" },
  { url: "/income", label: "Income", icon: "dollar", color: "#597ef7" },
  { url: "/investment", label: "Investment", icon: "bank", color: "#ffd666" },
  { url: "/profile", label: "Profile", icon: "user", color: "#5cdbd3" },
];

const provider = new firebase.auth.GoogleAuthProvider();

class Home extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired
  }

  linkTo = url => () => {
    this.props.history.push(url);
  }

  login = () => {
    firebase.auth().signInWithRedirect(provider)
      .then((result)=>{
        this.props.login(result.user.uid);
      })
      // eslint-disable-next-line no-console
      .catch(err => console.log(err));
  }

  render() {
    return (
      <React.Fragment>
        <div className="App">
          {!this.props.isAuthenticated && (
            <Row gutter={16} type="flex" align="middle">
              <Col offset={2}>
                <Title style={{ marginTop: 30 }} level={2}>Expense Tracker</Title>
                <Button onClick={this.login}>Login</Button>
              </Col>
            </Row>
          )}

          {this.props.isAuthenticated && (
            <React.Fragment>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  lg={{ span: 16, offset: 4 }}
                  style={{ paddingTop: 40, }}
                >
                  <Title style={{ fontSize: 25, marginBottom: 30, }}>Home</Title>
                  <h6 style={{ marginBottom: 20, }}>Overview</h6>
                </Col>
              </Row>

              <ExpensesSummary />
              <Container>

                <h6 style={{ marginBottom: 0 }}>Quick Links &gt;</h6>
                <Row gutter={16} type="flex" justify="center">
                  {NAVBAR.map(nav => (
                    <Col xs={12} key={nav.label}>
                      <div
                        onClick={this.linkTo(nav.url)}
                        style={{ marginTop: 15, borderRadius: 15, backgroundColor:"white", padding: 15, textAlign: "center", }}
                      >
                        <Icon style={{ color: `${nav.color}`, fontSize: "25px" }} type={nav.icon} />
                        <div style={{ fontSize: 10 }}>{nav.label}</div>
                      </div>
                    </Col>
                  ))}
                </Row>

                <Divider />
              </Container>
            </React.Fragment>
          )}


        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({ isAuthenticated: state.user.isAuthenticated });

export default connect(mapStateToProps, { login })(withRouter(Home));