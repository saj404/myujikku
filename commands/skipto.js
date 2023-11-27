const { useMainPlayer, GuildQueuePlayerNode } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const { error } = require('../message.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skip to a specified song index.')
        .addIntegerOption(option =>
            option
                .setName('index')
                .setDescription('Indicate queue index you want to play.')
                .setRequired(true)),
    async execute(interaction) {
        // Initialization
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);
        const voiceChannel = interaction.member.voice.channel;
        const index = interaction.options.getInteger('index', true);
        const totalTracks = queue.getSize();

        // Check Process
        if (!voiceChannel) {
            await interaction.reply({ content: error.e001, ephemeral: true });
            console.log('ERROR: Requester not in a voice channel.');
            return;
        }
        if (index < 0) {
            await interaction.reply({ content: error.e007, ephemeral: true });
            console.log('ERROR: Index lower than 0.');
            return;
        } else if (index >= totalTracks) {
            await interaction.reply({ content: error.e006, ephemeral: true });
            console.log('ERROR: Index higher than the total tracks.');
            return;
        }
        await interaction.deferReply();

        // Skip to the specified song index
        new GuildQueuePlayerNode(queue).skipTo(index);
        let message = `Skipped to No. \`${index}\` of the queue.`; 
        await interaction.editReply(message);
    }
}