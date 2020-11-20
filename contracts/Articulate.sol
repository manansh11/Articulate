//Project: Articulate
//Author: Team Articulate
//Date: October 1, 2020

//Articulate is a censorship-free news platform focused on preventing the spread of fake news and promoting independant journalism.
//Learn more here: [URL]

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

pragma solidity 0.6.2;
pragma experimental ABIEncoderV2;

contract Articulate {

    // To mitigate integer overflow
    using SafeMath for uint256;




    //Data

    //Each article has a title, an author, evidence, a proof that the evidence is accurate, a price, a summary, content, a credibility score, an array of readers that have purchased the article, and an array of raters that have rated the article on credibility, and an array of raters that await compensation by the author for providing a rating on the credibility of the article.
    struct Article {
        string title;
        address payable author;
        string evidence;
        bool proof;
        uint256 price;
        string summary;
        string content;
        uint256 credibility;
        address[] readers;
        address[] raters;
        address payable[] toCompensate;
    }

    //Articles are serialized + stored in an array.
    Article[] public articles;

    //Each user has a library to store their evidence.
    mapping(address => uint256[]) public myEvidence;

    //Each user is mapped to an array of the articles they have written.
    mapping(address => uint256[]) public myArticles;

    //Each user is mapped to an array of the articles they have purchased.
    mapping(address => uint256[]) public myLibrary;

    //Each user is mapped to a reputation rating (calculated from their credibility).
    mapping(address => uint256) reputation;





    //Getter Functions
    function myEvidenceCount() public view returns (uint256) {
        return myEvidence[msg.sender].length;
    }

    function getMyEvidence(uint256 i) public view returns (uint256) {
        return myEvidence[msg.sender][i];
    }

    function getEvidence(uint256 i) public view returns (string memory) {
        return Evidence[i];
    }

    function getArticleCount() public view returns (uint256) {
        return articles.length;
    }

    function getArticle(uint256 i) public view returns (Article memory) {
        return articles[i];
    }

    function myArticleCount() public view returns (uint256) {
        return myArticles[msg.sender].length;
    }

    function userArticleCount(address user) public view returns (uint256) {
        return myArticles[user].length;
    }

    function getMyArticles(uint256 i) public view returns (uint256) {
      return myArticles[msg.sender][i];
    }

    function getUserArticles(address user, uint256 i) public view returns (uint256) {
        return myArticles[user][i];
    }

    function myLibraryCount() public view returns (uint256) {
        return myLibrary[msg.sender].length;
    }

    function userLibraryCount(address user) public view returns (uint256) {
        return myLibrary[user].length;
    }

    function getMyLibrary(uint256 i) public view returns (uint256) {
      return myLibrary[msg.sender][i];
    }

    function getUserLibrary(address user, uint256 i) public view returns (uint256) {
      return myLibrary[user][i];
    }

    function getReputation() public view returns (uint256) {
        return reputation[msg.sender];
    }

    function getUserReputation(address user) public view returns (uint256) {
        return reputation[user];
    }




    //Investigate (Camera Application)

    //Evidence is serialized + stored in an array.
    string[] public Evidence;

    //When a user uploads new evidence (via our camera application), it is pushed to an array of serialized evidence and to their evidence library.
    function addEvidence(string memory newEvidence) public {

        Evidence.push(newEvidence);
        myEvidence[msg.sender].push(Evidence.length);
    }

    //In order to verify the integrity of the evidence, our application determines whether or not it was uploaded from our camera application.
    function calculateProof(string memory evidence) public view returns (bool) {
        for (uint256 x = 0; x < Evidence.length; x++) {
            if (keccak256(abi.encodePacked(evidence)) == keccak256(abi.encodePacked(Evidence[x]))) {
                return true;
            } else {
                return false;
            }
        }
    }





    //Articulate (Main Application)

    //To create an article, a user must specify a title, evidence, a price, a summary and content. This article is then pushed to an array of serialized articles.
    function publishArticle(

        string memory title,
        string memory evidence,
        uint256 price,
        string memory summary,
        string memory content

    ) public {
        require(bytes(title).length > 0 && bytes(title).length < 20, "Invalid title");
        require(bytes(content).length > 0 && bytes(content).length < 10000, "Invalid content");

         bool proof = calculateProof(evidence);

         uint credibility;

         if (proof) {
           credibility = 7;
         } else {
           credibility = 0;
         }

        articles.push(
            Article(title, msg.sender, evidence, proof, price, summary, content, credibility, new address[](0), new address[](0), new address payable[](0))
        );
        myArticles[msg.sender].push(articles.length);
    }

    //Utility function to determine whether or not a user has purchased an article
    function purchasedArticle(uint256 i)
        public
        view
        returns (bool)
    {
        for (uint256 x = 0; x < myLibrary[msg.sender].length; x++) {
            if (myLibrary[msg.sender][x] == i) {
                return true;
            }
        }
        return false;
    }

    //Utility function to determine whether or not a user has permission to view an article
    function hasPermission(uint256 i) public view returns (bool) {
      if (msg.sender == articles[i].author || purchasedArticle(i)) {
        return true;
      }
      return false;
    }

    //Once a user purchases an article, they are added to an array of readers and will not have to purchase the article again to read it a second or third time. Yes, we are promoting independant journalism as well! Centralized news sources can be highly biased which can also promote fake news.
    function readArticle(uint256 i) public payable {
      require(msg.sender != articles[i].author && !purchasedArticle(i));
      require(msg.value == articles[i].price, "Invalid Value");

        articles[i].author.transfer(msg.value);

        myLibrary[msg.sender].push(i);
        articles[i].readers.push(msg.sender);
      }

    //Each reader has the option to rate the credibility of the article. This affects the credibility score of the article which, in turn, affects the reputation rating of the author. For this reason, authors will generally compensate raters for their opinion. However, this is not always the case. If compensating raters for their opinion was mandatory, malicious users may take advantage of this feature to control the credibility of their article. This is why compensation is not directly tied to credibility rating. However, compensating raters is a best practice to provide an incentive for reader to crowdsource credibility and keep the credibility system running.
    function rateArticle(uint256 i, uint256 rating) public {
        require(rating > 0 && rating < 8, "Invalid rating");
        require(msg.sender != articles[i].author, "Cannot rate your own article");

        articles[i].raters.push(msg.sender);
        articles[i].toCompensate.push(msg.sender);

        if (articles[i].proof) {
             articles[i].credibility = (((((articles[i].credibility)*articles[i].raters.length) + rating).div(articles[i].raters.length + 1)) + 7).div(2);
        } else {
             articles[i].credibility = (((articles[i].credibility)*articles[i].raters.length) + rating).div(articles[i].raters.length + 1);
        }

         uint256 myReputation = 0;
         for (uint256 x = 0; x < myArticles[articles[i].author].length; x++) {

             uint256 a = myArticles[articles[i].author][x] - 1;
             myReputation = myReputation.add(articles[a].credibility);

         }

         myReputation = myReputation.div(myArticles[articles[i].author].length);
         reputation[articles[i].author] = myReputation;
    }

    //Utility function to compensate raters
    function compensateRaters(uint256 i) public payable {
        require(msg.sender == articles[i].author, "Only the author can compensate raters");

        for(uint256 x; x < articles[i].raters.length; x++){
          articles[i].toCompensate[x].transfer(articles[i].price.div(10));
        }
        delete articles[i].toCompensate;
    }





    //Additional Features

    //Bio
    mapping(address => string) public bio;

    function addBio(string memory i) public {
      require(bytes(i).length > 0 && bytes(i).length < 10000, "Invalid bio");

      bio[msg.sender] = i;
    }

    function getBio() public view returns (string memory) {
      return bio[msg.sender];
    }

    function getUserBio(address user) public view returns (string memory) {
      return bio[user];
    }

    //Comment
    struct Comment {
      address sender;
      string message;
    }

    Comment[] public comments;
    mapping(string => uint256[]) public commentsByArticle;

    function addComment(string memory article, string memory message) public {
      require(bytes(message).length > 0 && bytes(message).length < 500, "Invalid message");

      comments.push(Comment(msg.sender, message));
      return commentsByArticle[article].push(comments.length);
    }

    function getCommentCount(string memory article) public view returns (uint256) {
      return commentsByArticle[article].length;
    }

    function getCommentsByArticle(string memory article, uint256 i) public view returns (uint256) {
      return commentsByArticle[article][i];
    }

    function getComment(uint256 i) public view returns (Comment memory) {
      return comments[i];
    }

    //Following
    mapping(address => address[]) public myFollowing;

    function followAuthor(address author) public {
      require(author != msg.sender, "You cannot follow yourself");

      myFollowing[msg.sender].push(author);
    }

    function myFollowingCount() public view returns (uint256) {
      return myFollowing[msg.sender].length;
    }

    function getMyFollowing(uint i) public view returns (address) {
      return myFollowing[msg.sender][i];
    }

}
