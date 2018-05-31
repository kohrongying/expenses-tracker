import React, { Component } from 'react';

export default class History extends Component {
	render() {
		return (
			<div>
				{this.props.user ?
				<p>History</p>
				:
				<p>You must be logged in.</p>
				}
			</div>
		)
	}
}