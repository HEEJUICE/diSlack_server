module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "local",
      },
      sns_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
