module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "channel",
    {
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
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
