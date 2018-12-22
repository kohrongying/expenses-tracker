import React from 'react'
import del_icon from '../svg/x-circle.svg';
import { CreditCard, Money } from '@material-ui/icons'
const Expense = (props) => {
	return (
    <li key={props.item.id} className="item" >
      <div className="row">

        <div className="category-box d-flex align-items-center justify-content-center" data-category={props.item.category}>
          <strong>{props.item.category}</strong>
        </div>

        <div className="col-6 info-box d-flex flex-column align-items-center justify-content-center">
          <h3>{props.item.remarks}</h3>
          <p><i>{props.item.date}</i></p>
        </div>
        
        <div className="col amount-box d-flex align-items-center justify-content-end">
          {props.item.paymentType == "Cash" ? <Money style={{marginRight:10}} /> : <CreditCard style={{marginRight:10}}/>}
          <h3>S${props.item.amount}{" "}</h3>
        </div>
        
        <div className="del-item-btn" onClick={() => props.removeItem(props.item.id, props.item.amount)}><img src={del_icon} alt="delete icon"/></div>
      </div>
    </li>
  )
}

export default Expense;