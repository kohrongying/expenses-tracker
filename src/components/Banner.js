import React from 'react';

const Banner = (props) => {
	return (
    <section className="banner">
      <div className="container d-flex flex-column align-items-center">
        <h5>{props.title}</h5>
        {props.secondaryText ? (
          <h2>{props.secondaryText}</h2>
        ) : null }
      </div>
    </section>
  )
}

export default Banner;