module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "workspace",
    {
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
      code: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      timestamps: true,
      paranoid: true,
    },
  );
