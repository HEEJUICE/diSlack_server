module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "directMessage",
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
