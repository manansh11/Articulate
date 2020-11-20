import React from "react";
import Web3 from "web3";
import Articulate from "../contracts/Articulate.json";

import Navigation from "./navigation.jsx";
import Following from "./subcomponents/following.jsx";
import FeedArticleItem from "./subcomponents/feedArticleItem.jsx";

import "../style.css";

const web3 = new Web3(window.ethereum);

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: undefined,
      myFollowing: [],
      articles: [],
    };

    window.ethereum
      .enable()
      .then(() => {
        this.Articulate = new web3.eth.Contract(
          Articulate.abi,
          Articulate.address
        );
        this.Articulate.setProvider(web3.currentProvider);
        this.Articulate.methods
          .getArticleCount()
          .call()
          .then(async (i) => {
            for (var x = 0; x < i; x++) {
              await this.Articulate.methods
                .getArticle(x)
                .call()
                .then((article) => {
                  this.state.articles.push(
                    <FeedArticleItem
                      key={this.state.articles.length}
                      id={x}
                      title={article.title}
                      author={article.author}
                      evidence={article.evidence}
                      proof={article.proof}
                      price={article.price}
                      summary={article.summary}
                      content={article.content}
                      credibility={article.credibility}
                      readers={article.readers}
                      raters={article.raters}
                    />
                  );
                  this.setState({ articles: this.state.articles });
                });
            }
          });
      })
      .then(() => {
        web3.eth.getAccounts().then((accounts) => {
          this.account = accounts[0];
          this.Articulate = new web3.eth.Contract(
            Articulate.abi,
            Articulate.address
          );
          this.Articulate.setProvider(web3.currentProvider);
          this.Articulate.methods
            .myFollowingCount()
            .call({ from: this.account })
            .then((i) => {
              for (var x = 0; x < i; x++) {
                this.Articulate.methods
                  .getMyFollowing(x)
                  .call({ from: this.account })
                  .then((author) => {
                    this.state.myFollowing.push(
                      <Following
                        key={this.state.myFollowing.length}
                        author={author}
                      />
                    );
                    this.setState({ myFollowing: this.state.myFollowing });
                  });
              }
            });
        });
      });
  }

  render() {
    if (this.state.myFollowing.length == 0) {
      return (
        <div>
          <Navigation />
          <div className="feed-layout">
            <div className="following-column">
              <h2 className="feed-heading">My Following</h2>
              <div className="following">
                <p>
                  You are not following anyone yet.
                  <br />
                  Once you find an author you like, <br />
                  click the follow button on their
                  <br />
                  profile to receive updates when
                  <br />
                  the author releases a new article!
                </p>
              </div>
            </div>
            <div className="feed-column">
              <h2 className="feed-heading-2">What's New</h2>
              <div>{this.state.articles}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Navigation />
          <div className="feed-layout">
            <div className="following-column">
              <h2 className="feed-heading">My Following</h2>
              <div className="following">{this.state.myFollowing}</div>
            </div>
            <div className="feed-column">
              <h2 className="feed-heading-2">What's New</h2>
              <div>{this.state.articles}</div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Feed;
