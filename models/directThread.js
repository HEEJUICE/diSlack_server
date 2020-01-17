module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "directThread",
    {
      reply: {
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
