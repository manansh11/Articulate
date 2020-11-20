import React from "react";
import { Link } from "react-router-dom";

import Identicon from "react-identicons";
import { Award, Check, Eye, Star } from "react-feather";
import "../../style.css";

class MyLibraryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      title: this.props.title,
      author: this.props.author,
      evidence: "https://ipfs.infura.io/ipfs/" + this.props.evidence,
      proof: this.props.proof,
      price: this.props.price,
      summary: this.props.summary,
      content: this.props.content,
      credibility: this.props.credibility,
      readers: this.props.readers,
      raters: this.props.raters,
    };
  }

  render() {
    if (this.state.proof) {
      return (
        <div>
          <div className="container-fluid">
            <div className="feed row">
              <div className="feed col-sm-0">
                <span className="reader-info">
                  <Award />
                  <span className="stats">{this.state.credibility}</span>
                </span>
                <span className="reader-info">
                  <Eye />
                  <span className="stats">{this.state.readers.length}</span>
                </span>
                <span className="reader-info">
                  <Star />
                  <span className="stats">{this.state.raters.length}</span>
                </span>
              </div>
              <div className="feed col-sm-1">
                <h3>
                  {this.state.title}
                  <span className="verification-badge">
                    <span>Verified</span>
                    <Check className="verification-icon" />
                  </span>
                </h3>
                <p>{this.state.summary}</p>
                <div className="author-info">
                  <span>By</span>
                  <Identicon
                    className="author-icon"
                    string={this.state.author}
                    size={30}
                  />
                  <span>
                    <Link
                      to={{
                        pathname: "/profile",
                        state: {
                          author: this.state.author,
                        },
                      }}
                    >
                      {this.state.author}
                    </Link>
                  </span>
                </div>
                <button className="read-button-container">
                  <Link
                    className="read-button"
                    to={{
                      pathname: "/reader",
                      state: {
                        id: this.state.id,
                        title: this.state.title,
                        author: this.state.author,
                        evidence: this.state.evidence,
                        content: this.state.content,
                        readers: this.state.readers,
                        raters: this.state.raters,
                      },
                    }}
                  >
                    Read
                  </Link>
                </button>
              </div>
              <div className="feed col-sm-2">
                <img className="evidence-img" src={this.state.evidence} />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="container-fluid">
            <div className="feed row">
              <div className="feed col-sm-0">
                <span className="reader-info">
                  <Award />
                  <span className="stats">{this.state.credibility}</span>
                </span>
                <span className="reader-info">
                  <Eye />
                  <span className="stats">{this.state.readers.length}</span>
                </span>
                <span className="reader-info">
                  <Star />
                  <span className="stats">{this.state.raters.length}</span>
                </span>
              </div>
              <div className="feed col-sm-1">
                <h3>{this.state.title}</h3>
                <p>{this.state.summary}</p>
                <div className="author-info">
                  <span>By</span>
                  <Identicon
                    className="author-icon"
                    src={this.state.author}
                    size={30}
                  />
                  <span>
                    <Link
                      to={{
                        pathname: "/profile",
                        state: {
                          author: this.state.author,
                        },
                      }}
                    >
                      {this.state.author}
                    </Link>
                  </span>
                </div>
                <button className="read-button-container">
                  <Link
                    className="read-button"
                    to={{
                      pathname: "/reader",
                      state: {
                        id: this.state.id,
                        title: this.state.title,
                        author: this.state.author,
                        evidence: this.state.evidence,
                        content: this.state.content,
                        readers: this.state.readers,
                        raters: this.state.raters,
                      },
                    }}
                  >
                    Read
                  </Link>
                </button>
              </div>
              <div className="feed col-sm-2">
                <img className="evidence-img" src={this.state.evidence} />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default MyLibraryItem;
