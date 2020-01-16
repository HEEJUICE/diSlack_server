module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "channelThread",
    {
      reply: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
