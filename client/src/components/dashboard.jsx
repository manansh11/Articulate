import React from "react";
import Web3 from "web3";
import Articulate from "../contracts/Articulate.json";

import Navigation from "./navigation.jsx";
import MyArticlesItem from "./subcomponents/myArticlesItem.jsx";
import MyLibraryItem from "./subcomponents/myLibraryItem.jsx";
import Write from "./subcomponents/write.jsx";
import Capture from "./subcomponents/capture.jsx";

import Identicon from "react-identicons";
import { Edit2 } from "react-feather";
import { Badge, Container, Col, Row } from "react-bootstrap";
import "../style.css";

const web3 = new Web3(window.ethereum);

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      reputation: 0,
      bio:
        "I am a great person who likes reading and writing. That's all you need to know for now.",
      display: 0,
      myArticles: [],
      myLibrary: [],
    };

    window.ethereum.enable().then(() => {
      web3.eth
        .getAccounts()
        .then(async (accounts) => {
          this.setState({ account: accounts[0] });
        })
        .then(() => {
          this.Articulate = new web3.eth.Contract(
            Articulate.abi,
            Articulate.address
          );
          this.Articulate.setProvider(web3.currentProvider);
          this.Articulate.methods
            .getReputation()
            .call({ from: this.state.account })
            .then((reputation) => {
              this.setState({ reputation: reputation });
            })
            .then(() => {
              this.Articulate.methods
                .getBio()
                .call()
                .then((bio) => {
                  if (bio != "") {
                    this.setState({ bio: bio });
                  }
                });
            })
            .then(() => {
              this.Articulate.methods
                .myArticleCount()
                .call({ from: this.state.account })
                .then(async (i) => {
                  for (var x = 0; x < i; x++) {
                    await this.Articulate.methods
                      .getMyArticles(x)
                      .call({ from: this.state.account })
                      .then(async (id) => {
                        id = id - 1;
                        await this.Articulate.methods
                          .getArticle(id)
                          .call()
                          .then((article) => {
                            this.state.myArticles.push(
                              <MyArticlesItem
                                key={this.state.myArticles.length}
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
                                toCompensate={article.toCompensate}
                              />
                            );
                            this.setState({
                              myArticles: this.state.myArticles,
                            });
                          });
                      });
                  }
                });
            })
            .then(() => {
              this.Articulate.methods
                .myLibraryCount()
                .call({ from: this.state.account })
                .then((i) => {
                  for (var x = 0; x < i; x++) {
                    this.Articulate.methods
                      .getMyLibrary(x)
                      .call({ from: this.state.account })
                      .then((id) => {
                        this.Articulate.methods
                          .getArticle(id)
                          .call()
                          .then((article) => {
                            this.state.myLibrary.push(
                              <MyLibraryItem
                                key={this.state.myLibrary.length}
                                title={article.title}
                                author={article.author}
                                evidence={article.evidence}
                                proof={article.proof}
                                price={article.price}
                                summary={article.summary}
                                credibility={article.credibility}
                                content={article.content}
                                readers={article.readers}
                                raters={article.raters}
                              />
                            );
                            this.setState({ myLibrary: this.state.myLibrary });
                          });
                      });
                  }
                });
            });
        });
    });

    this.addBio = this.addBio.bind(this);
  }

  addBio() {
    window.ethereum.enable().then(() => {
      this.Articulate = new web3.eth.Contract(
        Articulate.abi,
        Articulate.address
      );
      this.Articulate.setProvider(web3.currentProvider);
      this.Articulate.methods
        .addBio(document.getElementById("bio").value)
        .send({ from: this.state.account, gas: 5000000 });
    });
  }

  render() {
    let display;

    if (this.state.display == 0) {
      if (this.state.myArticles.length == 0) {
        display = (
          <center>
            <p>
              You have not published any articles yet. Navigate to the write tab
              to get started...
            </p>
          </center>
        );
      } else {
        display = <div>{this.state.myArticles}</div>;
      }
    } else if (this.state.display == 1) {
      if (this.state.myLibrary.length == 0) {
        display = (
          <center>
            <p>
              You have not purchased any articles yet. Navigate to your feed to
              get started...
            </p>
          </center>
        );
      } else {
        display = <div>{this.state.myLibrary}</div>;
      }
    } else if (this.state.display == 2) {
      display = <Write />;
    } else {
      display = <Capture />;
    }
    return (
      <div className="dashboard">
        <Navigation />
        <Container>
          <Row>
            <Col sm={3}>
              <Identicon
                className="avatar"
                string={this.state.account}
                size={100}
              />
            </Col>
            <Col>
              <h3 className="user">{this.state.account}</h3>
              <Badge className="reputation" variant="dark">
                {this.state.reputation}
              </Badge>
              <div className="bio-container">
                <input
                  id="bio"
                  className="bio"
                  type="text"
                  placeholder={this.state.bio}
                />
                <Edit2 className="edit-icon" onClick={this.addBio} />
              </div>
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
                <button
                  className="option"
                  onClick={() => {
                    this.setState({ display: 2 });
                  }}
                >
                  Write
                </button>
                <button
                  className="option"
                  onClick={() => {
                    this.setState({ display: 3 });
                  }}
                >
                  Capture
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

export default Dashboard;
