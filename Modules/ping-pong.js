const { MessageEmbed } = require('discord.js');

const pingMessage = () => {
    const pingEmbed = new MessageEmbed()
        .setColor('#e6b48f')
        .setTitle('Ping 🏓')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTimestamp()
    return pingEmbed;
}

const pongMessage = (message) => {
    const pongEmbed = new MessageEmbed()
        .setColor('#e6b48f')
        .setTitle('Pong 🏓')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTimestamp()
    return pongEmbed
}


module.exports = { pingMessage, pongMessage }