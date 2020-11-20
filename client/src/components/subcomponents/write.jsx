import React from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import Articulate from "../../contracts/Articulate.json";

import EvidenceItem from "./evidenceItem.jsx";
import "../../style.css";

const web3 = new Web3(window.ethereum);

const IpfsHttpClient = require("ipfs-http-client");
const ipfs = IpfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class Write extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: true,
      evidence: undefined,
      myEvidence: [],
    };

    window.ethereum.enable().then(() => {
      web3.eth.getAccounts().then(async (accounts) => {
        this.account = accounts[0];
        this.Articulate = new web3.eth.Contract(
          Articulate.abi,
          Articulate.address
        );
        this.Articulate.setProvider(web3.currentProvider);
        this.Articulate.methods
          .myEvidenceCount()
          .call({ from: this.account })
          .then((i) => {
            for (var x = 0; x < i; x++) {
              this.Articulate.methods
                .getMyEvidence(x)
                .call({ from: this.account })
                .then((id) => {
                  this.Articulate.methods
                    .getEvidence(id - 1)
                    .call()
                    .then((evidence) => {
                      this.state.myEvidence.push(
                        <EvidenceItem
                          key={this.state.myEvidence.length}
                          src={evidence}
                          callback={this.setEvidence}
                        />
                      );
                      this.setState({ myEvidence: this.state.myEvidence });
                    });
                });
            }
          });
      });
    });

    this.captureFile = this.captureFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setEvidence = (evidence) => {
    this.setState({ evidence: evidence });
  };

  async handleSubmit(event) {
    event.preventDefault();
    await web3.eth.getAccounts().then(async (accounts) => {
      this.account = accounts[0];
      this.Articulate = new web3.eth.Contract(
        Articulate.abi,
        Articulate.address
      );
      this.Articulate.setProvider(web3.currentProvider);
      if (this.state.select) {
        this.Articulate.methods
          .publishArticle(
            document.getElementById("title").value,
            this.state.evidence,
            document.getElementById("price").value,
            document.getElementById("summary").value,
            document.getElementById("content").value
          )
          .send({ from: this.account, gas: 5000000 });
      } else {
        ipfs.add(this.state.evidence).then((evidence) => {
          this.Articulate.methods
            .publishArticle(
              document.getElementById("title").value,
              evidence.path,
              document.getElementById("price").value,
              document.getElementById("summary").value,
              document.getElementById("content").value
            )
            .send({ from: this.account, gas: 5000000 });
        });
      }
    });
  }

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    console.log(file);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ evidence: Buffer(reader.result) });
    };
  }

  render() {
    let select;

    if (this.state.select) {
      if (this.state.myEvidence.length == 0) {
        select = (
          <center>
            <p>
              You have not taken any evidence yet. Navigate to the capture tab
              to get started...
            </p>
          </center>
        );
      } else {
        select = (
          <div className="evidence-library-container">
            {this.state.myEvidence}
          </div>
        );
      }
    } else {
      select = (
        <div className="evidence-library-container">
          <input
            type="file"
            className="form-control-input"
            onChange={this.captureFile}
          />
        </div>
      );
    }

    return (
      <div>
        <form className="article-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="form-heading">Title</label>
            <input
              type="text"
              id="title"
              className="form-control"
              placeholder="Write title..."
            />
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="write col-sm-1">
                <label className="form-heading">Price</label>
                <input
                  type="number"
                  id="price"
                  className="form-control"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="evidence-attachment-options">
              <Link
                className="evidence-attachment"
                onClick={() => {
                  this.setState({ select: true });
                }}
              >
                Choose from Evidence Library
              </Link>
              <Link
                className="evidence-attachment"
                onClick={() => {
                  this.setState({ select: false });
                }}
              >
                Upload from Device
              </Link>
            </div>
            {select}
          </div>
          <div className="form-group">
            <label className="form-heading">Summary</label>
            <textarea
              id="summary"
              className="form-control"
              placeholder="Write a short summary..."
            />
          </div>
          <div className="form-group">
            <label className="form-heading">Content</label>
            <textarea
              id="content"
              className="form-control"
              placeholder="Write here..."
            />
          </div>
          <button type="submit" className="publish-button">
            Publish
          </button>
        </form>
      </div>
    );
  }
}

export default Write;
