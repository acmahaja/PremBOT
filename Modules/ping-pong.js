const { MessageEmbed } = require('discord.js');

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


module.exports = { pingMessage, pongMessage }