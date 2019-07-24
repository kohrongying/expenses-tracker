import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import Banner from "../UI/Banner";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import AddIncomeForm from "./AddIncomeForm";
import { getMonth } from "../../helpers/common";
import IncomeItem from "./IncomeItem";
import { connect } from "react-redux";

const year = new Date().getFullYear();
const month = getMonth();

const styles = {
  salarySection: {
    paddingTop: 10,
    paddingBottom: 10
  }
};

class Income extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
  }

  state = {
    open: false,
    amount: "",
    incomeSource: "",
    monthlyItems: [],
    items: [],
    openExtra: false,
  }

  componentDidMount(){
    firebase.database().ref(`users/${this.props.uid}/monthlyIncome`)
      .on("value", (snapshot)=> {
        let items = snapshot.val();
        let temp = [];
        for (let item in items) {
          temp.push({
            id: item,
            incomeSource: items[item].incomeSource,
            amount: items[item].amount
          });
        }
        this.setState({ monthlyItems: temp });
      });

    firebase.database().ref(`users/${this.props.uid}/${year}/${month}/income`)
      .on("value", (snapshot)=> {
        let items = snapshot.val();
        let temp = [];
        for (let item in items) {
          temp.push({
            id: item,
            incomeSource: items[item].incomeSource,
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

  handleClickOpenExtra = () => {
    this.setState({ openExtra: true });
  };

  handleCloseExtra = () => {
    this.setState({ openExtra: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmitMonthlyIncome = (e) => {
    e.preventDefault();
    if (this.state.amount > 0){
      firebase.database().ref(`users/${this.props.uid}/monthlyIncome`)
        .push({ amount: parseFloat(this.state.amount), incomeSource: this.state.incomeSource });
    }

    this.setState({
      amount: "",
      incomeSource: "",
      open: false
    });
  }

  handleSubmitExtraIncome = (e) => {
    e.preventDefault();

    if (this.state.amount > 0){
      firebase.database().ref(`users/${this.props.uid}/${year}/${month}/income`)
        .push({ amount: parseFloat(this.state.amount), incomeSource: this.state.incomeSource });
    }

    this.setState({
      amount: "",
      incomeSource: "",
      openExtra: false
    });
  }

  removeMonthlyItem = (id) => () => {
    firebase.database().ref(`users/${this.props.uid}/monthlyIncome/${id}`).remove();
  }

  removeItem = (id) => () => {
    firebase.database().ref(`users/${this.props.uid}/${year}/${month}/income/${id}`).remove();
  }

  render() {
    return (
      <div>
        {this.props.uid ?

          <div>
            <Banner title="Income" />

            <section style={styles.salarySection} className="salary-section">
              <div className="container">
                <div className="row d-flex flex-row justify-content-between align-items-center">
                  <h5>Monthly Income</h5>
                  <IconButton onClick={this.handleClickOpen} aria-label="Add">
                    <AddIcon />
                  </IconButton>
                </div>

                <AddIncomeForm
                  open={this.state.open}
                  handleClose={this.handleClose}
                  title="Add Monthly Income"
                  value={this.state.amount}
                  source={this.state.incomeSource}
                  handleChange={this.handleChange}
                  handleSubmit={this.handleSubmitMonthlyIncome}
                />

                {this.state.monthlyItems.map((item, index) => {
                  return (
                    <IncomeItem key={index} item={item} removeItem={this.removeMonthlyItem} />
                  );
                })}

              </div>
            </section>

            <section style={styles.salarySection} className="salary-section">
              <div className="container">
                <div className="row d-flex flex-row justify-content-between align-items-center">
                  <h5>Total Income ({getMonth()})</h5>
                  <IconButton onClick={this.handleClickOpenExtra} aria-label="Add">
                    <AddIcon />
                  </IconButton>
                </div>

                <AddIncomeForm
                  open={this.state.openExtra}
                  handleClose={this.handleCloseExtra}
                  title="Add Additional Income"
                  value={this.state.amount}
                  source={this.state.incomeSource}
                  handleChange={this.handleChange}
                  handleSubmit={this.handleSubmitExtraIncome}
                />

                {this.state.items.map((item, index) => {
                  return (
                    <IncomeItem key={index} item={item} removeItem={this.removeItem} />
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

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps)(Income);