const { useMainPlayer } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { error } = require('../message.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showqueue')
        .setDescription('Displays the full list of songs in the queue.'),
    async execute(interaction) {
        // Initialization
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);
        const voiceChannel = interaction.member.voice.channel;
        const totalTracks = queue.getSize();

        // Check Process
        if (!voiceChannel) {
            await interaction.reply({ content: error.e001, ephemeral: true });
            console.log('ERROR: Requester not in a voice channel.');
            return;
        }
        if (totalTracks < 1) {
            await interaction.reply('There are no songs in the queue.');
            return;
        }

        // List all the tracks
        await interaction.deferReply();
        let message = ['Songs in the queue\n'];
        const maxCharCount = 4096;
        // let message = 'Songs in the queue\n';
        let charCount = 0;
        let arrIndex = 0;
        for (let ite = 0; ite < totalTracks; ite++) {
            charCount = message[arrIndex].length;
            if (ite == totalTracks + 1) {
                let nextQueue = `\[\`${ite}\`\]: \`${queue.tracks.at(ite)}\``;
                if (maxCharCount < charCount + nextQueue.length) {
                    arrIndex++;
                }
                if (message[arrIndex] == null || message[arrIndex].trim() == '') {
                    message[arrIndex] = nextQueue;
                } else {
                    message[arrIndex] += nextQueue;
                }
            } else {
                let nextQueue = `\[\`${ite}\`\]: \`${queue.tracks.at(ite)}\`\n`;
                if (maxCharCount < charCount + nextQueue.length) {
                    arrIndex++;
                }
                if (message[arrIndex] == null || message[arrIndex].trim() == '') {
                    message[arrIndex] = nextQueue;
                } else {
                    message[arrIndex] += nextQueue;
                }
            }
        }
        message.forEach(async ms => {
            const embed = new EmbedBuilder()
                .setTitle("Musicbot Queue")
                .setDescription(ms)
                .setColor('Yellow');
            await interaction.followUp({ embeds: [embed] });
        });
        return;
    }
}