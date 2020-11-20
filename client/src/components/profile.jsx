import React from "react";
import Web3 from "web3";
import Articulate from "../contracts/Articulate.json";

import Navigation from "./navigation.jsx";
import FeedArticleItem from "./subcomponents/feedArticleItem.jsx";

import Identicon from "react-identicons";
import { Badge, Container, Col, Row } from "react-bootstrap";
import "../style.css";

const web3 = new Web3(window.ethereum);

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      author: this.props.location.state.author,
      reputation: 0,
      bio:
        "I am a great person who likes reading and writing. That's all you need to know for now.",
      display: 0,
      userArticles: [],
      userLibrary: [],
    };

    window.ethereum.enable().then(() => {
      this.Articulate = new web3.eth.Contract(
        Articulate.abi,
        Articulate.address
      );
      this.Articulate.setProvider(web3.currentProvider);
      this.Articulate.methods
        .getUserReputation(this.state.author)
        .call()
        .then((reputation) => {
          this.setState({ reputation: reputation });
        })
        .then(() => {
          this.Articulate.methods
            .getUserBio(this.state.author)
            .call()
            .then((bio) => {
              if (bio != "") {
                this.setState({ bio: bio });
              }
            });
        })
        .then(() => {
          this.Articulate.methods
            .userArticleCount(this.state.author)
            .call()
            .then((i) => {
              for (var x = 0; x < i; x++) {
                this.Articulate.methods
                  .getUserArticles(this.state.author, x)
                  .call()
                  .then((id) => {
                    this.Articulate.methods
                      .getArticle(id - 1)
                      .call()
                      .then((article) => {
                        this.state.userArticles.push(
                          <FeedArticleItem
                            key={this.state.userArticles.length}
                            id={id}
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
                        this.setState({
                          userArticles: this.state.userArticles,
                        });
                      });
                  });
              }
            });
        })
        .then(() => {
          this.Articulate.methods
            .userLibraryCount(this.state.author)
            .call()
            .then((i) => {
              for (var x = 0; x < i; x++) {
                this.Articulate.methods
                  .getUserLibrary(this.state.author, x)
                  .call()
                  .then((id) => {
                    this.Articulate.methods
                      .getArticle(id)
                      .call()
                      .then((article) => {
                        this.state.userLibrary.push(
                          <FeedArticleItem
                            key={this.state.userLibrary.length}
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
                        this.setState({ userLibrary: this.state.userLibrary });
                      });
                  });
              }
            });
        });
    });
    this.followAuthor = this.followAuthor.bind(this);
  }

  followAuthor() {
    web3.eth.getAccounts().then((accounts) => {
      this.account = accounts[0];
      window.ethereum.enable().then(() => {
        this.Articulate = new web3.eth.Contract(
          Articulate.abi,
          Articulate.address
        );
        this.Articulate.setProvider(web3.currentProvider);
        this.Articulate.methods
          .followAuthor(this.state.author)
          .send({ from: this.account, gas: 5000000 });
      });
    });
  }

  render() {
    let display;
    if (this.state.display == 0) {
      if (this.state.userArticles.length == 0) {
        display = (
          <center>
            <p>This user has not written any articles yet. Check back later.</p>
          </center>
        );
      } else {
        display = <div>{this.state.userArticles}</div>;
      }
    } else {
      if (this.state.userLibrary.length == 0) {
        display = (
          <center>
            <p>
              This user has not purchased any articles yet. Check back later.
            </p>
          </center>
        );
      } else {
        display = <div>{this.state.userLibrary}</div>;
      }
    }
    return (
      <div className="profile">
        <Navigation />
        <Container>
          <Row>
            <Col sm={3}>
              <Identicon
                className="avatar"
                string={this.state.author}
                size={100}
              />
            </Col>
            <Col>
              <h3 className="user">{this.state.author}</h3>
              <Badge className="reputation" variant="dark">
                {this.state.reputation}
              </Badge>
              <div className="bio-container">
                <p className="bio">{this.state.bio}</p>
              </div>
              <button
                className="follow"
                onClick={() => {
                  this.followAuthor();
                }}
              >
                Follow
              </button>
              <div className="options">
                <button
                  className="option"
                  onClick={() => {
                    this.setState({ display: 0 });
                  }}
                >
                  My Articles
                </button>
                <button
                  className="option"
                  onClick={() => {
                    this.setState({ display: 1 });
                  }}
                >
                  My Library
                </button>
              </div>
            </Col>
          </Row>
        </Container>
        {display}
      </div>
    );
  }
}

export default Profile;
