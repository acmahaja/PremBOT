const { MessageEmbed } = require('discord.js');

const leagueTableEmbed = (data) => {

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
                , {
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

const overviewEmbed = (data) => {
    let fields = []
    let i = 0;
    while (data.events[i].finished && i < 38) {
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
            , fields
        );
}


module.exports = { leagueTableEmbed, overviewEmbed}