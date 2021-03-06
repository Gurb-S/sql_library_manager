'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false, // disallow null
      validate: {
        notNull: {
          msg: 'there needs to be a value for "title"'
        },
        notEmpty: {
          msg: 'value for "title" can not be empty'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false, //disallow null
      validate: {
        notNull: {
          msg: 'there needs to be a value for "author"'
        },
        notEmpty: {
          msg: 'value for "author" can not be empty'
        }
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};