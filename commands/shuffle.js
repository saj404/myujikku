const { useMainPlayer, GuildQueuePlayerNode, GuildQueue } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const { error } = require('../message.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the song in the queue.'),
    async execute(interaction) {
        // Initialization
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);
        const voiceChannel = interaction.member.voice.channel;

        // Check Process
        if (!voiceChannel) {
            await interaction.reply({ content: error.e001, ephemeral: true });
            console.log('ERROR: Requester not in a voice channel.');
            return;
        }
        if (queue.isEmpty()) {
            await interaction.reply({ content: error.e011, ephemeral: true });
            console.log('ERROR: No song in the queue to shuffle.');
            return;
        }
        await interaction.deferReply();

        // Skip the song
        let message = "Shuffled the songs.";
        queue.tracks.shuffle();
        await interaction.editReply(message);
    }
}