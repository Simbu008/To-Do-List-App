require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

const url = process.env.MONGO_URI;
mongoose.connect(url);

const itemSchema = new mongoose.Schema({
  itemName: String,
});

const Item = mongoose.model("Item", itemSchema);

const Item1 = new Item({
  itemName: "Add your Works here.",
});
const Item2 = new Item({
  itemName: "Hit the + to add new item",
});
const Item3 = new Item({
  itemName: "<-- Hit this to delete  item",
});

const defaultItems = [Item1, Item2, Item3];

const customListSchema = {
  name: String,
  items: [itemSchema],
};

async function insertItems() {
  try {
    const response = await Item.insertMany(defaultItems);
    // console.log(response);
    console.log("Items saved successfully");
  } catch (err) {
    console.log(err);
  }
}

app.get("/", function (req, res) {
  const day = new Date().toDateString();
  fetchItems();
  async function fetchItems() {
    try {
      const foundItems = await Item.find();
      console.log(foundItems.length);
      foundItems.forEach((items) => {
        console.log(items.itemName);
      });
      if (foundItems.length === 0) {
        insertItems();
        res.redirect("/");
        return;
      } else {
        res.render("list.ejs", {
          listTitle: day,
          newlistItems: foundItems,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
});

app.post("/", function (req, res) {
  const createdItem = new Item({
    itemName: req.body.newItem,
  });
  createdItem.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const id = req.body.checkbox;
  deleteItem();
  res.redirect("/");
  async function deleteItem() {
    try {
      const response = await Item.findByIdAndRemove(id);
      if (response) {
        console.log("Successfully deleted the item ");
      }
    } catch (err) {
      console.log(err);
    }
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started on port 3000");
});
