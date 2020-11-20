import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";

import { Compass, Camera, ThumbsUp, Monitor } from "react-feather";
import "aos/dist/aos.css";
import "../style.css";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <div className="home">
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
                <Link className="nav-link" to="#features">
                  Features
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#tech">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/mission-control">
                  <button className="action">Go to Articulate</button>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <div id="home">
        <div className="container">
          <div className="home row">
            <div className="home col-sm-6">
              <h1 className="heading-1">Articulate</h1>
              <h3 className="sub-heading">Take the Red Pill</h3>
              <Link to="/mission-control">
                <button className="action">Go to Articulate</button>
              </Link>
            </div>
            <div className="home col-sm-4">
              <img
                className="graphics right"
                src={require("../media/header.png")}
                alt="Articulate logo"
              />
            </div>
          </div>
        </div>
      </div>

      <div id="about" data-aos="fade-up">
        <div className="container-fluid">
          <div className="home row">
            <div className="home col-sm-1">
              <Compass className="graphics" />
            </div>
            <div className="home col-sm-2">
              <h1 className="heading-2">Take the Red Pill</h1>
              <p className="text-right">
                Thanks to the rise of social media in recent years, it is now
                easier to spread fake news than ever before. In fact, fake news
                spreads 6x faster than real news. As a result, fake news is
                becoming increasingly prevalent. Over 40% of the information on
                social media platforms is believed to be fake news. Fake news
                interferes with democracy and freedom and encourages
                polarization. At Articulate, we aspire to prevent the spread of
                fake news by providing the infrastructure for anyone to create
                reliable news content.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="features" data-aos="fade-up">
        <div className="container-fluid">
          <div className="home row">
            <div className="home col-sm-1">
              <h1 className="heading-3">Seeing is Believing</h1>
              <p className="text-left">
                By having authors provide photo or video evidence along with
                their article to suggest that the article is accurate. This
                evidence could be taken from the Articulate camera application
                which verifies the credibility of the evidence and ensures it
                has not been tampered with or it can be uploaded onto our
                platform. It is important to note that evidence uploaded onto
                our platform will receive a lower credibility score than
                evidence taken by the Articulate camera application by default.
              </p>
            </div>
            <div className="home col-sm-2">
              <Camera className="graphics right" />
            </div>
          </div>
        </div>
      </div>

      <div id="promoting-independent-journalism" data-aos="fade-up">
        <div className="container-fluid">
          <div className="home row">
            <div className="home col-sm-1">
              <img
                className="graphics"
                src={require("../media/megaphone.png")}
                alt="Megaphone"
              />
            </div>
            <div className="home col-sm-2">
              <h1 className="heading-2">Promoting Independent Journalism</h1>
              <p className="text-right">
                Once an article is published onto our platform by an author,
                users can choose to purchase the article. The author will use
                their discretion to determine the price of the article.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="credibility-by-reputation" data-aos="fade-up">
        <div className="container-fluid">
          <div className="home row">
            <div className="home col-sm-1">
              <h1 className="heading-3">Credibility by Reputation</h1>
              <p className="text-left">
                User rating, use of the articulate camera, and other variables
                are taken into consideration and an article credibility score is
                calculated. This score acts as social proof and either
                encourages or discourages other users to purchase or not
                purchase the article. This score is also used to calculate the
                author’s reputation score. By exposing authors that produce fake
                news to incite hate and toxic online communities, we aim to
                discourage them from producing false news content and discourage
                readers from believing their lies.
              </p>
            </div>
            <div className="home col-sm-2">
              <ThumbsUp className="graphics right" />
            </div>
          </div>
        </div>
      </div>

      <div id="tech" data-aos="fade-up">
        <div className="container-fluid">
          <div className="home row">
            <div className="home col-sm-1">
              <Monitor className="graphics" />
            </div>
            <div className="home col-sm-2">
              <h1 className="heading-2">Tech Powering Articulate</h1>
              <p className="text-right">
                Articulate is powered by the Ethereum blockchain. We also make
                use of IPFS to store evidence. The frontend is made with
                ReactJS, React Native, and a tad bit of Web3JS.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="container-fluid">
          <div className="footer row">
            <div className="footer col-sm-4">
              <img
                className="footer-logo"
                src={require("../media/favicon.ico")}
                alt="Logo"
              />
            </div>
            <div className="footer col-sm-4">
              <p>
                <Link className="footer-link" to="#about">
                  About
                </Link>
              </p>
              <p>
                <Link className="footer-link" to="#features">
                  Features
                </Link>
              </p>
              <p>
                <Link className="footer-link" to="#tech">
                  Technology
                </Link>
              </p>
              <button className="footer action">Go to Articulate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
