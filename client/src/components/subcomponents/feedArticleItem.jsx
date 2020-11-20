import React from "react";
import { Link, Redirect } from "react-router-dom";
import Web3 from "web3";
import Articulate from "../../contracts/Articulate.json";

import Identicon from "react-identicons";
import { Award, Check, Eye, Star } from "react-feather";
import "../../style.css";

const web3 = new Web3(window.ethereum);

class FeedArticleItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switch: false,
      hasPermission: false,
      id: this.props.id,
      title: this.props.title,
      author: this.props.author,
      evidence: "https://ipfs.infura.io/ipfs/" + this.props.evidence,
      content: this.props.content,
      proof: this.props.proof,
      price: this.props.price,
      summary: this.props.summary,
      credibility: this.props.credibility,
      readers: this.props.readers,
      raters: this.props.raters,
    };

    this.readArticle = this.readArticle.bind(this);
  }

  componentDidMount() {
    web3.eth.getAccounts().then((accounts) => {
      this.account = accounts[0];
      if (this.account == this.state.author) {
        this.setState({ hasPermission: true });
      }
      for (var x = 0; x < this.state.readers.length; x++) {
        if (this.account == this.state.readers[x]) {
          this.setState({ hasPermission: true });
        }
      }
    });
  }

  readArticle() {
    window.ethereum.enable().then(() => {
      web3.eth.getAccounts().then((accounts) => {
        this.account = accounts[0];
        this.Articulate = new web3.eth.Contract(
          Articulate.abi,
          Articulate.address
        );
        this.Articulate.setProvider(web3.currentProvider);
        this.Articulate.methods
          .hasPermission(this.state.id)
          .call({ from: this.account })
          .then((x) => {
            if (x) {
              this.setState({ switch: true });
            } else {
              this.Articulate.methods
                .readArticle(this.state.id)
                .send({
                  from: this.account,
                  value: this.state.price,
                  gas: 5000000,
                })
                .then(() => {
                  this.setState({ switch: true });
                });
            }
          });
      });
    });
  }

  render() {
    if (this.state.switch == false) {
      if (this.state.proof) {
        if (this.state.hasPermission) {
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
                        className="feed author-icon"
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
                    <button
                      className="evidence-button"
                      href={this.state.evidence}
                      target="blank"
                    >
                      View Evidence
                    </button>
                    <button
                      className="purchase-article-button-2"
                      onClick={this.readArticle}
                    >
                      Read
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
                        className="feed author-icon"
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
                    <button
                      className="purchase-article-button"
                      onClick={this.readArticle}
                    >
                      Purchase for {this.state.price} wei
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
        if (this.state.hasPermission) {
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
                      <p>By</p>
                      <Identicon
                        className="feed author-icon"
                        string={this.state.author}
                        size={30}
                      />
                      <p>
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
                      </p>
                    </div>
                    <button
                      className="purchase-article-button"
                      onClick={this.readArticle}
                    >
                      Read
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
                      <p>By</p>
                      <Identicon
                        className="feed author-icon"
                        string={this.state.author}
                        size={30}
                      />
                      <p>
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
                      </p>
                    </div>
                    <button
                      className="purchase-article-button"
                      onClick={this.readArticle}
                    >
                      Purchase for {this.state.price} wei
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
    } else {
      return (
        <Redirect
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
        />
      );
    }
  }
}

export default FeedArticleItem;
