const { MessageEmbed } = require('discord.js');


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
                value: '/help\n/overview\n/league-table\n/manager <id>\n/save <id>\n/manager\n/suggest <message>',
                inline: true
            }
        );
}

module.exports = { helpEmbed }
