import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login, logout } from "./actions";
import { Typography, Row, Col, Icon, Card, Divider, Button } from "antd";
import firebase from "firebase/app";
import "firebase/auth";
import { withRouter } from "react-router-dom";

const { Title } = Typography;

const NAVBAR = [
  { url: "/expenses", label: "Expenses", icon: "dashboard" },
  // { url: "/history", label: "History", icon: "history" },
  { url: "/income", label: "Income", icon: "dollar" },
  { url: "/investment", label: "Investment", icon: "bank" }
];

const provider = new firebase.auth.GoogleAuthProvider();
const { Meta } = Card;

class Home extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
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

  logout = () => {
    firebase.auth().signOut()
      .then(() => this.props.logout() );
  }

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <Row gutter={16} type="flex" align="middle">
            <Col offset={2}>
              <Title style={{ marginTop: 30 }} level={2}>Expense Tracker</Title>
            </Col>
            {this.props.isAuthenticated ? (
              <Col>
                <Button onClick={this.logout}>Logout</Button>
              </Col>
            ) : (
              <Col>
                <Button onClick={this.login}>Login</Button>
              </Col>
            )}
          </Row>

          {this.props.isAuthenticated && (
            <Row gutter={16} type="flex" justify="center">
              {NAVBAR.map(nav => (
                <Col xs={5} key={nav.label}>
                  <Card
                    size="small"
                    hoverable
                    onClick={this.linkTo(nav.url)}
                    style={{ textAlign: "center" }}
                  >
                    <Icon style={{ fontSize: "30px" }} type={nav.icon} />
                    <Meta title={nav.label} />
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <Divider />
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({ isAuthenticated: state.user.isAuthenticated });

export default connect(mapStateToProps, { login, logout })(withRouter(Home));