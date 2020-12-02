'use strict'

const fs = require('fs');
const asyncPool = require('tiny-async-pool');
const axios = require('axios');
const Agent = require('agentkeepalive');

const keepAliveConfig = {
    maxSockets: 40,
    timeout: 30000
};

// Axios uses separate agents for HTTP vs HTTPS.
const httpKeepAliveAgent = new Agent(keepAliveConfig);
const httpsKeepAliveAgent = new Agent.HttpsAgent(keepAliveConfig);

const requestConfig = {
    maxRedirects: 0,
    validateStatus: function(status) {
        return true;
    }
};

const httpClient = axios.create({
    httpAgent: httpKeepAliveAgent,
    httpsAgent: httpsKeepAliveAgent
});

async function test(url) {

    try {
        return await httpClient.get(url, requestConfig);
    } catch (error) {
        return `Error '${error.message}' connecting to '${url}'.`;
    }
}

async function main() {

    const temp = fs.readFileSync('urls.json');
    const urlList = JSON.parse(temp);

    const responses = await asyncPool(5, urlList, test);

    let errorList = new Array();
    responses.forEach((response) => {

        // If we got back an object, it's an HTTP response so check for an unexpected result and report it.
        // If it's a string, something went badly wrong so we display it.
        // Otherwise, it's a valid HTTP response, and we do nothing further.
        if( typeof(response) == 'object' && response.status != 200 ) {
            errorList.push(`Unexpected status '${response.status}' for url '${response.config.url}'`);
        }
        else if( typeof(response) == 'string' ) {
            errorList.push(response);
        }
    });

    if( errorList.length == 0 ) {
        console.error('All urls OK.')
    }
    else {
        console.error("Errors encountered:\n");
        errorList.forEach(message => console.error(message));
    }
}

main();