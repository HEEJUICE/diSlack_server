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
db.DirectThread = require("./directThread")(sequelize, Sequelize);
db.ChannelThread = require("./channelThread")(sequelize, Sequelize);
db.Room = require("./room")(sequelize, Sequelize);

// User >-< Workspace
db.User.belongsToMany(db.Workspace, { through: "Workspace_User" });
db.Workspace.belongsToMany(db.User, { through: "Workspace_User" });

// Owner(User) -< Workspace
db.User.hasMany(db.Workspace, { as: "WSOwner", foreignKey: "owner_id" });
db.Workspace.belongsTo(db.User, { foreignKey: "owner_id" });

// Workspace -< Channel
db.Workspace.hasMany(db.Channel, {
  foreignKey: "workspace_id",
  target: "id",
});
db.Channel.belongsTo(db.Workspace, {
  foreignKey: "workspace_id",
  target: "id",
});

// Workspace -< Room
db.Workspace.hasMany(db.Room, {
  foreignKey: "room_id",
  target: "id",
});
db.Room.belongsTo(db.Workspace, {
  foreignKey: "room_id",
  target: "id",
});

// User >-< Channel
db.User.belongsToMany(db.Channel, { through: "Channel_User" });
db.Channel.belongsToMany(db.User, { through: "Channel_User" });

// Owner(User) -< Channel
db.User.hasMany(db.Channel, { as: "ChOwner", foreignKey: "owner_id" });
db.Channel.belongsTo(db.User, { foreignKey: "owner_id" });

// User >-< Room
db.User.belongsToMany(db.Room, { through: "Room_User" });
db.Room.belongsToMany(db.User, { through: "Room_User" });

// User -< ChannelMessage
db.User.hasMany(db.ChannelMessage, {
  foreignKey: "user_id",
  target: "id",
});
db.ChannelMessage.belongsTo(db.User, {
  foreignKey: "user_id",
  target: "id",
});

// Channel -< ChannelMessage
db.Channel.hasMany(db.ChannelMessage, {
  foreignKey: "channel_id",
  target: "id",
});
db.ChannelMessage.belongsTo(db.Channel, {
  foreignKey: "channel_id",
  target: "id",
});

// Room -< directMessage
db.Room.hasMany(db.DirectMessage, {
  foreignKey: "room_id",
  target: "id",
});
db.DirectMessage.belongsTo(db.Room, {
  foreignKey: "room_id",
  target: "id",
});

// User -< directMessage
db.User.hasMany(db.DirectMessage, {
  foreignKey: "user_id",
  target: "id",
});
db.DirectMessage.belongsTo(db.User, {
  foreignKey: "user_id",
  target: "id",
});

// ChannelMessages -< ChannelThread
db.ChannelMessage.hasMany(db.ChannelThread, {
  foreignKey: "cm_id",
  target: "id",
});
db.ChannelThread.belongsTo(db.ChannelMessage, {
  foreignKey: "cm_id",
  target: "id",
});

// DirectMessages -< DirectThread
db.DirectMessage.hasMany(db.DirectThread, {
  foreignKey: "dm_id",
  target: "id",
});
db.DirectThread.belongsTo(db.DirectMessage, {
  foreignKey: "dm_id",
  target: "id",
});

// User -< ChannelThread
db.User.hasMany(db.ChannelThread, {
  foreignKey: "user_id",
  target: "id",
});
db.ChannelThread.belongsTo(db.User, {
  foreignKey: "user_id",
  target: "id",
});

// User -< DirectThread
db.User.hasMany(db.DirectThread, {
  foreignKey: "user_id",
  target: "id",
});
db.DirectThread.belongsTo(db.User, {
  foreignKey: "user_id",
  target: "id",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
