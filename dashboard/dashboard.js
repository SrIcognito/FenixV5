// We import modules.
const url = require("url");
const path = require("path");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const config = require("../config/config");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const ms = require('convert-ms');
const Premium = require('../schemas/User/User-Schema.js');
const PremiumCode = require('../schemas/Commands/premiumcode-schema');
const { emitEvent } = require("../utils/functions");

const app = express();
const MemoryStore = require("memorystore")(session);

module.exports = async (client) => {
  const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
  const templateDir = path.resolve(`${dataDir}${path.sep}views`);

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  var callbackUrl;
  var domain;

  try {
    const domainUrl = new URL(config.page.domain);
    domain = {
      host: domainUrl.hostname,
      protocol: domainUrl.protocol
    };
  } catch (e) {
    console.log(e);
    throw new TypeError("Dominio invalido en el archivo de configuracion.");
  }

  if (config.page.usingCustomDomain) {
    callbackUrl = `${domain.protocol}//${domain.host}/callback`
  } else {
    callbackUrl = `${domain.protocol}//${domain.host}${config.page.port == 80 ? "" : `:${config.page.port}`}/callback`;
  }

  passport.use(new Strategy({
    clientID: config.page.id,
    clientSecret: config.page.clientSecret,
    callbackURL: callbackUrl,
    scope: ["identify", "guilds"]
  },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }));

  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.locals.domain = config.page.domain.split("//")[1];

  app.engine("html", ejs.renderFile);
  app.set("view engine", "ejs");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use("/", express.static(path.resolve(`${dataDir}${path.sep}public`)));

  const renderTemplate = async (res, req, template, data = {}) => {
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null
    };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };

  const renderStatus = (res, req, status, template, data = {}) => {
    const baseData = {
      path: req.path,
    };
    res.status(status).render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/dashboard";
    }
    next();
  },
    passport.authenticate("discord"));

  app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), (req, res) => {
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect("/dashboard");
    }
  });

  app.get("/logout", function (req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });

  app.get("/", (req, res) => {
    renderTemplate(res, req, "index.ejs");
  });

  app.get("/commands", async (req, res) => {
    const commands = await client.globalcommands;
    let CommandList = {}

    for (let Command of commands.values()) {
      let Name = Command.name;
      let Description = Command.description;
      let Category = Command.category || "Desconocida";

      if (!CommandList[Category]) {
        CommandList[Category] = [];
      }

      if (!CommandList[Category]['commands']) {
        CommandList[Category]['commands'] = {};
      }

      if (!CommandList[Category]['commands'][Name]) {
        CommandList[Category]['commands'][Name] = {};
      }

      if (!CommandList[Category]['commands'][Name]['name']) {
        CommandList[Category]['commands'][Name]['name'] = Name;
      }

      if (!CommandList[Category]['commands'][Name]['description']) {
        CommandList[Category]['commands'][Name]['description'] = Description;
      }

      if (!CommandList[Category]['commands'][Name]['botPermission']) {
        CommandList[Category]['commands'][Name]['botPermission'] = Command.botPermission ? Command.botPermission.join(', ') : false;
      }

      if (!CommandList[Category]['commands'][Name]['authorPermission']) {
        CommandList[Category]['commands'][Name]['authorPermission'] = Command.authorPermission ? Command.authorPermission.join(', ') : false;
      }

      if (!CommandList[Category]['commands'][Name]['maintenance']) {
        CommandList[Category]['commands'][Name]['maintenance'] = Command.maintenance;
      }

      if (!CommandList[Category]['commands'][Name]['cooldown']) {
        CommandList[Category]['commands'][Name]['cooldown'] = Command.cooldown ? ms.toSeconds(Command.cooldown) : false;
      }
    }

    renderTemplate(res, req, "commands.ejs", { Commands: CommandList });
  });

  // app.get("/faq", (req, res) => { DESABILITADO.
  //   renderTemplate(res, req, "faq.ejs");
  // });

  app.get("/dashboard", checkAuth, (req, res) => {

    let GuildList = [];
    let GuildPerms = req.user.guilds.filter(P => (P.permissions & 32) === 32);

    // FOR CARDS
    for (const Guild in GuildPerms) {
      if (client.guilds.cache.get(GuildPerms[Guild].id)) {
        GuildList.push({
          Name: GuildPerms[Guild].name,
          Icon: GuildPerms[Guild].icon,
          Id: GuildPerms[Guild].id,
          Invite: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&guild_id=${GuildPerms[Guild].id}&response_type=code&redirect_uri=${encodeURIComponent(`${config.page.domain}${config.page.port == 80 ? "" : `:${config.page.port}`}/callback`)}`,
          Bot: true
        })
      } else if (!client.guilds.cache.get(GuildPerms[Guild].id)) {
        GuildList.push({
          Name: GuildPerms[Guild].name,
          Icon: GuildPerms[Guild].icon,
          Id: GuildPerms[Guild].id,
          Invite: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&guild_id=${GuildPerms[Guild].id}&response_type=code&redirect_uri=${encodeURIComponent(`${config.page.domain}${config.page.port == 80 ? "" : `:${config.page.port}`}/callback`)}`,
          Bot: false
        })
      }
    }

    // FOR SEARCH
    let Guilds = '';

    for (const Guild in GuildPerms) {
      Guilds += JSON.stringify(GuildPerms[Guild]).replace('}', `},`)
    }

    renderTemplate(res, req, "dashboard.ejs", { Guilds: Guilds.slice(0, Guilds.length - 1).replace('undefined', ''), Guild: GuildList.sort((a, b) => b.Bot - a.Bot), Permissions: Discord.Permissions });
  });

  app.post("/premium", async (req, res) => {
    if (!req.user) res.redirect("/login");
    
    const Code = req.body.code
    const UserID = req.user.id
    const { members } = client.guilds.cache.get(client.config.discord.redfenixserver);
    const UserGuild = members.cache.get(UserID);

    if (UserGuild) if (!UserGuild.roles.cache.some(role => role.id === client.config.discord.redfenixpremiumrole)) await UserGuild.roles.add(client.config.discord.redfenixpremiumrole);

    const PremiumCodeData = await PremiumCode.findOne({ code: Code });
    const PremiumData = await Premium.findOne({ userID: UserID });

    // On Error
    if (!Code) return res.status(400).send({ message: "El Codigo no puede estar en blanco" });
    if (Code.length !== 9) return res.status(400).send({ message: "El Codigo no tiene 9 caracteres" });
    if (!PremiumCodeData) return res.status(404).send({ message: "El Codigo no existe o no es valido" });
    if (PremiumCodeData.claimed) return res.status(400).send({ message: "El Codigo ya ha sido reclamado" });
    if (PremiumData) return res.status(400).send({ message: "Ya cuentas con el Titulo Premium" });

    // On Sucess
    if (Code && PremiumCodeData && !PremiumCodeData.claimed && !PremiumData) {
      await PremiumCode.findOneAndUpdate(
        {
          code: Code,
        },
        {
          userID: UserID,
          claimed: true
        },
        {
          upsert: true,
        }
      ).then(async () => {
        const NewPremium = await Premium.create(
          {
            userID: UserID,
            dateLose: PremiumCodeData.dateLose ? Math.floor(Date.now() + PremiumCodeData.dateLose) : null,
            dateGet: Date.now()
          }
        )

        NewPremium.save()

        emitEvent(client, 'premium', {
          user: client.users.cache.get(UserID),
          administrator: client,
          action: 'give',
          dateLose: PremiumCodeData.dateLose ? Math.floor(Date.now() + PremiumCodeData.dateLose) : null,
          dateGet: Date.now()
        });
        return res.status(200).send({ message: "¡Felicidades has reclamado un Titulo Premium!" });
      });
    }
  });

  app.use((req, res, next) => {
    renderStatus(res, req, 404, "404.ejs");
  });

  app.listen(config.page.port, null, null, () => client.logger.success(`[DASHBOARD] La Dashboard de Cubed esta siendo ejecutada el el puerto ${config.page.port}.`));
};
