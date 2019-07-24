import React, { Component } from 'react';
import firebase from '../../firebase.js';
import Banner from '../Banner';
import MonthItem from './MonthItem';
import { getMonth, getTotalFromItems } from '../../helpers/common';
import { Bar } from 'react-chartjs-2';
import { deepPurple, lightBlue } from '@material-ui/core/colors';

const year = new Date().getFullYear();
const month = getMonth()
const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class History extends Component {
	state = {
		thisYear: [],
		year: year,
		expanded: null,
		monthlyIncome: 0,
		monthlyInvestment: 0,
		monthLabels: [],
		barData: [],
		lineData: []
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
					
					Object.keys(months).sort((a,b) => { return allMonths.indexOf(a) - allMonths.indexOf(b) }).forEach(function(key) {
						orderedMonths[key] = months[key];
					});
					let thisYear = []
					let monthLabels = []
					let barData = []
					let lineData = []
					for (let month in orderedMonths) {
						let totalIncome = getTotalFromItems(months[month].income)
						let totalInvestment = getTotalFromItems(months[month].investment)
						let totalExpenses = months[month].totalAmount
						let totalSavings = totalIncome - totalExpenses - totalInvestment
						thisYear.push({
							id: month,
							totalExpenses: totalExpenses,
							totalIncome: totalIncome,
							totalInvestment: totalInvestment,
							totalSavings: totalSavings
						})
						monthLabels.push(month)
						barData.push(totalSavings)
						lineData.push(totalExpenses)
					}
          this.setState({ thisYear, monthLabels, barData, lineData })
        })
		}
		
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
		const data = {
			datasets: [{
					label: 'Expenses',
					type:'line',
					data: this.state.lineData,
					fill: false,
					borderColor: deepPurple[400],
					backgroundColor: deepPurple[400],
					pointBorderColor: deepPurple[400],
					pointBackgroundColor: deepPurple[400],
					pointHoverBackgroundColor: deepPurple[500],
					pointHoverBorderColor: deepPurple[500],
					yAxisID: 'y-axis-2'
				},{
					type: 'bar',
					label: 'Savings',
					data: this.state.barData,
					fill: false,
					backgroundColor: lightBlue[200],
					borderColor: lightBlue[200],
					hoverBackgroundColor: lightBlue[300],
					hoverBorderColor: lightBlue[300],
					yAxisID: 'y-axis-1'
				}]
		};
		const options = {
			responsive: true,
			tooltips: {
				mode: 'label'
			},
			elements: {
				line: {
					fill: false
				}
			},
			scales: {
				xAxes: [
					{
						display: true,
						gridLines: {
							display: false
						},
						labels: this.state.monthLabels,
					}
				],
				yAxes: [
					{
						type: 'linear',
						display: true,
						position: 'left',
						id: 'y-axis-1',
						gridLines: {
							display: false
						},
						labels: {
							show: true
						}
					},
					{
						type: 'linear',
						display: true,
						position: 'right',
						id: 'y-axis-2',
						gridLines: {
							display: false
						},
						labels: {
							show: true
						}
					}
				]
			}
		};
		return (
			<div>
				{this.props.uid ?

				<div>
					<Banner title="History" secondaryText={this.state.year} />

				  	<section>
				  		<div className="container" style={{marginTop: '10px', marginBottom: '10px'}}>
								<Bar data={data} options={options}/>
								
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