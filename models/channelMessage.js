module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "channelMessage",
    {
      message: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: true,
      paranoid: true,
    },
  );
