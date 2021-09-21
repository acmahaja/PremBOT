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


const errorMessage = (message, error) => {
    
    client.guilds.cache.get('882798563795533876').channels.cache.get('889917151216021524').send(error);

    const exampleEmbed = new MessageEmbed()
        .setColor('#ef3939')
        .setTitle('Something Broke 😲')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setDescription(`${error}`)
        .setTimestamp()
    message.channel.send({ embeds: [exampleEmbed] });
}

const pingMessage = (message) => {
    const exampleEmbed = new MessageEmbed()
        .setColor('#e6b48f')
        .setTitle('Ping 🏓')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTimestamp()
    message.channel.send({ embeds: [exampleEmbed] });
}

const pongMessage = (message) => {
    const exampleEmbed = new MessageEmbed()
        .setColor('#e6b48f')
        .setTitle('Pong 🏓')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTimestamp()
    message.channel.send({ embeds: [exampleEmbed] });
}

const managerEmbed = (data, author) => {
    return new MessageEmbed()
        .setColor('#562765')
        .setFooter(`${data.player_first_name} ${data.player_last_name}`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTitle(`${data.name}`)
        .setThumbnail(author.avatarURL())
        .addFields(
            {
                name: `${data.summary_overall_points}`,
                value: 'Total Points',
            },
            {
                name: `${data.summary_overall_rank}`,
                value: 'Overall Rank',
            },
            {
                name: `${data.summary_event_rank}`,
                value: `Week ${data.current_event}`,
            },
            { name: 'Classic Leagues', value: `${data.leagues.classic.length}`, inline: true },
            { name: 'h2h', value: `${data.leagues.h2h.length}`, inline: true },

        );
}

const helpEmbed = () => {
    return new MessageEmbed()
        .setColor('#DDBCEC')
        .setTitle(`Hi! I'm PremBot 🦁`)
        .setDescription(`**Get started by entering one of these commands:**\n 
                        How To Get Your Manager ID:\n
                        Step One - Log into the Official Fantasy Premier League site.\n
                        Step Two - Click on the 'Points' tab.\n
                        Step Three - Look for the number in the URL of that webpage. That is your unique FPL ID.`)
        .setThumbnail('https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .addFields(
            {
                name: `Command`,
                value: 'To Get Help\nFantasy Overview\nLive League Table\nManager Overview\nSave Manager ID\nManager Overview (Saved)\n To Suggest Features',
                inline: true
            },
            {
                name: `What to Enter`,
                value: '~help\n~overview\n~league-table\n~manager <id>\n~save <id>\n~manager\n~suggest <message>',
                inline: true
            }
        );
}



const overviewEmbed = (data) => {
    let fields = []
    let i = 0;
    while (data.events[i].finished && i <38) {
        fields = fields.concat(
            [{
                name: `${data.events[i].name}`,
                value: `Week`,
                inline: true
            },
            {
                name: `${data.events[i].average_entry_score}`,
                value: `Average`,
                inline: true,
            },
            {
                name: `${data.events[i].average_entry_score}`,
                value: `Highest Score`,
                inline: true,
            }
        ])
        i++;
    }

    return new MessageEmbed()
        .setColor('#562765')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTitle(`Overview`)
        .addFields(
            {
                name: `${data.total_players}`,
                value: 'Total Players',
            }
            ,fields
        );
}

const leagueTableEmbed = (data) =>{

    let team = ""
    let gamesPlayed = ""
    let gd = ""
    let points = ""
    
    let i = 1;
    data.standings.forEach(rank => {
        team += `${i}.\t${rank.team.displayName}\n`
        points += `${rank.stats[6].value}\n`
        gd += `${rank.stats[9].value}\n`
        gamesPlayed += `${rank.stats[4].value}\n`
        i++;
    });

    return new MessageEmbed()
        .setColor('#0078d4')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTitle(`League Table`)
        .addFields(
            {
                name: `${data.name}`,
                value: 'Total Players',
            },
            [
                {
                    name: `Team`,
                    value: `${team}`,
                    inline: true
                }
                ,{
                    name: `Goal Difference`,
                    value: `${gd}`,
                    inline: true
                },
                {
                    name: `Points`,
                    value: `${points}`,
                    inline: true
                }
            ]
        );
}

const saveManagerEmbed = (data, author) => {
    return new MessageEmbed()
        .setColor('#5CA65C')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTitle(`Saved ID`)
        .setThumbnail(author.avatarURL())
        .addFields(
            {
                name: `${author.username}#${author.discriminator}`,
                value: 'Discord Tag',
            },
            {
                name: `${data.managerID}`,
                value: 'Manager ID',
            }
        );
}

const errorSaveManagerEmbed = () => {
    return new MessageEmbed()
        .setColor('#F9484A')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTitle(`ALREADY SAVED`)
}

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
                errorMessage(message, error);
            }
        } else if (message.content.includes('suggestion')) {
            try {
                const toSend = message.content.substr('~suggestion '.length);
                // client.guilds.cache.get().channels.cache.get(889916382869852240).send(toSend)
                await client.guilds.cache.get('882798563795533876').channels.cache.get('889916382869852240').send(toSend);
                const embed = suggestionFeature(toSend)
                message.channel.send({ embeds: [embed] });

            } catch (error) {
                errorMessage(message, error);
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
        } else if (message.content.includes('save')) {
            try {
                console.log(message.author);
                const managerID = message.content.substr('~save '.length);
                const embed = await saveUserMongo(managerID, message.author);
                 message.channel.send({ embeds: [embed] });

            } catch (error) {
                errorMessage(message, error);
            }
        } else if (message.content.includes('league-table')){
            try {
                const result = await axios.get(`https://api-football-standings.azharimm.site/leagues/eng.1/standings`)
                const embed = leagueTableEmbed(result.data.data)
                message.channel.send({ embeds: [embed] });

            } catch (error) {
                errorMessage(message, error);
            }
        } else if (message.content.includes('ping')){
            try {
                pongMessage(message)
            } catch(error) {
                errorMessage(message, error);
            }

        } else if (message.content.includes('pong')) {
            try {
                pingMessage(message)
            } catch (error) {
                errorMessage(message, error);
            }
        } else if ((message.content.includes('hi'))){
            message.channel.send(`Hi ${message.author.username}`);
        } else {
            errorMessage(message, "Unknown command");
        }
    }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);

