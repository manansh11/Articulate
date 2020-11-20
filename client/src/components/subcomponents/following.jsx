import React from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import Articulate from "../../contracts/Articulate.json";

import Identicon from "react-identicons";
import { AlertCircle } from "react-feather";
import "../../style.css";

const web3 = new Web3(window.ethereum);

class Following extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      author: this.props.author,
      alert: false
    };
  }

  componentDidMount() {
    this.Articulate = new web3.eth.Contract(
      Articulate.abi,
      Articulate.address
    );
    this.Articulate.setProvider(web3.currentProvider);
    this.Articulate.methods
      .getArticleCount()
      .call()
      .then((i) => {
        var a;
        if (i < 5) {
          a = i;
        } else {
          a = 5;
        }
        for (var x = i - a; x < i; x++) {
          this.Articulate.methods
          .getArticle(x)
          .call()
          .then((article) => {
            if (this.state.author == article.author) {
              this.setState({ alert: true });
            }
          });
        }
      });
  }

  render() {
    if (this.state.alert == false) {
      return (
          <div className="followed-user">
            <Identicon
            string={this.state.author}
            size={30}
            />
            <p>
              <Link
                className="followed-user-link"
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
      );
    } else {
      return (
          <div className="followed-user">
            <Identicon
            string={this.state.author}
            size={30}
            />
            <p>
              <Link
                className="followed-user-link"
                to={{
                  pathname: "/profile",
                  state: {
                    author: this.state.author,
                  },
                }}
              >
                {this.state.author}
              </Link>
              <AlertCircle className="alert-icon" />
            </p>
          </div>
      );
    }
  }
}

export default Following;
