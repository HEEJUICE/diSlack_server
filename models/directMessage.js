module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "directMessage",
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
