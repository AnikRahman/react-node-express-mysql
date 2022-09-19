const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");


const db = mysql.createPool ({
    host: "localhost",
    user: "root",
    password: "Hranik019551",
    database: "comments",
});

app.use(cors());
app.use (express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/api/get" , (req , res) => {
    const sqlGet = " Select * from response_db" ;
    db.query(sqlGet,(error,result) => {
        res.send(result);
    })
    
})

app.post("/api/post" ,(req ,res) => {
    const {postId , Username , body} = req.body;
    const sqlInsert = 
    "Insert into response_db (postId, Username , body) values (? ,? ,? )";
    db.query(sqlInsert, [postId , Username , body],(error,result) => {
        if (error) {
            console.log(error);
        }
    });
});

app.put("/edit", (req, res) => {
    const { id } = req.body;
    const { postId } = req.body;
    const { Username } = req.body;
    const { body } = req.body;

    let sql = "UPDATE response_db SET postId = ?, Username = ?, body = ? WHERE id = ?";
    db.query(sql, [postId, Username, body, id], (err,result) =>{
        if (err) {
            console.log(err);
        }else{

            res.send(result);
        }
    })
});

app.delete("/delete/:index", (req,res) =>{
    const { index } = req.params

    let sql = "DELETE FROM response_db WHERE id = ?"
    db.query(sql, [index], (err,result) =>{err ? console.log(err) : res.send(result)})
})

app.get ("/",(req,res) => {
    //const sqlInsert = 
    //"INSERT INTO response_db (`postId`,`Username`, `body` ) Values ('1', 'Hranik7' , 'hello world')";
   
    //db.query(sqlInsert ,(error,result)=> {
       // console.log("error", error);
        //console.log("result", result);
        //res.send("hello express");
    //});
   
});

app.listen(5000, () => {
    console.log("server is running on port 5000 ")
})