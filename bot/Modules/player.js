const cron = require('node-cron');


const axios = require('axios')
axios.defaults.headers.common['User-Agent'] = 'PostmanRuntime/7.26.2';


let overview;

cron.schedule('*/2 * * * * *', async () => {
    overview = await axios.get('https://fantasy.premierleague.com/api/bootstrap-static/')
    console.log("Updated Overview")
});

const getPlayerDetails = async (id) => {
    const { data } = overview;
    const elements = data.elements;
    return elements.find(x => x.id == id)
}



module.exports = { getPlayerDetails }