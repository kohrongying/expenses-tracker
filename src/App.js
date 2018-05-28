import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

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
      <div className="App">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand">Expense Tracker</a>
          

            <ul class="navbar-nav ml-auto">
          
            {this.state.user ?
              <li class="nav-item">
                <a class="nav-link" onClick={this.logout}>Log Out</a>
              </li>
              :
              <li class="nav-item">
                <a class="nav-link" onClick={this.login}>Log In</a>
              </li>
            }
            </ul>
          
        </nav>

         {this.state.user ?

            <div>
              
              <section>
                <div className='container'>
                  <form class="add-item-form" onSubmit={this.handleSubmit}>
                    <div class="form-row" >
                      <div class="col">
                        <input type="text" class="form-control" name="amount" placeholder="How much?" onChange={this.handleChange} value={this.state.amount} />
                      </div>
                      <div class="col">
                        <div class="form-group">
                          <select class="form-control" id="category-type" name="category" onChange={this.handleChange} value={this.state.category}>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Movie">Movie</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div class="col">
                        <input type="text" class="form-control" name="remarks" placeholder="Remarks" onChange={this.handleChange} value={this.state.remarks} />
                      </div>
                      <div class="col">
                        <button type="submit" class="btn btn-primary save-item-btn">Save</button>
                      </div>
                    </div>
                  </form>
                </div>
              </section>

              <section>
                <div class="container">
                  <div class="row">
                    <div class="col">
                      <h4>Total expense: S${this.state.totalAmount}</h4>
                    </div>
                  </div>
                </div>  
              </section>
              
              <section class='display-item'>
                <div class='container'>
                  <ul class="display-list">
                  {this.state.items.map((item)=>{
                    return (
                      <li key={item.id} class="item" data-category={item.category}>
                        <h3>S${formatNumber(item.amount)}</h3>
                        <p>{item.category} ({item.remarks})</p>
                        <p>{item.date}</p>
                        <button class="btn btn-primary" onClick={() => this.removeItem(item.id, item.amount)}>Remove Item</button>
                      </li>
                      )
                  })}
                  </ul>
                </div>
              </section>
             
            </div>
            :
            <div className='wrapper'>
              <p>You must be logged in to see your expenses.</p>
            </div>
          }

      </div>
      
    );
  }
}

export default App;
