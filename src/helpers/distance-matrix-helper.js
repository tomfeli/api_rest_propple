let axios = require('axios');
const Google_API_Key = "AIzaSyCUiYXiVjEbxvtg5FL0noAR1t0eQyDOW9o"

async function getDistance(origins, destinations) {
    let config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&departure_time=now&key=${Google_API_Key}`,
        headers: {}
    };
    return axios(config)
    .then(function (res) {
        //console.log("valor distancia: "+JSON.stringify(res.data.rows[0].elements[0].status));
        const distancia = res.data.rows[0].elements[0].status == "OK" ? res.data.rows[0].elements[0].distance.value: "1"
        //return JSON.stringify(res.data.rows[0].elements[0].distance.value);
        return distancia
    })
        .catch(function (error) {
            throw error;
    });
}

module.exports = {getDistance}