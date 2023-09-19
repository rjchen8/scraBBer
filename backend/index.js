require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const port = process.env.PORT;

const { getAvailability, getSale, getProduct } = require('./urlhandlers');
const { runDatabase, findNewListing } = require('./database');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: true }));

app.post('/api', async(req, res) => { // user posts link to api
    const link = req.body.value;
    try {
        const available = await getAvailability(link);
        const sale = await getSale(link);
        const product = await getProduct(link);
        // write to database
        await runDatabase("post", available, sale, link, product).catch(console.error);
        return res.status(201).send("Successfully added to API.")
    }
    catch {
        console.log('fail');
        return res.status(400).send("Error with URL")
    }
})

app.get('/api', async(req, res) => {
    const data = await runDatabase("get");  
    return res.status(200).send(data);
})

app.put('/api', async(req, res) => {
    const link = req.body.link;
    const available = await getAvailability(link);
    const sale = await getSale(link);
    const newData = await runDatabase("put", available, sale, link);
    return res.status(200).send(newData);
})

app.delete('/api/:productId', async(req,res) => {
    const productId = req.params.productId;
    await runDatabase("delete", null, null, null, null, productId);
    return res.status(200).send();
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})




