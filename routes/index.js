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

module.exports = router;
