const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

const chalk = require("chalk");
const { logData } = require("../utils/functions");

module.exports = async (client) => {
    const data = [[`${chalk.yellow.bold("EVENTS")}`, `${chalk.yellow.bold("STATUS")}`, `${chalk.yellow.bold("DESCRIPTION OF EVENTS")}`]]

    const Events = await globPromise(`${process.cwd()}/events/*/*.js`);

    Events.map(async (value) => {
        const file = require(value);

        if (!file.name) return data.push([file.replace(".js", ""), `${chalk.red("✘ Error")}`, "Missing name."]);

        client.on(file.name, file.run.bind(null, client));
        await data.push([file.name, `${chalk.green("✔ Loaded")}`, "Command Loaded."])
    });

    logData(`${chalk.bold("Events")}`, data);
}