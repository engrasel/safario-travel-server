// server required
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const objectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');

//server port
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//server root directory
app.get('/',(req,res)=>{
    res.send('Travel Agency Server Running...');
});

//server to database connect
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dw1qi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//server to database connect
const uri = "mongodb+srv://safariotravelonline:pSVPCIhVbk4aBZXD@cluster0.dw1qi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run(){
    try{
        await client.connect();
        const database = client.db("safario-travel");
        const productCollection = database.collection("products");
        const myOrderCollection = database.collection("myOrder");
        const userCollection = database.collection("users");
        
        //product get service api
        app.get('/products', async(req,res) =>{
            const product = await productCollection.find({}).toArray();
            res.json(product);
        });

         //product get service api count
         app.get('/products/count', async(req,res) =>{
            const product = await productCollection.find({}).limit(6).toArray();
            res.json(product);
        });

        //product post service api
        app.post('/addNewService', async(req,res) => {
            const getProduct = req.body;
            const product = await productCollection.insertOne(getProduct);
            res.json(product);
        })

        //single service api
        app.get('/booking/:id', async(req,res)=> {
            const id = req.params.id;
            const query = {_id:objectId(id)};
            const result = await productCollection.findOne(query);
            res.json(result);
        })

        // user order set api
        app.post('/myOrder',async (req,res)=>{
            const userItem = req.body;
            const result = await myOrderCollection.insertOne(userItem);
            res.json(result);
        });

        // user order get api
        app.get('/myOrder', async (req,res)=>{
            const result = await myOrderCollection.find({}).toArray();
            res.json(result);
        });

        
        // Delete user order get api
        app.delete('/myOrder/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id:objectId(id)};
             console.log('deleted user',query)
             const result = await myOrderCollection.deleteOne(query);
            res.json(result);
        });

         // user login ino set api
         app.post('/users',async (req,res)=>{
            const userItem = req.body;
            const result = await userCollection.insertOne(userItem);
            res.json(result);
        });

         // user login ino set api
         app.get('/users',async (req,res)=>{
            const result = await userCollection.find({}).toArray();
            res.json(result);
        });

    }finally{
        //await  client.close();
    }
}
run().catch(console.dir);


//server listen
app.listen(port,()=>{
    console.log('Travel Agency Server Running...',port);
})








