import React, { Component } from 'react';
import del_icon from './x-circle.svg';

const getMonthYear = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${monthNames[(new Date().getMonth())]} ${new Date().getFullYear()}`;
}

export default class Home extends Component {
	render(){
		return (
			<div>
				{this.props.user ?
				<div>

				  <section class="banner">
				  	<div class="container d-flex flex-column align-items-center">
				  		<h5>{getMonthYear()}</h5>
				  		<h2>S${this.props.totalAmount}</h2>
				  	</div>
			  	  </section>
	              <section>
	                <div class='container'>
	                  <form class="add-item-form" onSubmit={this.props.onSubmit}>
	                    <div class="form-row" >
	                      <div class="col">
	                        <input type="text" class="form-control" name="amount" placeholder="How much?" onChange={this.props.onChange} value={this.props.amount} />
	                      </div>
	                      <div class="col">
	                        <div class="form-group">
	                          <select class="form-control" id="category-type" name="category" onChange={this.props.onChange} value={this.props.category}>
	                            <option value="Food">Food</option>
	                            <option value="Transport">Transport</option>
	                            <option value="Movie">Movie</option>
	                            <option value="Other">Other</option>
	                          </select>
	                        </div>
	                      </div>
	                      <div class="col">
	                        <input type="text" class="form-control" name="remarks" placeholder="Remarks" onChange={this.props.onChange} value={this.props.remarks} />
	                      </div>
	                      <div class="col">
	                        <button type="submit" class="btn btn-primary save-item-btn">Save</button>
	                      </div>
	                    </div>
	                  </form>
	                </div>
	              </section>
	              
	              <section class='display-item'>
	                <div class='container'>
	                  <ul class="display-list">
	                  {this.props.items.map((item)=>{
	                    return (
	                      <li key={item.id} class="item" >
	                      	<div class="row">
	                      		<div class="category-box d-flex align-items-center justify-content-center" data-category={item.category}>
									<strong>{item.category}</strong>
	                      		</div>
	                      		<div class="col info-box d-flex flex-column align-items-center justify-content-center">
		                      		
									<h3>{item.remarks}</h3>
									<p><i>{item.date}</i></p>
	                      		</div>
	                      		<div class="col amount-box d-flex align-items-center justify-content-end">
									<h3>S${item.amount}</h3>
	                      		</div>
	                      		<div class="del-item-btn" onClick={() => this.props.removeItem(item.id, item.amount)}><img src={del_icon} alt="delete icon"/></div>
	                      	</div>
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