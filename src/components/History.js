import React, { Component } from 'react';
import firebase from '../firebase.js';
import Banner from './Banner';

const formatNumber = (num) => {
  let result = num != null ? parseFloat(num).toFixed(2) : 0;
  return result;
}

export default class History extends Component {
	constructor(props){
		super(props)
		this.state = {
			thisYear: [],
			year: new Date().getFullYear()
		}
	}

	componentDidMount(){
		if (this.props.uid) {
			firebase
				.database()
				.ref(`users/${this.props.uid}/${this.state.year}`)
    			.on('value', (snapshot)=> {
					let months = snapshot.val();
					const orderedMonths = {};
					const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					Object.keys(months).sort((a,b) => { return allMonths.indexOf(a) - allMonths.indexOf(b) }).forEach(function(key) {
						orderedMonths[key] = months[key];
					});
					let thisYear = []
					for (let month in orderedMonths) {
						thisYear.push({
							id: month,
							totalAmount: formatNumber(months[month].totalAmount.totalAmount)
						})
					}
          this.setState({ thisYear })
        })
		}
	}
	render() {
		return (
			<div>
				{this.props.uid ?

				<div>
					<Banner title="History" />

				  	<section>
				  		<div className="container">
				  			<div className="row d-flex justify-content-center">
						  		<h3 className="year-title">{this.state.year}</h3>
						  	</div>
						  	<ul className="display-list">
						  		{this.state.thisYear.map((month) => {
						  			return (
						  				<li key={month.id} className="item d-flex justify-content-between">
						  					<h3><strong>{month.id}</strong></h3>
						  					<h3>S${month.totalAmount}</h3>
						  				</li>
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