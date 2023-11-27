const { useMainPlayer, QueryType } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const { error } = require('../message.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spq')
        .setDescription('Play a song from Spotify.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Name or URL of the song.')
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
            searchEngine: QueryType.SPOTIFY_SONG
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
        const username = interaction.member.nickname != null 
            ? interaction.member.nickname : interaction.user.username;

        if (focusedOption.name !== 'query') {
            return;
        }
        if (focusedOption.value.trim() === '') {
            await interaction.respond([]);
            return;
        }

        // Searching tracks
        let isUrl = focusedOption.value.includes("open.spotify.com");
        let queryType = QueryType.SPOTIFY_SEARCH;
        let searchQuery = "";
        if (isUrl) {
            let index = focusedOption.value.indexOf("?") > 0 ? focusedOption.value.indexOf("?") : focusedOption.value.length;
            searchQuery = focusedOption.value.substring(0, index);
            queryType = QueryType.SPOTIFY_SONG;
        } else {
            searchQuery = focusedOption.value;
        }
        const result = await player.search(searchQuery, {
            requestedBy: username
            , searchEngine: queryType
        });
        if (result.isEmpty()) {
            await interaction.respond([]);
            return;
        } else if (result.tracks.length < 6) {
            let ite = 0;
            while (ite < result.tracks.length) {
                choices.push({
                    name: `${result.tracks[ite].title} - ${result.tracks[ite].author}`,
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
                    name: `${result.tracks[ite].title} - ${result.tracks[ite].author}`,
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