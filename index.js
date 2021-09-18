require('dotenv').config()

const errorMessage = import('./modules/error.js')
const { pingMessage, pongMessage} = import('./modules/game.js')

const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const axios = require('axios')
axios.defaults.headers.common['User-Agent'] = 'PostmanRuntime/7.26.2';


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.on('messageCreate', async(message) => {
    if (message.content[0] === '~') {
        if (message.content.includes('player')) {
            try {
                message.content = message.content.substr('~player '.length);
                const result = await axios.get(`https://fantasy.premierleague.com/api/entry/${message.content}/`)
                const embed = playerEmbed(result.data)
                message.channel.send({ embeds: [embed] });
                
            } catch (error) {
                errorMessage(message, error);
            }

        } else if (message.content.includes('overview')) {
            try {
                const result = await axios.get(`https://fantasy.premierleague.com/api/bootstrap-static/`)
                const embed = overviewEmbed(result.data)
                message.channel.send({ embeds: [embed] });

            } catch (error) {
                errorMessage(message, error);
            }

        } else if (message.content.includes('ping')){
            try {
                const embed = pongMessage(message)
            } catch(error) {
                errorMessage(message, error);
            }

        } else if (message.content.includes('pong')) {
            try {
                const embed = pingMessage(message)
            } catch (error) {
                errorMessage(message, error);
            }
        }
        else {
            errorMessage(message, "Unknown command");
        }

    }
});



// Login to Discord with your client's token
client.login(process.env.TOKEN);
