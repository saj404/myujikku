module.exports = {
    name: 'playerSkip',
    async execute(queue, track) {
        // Emitted when the player skips a track.
        queue.metadata.channel.send(`Skipping \`${track.title}.\``);
    }
}