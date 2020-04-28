import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date }
}) => (
  <div className="post bg-white p-1 my-1">
    <div>
      <a href="profile.html">
        <img
          className="round-img"
          //   src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
          //   src="https://s.gravatar.com/avatar/745a3252344e2ccefa17fcaaef494687?s=200"
          src={avatar}
          alt=""
        />
        <h4>{name}</h4>
      </a>
    </div>
    <div>
      <p className="my-1">{text} </p>
      <p className="post-date">
        <Moment format="DD/MM/YY">{date}</Moment>
      </p>
      <button
        onClick={e => addLike(_id)}
        type="button"
        className="btn btn-light"
      >
        <i className="fas fa-thumbs-up" />{" "}
        <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
      </button>
      <button
        onClick={e => removeLike(_id)}
        type="button"
        className="btn btn-light"
      >
        <i className="fas fa-thumbs-down"></i>
      </button>
      <Link to={`/post/${_id}`} className="btn btn-primary">
        Discussion{" "}
        {comments.length > 0 && (
          <span className="comment-count">{comments.length}</span>
        )}
      </Link>
      {/* user - is the post user .. auth.user._id - is the loged in user* we want to see if those match .. if match we what to show the button*/}
      {!auth.loading && user === auth.user._id && (
        <button
          onClick={e => deletePost(_id)}
          type="button"
          className="btn btn-danger"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  </div>
);

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
