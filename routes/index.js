var express = require('express');
const db = require('../models');
var router = express.Router();
const { Book } = require('../models')
const { Op } = db.Sequelize;

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
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0){
    page = pageAsNumber; 
  }

  let size = 10;
  if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
    size = sizeAsNumber
  }

  const books = await Book.findAll({
    limit: size,
    offset: page * size
  });
  let morePages = true;
  if(books.length !== size){
    morePages = false;
  }
  res.render('index', { books, page, morePages });
}));

router.post('/books', asyncHandler(async(req,res) =>{
  const search = req.body.search;
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0){
    page = pageAsNumber; 
  }

  let size = 10;
  if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
    size = sizeAsNumber
  }
  try {
    const books = await Book.findAll({
      limit: size,
      offset: page * size,
        where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${search}%`
            }
          },
          {
            author: {
              [Op.like]: `%${search}%`
            }
          },
          {
            genre: {
              [Op.like]: `%${search}%`
            },
          },
          {
            year: {
              [Op.like]: `%${search}%`
            },
          }
        ]
      }
    });
    let morePages = true;
    if(books.length !== size){
      morePages = false;
    }
    res.render('index', { books, page, morePages });
  } catch (error) {
    res.render('page-not-found');
  }
}));

router.get('/books/new', asyncHandler(async(req,res) =>{
  res.render('new-book');
}));

router.post('/books/new',asyncHandler(async(req,res) =>{
  try {
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
