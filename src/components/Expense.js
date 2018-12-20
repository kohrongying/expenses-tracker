import React from 'react'
import del_icon from '../svg/x-circle.svg';

const Expense = (props) => {
	return (
    <li key={props.item.id} className="item" >
      <div className="row">

        <div className="category-box d-flex align-items-center justify-content-center" data-category={props.item.category}>
          <strong>{props.item.category}</strong>
        </div>

        <div className="col info-box d-flex flex-column align-items-center justify-content-center">
          <h3>{props.item.remarks}</h3>
          <p><i>{props.item.date}</i></p>
        </div>
        
        <div className="col amount-box d-flex align-items-center justify-content-end">
          <h3>S${props.item.amount}</h3>
        </div>
        
        <div className="del-item-btn" onClick={() => props.removeItem(props.item.id, props.item.amount)}><img src={del_icon} alt="delete icon"/></div>
      </div>
    </li>
  )
}

export default Expense;