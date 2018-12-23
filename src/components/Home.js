import React, { Component } from 'react';
import AddExpenseForm from '../components/AddExpenseForm';
import Expense from '../components/Expense';
import firebase from '../firebase.js';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { CreditCard, Money } from '@material-ui/icons';
import green from '@material-ui/core/colors/green';
import Banner from './Banner';

const getMonth = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[(new Date().getMonth())];
}

const formatNumber = (num) => {
  let result = num != null ? parseFloat(num).toFixed(2) : 0;
  return result;
}

const getMonthYear = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${monthNames[(new Date().getMonth())]} ${new Date().getFullYear()}`;
}

export default class Home extends Component {
	constructor(props) {
    super(props)
    this.state = {
      items: [],
      totalAmount: 0,
      cashExpense: "$0",
      cardExpense: "$0"
    }
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    if (this.props.uid) {
      let year = new Date().getFullYear();
      let month = getMonth();
      const itemsRef = firebase.database().ref(`/users/${this.props.uid}/${year}/${month}/items`);
      itemsRef.on('value', (snapshot)=> {
        let items = snapshot.val();
        let newState = [];
        let cashExpense = 0;
        let cardExpense = 0;
        for (let item in items){
          newState.push({
            id: item,
            amount: items[item].amount,
            category: items[item].category,
            remarks: items[item].remarks,
            date: items[item].date,
            paymentType: items[item].paymentType ? items[item].paymentType : "Cash"
          });
          if (items[item].paymentType === "Credit Card") {
            cardExpense += parseInt(items[item].amount) 
          } else {
            cashExpense += parseInt(items[item].amount)
          }
        }
        this.setState({
          items: newState.reverse(),
          cashExpense: formatNumber(cashExpense),
          cardExpense: formatNumber(cardExpense)
        })
      })
      
      const totalAmountRef = firebase.database().ref(`/users/${this.props.uid}/${year}/${month}/totalAmount`);
      totalAmountRef.on('value', (snapshot)=>{
        if (snapshot.val()!=null){
          this.setState({
            totalAmount: formatNumber(snapshot.val().totalAmount)
          }) 
        }
      })
    }
  }

  removeItem(itemID, itemAmt){
    let year = new Date().getFullYear();
    let month = getMonth();
    const itemRef = firebase.database().ref(`users/${this.props.uid}/${year}/${month}/items/${itemID}`);
    const totalAmountRef = firebase.database().ref(`users/${this.props.uid}/${year}/${month}/totalAmount`);
    let currentTotal = 0;
    totalAmountRef.on('value', (snapshot)=>{
      currentTotal = snapshot.val().totalAmount;
    })
    totalAmountRef.update({
      totalAmount: currentTotal - parseFloat(itemAmt)
    })
    itemRef.remove();
  }

	render(){
		return (
			<div>
				{this.props.uid ?
				
        <div>
          <Banner 
            title={getMonthYear()} 
            secondaryText={`S$${this.state.totalAmount}`} />

          <AddExpenseForm uid={this.props.uid} />
	        
          <div className="container d-flex justify-content-around">
            <Chip
              avatar={<Avatar style={{backgroundColor: green[500], color: "white"}}><CreditCard /></Avatar>}
              label={`$${this.state.cardExpense}`}
            />
            <Chip
        avatar={<Avatar style={{backgroundColor: green[500], color: "white"}}><Money /></Avatar>}
              label={`$${this.state.cashExpense}`}
            />
          </div>
          
          <section className='display-item'>
            <div className='container'>
              <ul className="display-list">
              {this.state.items.map((item, index)=>{
                return (
                  <Expense 
                    key={index}
                    item={item}
                    removeItem={this.removeItem}
                  />
                )
              })}
              </ul>
            </div>
          </section>
	             
        </div>
				:
				<p>You must be logged in.</p>
				}
			</div>
		)
	}
}