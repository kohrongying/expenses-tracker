import React, { Component } from 'react';
import firebase from '../firebase.js';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

const getMonth = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[(new Date().getMonth())];
}

const formatNumber = (num) => {
  let result = num != null ? parseFloat(num).toFixed(2) : 0;
  return result;
}

const categories = [
  {
    value: "Food",
    label: "Food"
  },
  {
    value: "Transport",
    label: "Transport"
  },
  {
    value: "Movie",
    label: "Movie"
  },
  {
    value: "Other",
    label: "Other"
  }
]

const paymentTypes = [
  {
    value: "Cash",
    label: "Cash"
  },
  {
    value: "Credit Card",
    label: "Credit Card"
  }
]

const styles = {
  textField: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  }
}

export default class AddExpenseForm extends Component {
	constructor(props) {
		super(props)
    this.state = {
      amount: 0,
      category: '',
      totalAmount: 0,
      remarks: '',
      paymentType: ''
		} 
		this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

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
      remarks: this.state.remarks,
      paymentType: this.state.paymentType
    }
    itemsRef.push(item);
    totalAmountRef.once('value', (snapshot)=>{
      if (snapshot.val() != null) {
        currentTotal = snapshot.val().totalAmount;
      }
    })
    totalAmountRef.update({
      totalAmount: currentTotal + parseFloat(this.state.amount)
    })
    this.setState({
      amount:0,
      remarks: '',
    })

	}
	
	render() {
		return (
			<section>
        <div className='container'>
          <form className="add-item-form" onSubmit={this.handleSubmit}>

          <div className="row">
            <div className="col">
              <TextField
                id="outlined-number"
                label="Amount"
                value={this.state.amount}
                onChange={this.handleChange('amount')}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"
                style={styles.textField}
              />
            </div>
            <div className="col">
              <TextField
                id="standard-select-category"
                select
                label="Category"
                value={this.state.category}
                onChange={this.handleChange('category')}
                margin="normal"
                style={styles.textField}
              >
                {categories.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <TextField
                id="standard-name"
                label="Remarks"
                value={this.state.remarks}
                onChange={this.handleChange('remarks')}
                margin="normal"
                style={styles.textField}
              />
            </div>
            
            <div className="col">
              <TextField
                id="standard-select-currency"
                select
                label="Payment Type"
                value={this.state.paymentType}
                onChange={this.handleChange('paymentType')}
                margin="normal"
                style={styles.textField}
              >
                {paymentTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          
          <div className="row" >
            <Button type="submit" variant="contained" color="primary" style={styles.button}>
              Save
            </Button>
          </div>
          </form>
        </div>
	    </section>
		)
	}
}

