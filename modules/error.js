
const { MessageEmbed } = require('discord.js');



const errorMessage = (message, error) => {
    const exampleEmbed = new MessageEmbed()
        .setColor('#ef3939')
        .setTitle('Something Broke 😲')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setDescription(`${error}`)
        .setTimestamp()
    message.channel.send({ embeds: [exampleEmbed] });
}


module.exports = errorMessage