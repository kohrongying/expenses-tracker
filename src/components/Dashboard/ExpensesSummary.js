import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import { Bar } from "react-chartjs-2";

const year = new Date().getFullYear();
const month = new Date().getMonth();

class ExpensesSummary extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
  }

  state = {
    months: [],
  }

  componentDidMount() {
    // If May or earlier
    if (month <= 4) {
      let months = [];
      this.getMonths(year, month+1).then(snapshot => {
        if (snapshot.exists()) {
          const result = snapshot.val();
          for (let i = 0; i < month + 1; i ++) {
            if (i in result) {
              const totalExpense = this.getTotalExpense(result[i].items);
              months.push(totalExpense);
            } else {
              months.push(0);
            }
          }
          const remainingMonths = 6 - month - 1;
          this.getMonths(year-1, remainingMonths).then(snapshot => {
            if (snapshot.exists()) {
              const result = snapshot.val();
              for (let i = 11 ; i >= 12 - remainingMonths; i --) {
                if (i in result) {
                  const totalExpense = this.getTotalExpense(result[i].items);
                  months.unshift(totalExpense);
                } else {
                  months.unshift(0);
                }
              }
              this.setState({ months });
            }
          });
        }
      });

    } else {
      this.getMonths(year, 6).then(snapshot => {
        let months = [];
        if (snapshot.exists()) {
          const result = snapshot.val();
          for (let i = month-6+1; i <= month; i ++) {
            if (i in result) {
              const totalExpense = this.getTotalExpense(result[i].items);
              months.push(totalExpense);
            } else {
              months.push(0);
            }
          }
          this.setState({ months });
        }
      });
    }
  }

  getMonths = (yearRef, num) => {
    return firebase.database()
      .ref(`users/${this.props.uid}/${yearRef}`)
      .limitToLast(num)
      .once("value");
  }

  getTotalExpense = (items) => {
    return Object.values(items)
      .map(item => item.amount)
      .reduce((accumulator, curr) => accumulator + curr, 0);
  }

  render() {
    const barData = {
      labels: [0, 1, 2, 3, 4, 5],
      datasets: [
        {
          label: "Expenses",
          backgroundColor: "#00d3ba",
          borderWidth: 1,
          hoverBackgroundColor: "#00d3ba",
          data: this.state.months
        }
      ]
    };
    if (this.state.months.length === 0) return null;
    return (

      <Bar
        data={barData}
        height={150}
        options={{
          legend: { display: false },
          scales: {
            xAxes: [{ display: false, barPercentage: 0.5 }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 60,
                gridlines: { show: false }
              }
            }],
          }
        }}
      />
    );
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps)(ExpensesSummary);