const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todoListDB", { 
  useNewUrlParser: true,
  useUnifiedTopology: true});

  const itemsSchema ={
      name: String
  };
  const Item = mongoose.model("Item", itemsSchema)

app.get("/", function (req, res) {
  var today = new Date();
  
  var options ={
    weekday: "long",
    day: "numeric",
    month:"long"
  }
  var day = today.toLocaleDateString("en-US", options)


  res.render("list", { listTitle: day , newListItems: items});
});

app.post("/", function (req, res) {
  let item = req.body.newItem
 if(req.body.list === "Work"){
  workItems.push(item)
  res.redirect("/work")
 }else{
  items.push(item);
  res.redirect("/");
 }
 
})
app.get("/work", function(req, res){
  res.render("list",{listTitle: "Work list" , newListItems: workItems} );
})
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
