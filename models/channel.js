module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "channel",
    {
      channelName: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "public",
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
