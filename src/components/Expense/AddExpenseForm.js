import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "../../firebase.js";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { getMonth } from "../../helpers/common";

const year = new Date().getFullYear();
const month = getMonth();

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
];

const paymentTypes = [
  {
    value: "Cash",
    label: "Cash"
  },
  {
    value: "Credit Card",
    label: "Credit Card"
  }
];

const styles = {
  textField: {
    width: "100%",
  },
  button: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  }
};

export default class AddExpenseForm extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
  }

  state = {
    amount: "",
    category: "",
    remarks: "",
    paymentType: ""
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const item = {
      amount: parseFloat(this.state.amount),
      category: this.state.category,
      date: new Date().toDateString(),
      remarks: this.state.remarks,
      paymentType: this.state.paymentType
    };
    firebase
      .database()
      .ref(`users/${this.props.uid}/${year}/${month}/items`)
      .push(item);

    firebase
      .database()
      .ref(`users/${this.props.uid}/${year}/${month}`)
      .update({
        totalAmount: parseFloat(this.props.totalAmount) + parseFloat(this.state.amount)
      });

    this.setState({
      amount: "",
      remarks: "",
    });
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
                  onChange={this.handleChange("amount")}
                  type="number"
                  margin="normal"
                  style={styles.textField}
                />
              </div>
              <div className="col">
                <TextField
                  id="standard-select-category"
                  select
                  label="Category"
                  value={this.state.category}
                  onChange={this.handleChange("category")}
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
                  onChange={this.handleChange("remarks")}
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
                  onChange={this.handleChange("paymentType")}
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
    );
  }
}