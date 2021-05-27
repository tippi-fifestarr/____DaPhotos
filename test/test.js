//prototype 1 (DaPhotos DApp Tests)
//new tests needed:
//tipMoji structure integration
//can people vote twice?

const { assert } = require('chai')

const DaPhotos = artifacts.require('DaPhotos')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  // notice deployer, author, and tipper
contract('DaPhotos', ([deployer, author, tipper]) => {
  let daphotos

  before(async () => {
    daphotos = await DaPhotos.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      // does address exist
      const address = await daphotos.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has correct name', async () => {
      const name = await daphotos.name()
      assert.equal(name, '___ Da Photos!')
      console.log(name)
    })
  })

  describe('images', async() => {
    let result, imageCount
    const hash = 'abc1QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb23'

    before(async () => {
      result = await daphotos.uploadImage(hash, 'Image description', { from: author })
      imageCount = await daphotos.imageCount()
    })

   //check event
    it('creates images', async () => {
      //SUCCESS
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Image description', 'description is correct')
      assert.equal(event.tipAmount, '0', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')
      
      // FAILURE: Image must have hash (should be rejected)
      await daphotos.uploadImage('', 'Image description', { from: author }).should.be.rejected;

      // FAILURE: Image must have description
      await daphotos.uploadImage('Image hash', '', { from: author }).should.be.rejected;
    })

      // check from struct
      it('lists images', async () => {
        const image = await daphotos.images(imageCount)
        assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
        assert.equal(image.hash, hash, 'Hash is correct')
        assert.equal(image.description, 'Image description', 'description is correct')
        assert.equal(image.tipAmount, '0', 'tip amount is correct')
        assert.equal(image.author, author, 'author is correct')
      })

      it('allows users to tip images', async () => {
        // Track the author balance before purchase
        let oldAuthorBalance
        oldAuthorBalance = await web3.eth.getBalance(author)
        oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
        //message value, msg.value (sent in from tip), everythings in whole numbers
        result = await daphotos.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
  
        // SUCCESS
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
        assert.equal(event.hash, hash, 'Hash is correct')
        assert.equal(event.description, 'Image description', 'description is correct')
        assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
        assert.equal(event.author, author, 'author is correct')
  
        // Check that author received funds
        let newAuthorBalance
        newAuthorBalance = await web3.eth.getBalance(author)
        newAuthorBalance = new web3.utils.BN(newAuthorBalance)

        let tipImageOwner
        tipImageOwner = web3.utils.toWei('1', 'Ether')
        tipImageOwner = new web3.utils.BN(tipImageOwner)

        const expectedBalance = oldAuthorBalance.add(tipImageOwner)

        assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

        // FAILURE: Tries to tip a image that does not exist
        await daphotos.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;

      // result = await daphotos.uploadImage();
      //see what happens
      // let image = await daphotos.images(1);
      // console.log("console logging da image(1)", image);
    })
  })
})