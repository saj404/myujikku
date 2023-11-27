# Myujikku
A free music bot for Discord that makes use of [discord.js](https://discord.js.org/) and [discord-player](https://discord-player.js.org/).
At the moment, the bot is not hosted yet but the code is fully functional and ready to be self-hosted.

## Hosting the Bot Yourself
### Creating a Discord Bot
Before you can host the bot yourself, you need to register a bot on [Discord Developer website](https://discord.com/developers/applications) to run the bot.
- Go to [Discord Developer website](https://discord.com/developers/applications) and click on **New Application**.
- Provide a name for your bot (and add other details if you like), the press **Create**. On the left-hand menu bar, select the Bot option and press **Add Bot**. If the token is not displayed, click **Reset Token**, copy, and make sure to keep it safe since this is used for accessing your bot.
### Setting Up and Running the Discord Bot
- Make sure that you already have [NodeJS](https://nodejs.org/en) installed on your PC. 
- Clone this repository and install the dependencies using `npm install`.
- Setup your `config.json` file in the root directory.
	- For `token`, add your `DISCORD_BOT_TOKEN`.
	- For `clientId`, add your `DISCORD_APPLICATION_ID`. You can obtain these information on [Discord Developer Portal](https://discord.com/developers/applications) when you created your own bot.
- To make the commands accessible on Discord, run the command `npm run deploy-commands`.
- You can start the bot using `node .` command.

## Usage
**To play a song, there are multiple commands available depending on your need:**
- Provide a query or link to a Youtube Video
```/ytq <query>```
- Provide a query or link to a Spotify song
```/spq <query>```
- Provide a link to a Spotify playlist
```/sppl <query>```
**To Skip a song, you have two options:**
- This skips the currently playing song.
```/skip```
- Skip all the way to the specified index.
```/skipto```
**You can also shuffle the songs in the queue.**
```/shuffle```
**There is also a command to get the list of songs in the queue.**
```/showqueue```
**You can also pause and play the song being played.**
```/pause```
```/resume```
**Use this command to display the information of the currently playing song.**
```/currentsong```
**It is also possible to remove a specific song or remove all the songs in the queue.**
- To remove a specific song index
```/remove <index>```
- To remove all the songs in the queue
```/clear```
**Getting the lyrics of a song is also supported through discord-player's feature that connects to genius API**
```/lyrics <query>```
## Support
Need help or have you encountered an issue? Open an issue in this repository for assistance.

## License
[ISC](https://opensource.org/license/isc-license-txt/)