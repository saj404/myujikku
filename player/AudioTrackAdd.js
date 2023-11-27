const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'audioTrackAdd',
    async execute(queue, track) {
        const embed = new EmbedBuilder()
            .setTitle(track.title)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .setAuthor({
                name: track.author
            })
            .addFields(
                { name: 'queued by', value: `\`${track.requestedBy}\``, inline: true },
                { name: 'duration', value: `\`${track.duration}\``, inline: true },
                { name: 'views', value: `\`${track.views}\``, inline: true },
            )
            .setColor('Yellow');
        // Emitted when the player adds a song to its queue
        queue.metadata.channel.send({ embeds: [embed] });
    }
}