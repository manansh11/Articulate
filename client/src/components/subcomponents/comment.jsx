import React from "react";
import { Link } from "react-router-dom";

import Identicon from "react-identicons";
import "../../style.css";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sender: this.props.sender,
      message: this.props.message,
    };
  }

  render() {
    return (
      <div className="comments">
        <div className="comment-info">
          <Identicon
          string={this.state.sender}
          size={30}
          />
          <p>
            <Link
              to={{
                pathname: "/profile",
                state: {
                  author: this.state.sender,
                },
              }}
            >
              {this.state.sender}
            </Link>
          </p>
        </div>
        <div className="comment-content">
          <p>{this.state.message}</p>
        </div>
      </div>
    );
  }
}

export default Comment;
