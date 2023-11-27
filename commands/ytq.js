const { useMainPlayer, QueryType } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const { error } = require('../message.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ytq')
        .setDescription('Play a song from YT.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Name or URL of the song/playlist.')
                .setRequired(true)
                .setAutocomplete(true)),
    async execute(interaction) {
        // Initialization
        const player = useMainPlayer();
        let queue = player.nodes.get(interaction.guildId);
        const voiceChannel = interaction.member.voice.channel;
        const username = interaction.member.nickname != null 
            ? interaction.member.nickname : interaction.user.username;

        // Check Process
        if (!voiceChannel) {
            await interaction.reply({ content: error.e001, ephemeral: true });
            console.log('ERROR: Requester not in a voice channel.');
            return;
        }
        if (queue === null) {
            queue = player.nodes.create(interaction.guildId, {
                leaveOnEnd: false,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 60000,
                metadata: {
                    channel: interaction.channel,
                    requestedBy: username,
                }
            });
        }
        if(!queue.channel) {
            try {
                await queue.connect(voiceChannel);
            } catch {
                await interaction.reply('Failed to connect to your channel.');
                return;
            }
        }

        // Searching for the song/playlist
        const query = interaction.options.getString('query', true);
        
        if (query == null || query.trim() === '') {
            await interaction.reply({ content: error.e002, ephemeral: true });
            console.log('ERROR: query is empty.');
            return;
        }
        await interaction.deferReply();
        const result = await player.search(query, {  
            requestedBy: username ,
            searchEngine: QueryType.YOUTUBE_SEARCH
        });

        if (!result.hasTracks()) {
            await interaction.editReply(error.e003);
            console.log('ERROR: No results found.');
            return;
        }
        result.setRequestedBy(username);

        // Trying to play the song
        try {
            await player.play(voiceChannel, result, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        requestedBy: username,
                    }
                }
            });
            await interaction.editReply("Song queued.");
        } catch (e) {
            await interaction.followUp(error.e004);
            console.log('ERROR: executing play error.');
            console.log(e);
            return;
        }
    },
    async autocomplete(interaction) {
        // Initialization
        const focusedOption = interaction.options.getFocused(true);
        const player = useMainPlayer();
        let choices = [];
        const username = interaction.user.nickname != null 
            ? interaction.user.nickname : interaction.user.username;

        if (focusedOption.name !== 'query') {
            return;
        }
        if (focusedOption.value.trim() === '') {
            await interaction.respond([]);
            return;
        }

        // Searching tracks
        const result = await player.search(focusedOption.value, {
            requestedBy: username
            , searchEngine: QueryType.YOUTUBE_SEARCH
        });
        if (result.isEmpty()) {
            await interaction.respond([]);
            return;
        } else if (result.tracks.length < 6) {
            let ite = 0;
            while (ite < result.tracks.length) {
                choices.push({
                    name: result.tracks[ite].title,
                    value: result.tracks[ite].url
                });
                ite++;
            }
            await interaction.respond(
                choices.map(choice => ({ name: choice.name, value: choice.value })),
            );
            return;
        } else {
            let ite = 0;
            while (ite < 6) {
                choices.push({
                    name: result.tracks[ite].title,
                    value: result.tracks[ite].url
                });
                ite++;
            }
            await interaction.respond(
                choices.map(choice => ({ name: choice.name, value: choice.value })),
            );
            return;
        }
    }
}