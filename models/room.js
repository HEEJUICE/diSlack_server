module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "room",
    {},
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: true,
      paranoid: true,
    },
  );
