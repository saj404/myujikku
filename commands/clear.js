const { useMainPlayer, GuildQueuePlayerNode } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const { error } = require('../message.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear all the queues including currently playing song.'),
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
        await interaction.deferReply();

        // Skip the song
        let message = "Cleared the queue.";
        queue.clear();
        new GuildQueuePlayerNode(queue).stop();
        await interaction.editReply(message);
    }
}