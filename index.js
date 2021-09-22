require('dotenv').config()

const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const axios = require('axios')
axios.defaults.headers.common['User-Agent'] = 'PostmanRuntime/7.26.2';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/PremBot');

const PremBotModel = mongoose.model('PremBot', {_id: Number,  managerID: String });


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const exampleEmbed = new MessageEmbed()
        .setColor('#ef3939')
        .setTitle('I\'m Awake')
        .setDescription(`${Date()}`)
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTimestamp()

    client.guilds.cache.get('882798563795533876').channels.cache.get('889917151216021524').send({ embeds: [exampleEmbed] });
});

const { errorMessage, errorSaveManagerEmbed} = require('./Modules/errors')
const { pingMessage, pongMessage } = require('./Modules/ping-pong')
const { managerEmbed, saveManagerEmbed } = require('./Modules/manager')
const { leagueTableEmbed, overviewEmbed } = require('./Modules/overview')
const { helpEmbed } = require('./Modules/misc')


const saveUserMongo = async (managerID, authorID)=>{
    if(await PremBotModel.findById(authorID) != null){
        return errorSaveManagerEmbed(authorID)
    }

    const newuser = new PremBotModel({ _id: authorID, managerID: managerID});
    await newuser.save().then(() => console.log(newuser));
    return saveManagerEmbed(newuser, authorID);
}


const suggestionFeature = (feature) =>{
    return new MessageEmbed()
        .setColor('#DDBCEC')
        .setTitle(`Thanks for your suggestion!🦁`)
        .setDescription(`The following feature was added to our requests\n 
                        ${feature}`)
}


client.on('messageCreate', async(message) => {
    if (message.content[0] === '~') {
        if (message.content.includes('help')) {
            try {
                const embed = helpEmbed()
                message.channel.send({ embeds: [embed] });

            } catch (error) {
                errorMessage(client, message, error);
            }
        } else if (message.content.includes('suggestion')) {
            try {
                const toSend = message.content.substr('~suggestion '.length);
                // client.guilds.cache.get().channels.cache.get(889916382869852240).send(toSend)
                await client.guilds.cache.get('882798563795533876').channels.cache.get('889916382869852240').send(toSend);
                const embed = suggestionFeature(toSend)
                message.channel.send({ embeds: [embed] });

            } catch (error) {
                errorMessage(client,message, error);
            }
        } else if (message.content.includes('manager')) {
            try {
                message.content = message.content.substr('~manager '.length);

                if(message.content == 0){
                    const User = await PremBotModel.findById(message.author.id);
                    const result = await axios.get(`https://fantasy.premierleague.com/api/entry/${User.managerID}/`)
                    const embed = managerEmbed(result.data, message.author)
                    message.channel.send({ embeds: [embed] });
                } else {
                    const result = await axios.get(`https://fantasy.premierleague.com/api/entry/${message.content}/`)
                    const embed = managerEmbed(result.data, message.author)
                    message.channel.send({ embeds: [embed] });
                }

                
            } catch (error) {
                errorMessage(client,message, error);
            }
        } else if (message.content.includes('overview')) {
            try {
                const result = await axios.get(`https://fantasy.premierleague.com/api/bootstrap-static/`)
                const embed = overviewEmbed(result.data)
                message.channel.send({ embeds: [embed] });

            } catch (error) {
                errorMessage(client,message, error);
            }
        } else if (message.content.includes('save')) {
            try {
                console.log(message.author);
                const managerID = message.content.substr('~save '.length);
                const embed = await saveUserMongo(managerID, message.author);
                 message.channel.send({ embeds: [embed] });

            } catch (error) {
                errorMessage(client,message, error);
            }
        } else if (message.content.includes('league-table')){
            try {
                const result = await axios.get(`https://api-football-standings.azharimm.site/leagues/eng.1/standings`)
                const embed = leagueTableEmbed(result.data.data)
                message.channel.send({ embeds: [embed] });

            } catch (error) {
                errorMessage(client,message, error);
            }
        } else if (message.content.includes('ping')){
            try {
                pongMessage(message)
            } catch(error) {
                errorMessage(client,message, error);
            }

        } else if (message.content.includes('pong')) {
            try {
                pingMessage(message)
            } catch (error) {
                errorMessage(client,message, error);
            }
        } else if ((message.content.includes('hi'))){
            message.channel.send(`Hi ${message.author.username}`);
        } else {
            errorMessage(client,message, "Unknown command");
        }
    }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);

