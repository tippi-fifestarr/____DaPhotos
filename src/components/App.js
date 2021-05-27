import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import DaPhotos from '../abis/DaPhotos.json'
import Navbar from './Navbar'
import Main from './Main'



//declare IPFS with infura freebees
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {
  //boilerplate to get connected to the BL_CKCH__N
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask (unpaid promotion)!')
    }
  }
  //these are pretty much boilerplate with mods
  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    //name of contract
    const networkData = DaPhotos.networks[networkId]
    if(networkData) {
      //camelCase local variable
      const daPhotos = new web3.eth.Contract(DaPhotos.abi, networkData.address)
      this.setState({ daPhotos })
      const imagesCount = await daPhotos.methods.imageCount().call()
      this.setState({ imagesCount })
      
      // Load images
      //maybe i needs to start at 1 because we have the first uploaded image be 1
      for (var i = 1; i <= imagesCount; i++) {
        const image = await daPhotos.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false})
    } else {
      window.alert('ERROR: DaPhotos contract not deployed to detected network.  TIP: Try Metamask setting to Rinkeby Testnet')
    }
  }

  captureFile = event => {
    //this boilerplate to convert the file into acceptable for ipfs
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    //when its done loading set the state of buffer to the result and console out the buffer
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = description => {
    console.log("Submitting file to ipfs (for free, thanks to ipfs, dappu and infura?!)...")
    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
      //?? i guess this is lets us know we are running the daPhotos.sol abi func uploadImage
      this.setState({ loading: true })
      this.state.daPhotos.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        //we done loading
        this.setState({ loading: false })
      })
    })
  }

  //this is where i adjust the template to enable governance
  //using tipMojis??? tip. comments
  tipImageOwner(id, tipAmount) {
    this.setState({ loading: true })
    //tipImageOwner(id = )
    this.state.daPhotos.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  //this constructor is not lonely, super give it props,
  //wait for the state to drop the ball, change it up or you
  //flop. stop rhymes have no place in the docs (swimmin with the snitches)

  constructor(props) {
    super(props)
    this.state = {

      //vague account, blank allows us to push in the imageOwner of the image 
      account: '',
      //name of the web3.eth.Contract js object that lets us get it get it
      daPhotos: null,
      //this is the array of hashes, could be filtered with this.  
      images: [],
      //make it say ""...loading da photos...""
      loading: true
    }

    //
    this.uploadImage = this.uploadImage.bind(this)
    this.tipImageOwner = this.tipImageOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }



  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>...Loading ___ Da Photos...</p></div>
          : <Main
            // parameters...
              images={this.state.images}
              captureFile={this.captureFile}
              uploadImage={this.uploadImage}
              tipImageOwner={this.tipImageOwner}
              //could use tipString
              //commentText? noComments.
            />

          
        }

      </div>
      
    );
  }
}

//classic
export default App;