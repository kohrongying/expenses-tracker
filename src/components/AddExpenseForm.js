import React, { Component } from 'react';
import firebase from '../firebase.js';

const getMonth = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[(new Date().getMonth())];
}

const formatNumber = (num) => {
  let result = num != null ? parseFloat(num).toFixed(2) : 0;
  return result;
}

export default class AddExpenseForm extends Component {
	constructor(props) {
		super(props)
    this.state = {
      amount: 0,
      category: 'Food',
      totalAmount: 0,
      remarks: ''
		} 
		this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault();
    let year = new Date().getFullYear();
    let month = getMonth();
    const itemsRef = firebase.database().ref(`users/${this.props.uid}/${year}/${month}/items`);
    const totalAmountRef = firebase.database().ref(`users/${this.props.uid}/${year}/${month}/totalAmount`);
    let currentTotal = 0;
    const item = {
      amount: formatNumber(this.state.amount),
      category: this.state.category,
      date: new Date().toDateString(),
      month: month,
      year: year,
      remarks: this.state.remarks
    }
    itemsRef.push(item);
    totalAmountRef.on('value', (snapshot)=>{
      if (snapshot.val() != null) {
        currentTotal = snapshot.val().totalAmount;
      }
    })
    totalAmountRef.update({
      totalAmount: currentTotal + parseFloat(this.state.amount)
    })
    this.setState({
      amount:0,
      category: "Food",
      remarks: ''
    })

	}
	
	render() {
		return (
			<section>
	        <div className='container'>
	          <form className="add-item-form" onSubmit={this.handleSubmit}>
	            <div className="form-row" >
	              <div className="col">
	                <input type="number" className="form-control" name="amount" placeholder="How much?" onChange={this.handleChange} value={this.state.amount} />
	              </div>
	              <div className="col">
	                <div className="form-group">
	                  <select className="form-control" id="category-type" name="category" onChange={this.handleChange} value={this.state.category}>
	                    <option value="Food">Food</option>
	                    <option value="Transport">Transport</option>
	                    <option value="Movie">Movie</option>
	                    <option value="Other">Other</option>
	                  </select>
	                </div>
	              </div>
	              <div className="col">
	                <input type="text" className="form-control" name="remarks" placeholder="Remarks" onChange={this.handleChange} value={this.state.remarks} />
	              </div>
	              <div className="col">
	                <button type="submit" className="btn btn-primary save-item-btn">Save</button>
	              </div>
	            </div>
	          </form>
	        </div>
	    </section>
		)
	}
}