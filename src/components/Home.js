import React, { Component } from 'react';
import AddExpenseForm from '../components/AddExpenseForm';
import Expense from '../components/Expense';
import firebase from '../firebase.js';

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
      loading: true,
      totalAmount: 0
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
        for (let item in items){
          newState.push({
            id: item,
            amount: items[item].amount,
            category: items[item].category,
            remarks: items[item].remarks,
            date: items[item].date
          });
        }
        this.setState({
          items: newState.reverse()
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
    this.setState({ loading: true })
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
          <section className="banner">
				  	<div className="container d-flex flex-column align-items-center">
				  		<h5>{getMonthYear()}</h5>
				  		<h2>S${this.state.totalAmount}</h2>
				  	</div>
          </section>

          <AddExpenseForm uid={this.props.uid} />
	              
          <section className='display-item'>
            <div className='container'>
              <ul className="display-list">
              {this.state.items.map((item)=>{
                return (
                  <Expense 
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