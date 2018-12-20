import React, { Component } from 'react';
import './App.css';
import { auth, provider } from './firebase.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import History from './components/History'
import Home from './components/Home'

class App extends Component {  
  constructor(props){
    super(props);
    this.state = {
      user: null
    }
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }

  login(){
    auth.signInWithRedirect(provider)
      .then((result)=>{
        const user = result.user;
        console.log(user);
        this.setState({
          user: user
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

  componentDidMount(){
    auth.onAuthStateChanged((user)=>{
      if (user) {
        this.setState({ user: user, loading: false })
      } 
      else this.setState({ user: null })   
    })
  }

  render() {
    return (
      <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light">
          <a className="navbar-brand">Expense Tracker</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {this.state.user ?
              <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                  <Link to='/' className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to='/history' className="nav-link">History</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={this.logout}>Log Out</a>
                </li>
              </ul>
              :
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link" onClick={this.login}>Log In</a>
                </li> 
              </ul>
            }
          </div>
           
        </nav>
          
        {this.state.user ? (
          <div>
            <Route exact path="/" render={(props)=>(<Home uid={this.state.user.uid} {...props} />)} />
            <Route path="/history" render={(props)=>(<History user={this.state.user} {...props} />)} />
          </div>
        ): null }
      </div>
      </Router>
    );
  }
}

export default App;