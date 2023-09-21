const uri = process.env.URI;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const client = new MongoClient(uri);

async function runDatabase(method, available, sale, link, product, id) { // maybe operation?
    try {
        await client.connect(); // connect to database

        if (method == "post") {
            await createListing(client, {
                available: available,
                sale: sale,
                link: link,
                product: product,
            })
        }

        else if (method == "get") {
            const data = await findNewestListing(client);
            return data;
        }

        else if (method == "put") { // update in mongo, send newData object to backend
            const productUrl = link;
            const update = {available: available, sale: sale};
            await client.db("scraped").collection("data").updateOne({ link: productUrl }, { $set: update }); // update in database
            const newData = await findListingByUrl(client, productUrl); // find updated listing
            return newData; // send new data to backend
        }

        else if (method == "delete") {
            const productId = id;
            await client.db("scraped").collection("data").deleteOne({ _id: new ObjectId(productId) });
            return;
        }
    }
    catch(error) {
        console.log(error); // log errors
    }
}

async function createListing(client, newListing) {  // inserts listing with data into mongo
    const result = await client.db("scraped").collection("data").insertOne(newListing);
    console.log(`New listing created with ID ${result.insertedId}`);
}

async function findNewestListing(client) { // finds listing just created to display to the user
    try {
        const cursor = await client.db("scraped").collection("data").find().sort({_id:-1}).limit(1);
        const result = await cursor.toArray()
        console.log(result);
        return result;
    }
    catch(error) {
        console.log(error);
    }
}

async function findListingByUrl(client, link) { // finds listing using link
    try {
        const result = await client.db("scraped").collection("data").findOne({ link: link });
        return result;
    }
    catch(error) {
        console.log(error);
    }
}

module.exports = { runDatabase };