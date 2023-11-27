module.exports = {
    name: 'audioTracksAdd',
    async execute(queue, track) {
        // Emitted when the player adds multiple songs to its queue
        queue.metadata.channel.send(`Multiple tracks are added by \`${queue.metadata.requestedBy}\`.`);
    }
}