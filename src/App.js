import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import History from './History'
import Home from './Home'

const getMonth = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[(new Date().getMonth())];
}

const formatNumber = (num) => {
  return parseFloat(num).toFixed(2);
}

class App extends Component {  
  constructor(props){
    super(props);

    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null,
      amount: 0,
      category: 'Food',
      totalAmount: 0,
      remarks: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }

  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const totalAmountRef = firebase.database().ref('totalAmount');
    let currentTotal = 0;
    const item = {
      amount: formatNumber(this.state.amount),
      category: this.state.category,
      date: new Date().toDateString(),
      month: getMonth(),
      year: new Date().getFullYear(),
      remarks: this.state.remarks
    }
    itemsRef.push(item);
    totalAmountRef.on('value', (snapshot)=>{
      currentTotal = snapshot.val().totalAmount;
    })
    totalAmountRef.update({
      totalAmount: currentTotal + parseFloat(this.state.amount)
    })
    this.setState({
      amount:0,
      category: 'Food',
      remarks: ''
    })

  }

  login(){
    auth.signInWithRedirect(provider)
      .then((result)=>{
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  logout(){
    auth.signOut()
      .then(()=>{
        this.setState({
          user: null
        })

      })

  }

  removeItem(itemID, itemAmt){
    const itemRef = firebase.database().ref(`/items/${itemID}`);
    const totalAmountRef = firebase.database().ref('totalAmount');
    let currentTotal = 0;
    totalAmountRef.on('value', (snapshot)=>{
      currentTotal = snapshot.val().totalAmount;
    })
    totalAmountRef.update({
      totalAmount: currentTotal - parseFloat(itemAmt)
    })
    itemRef.remove();
  }

  componentDidMount(){
    auth.onAuthStateChanged((user)=>{
      if (user) {
        this.setState({
          user
        })
      }
    })


    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot)=> {
      let items = snapshot.val();
      let newState = [];
      for (let item in items){
        newState.push({
          id: item,
          amount: items[item].amount,
          category: items[item].category,
          remarks: items[item].remarks,
          date: items[item].date
        });
      }
      this.setState({
        items: newState
      })
    })
    const totalAmountRef = firebase.database().ref('totalAmount');
    totalAmountRef.on('value', (snapshot)=>{
      this.setState({
        totalAmount: formatNumber(snapshot.val().totalAmount)
      })    
    })
  
  }

  render() {
    return (
      <Router>
      <div className="App">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand">Expense Tracker</a>
          
            {this.state.user ?
              <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                  <Link to='/' className="nav-link">Home</Link>
                </li>
                <li class="nav-item">
                  <Link to='/history' className="nav-link">History</Link>
                </li>
                <li class="nav-item">
                  <a class="nav-link" onClick={this.logout}>Log Out</a>
                </li>
              </ul>
              :
              <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                  <a class="nav-link" onClick={this.login}>Log In</a>
                </li> 
              </ul>
            }
           
        </nav>
          <Route exact path="/" render={(props)=>(<Home test="hi" user={this.state.user} onSubmit={this.handleSubmit} onChange={this.handleChange} items={this.state.items} totalAmount={this.state.totalAmount} amount={this.state.amount} category={this.state.category} remarks={this.state.remarks} {...props} />)} />
          
          <Route path="/history" render={(props)=>(<History test="hi" user={this.state.user} {...props} />)} />
      </div>
      </Router>
    );
  }
}

export default App;