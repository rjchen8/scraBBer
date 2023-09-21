const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function getAvailability(link) { // grabs sale availability from site
    const root = await axios.get(link);
    const dom = new jsdom.JSDOM(root.data);
    if (dom.window.document.querySelector('.availabilityMessage_3ZSBM').textContent == "Available to ship") {
        return true // available
    }
    else {
        return false // not available
    }
}

async function getSale(link) { // grabs sale status from site
    const root = await axios.get(link);
    const dom = new jsdom.JSDOM(root.data);
    if (dom.window.document.querySelector('.productSaleDate_353UZ')) {
      return true // on sale
    }
    else {
      return false // not on sale
    }
}

async function getProduct(link) { // grabs name of product from site
    const root = await axios.get(link);
    const dom = new jsdom.JSDOM(root.data);
    const product = dom.window.document.querySelector('.productName_2KoPa').textContent; 
    return product;
}


module.exports = { getAvailability, getSale, getProduct }