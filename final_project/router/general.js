const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//  Task 6
//  Register a new user
public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
    if (!username || !password) {
      return res.json({ message: "Username and password are required for registration" });
    }
    if (users.find((user) => user.username === username)) {
      return res.json({ message: "Username already exists in the Database" });
    }
    users.push({ username, password });
    return res.json({ message: "User registered successfully!!!" });
});

//  Task10
// Get book lists
const getBooks = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};

//  Task 1
//  Get the book list available in the shop
public_users.get('/',async function (req, res) {
    const myBookList = await getBooks(); 
    res.json(myBookList); 
});

//  Task 11
// Get book details based on ISBN
const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let isbn_value = parseInt(isbn);
        if (books[isbn_value]) {
            resolve(books[isbn_value]);
        } else {
            reject({ message: `ISBN ${isbn} is not found` });
        }
    });
};

//  Task 2
//  Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
 });

//  Task 3 & Task 12
//  Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author_name = req.params.author;
    let gbook = getBooks()
    gbook.then((bookEntries) => Object.values(bookEntries))
    gbook.then((books) => books.filter((book) => book.author === author_name))
    gbook.then((filteredBooks) => res.send(filteredBooks))
});

//  Task 4 & Task 13
//  Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Task 5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn_value = req.params.isbn;
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result.reviews),
        error => res.status(error.status).json({message: error.message})
    );
});

module.exports.general = public_users;
