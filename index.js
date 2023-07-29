const { Client, Intents, Collection, version: djsversion } = require("discord.js");
const { join } = require('path');
require("./database/connection");

const client = new Client({
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ],
});

/* C L I E N T - C O N F I G */
client.config = require("./config/config");
client.emotes = client.config.emojis;
client.emojistatic = client.config.emojis.static
client.colors = client.config.colors;
client.logger = require("./utils/logger");
client.Embed = require('./utils/embed');
client.languages = require('i18n');

/* L A N G U A G E - C O N F I G */
client.languages.configure({
  locales: ['en-US', 'es-ES'],
  directory: join(__dirname, "locales"),
  defaultLocale: 'en-US',
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,

  logWarnFn: function (msg) {
    client.logger.warn(`[LANGUAGE] ${msg}`)
  },

  logErrorFn: function (msg) {
    client.logger.error(`[LANGUAGE] ${msg}`)
  },

  missingKeyFn: function (locale, value) {
    return value
  },

  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false
  }
});

/* C L I E N T - D A T A B A S E */
client.deleteUser = require("./database/functions/User/deleteUser");
client.findOrCreateUser = require("./database/functions/User/findOrCreateUser");
client.getUser = require("./database/functions/User/getUser");
client.updateUser = require("./database/functions/User/updateUser");
client.updatesUser = require("./database/functions/User/updatesUser");

client.deleteGuild = require("./database/functions/Guild/deleteGuild");
client.findOrCreateGuild = require("./database/functions/Guild/findOrCreateGuild");
client.getGuild = require("./database/functions/Guild/getGuild");
client.updateGuild = require("./database/functions/Guild/updateGuild");
client.updatesGuild = require("./database/functions/Guild/updatesGuild");

/* C L I E N T - F U N T I O N S */
client.findChannel = function (guild, channel) {
  let channelData = guild.channels.cache.find(x => x.name === channel);

  if (!channelData) {
    const channelId = guild.channels.cache.find(x => x.id === channel);
    channelData = channelId
  }

  return channelData;
}

client.findCategory = function (guild, category) {
  let categoryData = guild.channels.cache.find(x => x.name === category && x.type === 'GUILD_CATEGORY');

  if (!categoryData) {
    const categoryId = guild.channels.cache.find(x => x.id === category && x.type === 'GUILD_CATEGORY')
    categoryData = categoryId
  }

  return categoryData;
}

client.findRole = function (guild, role) {
  let roleData = guild.roles.cache.find(x => x.name === role);

  if (!roleData) {
    const roleId = guild.roles.cache.find(x => x.id === role)
    roleData = roleId
  }

  return roleData;
}

/* C O L L E C T I O N  O F  C O M M A N D S - S L A S H */
client.commands = new Collection();
client.globalcommands = new Collection();
client.guildcommands = new Collection();

/* H A N D L E R - R U N N E R */
["Events", "GuildCommandSlash"].forEach((handler) => {
  require(`./loaders/${handler}`)(client);
});

/* L O G G E R - R U N N E R */
process.on("unhandledRejection", (error) => {
  client.logger.warn("An error was not caught");
  if (error instanceof Error) client.logger.warn(`Uncaught ${error.name}`);
  client.logger.error(error);
});

/* C L I E N T - L O G I N */
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.13.1 or higher is required. You need to update your Node.js to the required release, or a newer one.");
if (Number(djsversion.split(".")[0]) < 13) throw new Error("Discord.JS 13.2.0 or higher is required. You need to update your Discord.JS to the required release, or a newer one.");
if (!client.config.discord.token) throw new Error("Not found a token in the config file, please update your config.");
client.login(client.config.discord.token);
