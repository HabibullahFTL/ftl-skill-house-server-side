const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const app = express();
const uri = "mongodb+srv://piash1:piash365@cluster0.ummk1.mongodb.net/ftl_skill_house?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello")
})


client.connect(err => {
  const courseCollection = client.db("ftl_skill_house").collection("courses");
  const orderCollection = client.db("ftl_skill_house").collection("orders");
  if (err) {
      console.log("there is an error");
  }else{
     // ============ [ For Creating new course ]==============
      app.post('/create-course',(req,res)=>{
          courseCollection.insertOne(req.body).then(result=>{
              if(result.insertedCount > 0){
                  res.send(result.ops[0])
              }else{
                  res.send({message:"Something went wrong"})
              }
          })
      }) 

      // ============ [ For Placing Order ]==============
      app.post('/add-order',(req,res)=>{
        orderCollection.insertOne(req.body).then(result=>{
            if(result.insertedCount > 0){
                res.send(result.insertedCount > 0)
            }else{
                res.send({message:"Something went wrong"})
            }
        })
    })

      // ============ [ For Showing All course ]==============
      app.post('/all-courses',(req,res)=>{
        courseCollection.find({})
        .sort({_id:-1})
        .toArray((err,documents)=>{
            res.send(documents)
        })
      })

      // ============ [ For Showing Single course ]==============
      app.post('/course',(req,res)=>{
        const {course_id} = req.query;
        courseCollection.find({_id:ObjectID(course_id)})
        .sort({_id:-1})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
      })
  }
});


app.listen(3001);