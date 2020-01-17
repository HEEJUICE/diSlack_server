module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "directMessage",
    {
      message: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      timestamps: true,
      paranoid: true,
    },
  );
