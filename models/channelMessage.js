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
      timestamps: true,
      paranoid: true,
    },
  );
