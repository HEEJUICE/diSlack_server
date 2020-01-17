module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "channel",
    {
      name: {
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
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: true,
      paranoid: true,
    },
  );
