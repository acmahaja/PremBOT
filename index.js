
require('dotenv').config()

const axios = require('axios')
axios.defaults.headers.common['User-Agent'] = 'PostmanRuntime/7.26.2';


const DiscordJS = require('discord.js')
const { Client, Intents, MessageEmbed, Interaction } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


const cron = require('node-cron');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/PremBot').then(()=>{
    console.log("Connected to PremBot DB");
});


const { errorMessage, errorSaveManagerEmbed } = require('./Modules/errors')
const { pingMessage, pongMessage } = require('./Modules/ping-pong')
const { managerEmbed, saveManagerEmbed } = require('./Modules/manager')
const { leagueTableEmbed, overviewEmbed } = require('./Modules/overview')
const { helpEmbed } = require('./Modules/misc')

let currGW = 1; // current GW


const PremBotModel = mongoose.model('PremBot', {_id: Number,  managerID: String });


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const exampleEmbed = new MessageEmbed()
        .setColor('#ef3939')
        .setTitle('I\'m Awake')
        .setDescription(`${Date()}`)
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTimestamp()

    client.guilds.cache.get(`${process.env.BOT_GUILD}`).channels.cache.get(`${process.env.BOT_CHANNEL_STATUS}`).send({ embeds: [exampleEmbed] });

    const Guilds = client.guilds.cache.map(guild => guild.id);
    
    Guilds.forEach(guild => {
        //const currGuild = [client.guilds.cache.get('882798563795533876')]
        const currGuild = client.guilds.cache.get(`${guild}`)
        let commands;
        if (currGuild) {
            commands = currGuild.commands
        } else {
            commands = client.application?.commands
        }

        commands?.create({
            name: 'ping',
            description: 'Reply Pong'
        })

        commands?.create({
            name: 'pong',
            description: 'Reply Ping'
        })

        commands?.create({
            name: 'hi',
            description: 'Prem Bot Says Hello'
        })

        commands?.create({
            name: 'league-table',
            description: 'Get live premier league table'
        })

        commands?.create({
            name: 'suggestion',
            description: 'Give suggestions to help improve the bot!',
            options: [
                {
                    name: 'text',
                    description: 'Thanks for your help!',
                    required: true,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        })


        commands?.create({
            name: 'save',
            description: 'Save your Manager ID to bot',
            options: [
                {
                    name: 'id',
                    description: 'Enter Manger ID\n Enter /help to find id',
                    required: true,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
                }
            ]
        })

        commands?.create({
            name: 'help',
            description: 'List of commands for bot'
        })

        commands?.create({
            name: 'overview',
            description: 'Get Competition Overview'
        })

        commands?.create({
            name: 'manager',
            description: 'Get Manager Overview',
            options: [
                {
                    name: 'id',
                    description: 'Enter Manger ID\n Enter /help to find id',
                    required: true,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
                }
            ]
        })

        commands?.create({
            name: 'my-team',
            description: 'Get Saved Player Overview',
        })
    });    
});

const updateGW = async() =>{
    const { data } = await axios.get(`https://fantasy.premierleague.com/api/bootstrap-static/`)
    const {events} = data

    while (events[currGW].data_checked) {
        currGW++;
    }
    //console.log(`Current GW: ${currGW}`);
}
updateGW();

// run every 2 mins
cron.schedule('* */2 * * * *', () => {
    updateGW();
});

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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const { commandName, options, user } = interaction
    if (commandName === 'help'){
        try {
            const embed = helpEmbed()
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            errorMessage(client, message, error);
        }
    } else if (commandName === 'ping') {
        const embed = pingMessage();
        interaction.reply({ embeds: [embed] })
    } else if (commandName === 'pong'){
        const embed = pongMessage();
        interaction.reply({ embeds: [embed] })
    } else if (commandName === 'hi') {
        interaction.reply({ content: `Hi ${user.username}!` })
    } else if (commandName === 'league-table'){
        try {
            const result = await axios.get(`https://api-football-standings.azharimm.site/leagues/eng.1/standings`)
            const embed = leagueTableEmbed(result.data.data, client)
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            errorMessage(client, interaction, error);
        }
    } else if (commandName === 'suggestion') {
        try {
            const toSend = options.getString('text');
            await client.guilds.cache.get(process.env.BOT_GUILD).channels.cache.get(process.env.BOT_CHANNEL_SUGGESTION).send(toSend);
            const embed = suggestionFeature(toSend)
            interaction.reply({ embeds: [embed] });

        } catch (error) {
            errorMessage(client, interaction, error);
        }
    } else if (commandName === 'manager') {
        try {
            const ManagerID = options.getNumber('id')
            let result = await axios.get(`https://fantasy.premierleague.com/api/entry/${ManagerID}/`)
            console.log(interaction);
            result.data.id = ManagerID;
            const embed = await managerEmbed(result.data, interaction.user, currGW)
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            errorMessage(client, interaction, error);
        }
    } else if (commandName === 'save') {
        try {
            const ManagerID = options.getNumber('id')
            const embed = await saveUserMongo(ManagerID, interaction.user);
            interaction.reply({ embeds: [embed] });

        } catch (error) {
            errorMessage(client, message, error);
        }
    } else if (commandName === 'my-team') {
        try{
            const { managerID} = await PremBotModel.findById(interaction.user.id);
            console.log(managerID);
            let result = await axios.get(`https://fantasy.premierleague.com/api/entry/${managerID}/`)
            result.data.id = managerID
            const embed = await managerEmbed(result.data, interaction.user, currGW)
            await interaction.reply({ embeds: [embed] });


        } catch (error) {
            errorMessage(client, interaction, error);
        }
    } else if (commandName === 'overview') {
        try {
            const result = await axios.get(`https://fantasy.premierleague.com/api/bootstrap-static/`)
            const embed = overviewEmbed(result.data)
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            errorMessage(client, interaction, error);
        }
    } 
})

// Login to Discord with your client's token
client.login(process.env.TOKEN);

