import React, { Component } from 'react';
import firebase from '../firebase.js';

const formatNumber = (num) => {
  let result = num != null ? parseFloat(num).toFixed(2) : 0;
  return result;
}

export default class History extends Component {
	constructor(props){
		super(props)
		this.state = {
			thisYear: [] 
		}
	}

	componentDidMount(){
		if (this.props.user) {
			let year = new Date().getFullYear();
			const yearRef = firebase.database().ref(`users/${this.props.user.uid}/${year}`);
    		yearRef.on('value', (snapshot)=> {
	          let months = snapshot.val();
	          let newMonth = []
	          for (let month in months) {
	          	newMonth.push({
	          		id: month,
	          		totalAmount: formatNumber(months[month].totalAmount.totalAmount)
	          	})
	          }
	          this.setState({
	          	thisYear: newMonth
	          })
	        })
		}
	}
	render() {
		return (
			<div>
				{this.props.user ?

				<div>
					<section className="banner">
					  	<div className="container d-flex flex-column align-items-center">
					  		<h5>History</h5>
					  	</div>
				  	</section>

				  	<section>
				  		<div className="container">
				  			<div className="row">
						  		<h3 className="year-title">2018</h3>
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