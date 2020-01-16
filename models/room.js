module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "room",
    {},
    {
      timestamps: true,
      paranoid: true,
    },
  );
