import React from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import Articulate from "../contracts/Articulate.json";

import Navigation from "./navigation.jsx";
import Comment from "./subcomponents/comment.jsx";

import Identicon from "react-identicons";
import { Send, Star } from "react-feather";
import "../style.css";

const web3 = new Web3(window.ethereum);

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      switch: false,
      rating: 0,
      id: this.props.location.state.id,
      title: this.props.location.state.title,
      author: this.props.location.state.author,
      evidence: this.props.location.state.evidence,
      content: this.props.location.state.content,
      readers: this.props.location.state.readers,
      raters: this.props.location.state.raters,
      comments: [],
    };

    this.isRater = this.isRater.bind(this);
    this.rateArticle = this.rateArticle.bind(this);
    this.comment = this.comment.bind(this);
  }

  componentDidMount() {
    window.ethereum
      .enable()
      .then(() => {
        web3.eth.getAccounts().then((accounts) => {
          this.state.account = accounts[0];
          if (
            this.state.account == this.state.author ||
            this.isRater(this.account)
          ) {
            this.setState({ switch: true });
          }
        });
      })
      .then(() => {
        this.Articulate = new web3.eth.Contract(
          Articulate.abi,
          Articulate.address
        );
        this.Articulate.setProvider(web3.currentProvider);
        this.Articulate.methods
          .getCommentCount(this.state.title)
          .call()
          .then((i) => {
            for (var x = 0; x < i; x++) {
              this.Articulate.methods
                .getCommentsByArticle(this.state.title, x)
                .call()
                .then((id) => {
                  id = id - 1;
                  this.Articulate.methods
                    .getComment(id)
                    .call()
                    .then((comment) => {
                      console.log(comment);
                      this.state.comments.push(
                        <Comment
                          key={this.state.comments.length}
                          sender={comment.sender}
                          message={comment.message}
                        />
                      );
                      this.setState({ comments: this.state.comments });
                    });
                });
            }
          });
      });
  }

  isRater(account) {
    for (var x = 0; x < this.state.readers.length; x++) {
      if (this.state.raters[x] == account) {
        return true;
      }
      return false;
    }
  }

  rateArticle() {
    window.ethereum.enable().then(() => {
      web3.eth.getAccounts().then((accounts) => {
        this.account = accounts[0];
        this.Articulate = new web3.eth.Contract(
          Articulate.abi,
          Articulate.address
        );
        this.Articulate.setProvider(web3.currentProvider);
        this.Articulate.methods
          .rateArticle(this.state.id, this.state.rating - 1)
          .send({ from: this.state.account, gas: 5000000 })
          .then(() => {
            this.setState({ switch: true });
          });
      });
    });
  }

  comment() {
    window.ethereum.enable().then(() => {
      web3.eth.getAccounts().then(async (accounts) => {
        this.account = accounts[0];
        this.Articulate = new web3.eth.Contract(
          Articulate.abi,
          Articulate.address
        );
        this.Articulate.setProvider(web3.currentProvider);
        await this.Articulate.methods
          .addComment(
            this.state.title,
            document.getElementById("message").value
          )
          .send({ from: this.state.account, gas: 5000000 });
      });
    });
  }

  render() {
    if (this.state.switch) {
      return (
        <div>
          <Navigation />
          <div className="article-container">
            <div className="article-content">
              <h3>{this.state.title}</h3>
            </div>
            <div className="article-content">
              <div className="article-author-info">
                <p className="author-text">By</p>
                <Identicon
                  string={this.state.author}
                  size={30}
                  className="author-icon"
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
            </div>
            <div className="article-content">
              <img src={this.state.evidence} className="article-evidence" />
            </div>
            <p>{this.state.content}</p>
            <h3>Thoughts?</h3>
            <div>
              <div className="comment-input">
                <Identicon string={this.state.author} size={30} />
                <textarea
                  id="message"
                  className="comment-textarea"
                  type="text"
                  placeholder="Write your comment here..."
                />
                <Send
                  className="send-icon"
                  onClick={() => {
                    this.comment();
                  }}
                />
              </div>
              <div>{this.state.comments}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Navigation />
          <div className="article-container">
            <div className="article-content">
              <h3>{this.state.title}</h3>
            </div>
            <div className="article-content">
              <div className="article-author-info">
                <p className="author-text">By</p>
                <Identicon
                  string={this.state.author}
                  size={30}
                  className="author-icon"
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
            </div>
            <div className="article-content">
              <img src={this.state.evidence} className="article-evidence" />
            </div>
            <p>{this.state.content}</p>
            <div className="article-content">
              <Star
                color={1 < this.state.rating ? "#ffbd59" : "#000000"}
                onMouseEnter={() => this.setState({ rating: 2 })}
                onClick={() => {
                  this.rateArticle();
                }}
              />
              <Star
                color={2 < this.state.rating ? "#ffbd59" : "#000000"}
                onMouseEnter={() => this.setState({ rating: 3 })}
                onClick={() => {
                  this.rateArticle();
                }}
              />
              <Star
                color={3 < this.state.rating ? "#ffbd59" : "#000000"}
                onMouseEnter={() => this.setState({ rating: 4 })}
                onClick={() => {
                  this.rateArticle();
                }}
              />
              <Star
                color={4 < this.state.rating ? "#ffbd59" : "#000000"}
                onMouseEnter={() => this.setState({ rating: 5 })}
                onClick={() => {
                  this.rateArticle();
                }}
              />
              <Star
                color={5 < this.state.rating ? "#ffbd59" : "#000000"}
                onMouseEnter={() => this.setState({ rating: 6 })}
                onClick={() => {
                  this.rateArticle();
                }}
              />
              <Star
                color={6 < this.state.rating ? "#ffbd59" : "#000000"}
                onMouseEnter={() => this.setState({ rating: 7 })}
                onClick={() => {
                  this.rateArticle();
                }}
              />
              <Star
                color={7 < this.state.rating ? "#ffbd59" : "#000000"}
                onMouseEnter={() => this.setState({ rating: 8 })}
                onClick={() => {
                  this.rateArticle();
                }}
              />
            </div>
            <h3>Thoughts?</h3>
            <div>
              <div className="comment-input">
                <Identicon string={this.state.account} size={30} />
                <textarea
                  id="message"
                  className="comment-textarea"
                  type="text"
                  placeholder="Write your comment here..."
                />
                <Send
                  className="send-icon"
                  onClick={() => {
                    this.comment();
                  }}
                />
              </div>
              <div>{this.state.comments}</div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Article;
