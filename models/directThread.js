module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "directThread",
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
