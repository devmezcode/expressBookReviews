const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if(!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({message: "Username already taken"});
  }

  users.push({username, password});

  return res.status(201).json({message: "User registered successfully"});
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book){
    res.json(book);
  } else {
    res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const matchingBooks = [];

  for(let isbn in books){
    if(books[isbn].author.toLowerCase() === author){
        matchingBooks.push({isbn, ...books[isbn]});
    }
  }
  if(matchingBooks.length > 0){
    res.json(matchingBooks);
  } else {
    res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = [];
  for (let isbn in books) {
    if(books[isbn].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push({isbn, ...books[isbn]});
    }
  }

  if(matchingBooks.length > 0){
    res.json(matchingBooks);
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
  
  
  
});

module.exports.general = public_users;

/*

async function getAllBooks() {
    try {
      const response = await axios.get('http://localhost:5000/');
      console.log("All Books:\n", response.data);
    } catch (error) {
      console.error("Error fetching all books:", error.message);
    }
  }
getAllBooks();

async function getBookByISBN(isbn) {
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      console.log(`Book with ISBN ${isbn}:\n`, response.data);
    } catch (error) {
      console.error(`Error fetching book by ISBN ${isbn}:`, error.message);
    }
  }
getBookByISBN();

async function getBooksByAuthor(author) {
    try {
      const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
      console.log(`Books by ${author}:\n`, response.data);
    } catch (error) {
      console.error(`Error fetching books by author ${author}:`, error.message);
    }
  }
getBooksByAuthor();

async function getBooksByTitle(title) {
    try {
      const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
      console.log(`Books with title "${title}":\n`, response.data);
    } catch (error) {
      console.error(`Error fetching books by title "${title}":`, error.message);
    }
  }
getBooksByTitle();

*/