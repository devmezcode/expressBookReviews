const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return  username && username.trim() !== "";

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body; 

  if(!username || !password){
    res.status(400).json({message: "Username and password is required"});
  }

  if(authenticatedUser(username, password)){
    const accessToken = jwt.sign({username}, "fingerprin_customer", {expiresIn: '1hr'});

    req.session.authorization = {accessToken};

    return res.status(200).json({message: "User successfully logged in", token: accessToken});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }

  if (!req.user || !req.user.username){
    return res.status(401).json({message: "User not authenticated"});
  }

  const username = req.user.username;

  if(!review){
    return res.status(400).json({messsage:"Review text is required"});
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Review added/updated successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
