import React, {Component} from 'react';
import Banner from './Banner';
import firebase from '../firebase.js';
import { cyan, teal, indigo, red } from '@material-ui/core/colors';
import { Pie, Bar } from 'react-chartjs-2';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const styles = {
  paper: {
    padding: 20,
  },
  card: {
    width: '30%'
  },
}

export default class MonthlyBreakdown extends Component {
  constructor(props){
    super(props)
    this.state = {
      month: props.match.params.month, 
      year: props.match.params.year
    }
  }

  componentDidMount() {
    this.getMonthData(this.props.uid, this.state.year, this.state.month)
  }
  
  getMonthData = (uid, year, month) => {
    firebase
      .database()
      .ref(`users/${uid}/${year}/${month}`)
      .once('value')
      .then(snapshot => {
        const monthItem = snapshot.val()
        const income = this.getTotalFromItems(monthItem.income)
        const investment = this.getTotalFromItems(monthItem.investment)
        const expenses = monthItem.totalAmount
        const savings = income - investment - expenses
        this.setState({ expenses, investment, savings, income })
      })
  }
  
  getTotalFromItems = (items) => {
    let total = 0
    for (let item in items) {
      total += items[item].amount
    }
    return total
  }


  render(){
    const pieLabels = ['Expenses','Investment','Savings']
    const pieDataSet = [this.state.expenses, this.state.investment, this.state.savings]
    const data = {
      labels: pieLabels,
      datasets: [{
        data: pieDataSet ,
        backgroundColor: [cyan[300], teal[300], indigo[300]],
        hoverBackgroundColor: [cyan[600], teal[600], indigo[600]]
      }]
    };

    const barData = {
      labels: ['Food', 'Transport', 'Movie', 'Others'],
      datasets: [
        {
          label: 'Expenses',
          backgroundColor: red[200],
          borderWidth: 1,
          hoverBackgroundColor: red[400],
          data: [65, 59, 80, 81]
        }
      ]
    };

    return(
      <div>
      {this.props.uid ?
        <div>
          <Banner secondaryText="Breakdown" title={`${this.state.month} ${this.state.year}`} />

          <div className="container" style={styles.paper}>
            <Pie data={data} width={250} height={200} options={{ maintainAspectRatio: false}}/>
          </div>

          <div className="container d-flex justify-content-around">
            {
              pieLabels.map((item, index) =>{
                return (
                  <Card key={index} style={styles.card}>
                    <CardContent>
                      <h6>{item}</h6>
                      <h5>S${pieDataSet[index]}</h5>
                    </CardContent>
                  </Card>
                )
              })
            }
          </div>

          <div className="container" style={styles.paper}>
            <Bar
              data={barData}
              width={100}
              height={250}
              options={{
                maintainAspectRatio: false
              }}
            />
          </div>
          
          
        </div>
        
      :
      <p>You must be logged in.</p>
      }
      </div>
    )
  }
}