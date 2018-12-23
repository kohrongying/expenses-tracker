import React, { Component } from 'react';
import firebase from '../firebase.js';
import Banner from './Banner';

export default class Income extends Component {
  render() {
		return (
			<div>
        {this.props.uid ?
        
				<div>
					<Banner title="Income" />
        </div>
        :
        <p>You must be logged in.</p>
        }  
      </div>
    )
  }           
}