var DataTypes = require("sequelize").DataTypes;
var _cannon = require("./cannon");
var _harbor = require("./harbor");
var _harbor_shop = require("./harbor_shop");
var _inventory_item = require("./inventory_item");
var _islands = require("./islands");
var _login_history = require("./login_history");
var _loot = require("./loot");
var _npc = require("./npc");
var _resource = require("./resource");
var _ship = require("./ship");
var _transactions = require("./transactions");
var _type_of_ship = require("./type_of_ship");
var _user = require("./user");

function initModels(sequelize) {
  var cannon = _cannon(sequelize, DataTypes);
  var harbor = _harbor(sequelize, DataTypes);
  var harbor_shop = _harbor_shop(sequelize, DataTypes);
  var inventory_item = _inventory_item(sequelize, DataTypes);
  var islands = _islands(sequelize, DataTypes);
  var login_history = _login_history(sequelize, DataTypes);
  var loot = _loot(sequelize, DataTypes);
  var npc = _npc(sequelize, DataTypes);
  var resource = _resource(sequelize, DataTypes);
  var ship = _ship(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var type_of_ship = _type_of_ship(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  ship.belongsTo(cannon, { as: "Cannon", foreignKey: "Cannon_id"});
  cannon.hasMany(ship, { as: "ships", foreignKey: "Cannon_id"});
  harbor_shop.belongsTo(harbor, { as: "Harbor", foreignKey: "Harbor_id"});
  harbor.hasMany(harbor_shop, { as: "harbor_shops", foreignKey: "Harbor_id"});
  transactions.belongsTo(harbor_shop, { as: "Harbor_shop", foreignKey: "Harbor_shop_id"});
  harbor_shop.hasMany(transactions, { as: "transactions", foreignKey: "Harbor_shop_id"});
  harbor_shop.belongsTo(inventory_item, { as: "Inventory_item", foreignKey: "Inventory_item_id"});
  inventory_item.hasMany(harbor_shop, { as: "harbor_shops", foreignKey: "Inventory_item_id"});
  loot.belongsTo(inventory_item, { as: "Inventory_item", foreignKey: "Inventory_item_id"});
  inventory_item.hasMany(loot, { as: "loots", foreignKey: "Inventory_item_id"});
  npc.belongsTo(inventory_item, { as: "Inventory_item", foreignKey: "Inventory_item_id"});
  inventory_item.hasMany(npc, { as: "npcs", foreignKey: "Inventory_item_id"});
  ship.belongsTo(inventory_item, { as: "Inventory_item", foreignKey: "Inventory_item_id"});
  inventory_item.hasMany(ship, { as: "ships", foreignKey: "Inventory_item_id"});
  harbor.belongsTo(islands, { as: "Island", foreignKey: "Island_id"});
  islands.hasMany(harbor, { as: "harbors", foreignKey: "Island_id"});
  transactions.belongsTo(loot, { as: "Loot", foreignKey: "Loot_id"});
  loot.hasMany(transactions, { as: "transactions", foreignKey: "Loot_id"});
  transactions.belongsTo(npc, { as: "Npc", foreignKey: "Npc_id"});
  npc.hasMany(transactions, { as: "transactions", foreignKey: "Npc_id"});
  inventory_item.belongsTo(resource, { as: "Item", foreignKey: "Item_id"});
  resource.hasMany(inventory_item, { as: "inventory_items", foreignKey: "Item_id"});
  ship.belongsTo(type_of_ship, { as: "Ship_type", foreignKey: "Ship_type_id"});
  type_of_ship.hasMany(ship, { as: "ships", foreignKey: "Ship_type_id"});
  transactions.belongsTo(type_of_ship, { as: "Ship_type", foreignKey: "Ship_type_id"});
  type_of_ship.hasMany(transactions, { as: "transactions", foreignKey: "Ship_type_id"});
  login_history.belongsTo(user, { as: "User", foreignKey: "User_id"});
  user.hasMany(login_history, { as: "login_histories", foreignKey: "User_id"});
  ship.belongsTo(user, { as: "User", foreignKey: "User_id"});
  user.hasMany(ship, { as: "ships", foreignKey: "User_id"});
  transactions.belongsTo(user, { as: "User", foreignKey: "User_id"});
  user.hasMany(transactions, { as: "transactions", foreignKey: "User_id"});

  return {
    cannon,
    harbor,
    harbor_shop,
    inventory_item,
    islands,
    login_history,
    loot,
    npc,
    resource,
    ship,
    transactions,
    type_of_ship,
    user,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
