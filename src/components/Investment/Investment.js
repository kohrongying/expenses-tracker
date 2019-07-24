import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "../../firebase.js";
import Banner from "../UI/Banner";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import AddInvestmentForm from "./AddInvestmentForm";
import InvestmentItem from "./InvestmentItem";

const styles = {
  invSection: {
    paddingTop: 10,
    paddingBottom: 10
  }
};

export default class Investment extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
  }

  state = {
    items: [],
    investment: "",
    amount: "",
    open: false
  }
  componentDidMount(){
    firebase.database().ref(`users/${this.props.uid}/monthlyInvestments`)
      .on("value", (snapshot)=> {
        let items = snapshot.val();
        let temp = [];
        for (let item in items) {
          temp.push({
            id: item,
            investment: items[item].investment,
            amount: items[item].amount
          });
        }
        this.setState({ items: temp });
      });
  }

  componentWillUnmount(){
    firebase.database().ref().off();
  }


  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.amount > 0){
      firebase.database().ref(`users/${this.props.uid}/monthlyInvestments`)
        .push({ amount: parseFloat(this.state.amount), investment: this.state.investment });
    }

    this.setState({
      amount: "",
      investment: "",
      open: false
    });
  }

  removeItem = (id) => () => {
    firebase.database().ref(`users/${this.props.uid}/monthlyInvestments/${id}`).remove();
  }

  render(){
    return (
      <div>
        {this.props.uid ?

          <div>
            <Banner title="Investment" />

            <section style={styles.invSection}>
              <div className="container">
                <div className="row d-flex flex-row justify-content-between align-items-center">
                  <h5>Monthly Investment</h5>
                  <IconButton onClick={this.handleClickOpen} aria-label="Add">
                    <AddIcon />
                  </IconButton>
                </div>

                <AddInvestmentForm
                  open={this.state.open}
                  handleClose={this.handleClose}
                  title="Add Monthly Investment"
                  value={this.state.amount}
                  source={this.state.investment}
                  handleChange={this.handleChange}
                  handleSubmit={this.handleSubmit}
                />

                {this.state.items.map((item, index) => {
                  return (
                    <InvestmentItem key={index} item={item} removeItem={this.removeItem} />
                  );
                })}

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