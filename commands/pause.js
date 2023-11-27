const { useMainPlayer, GuildQueuePlayerNode } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const { error } = require('../message.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the currently playing song.'),
    async execute(interaction) {
        // Initialization
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);
        const voiceChannel = interaction.member.voice.channel;
        const guildPlayerQueue = new GuildQueuePlayerNode(queue);

        // Check Process
        if (!voiceChannel) {
            await interaction.reply({ content: error.e001, ephemeral: true });
            console.log('ERROR: Requester not in a voice channel.');
            return;
        }
        if (!guildPlayerQueue.isPlaying()) {
            await interaction.reply({ content: error.e009, ephemeral: true });
            console.log('ERROR: No song being played.');
            return;
        }
        if (guildPlayerQueue.isPaused()) {
            await interaction.reply({ content: error.e012, ephemeral: true });
            console.log('ERROR: Song is already paused.');
            return;
        }
        await interaction.deferReply();

        // Skip the song
        let message = "Paused the song.";
        guildPlayerQueue.pause();
        await interaction.editReply(message);
    }
}