import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//racfp+tab shortcut

// const ProfileItem = props => {
//   return <div>{props.profile.user.name + ": " + props.profile.user._id}</div>;
// };

// const ProfileItem = ({ profile }) => {
//   return <div>{profile.user.name + ": " + profile.user._id}</div>;
// };

const ProfileItem = ({
  //for use those directly without props...
  profile: {
    user: { _id, name, avatar }, //like props.profile.user._id but now just _id because destructure
    status,
    company,
    location,
    skills
  }
}) => {
  return (
    <div className="profile bg-light">
      <img src={avatar} alt="" className="round-img" />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className="my-1">{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>
      <ul>
        {/* //skills is array and i want just 4 skills */}
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className="text-primary">
            <i className="fas fa-check"></i>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
