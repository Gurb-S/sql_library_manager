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
  res.render('index', { books });
}));

router.get('/books/new', asyncHandler(async(req,res) =>{
  res.render('new-book');
}));

router.post('/books/new',asyncHandler(async(req,res) =>{
  try {
    console.log('INITIAL BODY', req.body);
    const book = await Book.create({
      title: req.body.title,
      author: req.body.Author,
      genre: req.body.genre,
      year: req.body.year
    });
    res.redirect('/books')
  } catch (error) {
    if(error.name === 'SequelizeValidationError'){
      const errorsPath = error.errors.map(err => err.path);
      res.render('new-book', { errorsPath });
    }
    else{
      throw error;
    }
  }

}));

router.get('/books/:id', asyncHandler(async(req,res) =>{
  const book = await Book.findByPk(req.params.id);
  if(book){
    res.render('update-book',{ book });
  }
  else{
    res.status(404).render('page-not-found')
  }
  
}));

router.post('/books/:id', asyncHandler(async(req,res) =>{
  const book = await Book.findByPk(req.params.id);
  await book.update({
    title: req.body.title,
    author: req.body.Author,
    genre: req.body.genre,
    year: req.body.year
  })
  res.redirect('/books');
}))

router.post('/books/:id/delete', asyncHandler(async(req,res) =>{
  const deleteBook = await Book.findByPk(req.params.id);
  await deleteBook.destroy();
  res.redirect('/');
}));



module.exports = router;
