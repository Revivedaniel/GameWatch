const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Game extends Model {};

Game.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          genres: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          summary: {
            type: DataTypes.STRING(2000),
            allowNull: false,
          },
          age_ratings: {
            type: DataTypes.STRING,
            allowNull: false
          },
          cover: {
            type: DataTypes.STRING,
            allowNull: false
          },
          slug: {
            type: DataTypes.STRING,
            allowNull: false
          }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'game',
      }
);

module.exports = Game;