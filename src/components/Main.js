import React, { Component, useState } from 'react';
import Identicon from 'identicon.js';
import favicon from './favicon-32x32.png'
import TipMojiCounter from './TipMojiCounter';
import { GithubSelector } from "@charkour/react-reactions";
// import {TipButton, setEmojiSelector, emojiSelector} from './TipButton';

const TipButton = () => {

  const [emojiSelector, setEmojiSelector] = useState(false);
  return (
    <div className="animation-story">
      <div style={{ position: "relative" }}>
        <div
          className={
            emojiSelector ? "GithubSelector_Active" : "GithubSelector_Idle"
          }
        >
          <GithubSelector iconSize={20} />
        </div>
      </div>
      <button
        className="btn btn-link btn-sm float-right pt-0"
        // name={image.id}
        onClick={(event) => {
          setEmojiSelector(!emojiSelector)
          let tipAmount = window.web3.utils.toWei('0.05', 'Ether')
          console.log(event.target.name, tipAmount)
          this.props.tipImageOwner(event.target.name, tipAmount)
          
        }}

        
      >
        JUST TIP 0.05 ETH
      </button>
    </div>
  );
}

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2> 📤 Share <img src={favicon} width="30" height="30" className="d-inline-block align-top" alt="camera" /> Image 📝 ______ 🤑</h2>
              <label> tip: pay da cost to upload .jpg, .jpeg, .png, .bmp, .gif, boss!
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.imageDescription.value
                this.props.uploadImage(description)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="imageDescription"
                        type="text"
                        ref={(input) => { this.imageDescription = input }}
                        className="form-control"
                        placeholder="required: use your words..."
                        required />
                  </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
              </form>
              </label>
              
              <p>&nbsp;</p>
              { this.props.images.map((image, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                      />
                      <small className="text-muted">{image.author}</small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center"><img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{ maxWidth: '420px'}}/></p>
                        <p>{image.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        {/* insert the react-reactions */}
                        {/* <TipMoji className="float-center" /> */}
                        <TipButton 
                          name={image.id}
                          

                        />
                      </li>
                          <TipMojiCounter className="float-center"/>
                          {/* on click, connect to wallet, send string-to-count and address to the CHAIN  */}
                          {/* change the state */}
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;