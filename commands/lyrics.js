const { lyricsExtractor } = require('@discord-player/extractor');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { error } = require('../message.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Get the lyrics of the song.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Name of the song and artist.')
                .setRequired(true)
                .setAutocomplete(true)),
    async execute(interaction) {
        const lyricsFinder = lyricsExtractor(/* 'optional genius API key' */);

        // Get the query string
        const query = interaction.options.getString('query', true);
        const lyrics = await lyricsFinder.search(query).catch(() => null);
        await interaction.deferReply();
        if (!lyrics) return interaction.followUp({ content: 'No lyrics found', ephemeral: true });

        const trimmedLyrics = lyrics.lyrics;

        const embed = new EmbedBuilder()
            .setTitle(lyrics.title)
            .setURL(lyrics.url)
            .setThumbnail(lyrics.thumbnail)
            .setAuthor({
                name: lyrics.artist.name,
                iconURL: lyrics.artist.image,
                url: lyrics.artist.url
            })
            .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
            .setColor('Yellow');

        return interaction.followUp({ embeds: [embed] });
    },
    async autocomplete(interaction) {
        const lyricsFinder = lyricsExtractor(/* 'optional genius API key' */);
        // Initialization
        const focusedOption = interaction.options.getFocused(true);
        let choices = [];

        if (focusedOption.name !== 'query') {
            return;
        }
        if (focusedOption.value.trim() === '') {
            await interaction.respond([]);
            return;
        }

        // Get the query string
        const query = focusedOption.value;
        const lyrics = await lyricsFinder.search(query).catch(() => null);

        if (!lyrics) {
            await interaction.respond([]);
        } else {
            choices.push({
                name: `${lyrics.title} - ${lyrics.artist.name}`,
                value: query
            });
            await interaction.respond(choices.map(choice => ({ name: choice.name, value: choice.value })));
        }
        return;
    }
}