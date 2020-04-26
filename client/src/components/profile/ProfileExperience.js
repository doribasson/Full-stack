import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExperience = ({
  experience: { company, title, location, current, to, from, description }
}) => (
  <div>
    <h3 className="text-dark">{company}</h3>
    <p>
      <Moment format="DD/MM/YY">{from}</Moment> -{" "}
      {!to ? "now" : <Moment format="DD/MM/YY">{to}</Moment>}
    </p>
    <p>
      {/* strong is bold text */}
      <strong>Position:</strong> {title}
    </p>
    <p>
      <strong>Description:</strong> {description}
    </p>
  </div>
);

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
};

export default ProfileExperience;
