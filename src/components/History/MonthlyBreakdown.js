import React, { Component } from "react";
import PropTypes from "prop-types";
import Banner from "../Banner";
import firebase from "../../firebase.js";
import { cyan, teal, indigo, red } from "@material-ui/core/colors";
import { Pie, Bar } from "react-chartjs-2";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { getTotalFromItems } from "../../helpers/common";

const styles = {
  paper: {
    padding: 20,
  },
  card: {
    width: "30%"
  },
};

export default class MonthlyBreakdown extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    uid: PropTypes.string.isRequired,
  }

  state = {
    month: this.props.match.params.month,
    year: this.props.match.params.year,
    expenses: 0,
    expensesBreakdown: {
      "Food": 0, "Transport": 0, "Movie": 0, "Other": 0
    },
    investment: 0,
    savings: 0,
    income: 0
  };

  componentDidMount() {
    this.getMonthData();
    this.getExpensesBreakdown();
  }

  getMonthData = () => {
    firebase
      .database()
      .ref(`users/${this.props.uid}/${this.state.year}/${this.state.month}`)
      .once("value")
      .then(snapshot => {
        const monthItem = snapshot.val();
        const income = getTotalFromItems(monthItem.income);
        const investment = getTotalFromItems(monthItem.investment);
        const expenses = monthItem.totalAmount;
        const savings = income - investment - expenses;
        this.setState({ expenses, investment, savings, income });
      });
  }

  getExpensesBreakdown = () => {
    firebase
      .database()
      .ref(`users/${this.props.uid}/${this.state.year}/${this.state.month}/items`)
      .once("value")
      .then(snapshot => {
        const items = snapshot.val();
        let expensesBreakdown = {
          "Food": 0, "Transport": 0, "Movie": 0, "Other": 0
        };
        for (let item in items){
          expensesBreakdown[items[item].category] += parseFloat(items[item].amount);
        }
        this.setState({ expensesBreakdown });
      });
  }

  render(){
    const pieLabels = ["Expenses","Investment","Savings"];
    const pieDataSet = [this.state.expenses, this.state.investment, this.state.savings];
    const data = {
      labels: pieLabels,
      datasets: [{
        data: pieDataSet ,
        backgroundColor: [cyan[300], teal[300], indigo[300]],
        hoverBackgroundColor: [cyan[600], teal[600], indigo[600]]
      }]
    };
    const exp = this.state.expensesBreakdown;
    const barData = {
      labels: ["Food", "Transport", "Movie", "Other"],
      datasets: [
        {
          label: "Expenses",
          backgroundColor: red[200],
          borderWidth: 1,
          hoverBackgroundColor: red[400],
          data: [exp["Food"], exp["Transport"], exp["Movie"], exp["Other"]]
        }
      ]
    };

    return (
      <div>
        {this.props.uid ?
          <div>
            <Banner secondaryText="Breakdown" title={`${this.state.month} ${this.state.year}`} />

            <div className="container" style={styles.paper}>
              <Pie data={data} width={250} height={200} options={{ maintainAspectRatio: false }}/>
            </div>

            <div className="container d-flex justify-content-around">
              {
                pieLabels.map((item, index) =>{
                  return (
                    <Card key={index} style={styles.card}>
                      <CardContent>
                        <p>{item}</p>
                        <h6>S${pieDataSet[index]}</h6>
                      </CardContent>
                    </Card>
                  );
                })
              }
            </div>

            <div className="container" style={styles.paper}>
              <Bar
                data={barData}
                width={100}
                height={250}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [{
                      display: true,
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
                }}
              />
            </div>


          </div>

          :
          <p>You must be logged in.</p>
        }
      </div>
    );
  }
}