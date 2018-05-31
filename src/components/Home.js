import React, { Component } from 'react';
import AddExpenseForm from '../components/AddExpenseForm'
import DisplayExpenseList from '../components/DisplayExpenseList'

const getMonthYear = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${monthNames[(new Date().getMonth())]} ${new Date().getFullYear()}`;
}

export default class Home extends Component {
	render(){
		return (
			<div>
				{this.props.user ?
				<div>

				  <section className="banner">
				  	<div className="container d-flex flex-column align-items-center">
				  		<h5>{getMonthYear()}</h5>
				  		<h2>S${this.props.totalAmount}</h2>
				  	</div>
			  	  </section>
	              
	              <AddExpenseForm 
	              	onSubmit={this.props.onSubmit}
	              	onChange={this.props.onChange}
	              	category={this.props.category}
	              	amount={this.props.amount}
	              	remarks={this.props.remarks}
	              />
	              
	              <DisplayExpenseList
	              	items={this.props.items}
	              	removeItem={this.props.removeItem}
	              />
	             
	            </div>
				:
				<p>You must be logged in.</p>
				}
			</div>
		)
	}
}