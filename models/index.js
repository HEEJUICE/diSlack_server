const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/../config/config.js`)[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.User = require("./user")(sequelize, Sequelize);
db.Workspace = require("./workspace")(sequelize, Sequelize);
db.Channel = require("./channel")(sequelize, Sequelize);
db.DirectMessage = require("./directMessage")(sequelize, Sequelize);
db.ChannelMessage = require("./channelMessage")(sequelize, Sequelize);
db.Thread = require("./thread")(sequelize, Sequelize);

// User >-< Workspace
db.User.belongsToMany(db.Workspace, { through: "Workspace_User" });
db.Workspace.belongsToMany(db.User, { through: "Workspace_User" });

// Owner(User) -< Workspace
db.User.hasMany(db.Workspace, { as: "Owner", foreignKey: "owner_id" });
db.Workspace.belongsTo(db.User, { foreignKey: "owner_id" });

// User -< Message
db.User.hasMany(db.DirectMessage, {
  foreignKey: "from_id",
  target: "id",
});
db.DirectMessage.belongsTo(db.User, {
  foreignKey: "from_id",
  target: "id",
});
// User - DirectMessage(to_id)
db.DirectMessage.belongsTo(db.User, {
  foreignKey: "to_id",
  target: "id",
});

// User -< ChannelMessage
db.User.hasMany(db.ChannelMessage, {
  foreignKey: "from_id",
  target: "id",
});
db.ChannelMessage.belongsTo(db.User, {
  foreignKey: "from_id",
  target: "id",
});
// Channel - ChannelMessage(channel_id)
db.ChannelMessage.belongsTo(db.Channel, {
  foreignKey: "channel_id",
  target: "id",
});
// Channel -< ChannelMessage
db.Channel.hasMany(db.ChannelMessage, {
  foreignKey: "channel_id",
  target: "id",
});

// User >-< Channel
db.User.belongsToMany(db.Channel, { through: "Channel_User" });
db.Channel.belongsToMany(db.User, { through: "Channel_User" });

// Channel >- Workspace
db.Workspace.hasMany(db.Channel, {
  foreignKey: "workspace_id",
  target: "id",
});
db.Channel.belongsTo(db.Workspace, {
  foreignKey: "workspace_id",
  target: "id",
});

// ChannelMessages >-< Thread
db.ChannelMessage.belongsToMany(db.Thread, { through: "Thread_id" });
db.Thread.belongsToMany(db.ChannelMessage, { through: "Thread_id" });

// DirectMessages >-< Thread
db.DirectMessage.belongsToMany(db.Thread, { through: "Thread_id" });
db.Thread.belongsToMany(db.DirectMessage, { through: "Thread_id" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
