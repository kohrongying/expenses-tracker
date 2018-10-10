import React from 'react'

const AddExpenseForm = (props) => {
	return (
		<section>
	        <div className='container'>
	          <form className="add-item-form" onSubmit={props.onSubmit}>
	            <div className="form-row" >
	              <div className="col">
	                <input type="number" className="form-control" name="amount" placeholder="How much?" onChange={props.onChange} value={props.amount} />
	              </div>
	              <div className="col">
	                <div className="form-group">
	                  <select className="form-control" id="category-type" name="category" onChange={props.onChange} value={props.category}>
	                    <option value="Food">Food</option>
	                    <option value="Transport">Transport</option>
	                    <option value="Movie">Movie</option>
	                    <option value="Other">Other</option>
	                  </select>
	                </div>
	              </div>
	              <div className="col">
	                <input type="text" className="form-control" name="remarks" placeholder="Remarks" onChange={props.onChange} value={props.remarks} />
	              </div>
	              <div className="col">
	                <button type="submit" className="btn btn-primary save-item-btn">Save</button>
	              </div>
	            </div>
	          </form>
	        </div>
	    </section>
    )
}

export default AddExpenseForm