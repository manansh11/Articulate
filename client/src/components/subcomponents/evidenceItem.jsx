import React from "react";

import "../../style.css";

class EvidenceItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: this.props.src
    };
  }

  sendData = () => {
         this.props.callback(this.state.src);
    }

  render() {
    return (
      <div className="evidence-library">
      <label>
        <input type="radio" name="evidence" value={this.state.src} />
        <img
        src= {"https://ipfs.infura.io/ipfs/" + this.state.src}
        className="evidence-library-img"
        onClick= {() => {this.sendData()}}
        />
      </label>
      </div>
    );
  }
}

export default EvidenceItem;
