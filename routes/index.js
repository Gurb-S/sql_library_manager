var express = require('express');
var router = express.Router();
const { Book } = require('../models')

function asyncHandler(cb){
  return async(req,res,next) => {
    try {
      await cb(req,res,next);
    } catch (error) {
      res.status(500).send(error);
      next(error);
    }
  }
}
/* GET home page. */
router.get('/', asyncHandler(async (req,res) => {
  res.redirect('/books');
}));

// Shows the full list of books
router.get('/books', asyncHandler(async(req,res) =>{
  const books = await Book.findAll();
  res.render('index', {books})
}));

router.get('/books/new', asyncHandler(async(req,res) =>{
  res.render('new-book')
}));

router.post('/books/new',asyncHandler(async(req,res) =>{
  const book = await Book.create(req.body);
  console.log(req.body);
  res.redirect('/books')
}));

router.get('/books/:id', asyncHandler(async(req,res) =>{
  const book = await Book.findByPk(req.params.id);
  console.log(book.toJSON())
  res.render('update-book', { book })
}));

module.exports = router;
