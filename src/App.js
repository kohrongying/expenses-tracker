import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

class App extends Component {
  constructor(){
    super();

    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null,
      amount: 0,
      category: '',
      totalAmount: 0
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
      amount: this.state.amount,
      category: this.state.category,
      date: new Date().toDateString()
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
      category: ''
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
        totalAmount: snapshot.val().totalAmount
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
                        <input type="text" class="form-control" name="category" placeholder="Category" onChange={this.handleChange} value={this.state.category} />
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
                    <h4>Total expense: S${this.state.totalAmount}</h4>
                  </div>
                </div>  
              </section>
              
              <section className='display-item'>
                <div className='container'>
                  <ul>
                  {this.state.items.map((item)=>{
                    return (
                      <li key={item.id} class="item">
                        <h3>S${item.amount}</h3>
                        <p>{item.category}</p>
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
