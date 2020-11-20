import React from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import Articulate from "../../contracts/Articulate.json";

import Identicon from "react-identicons";
import { AlertCircle, Award, Check, Eye, Gift, Star } from "react-feather";
import "../../style.css";

const web3 = new Web3(window.ethereum);

class MyArticlesItem extends React.Component {
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
      toCompensate: this.props.toCompensate,
    };

    this.compensateRaters = this.compensateRaters.bind(this);
  }

  compensateRaters() {
    window.ethereum.enable().then(() => {
      web3.eth.getAccounts().then((accounts) => {
        this.account = accounts[0];
        this.Articulate = new web3.eth.Contract(
          Articulate.abi,
          Articulate.address
        );
        this.Articulate.setProvider(web3.currentProvider);
        this.Articulate.methods
          .compensateRaters(this.state.id)
          .send({ from: this.account, gas: 5000000 })
          .then(() => {this.setState({ toCompensate: [] })});
      });
    });
  }

  render() {
    if (this.state.proof) {
      if (this.state.toCompensate.length > 0) {
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
                  <button className="gift-icon-container">
                    <Link onClick={this.compensateRaters}>
                      <Gift className="gift-icon" />
                      <AlertCircle className="alert-icon" />
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
                  <button className="gift-icon-container">
                    <Link onClick={this.compensateRaters}>
                      <Gift className="gift-icon" />
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
    } else {
      if (this.state.toCompensate.length > 0) {
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
                  <button className="gift-icon-container">
                    <Link onClick={this.compensateRaters}>
                      <Gift className="gift-icon" />
                      <AlertCircle className="alert-icon" />
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
                  <button className="gift-icon-container">
                    <Link onClick={this.compensateRaters}>
                      <Gift className="gift-icon" />
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
}

export default MyArticlesItem;
