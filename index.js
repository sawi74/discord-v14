const express = require('express');
const app = express();


app.get('/', function(request, response) {
	response.sendFile(__dirname + '/index.html');
});

app.use('/ping', (req, res) => {
  res.send(new Date());
});

app.listen(3000, () => {
  console.log(('Express is ready.').blue.bold)
});

const { Client, Collection, Partials, GatewayIntentBits } = require('discord.js');

const config = require("./json/config.json");
const { glob } = require("glob"); 
const { promisify } = require("util"); 
const { joinVoiceChannel } = require('@discordjs/voice');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db');
const colors = require("colors");

const client = new Client({
	intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.User,
    Partials.ThreadMember
  ],
  shards: "auto",
  allowedMentions: { repliedUser: false },
});

//nodejs-events
process.on("unhandledRejection", e => { 
  console.log(e)
}) 
process.on("uncaughtException", e => { 
  console.log(e)
})  
process.on("uncaughtExceptionMonitor", e => { 
  console.log(e)
})

module.exports = client;
client.commands = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
['commands', 'events', 'slash'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
})

const commands = client.slashCommands.map(({ execute, ...data }) => data);
// Register slash commands
const rest = new REST({ version: '10' }).setToken(config.token || process.env.token);
rest.put(
  Routes.applicationCommands(config.clientID),
  { body: commands },
).then(() => console.log('Successfully registered application commands.'))
        .catch(console.error)

/*
// Register slash commands
const rest = new REST({ version: '10' }).setToken(config.token || process.env.token);
rest.put(
  Routes.applicationGuildCommands(config.clientID, config.guildID),
  { body: commands },
).then(() => console.log('Successfully registered application commands.'))
        .catch(console.error)
*/

setTimeout(() => {
  if (!client || !client.user) {
    console.log("Client Not Login, Process Kill")
    process.kill(1);
  } else {
    console.log("Client Login")
  }
}, 3 * 1000 * 60);

setTimeout(() => {  
      process.kill(1);
    console.log("Client Login")
}, 22 * 10000 * 60);

client.login(config.token || process.env.token).catch((err) => {
	console.log(err.message)
})