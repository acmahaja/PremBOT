const { MessageEmbed } = require('discord.js');


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

module.exports = { managerEmbed, saveManagerEmbed }