import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";

import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import Home from "./components/home.jsx";
import Feed from "./components/feed.jsx";
import Dashboard from "./components/dashboard.jsx";

import Profile from "./components/profile.jsx";
import Article from "./components/article.jsx";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/stay-in-the-know" component={Feed} />

      <Route path="/mission-control" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/reader" component={Article} />

      <Redirect to="/home" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
