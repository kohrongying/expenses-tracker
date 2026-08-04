import React from "react";
import PropTypes from "prop-types";

const Banner = (props) => (
  <section className="banner">
    <div className="container d-flex flex-column align-items-center">
      <h5>{props.title}</h5>
      {props.secondaryText ? (
        <h2>{props.secondaryText}</h2>
      ) : null }
    </div>
  </section>
);

Banner.propTypes = {
  title: PropTypes.string.isRequired,
  secondaryText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default Banner;