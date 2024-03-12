const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  //returns boolean
  const userMatches = users.filter((user) => user.username === username);
  return userMatches.length > 0;
}

const authenticatedUser = (username,password)=>{ 
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const matchingUsers = users.filter((user) => user.username === username && user.password === password);
  return matchingUsers.length > 0;
}

//  Task 7
//  Only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  console.log("login: ", req.body);
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
            accessToken,username
        }
        return res.send("User successfully logged in");
    } else {
        return res.json({message: "Invalid Login. Check username and password"});
    }
});

//  Task 8
//  Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).send("Review successfully posted");
  }
  else {
      return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

//  Task 9
//  Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).send("Review successfully deleted");
  }
  else {
    return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;