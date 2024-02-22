const express = require("express");

require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const cors = require("cors");

const app = express();

const port = process.env.PORT || 5000;





app.use( cors());

app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ck8e5sv.mongodb.net/?retryWrites=true&w=majority`;





const client = new MongoClient(uri, {

  serverApi: {

    version: ServerApiVersion.v1,

    strict: true,

    deprecationErrors: true,

  },

});







const dbConnect = async () => {

  try {

    // <----------------------------------> //
    // <------ Database Collections ------> //
    // <----------------------------------> //

    const productsCollection = client.db("Simple-Style").collection("Products");

    const usersCartCollection = client.db("Simple-Style").collection("Cart");



    // <---------------------------------------------> //
    // <------ CRUD Operations Start form Here ------> //
    // <---------------------------------------------> //

    app.get("/api/v1/products", async (req, res) => {

      const cursor = productsCollection.find();

      const result = await cursor.toArray();

      res.send(result);

    });




    app.get("/api/v1/product", async (req, res) => {

      const id = req.query.id;

      const query = { _id: new ObjectId(id) };

      const result = await productsCollection.findOne(query)

      res.send(result);

    });




    app.get("/api/v1/cart", async (req, res) => {

      const email = req.query.email;

      const query = { email: email };

      const result = await usersCartCollection.find(query).toArray();

      res.send(result);

    });




    app.get("/api/v1/cart/product", async (req, res) => {

      const id = req.query.id;

      const query = { _id: new ObjectId(id) };

      const result = await usersCartCollection.findOne(query);

      res.send(result);

    });




    app.post("/api/v1/products", async (req, res) => {

      const product = req.body;

      const result = productsCollection.insertOne(product);

      res.send(result)
    
    })




    app.post("/api/v1/cart", async (req, res) => {

      const product = req.body;

      const result = usersCartCollection.insertOne(product);

      res.send(result)
    
    })





    app.put("/api/v1/cart", async (req, res) => {

      const id = req.query.id;
      
      const product = req.body;

      const query = { _id: new ObjectId(id) };
      
      const option = { upsert: true };
      
      const UpdatedProduct = {

        $set: {

          name: product.name,

          image: product.image,
          
          type: product.type,
          
          price: product.price,
          
          rating: product.rating,
          
          brand: product.brand,
          
          details: product.details,
        
        },

      };
      
      const result = await usersCartCollection.updateOne(query, UpdatedProduct, option);
      
      res.send(result);
    
    });


    // <---------------------------------------> //
    // <------ CRUD Operations Ends Here ------> //
    // <---------------------------------------> //

    await client.connect();
    console.log("Database Connected!");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();






app.get("/", (req, res) => {

  res.send("This the Server of Simple Style's Website");

});

app.listen(port, () => {

  console.log("the server is Running on ", port, "port.");

});
