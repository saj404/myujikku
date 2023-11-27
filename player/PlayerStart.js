module.exports = {
    name: 'playerStart',
    async execute(queue, track) {
        // Emitted when the player starts to play a song.
        queue.metadata.channel.send(
            `Now playing: \`${track.title} - ${track.author}\`, \`${track.duration}\` requested by: \`${track.requestedBy}\``
        );
    }
}