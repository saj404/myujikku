const { useMainPlayer, GuildQueuePlayerNode } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const { error } = require('../message.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('currentsong')
        .setDescription('Show details of the current song.'),
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
        await interaction.deferReply();

        // Show currently playing song's information
        let message = `Currently playing: \`${queue.currentTrack.title} - ${queue.currentTrack.author}\`, \`${queue.currentTrack.duration}\``;
        await interaction.editReply(message);
    }
}