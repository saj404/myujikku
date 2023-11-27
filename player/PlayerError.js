module.exports = {
    name: 'playerError',
    async execute(queue, error) {
        // Emitted when the audio player encounters error while
        // streaming audio track
        console.log(`ERROR: player error message: ${error.message}`);
        console.log(error);
    }
}