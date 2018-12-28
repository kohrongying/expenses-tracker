import React, { Component } from 'react';
import firebase from '../firebase.js';
import Banner from './Banner';
import MonthItem from './MonthItem';
import { getMonth } from '../helpers/common';

const year = new Date().getFullYear();
const month = getMonth()

export default class History extends Component {
	state = {
		thisYear: [],
		year: year,
		expanded: null,
		monthlyIncome: 0,
		monthlyInvestment: 0
	}
	
  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
	};
	
	componentDidMount(){
		if (this.props.uid) {
			this.saveMonthlyIncome()
			this.saveMonthlyInvestment()

			firebase
				.database()
				.ref(`users/${this.props.uid}/${this.state.year}`)
    		.once('value', (snapshot)=> {
					let months = snapshot.val();
					const orderedMonths = {};
					const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					Object.keys(months).sort((a,b) => { return allMonths.indexOf(a) - allMonths.indexOf(b) }).forEach(function(key) {
						orderedMonths[key] = months[key];
					});
					let thisYear = []
					for (let month in orderedMonths) {
						let totalIncome = this.getTotalFromItems(months[month].income)
						let totalInvestment = this.getTotalFromItems(months[month].investment)
						let totalExpenses = months[month].totalAmount
						thisYear.push({
							id: month,
							totalExpenses: totalExpenses,
							totalIncome: totalIncome,
							totalInvestment: totalInvestment,
							totalSavings: totalIncome - totalExpenses - totalInvestment
						})
					}
          this.setState({ thisYear })
        })
		}
		
	}

	getTotalFromItems = (items) => {
		let total = 0
		for (let item in items) {
			total += items[item].amount
		}
		return total
	}

  saveMonthlyIncome = () => {
    firebase.database().ref(`users/${this.props.uid}/monthlyIncome`)
			.once('value')
			.then(snapshot =>{
				const items = snapshot.val()
				let updates = {}
				for (let item in items) {
					updates[item] = { amount: items[item].amount, incomeSource: items[item].incomeSource}
				}
				return updates
			})
			.then(updates => {
				firebase
					.database()
					.ref(`users/${this.props.uid}/${year}/${month}/income`)
					.update(updates)
			})	
  }

	saveMonthlyInvestment = () => {
    firebase.database().ref(`users/${this.props.uid}/monthlyInvestments`)
			.once('value')
			.then(snapshot =>{
				const items = snapshot.val()
				let updates = {}
				for (let item in items) {
					updates[item] = { amount: items[item].amount, investment: items[item].investment}
				}
				return updates
			})
			.then(updates => {
				firebase
					.database()
					.ref(`users/${this.props.uid}/${year}/${month}/investment`)
					.update(updates)
			})	
  }

	render() {
		return (
			<div>
				{this.props.uid ?

				<div>
					<Banner title="History" secondaryText={this.state.year} />

				  	<section>
				  		<div className="container">
				  			
						  	<div style={{paddingTop: '10px', paddingBottom: '10px'}}>
						  		{this.state.thisYear.map((month, i) => {
										let panel = `panel${i}`
						  			return (
											<MonthItem 
												key={month.id}
												expanded={this.state.expanded}
												handleChange={this.handleChange}
												panel={panel}
												month={month}
											/>
						  			)
						  		})}
						  	</div>
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