'use strict'

const axios = require('axios');

const fs = require('fs');

async function main() {

    const temp = fs.readFileSync('urls.json');
    const urlList = JSON.parse(temp);

    const requestConfig = {
        maxRedirects: 0,
        validateStatus: function(status) {
            return true;
        }
    };

    const promises = urlList.map((url) => axios.get(url, requestConfig));
    const responses = await Promise.all(promises);

    let allOK = true;
    responses.forEach((response) => {
        if( response.status != 200 ) {
            allOK = false;
            console.log(`Unexpected status '${response.status}' for url '${response.config.url}'`);
        }
    });

    if( allOK )
        console.log('All urls OK.')
}

main();