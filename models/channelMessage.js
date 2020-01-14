module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "channelMessage",
    {
      message: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
