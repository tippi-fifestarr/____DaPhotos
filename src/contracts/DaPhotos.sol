//prototype 1, 2 weeks post-blockathon: hypothesis remains that by repeating iterations
//real projects on the testnets, expanding feedback from people i trust, improving the 
//speed and scope of the projects i can present and say, I deployed this, added values
//such as //and different names.  Learning from today, scale with the moments.

//problems: 1 anticipating my own variables as they differ from the template
//2 getting the tip function right 
//3 the "filter by likes" switch on front end
//4 nsfw isNSFW or its just a percentNSFW recieved (NOT AN ISSUE/DEAL ON FRONT)
//5 governance
//testing the Ownable addition???
//6 using uint32 creates errors?
//tipMojis and isDead

//DeadDucks:  if DaPhoto isDead, don't serve it up to the front-end. don't let it get tips anymore.
//can have a "graveyard" with just the titles of photos.
//tipMoji concept: death, love, laugh, spicy, books
//they are strings!
//just use if!
//if(knifes >= (love+laugh+spicy)+3) { isDead=true; return isDead } 
//else if (knives >= 21) { isDead=true; return isDead } 
//else { run rest of DaPhotosAlive() }
//it might be necessary to just reinterpret this as require(isDead=false)

//before the 

//references: [https://www.clarifai.com/models/ai-image-moderation,
//  https://www.clarifai.com/models/nsfw-model-for-content-detection 

//reactions: nsfw model failed to be useful as a filter.  
//still would be fun to build a game around getting near 50% for rankings
//let them stake into either sfw or nsfw.  and when the ai got it wrong they can 
//vote it out into the other page and * it 
//so, the moderation app works with filter on explicit and 

//https://medium.com/coinmonks/how-to-use-accesscontrol-sol-9ea3a57f4b15
//https://docs.openzeppelin.com/learn/developing-smart-contracts 
//https://albertocuestacanada.medium.com/
//


//prototype 2: DaiVideos, demonstrating understanding of dai's coolness and ability to
//work with it to enhance the existing platform using "stable" governance tokens 
//enhance it with a staking mechanism expandable reward system that sounds like a lot
//better comments and death+heart+laugh erc 1155 tokens. 

//not sure why Gregory has us using ^0.5.0... get it working perfect and then change
pragma solidity ^0.5.0;

contract DaPhotos {
  string public name;

  //store images
  uint public imageCount = 0;
  mapping(uint => Image) public images;

//   //tipMoji structure?
//   struct TipMoji{
//     bool isDead;
//     bool isSpicy;
//     bool isLoved;
//     bool isFunny;
//     //id of the image its for
//     uint id;
//     //log of who voted to prevent double votes
//     address voter;
// }

  struct Image {
    string hash;
    string description;
    // here i'm trying to group like types together and use smaller uints(uint32, failed in testing)
    uint id;
    uint tipAmount;
    address payable author;
    //add in isDead?
    //TipMoji?
  }

  event ImageCreated(
    string hash,
    string description,
    uint id,
    uint tipAmount,
    address payable author
  );
//notice its almost the same as imageCreated, even the groupings and order of variables
    event ImageTipped(
    string hash,
    string description,
    uint id,
    uint tipAmount,  //this got updated
    address payable author
    //add in tipmoji object?

  );

  constructor() public {
    name = "___ Da Photos!";
    //this feels empty
  }


  //create images basic action first
  // pass in _imgHash from IPFS
  function uploadImage(string memory _imgHash, string memory _description) public {
    
    // require nonempty description
    require(bytes(_description).length > 0);
    //validate the hash
    require(bytes(_imgHash).length > 0);
    //validate uploader
    require(msg.sender != address(0x0));
    //the first mapping of images is one Image datastructure
    //order of parameters must match!
    // dynamically generate ideas using ImageCount!
    imageCount ++;
    //increment image id

    //add image to contract
    //how do we set the author of the post dynamically??? 
    images[imageCount] = Image(_imgHash, _description, imageCount, 0, msg.sender);
  
  //which one?
    // emit ImageCreated(hash, description, id, tipAmount, author);
    emit ImageCreated(_imgHash, _description, imageCount, 0, msg.sender);
  }

    //tip images of valid image id
    function tipImageOwner(uint _id) public payable {
      //make sure id is valid (it cant be 0 or more than the total images)
      require(_id > 0 && _id <= imageCount);
      //fetch & read image, its in memory locally
      Image memory _image = images[_id];
      //find the author
      address payable _author = _image.author;
      //transfer to the author of the image!
      // _author.transfer(1 wei);
      //don't hard code it lets just send in how much they sent
      address(_author).transfer(msg.value);

      // increase that images tip amount (otc)
      _image.tipAmount = _image.tipAmount + (msg.value);

      //update the image (back in the mapping)
      images[_id] = _image;

      //emit the event 
      emit ImageTipped(_image.hash, _image.description, _id, _image.tipAmount, _author);

    }
}