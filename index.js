const port = 3001;

const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ummk1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Welcome to FTL Skill House API")
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
      app.get('/all-courses',(req,res)=>{
        courseCollection.find({})
        .sort({_id:-1})
        .toArray((err,documents)=>{
            res.send(documents)
        })
      })

      // ============ [ For Showing Single course ]==============
      app.get('/course',(req,res)=>{
        const {course_id} = req.query;
        courseCollection.find({_id:ObjectID(course_id)})
        .sort({_id:-1})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
      })

      // ============ [ For Orders filtering user id ]==============
      app.get('/orders',(req,res)=>{
        const {uid} = req.query;
        orderCollection.find({uid:uid})
        .sort({_id:-1})
        .toArray((err,documents)=>{
            res.send(documents)
        })
      })

      // ============ [ For deleting course by course id ]==============
      app.post('/delete-course',(req,res)=>{
        const {course_id} = req.query;
        courseCollection.deleteOne({_id:ObjectID(course_id)})
        .then(result=>{
            res.send(result.deletedCount > 0)
        })
        .catch(err=>{
            res.send(false)
        })
      })
  }
});

app.listen(process.env.PORT || port);