import React from "react";
import Web3 from "web3";
import Articulate from "../../contracts/Articulate.json";

import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

import "../../style.css";

const web3 = new Web3(window.ethereum);

const IpfsHttpClient = require("ipfs-http-client");
const ipfs = IpfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const dataUriToBuffer = require("data-uri-to-buffer");

class Capture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.uploadEvidence = this.uploadEvidence.bind(this);
  }

  uploadEvidence(dataUri) {
    let evidence = dataUriToBuffer(dataUri);
    ipfs.add(evidence).then((result) => {
      window.ethereum.enable().then(() => {
        web3.eth.getAccounts().then((accounts) => {
          this.account = accounts[0];
          this.Articulate = new web3.eth.Contract(
            Articulate.abi,
            Articulate.address
          );
          this.Articulate.setProvider(web3.currentProvider);
          this.Articulate.methods
            .addEvidence(result.path)
            .send({ from: this.account, gas: 5000000 });
        });
      });
    });
  }

  render() {
    return (
      <div className="capture">
        <Camera
          onTakePhoto={(dataUri) => {
            this.uploadEvidence(dataUri);
          }}
          imageType={IMAGE_TYPES.JPG}
          idealFacingMode={FACING_MODES.ENVIRONMENT}
        />
      </div>
    );
  }
}

export default Capture;
