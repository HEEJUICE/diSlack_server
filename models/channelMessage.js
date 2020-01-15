module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "channelMessage",
    {
      message: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
