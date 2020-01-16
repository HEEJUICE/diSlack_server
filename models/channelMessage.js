module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "channelMessage",
    {
      message: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      reply: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
