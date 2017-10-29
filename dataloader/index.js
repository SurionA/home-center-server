const DataLoader = require('dataloader');
const axios = require('axios');

async function getHydrometries() {
    try {
        const hydrometries = await axios.get('http://home.suriona.com/home-center/api/hydrometries/');
        console.log('getHydrometries');

        return {
            data: hydrometries.data,
            lastEntry: hydrometries.data[0],
        };
    } catch (err) {
        console.log('error', error);
    }
}

async function getHydrometryById(id) {
    try {
        const hydrometry = await axios.get(`http://home.suriona.com/home-center/api/hydrometries/${id}`);
        console.log('getHydrometryById');

        return hydrometry.data;
    } catch (err) {
        console.log('error', error);
    }
}

module.exports = {
    getHydrometries,
    getHydrometryById,
};
