const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// Async/await version of getting book list
public_users.get('/', async (req, res) => {
    try {
        // Simulate async fetch (this could also come from an external source)
        const getBooks = () => {
            return new Promise((resolve) => {
                resolve(books);
            });
        };

        const bookList = await getBooks();
        res.status(200).json(bookList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (users.find(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login." });
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    // Simulate async data retrieval
    const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        });
    };

    try {
        const book = await getBookByISBN(isbn);
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();

    // Simulate async data retrieval
    const getBooksByAuthor = (authorName) => {
        return new Promise((resolve, reject) => {
            const matchingBooks = Object.values(books).filter(book =>
                book.author.toLowerCase() === authorName
            );
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found for the given author"));
            }
        });
    };

    try {
        const result = await getBooksByAuthor(author);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get book details based on title using async/await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();

    const getBooksByTitle = (titleName) => {
        return new Promise((resolve, reject) => {
            const matchingBooks = Object.values(books).filter(book =>
                book.title.toLowerCase() === titleName
            );
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found with the given title"));
            }
        });
    };

    try {
        const result = await getBooksByTitle(title);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

  public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.general = public_users;
