module.exports = (sequelize, DataTypes) => {
  const channelMessage = sequelize.define(
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
  return channelMessage;
};
