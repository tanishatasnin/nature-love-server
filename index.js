const express = require('express');
// ____ cors ---
const cors = require('cors');
//
const ObjectId = require('mongodb').ObjectId;

// ____ mongo client ___ 
const { MongoClient } = require('mongodb');
// ____ secuer pass ___ 
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// ____ middleware__
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0k3m9.mongodb.net/myFirstDatabase?
retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');


        // ++++++++++++++++++++++++++ database and collections ++++++++++ 

        const database = client.db('nature-love');
        const productsCollection = database.collection('plants');
        const indoorCullection = database.collection('indoor-plants');
        const blogCollection = database.collection('blogs');
        const customerCollection = database.collection('customers');


        // ++++++++++++++++++++++++ close collection +++++++++++++++ 

        //    _____________ get api Products ____ 
        app.get('/plants', async (req, res) => {
            const cursor = productsCollection.find({});
            const plants = await cursor.toArray();
            res.send(plants);
        })
        //  post api products
        app.post('/plants', async (req, res) => {
            const plant = req.body;
            console.log('hit api ', plant);


            const result = await productsCollection.insertOne(plant);
            console.log(result);
            res.json(result)
        })

        //   ___________ Find one ___ 
        app.get('/plants/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const plant = await productsCollection.findOne(query);
            res.json(plant);

        })




        // +++++++++++++++++ data for all plants to buy a single product +++++++++ 

        app.get('/indoor-plants', async (req, res) => {
            const cursor = indoorCullection.find({});
            const indoors = await cursor.toArray();
            res.send(indoors);
        })
        //  post api products
        app.post('/indoor-plants', async (req, res) => {
            const indoor = req.body;
            console.log('hit api ', indoor);


            const result = await indoorCullection.insertOne(indoor);
            console.log(result);
            res.json(result)
        })
        // _________ find one  all plants to buy a single product _________ 
        app.get('/indoor-plants/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const indoor = await indoorCullection.findOne(query);
            res.json(indoor);

        })

        // +++++++++ indoor-plant close ++++ 

        // ++++++++++++++++++++++++ blogs +++++++++++

        //    _____________ get api blogs ____ 
        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        })
        //  post api products
        app.post('/blogs', async (req, res) => {
            const blog = req.body;
            console.log('hit api ', blog);


            const result = await blogCollection.insertOne(blog);
            console.log(result);
            res.json(result)
        })

        //   ___________ Find one blog ___ 
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const blog = await blogCollection.findOne(query);
            res.json(blog);

        })
        // ++++++++++++++++ blog close +++++++++ 


        // +++++++++++++++ customer part start +++ 
        //  -____________  Get api CUSTOMERS  _________ 

        app.get('/customers', async (req, res) => {
            const customerEmail = req.query.customerEmail;

            const query = { email: customerEmail }
            console.log(query);
            const cursor = customerCollection.find(query);
            // console.log(query);
            const customers = await cursor.toArray();
            res.json(customers);
        })

        //  -____________ CUSTOMERS POST API _________ 
        app.post('/customers', async (req, res) => {
            const customer = req.body;
            const result = await customerCollection.insertOne(customer);
            console.log(customer);
            res.json(result)
        });
        app.delete('/customers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await customerCollection.deleteOne(query);
            res.json(result);

        })
        // ++++++++++++++++++++++++++++++++++++++
        // _______________________________________________________________________________________________

        app.post("/customers", async (req, res) => {
            const result = await customerCollection.insertOne(req.body);
            res.send(result);
        });

        //  my order

        app.get("/customers/:email", async (req, res) => {
            console.log(req.params.customerEmail);
            const result = await customerCollection
                .find({ customerEmail: req.params.email })
                .toArray();
            res.send(result);
        });


    }
    finally {

        //        await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running Nature-love');
})

app.listen(port, () => {
    console.log("running Nature-love on porat", port)
})