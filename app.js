const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin-nigar:newpassword1001@cluster0.p39ug.mongodb.net/todoListDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "supermassive",
});
const item2 = new Item({
  name: "black",
});
const item3 = new Item({
  name: "hole",
});

const defalutItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("list", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defalutItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("succestfully added!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  //var day = today.toLocaleDateString("en-US", options)
});
app.get("/:customlistName", function (req, res) {
  const customlistName = _.capitalize(req.params.customlistName);
  List.findOne({ name: customlistName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //yenisini yarat
        const list = new List({
          name: customlistName,
          items: defalutItems,
        });
        list.save();
        res.redirect("/" + customlistName);
      } else {
        //movcud fayli elave et
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item4 = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item4.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item4);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkbox;
  const checkedName = req.body.listName;
  //Item.findByIdAndRemove(checkedItem, function(err){
  //   console.log("Succesfully deleted item!");
  //  res.redirect("/");
  // })
  if (checkedName === "Today") {
    Item.findByIdAndRemove(checkedItem, function (err) {
      console.log("Succesfully deleted item!");
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate(
      //conditions
      { name: checkedName },
      //update
      { $pull: { items: { _id: checkedItem } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + checkedName);
        }
      }
    );
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work list", newListItems: workItems });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started succesfully!");
});
