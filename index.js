require('dotenv').config()


const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const axios = require('axios')
axios.defaults.headers.common['User-Agent'] = 'PostmanRuntime/7.26.2';


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const errorMessage = (message, error) => {
    console.log(error);
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

const playerEmbed = (data, author) => {
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
                // , {
                //     name: `Games Played`,
                //     value: `${gamesPlayed}`,
                //     inline: true
                // }
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


client.on('messageCreate', async(message) => {
    if (message.content[0] === '~') {
        if (message.content.includes('player')) {
            try {
                message.content = message.content.substr('~player '.length);
                const result = await axios.get(`https://fantasy.premierleague.com/api/entry/${message.content}/`)
                const embed = playerEmbed(result.data, message.author)
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
        } else {
            errorMessage(message, "Unknown command");
        }

    }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);

