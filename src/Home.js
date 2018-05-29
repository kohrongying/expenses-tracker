import React, { Component } from 'react';

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
	              <section>
	                <div className='container'>
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

	              <section>
	                <div class="container">
	                  <div class="row">
	                    <div class="col">
	                      <h4>Total expense for {getMonthYear()}: S${this.props.totalAmount}</h4>
	                    </div>
	                  </div>
	                </div>  
	              </section>
	              
	              <section class='display-item'>
	                <div class='container'>
	                  <ul class="display-list">
	                  {this.props.items.map((item)=>{
	                    return (
	                      <li key={item.id} class="item" data-category={item.category}>
	                        <h3>S${item.amount}</h3>
	                        <p>{item.category} ({item.remarks})</p>
	                        <p>{item.date}</p>
	                        <button class="btn btn-primary" onClick={() => this.props.removeItem(item.id, item.amount)}>Remove Item</button>
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