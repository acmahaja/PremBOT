const { MessageEmbed } = require('discord.js');


const errorMessage = (client, interaction, error) => {

    client.guilds.cache.get('882798563795533876').channels.cache.get('889917151216021524').send(error);

const exampleEmbed = new MessageEmbed()
        .setColor('#ef3939')
        .setTitle('Something Broke 😲')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setDescription(`${error}`)
        .setTimestamp()
    interaction.reply({ embeds: [exampleEmbed] });
}

const errorSaveManagerEmbed = () => {
    return new MessageEmbed()
        .setColor('#F9484A')
        .setFooter(`PremBOT`, 'https://raw.githubusercontent.com/acmahaja/PremBOT/master/logo.png')
        .setTitle(`ALREADY SAVED`)
}


module.exports = { errorMessage, errorSaveManagerEmbed}