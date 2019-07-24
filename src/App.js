import React, { Component } from "react";
import "./App.css";
import { auth, provider } from "./firebase.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import History from "./components/History/History";
import Home from "./components/Home";
import Income from "./components/Income/Income";
import Investment from "./components/Investment/Investment";
import MonthlyBreakdown from "./components/History/MonthlyBreakdown";

class App extends Component {
  state = {
    user: null
  }

  login = () => {
    auth.signInWithRedirect(provider)
      .then((result)=>{
        const user = result.user;
        console.log(user);
        this.setState({
          user: user
        });
      });
  }

  logout = () => {
    auth.signOut()
      .then(()=>{
        this.setState({
          user: null
        });

      });
  }

  componentDidMount(){
    auth.onAuthStateChanged((user)=>{
      if (user) {
        this.setState({ user: user, loading: false });
      } else this.setState({ user: null });
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <nav className="navbar navbar-expand-lg navbar-light">
            <a href="/" className="navbar-brand">Expense Tracker</a>
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
                    <Link to='/income' className="nav-link">Income</Link>
                  </li>
                  <li className="nav-item">
                    <Link to='/investment' className="nav-link">Investment</Link>
                  </li>
                  <li className="nav-item">
                    <div className="nav-link" onClick={this.logout}>Log Out</div>
                  </li>
                </ul>
                :
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <div className="nav-link" onClick={this.login}>Log In</div>
                  </li>
                </ul>
              }
            </div>

          </nav>

          {this.state.user ? (
            <div>
              <Route exact path="/" render={(props)=>(<Home uid={this.state.user.uid} {...props} />)} />
              <Route path="/history" render={(props)=>(<History uid={this.state.user.uid} {...props} />)} />
              <Route path="/income" render={(props)=>(<Income uid={this.state.user.uid} {...props} />)} />
              <Route path="/investment" render={(props)=>(<Investment uid={this.state.user.uid} {...props} />)} />
              <Route path="/:year/:month" render={(props)=>(<MonthlyBreakdown uid={this.state.user.uid} {...props} />)} />
            </div>
          ): null }
        </div>
      </Router>
    );
  }
}

export default App;