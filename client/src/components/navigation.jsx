import React from "react";
import { Link } from "react-router-dom";
import { createBrowserHistory } from "history";

import "../style.css";

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="navigation">
        <header className="header sticky-top">
          <nav className="navbar navbar-expand-lg navbar-light py-3 shadow-sm">
            <div className="container">
              <Link to="/home">
                <img
                  className="home-navigation-logo"
                  src={require("../media/favicon.ico")}
                  alt="Logo"
                />
              </Link>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/stay-in-the-know">
                    Feed
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/mission-control">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

export default Navigation;
