module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "workspace",
    {
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
