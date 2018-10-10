import React from 'react'
import del_icon from '../svg/x-circle.svg';

const DisplayExpenseList = (props) => {
	return (
	<section className='display-item'>
      <div className='container'>
        <ul className="display-list">
        {props.items.map((item)=>{
          return (
            <li key={item.id} className="item" >
            	<div className="row">
            		<div className="category-box d-flex align-items-center justify-content-center" data-category={item.category}>
				<strong>{item.category}</strong>
            		</div>
            		<div className="col info-box d-flex flex-column align-items-center justify-content-center">
                		
				<h3>{item.remarks}</h3>
				<p><i>{item.date}</i></p>
            		</div>
            		<div className="col amount-box d-flex align-items-center justify-content-end">
				<h3>S${item.amount}</h3>
            		</div>
            		<div className="del-item-btn" onClick={() => props.removeItem(item.id, item.amount)}><img src={del_icon} alt="delete icon"/></div>
            	</div>
            </li>
            )
        })}
        </ul>
      </div>
        </section>
	)
}

export default DisplayExpenseList