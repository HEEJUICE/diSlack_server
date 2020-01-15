module.exports = (sequelize, DataTypes) => {
  const directMessage = sequelize.define(
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
  return directMessage;
};
