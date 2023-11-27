const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Player } = require('discord-player');
const { commandHandler } = require('./functions/CommandHandler.js');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// Initialization of commands
commandHandler(client);

// Command Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath)
        .filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Player Events
const player = Player.singleton(client);
player.extractors.loadDefault();
const pEventsPath = path.join(__dirname, 'player');
const pEventFiles = fs.readdirSync(pEventsPath)
        .filter(file => file.endsWith('.js'));
for (const file of pEventFiles) {
    const filePath = path.join(pEventsPath, file);
    const event = require(filePath);

    player.events.on(event.name, (...args) => event.execute(...args));
}

// Log in to Discord with client's token
client.login(token);