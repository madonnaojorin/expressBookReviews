const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid login. Check username or password." });
  }

  // Generate JWT
  const accessToken = jwt.sign({ username: user.username }, "access", { expiresIn: "1h" });

  // Save session
  req.session.authorization = { accessToken, username: user.username };

  return res.status(200).json({ message: "User successfully logged in." });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(403).json({ message: "User not logged in." });
  }

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully.", book: books[isbn] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    const book = books[isbn];
    if (book) {
      if (book.reviews && book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
      } else {
        return res.status(404).json({ message: "No review found for this user" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
