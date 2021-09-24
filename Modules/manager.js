const { MessageEmbed } = require('discord.js'); 
const { getPlayerDetails } = require('./player')

const axios = require('axios')
axios.defaults.headers.common['User-Agent'] = 'PostmanRuntime/7.26.2';

const managerEmbed = async(data, author, gw) => {
    let gks = '';
    let defs = '';
    let mids = '';
    let fwds = '';
    
    const result  = await axios.get(`https://fantasy.premierleague.com/api/entry/${data.id}/event/${gw}/picks/`)
    const {picks} = result.data;
    
    for (const pick of picks) {
        const { web_name, total_points, now_cost, element_type,  } = await getPlayerDetails(pick.element)
        const { is_captain, is_vice_captain} = pick
        let text = is_captain == true ? "**(C)** " : is_vice_captain == true ? "**(VC) **" :"";
        text += `${web_name} (${total_points}) (P${now_cost/10})\n`
        console.log(text);
        switch (element_type) {
            case 1:
                gks += text
                break;
            case 2:
                defs += text    
                break;
            case 3:
                mids += text
                break;
            case 4:
                fwds += text
                break;
            default:
                break;
        }
    };

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

            [
                {
                    name: `${data.summary_event_rank}`,
                    value: `Week ${data.current_event} Rank`, 
                    inline: true  
                },
                {
                    name: `${result.data.entry_history.points}`,
                    value: `Week ${data.current_event} Points`,
                    inline: true
                },
                { name: '\u200B', value: '\u200B', inline: true },
            ],
            [
                { name: 'Classic Leagues', value: `${data.leagues.classic.length}`, inline: true },
                { name: 'h2h', value: `${data.leagues.h2h.length}`, inline: true },
            ],
            {
                name: `GKS`,
                value: `${gks}`,
                inline: false
            }, 
            [
                { name: 'DEF', value: `${defs}`, inline: true },
                { name: 'MID', value: `${mids}`, inline: true },
                { name: 'FWD', value: `${fwds}`, inline: true },

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

module.exports = { managerEmbed, saveManagerEmbed }