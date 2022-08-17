
const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = new mongoose.Schema({
    name: String,
});

const Item = new mongoose.model("Item", itemsSchema);
const WorkItem = new mongoose.model("WorkItem", itemsSchema);
const day = date.getDate();

const item1 = new Item({ name: "Welcome to To Do List Web App" });
const item2 = new Item({ name: "Click on plus button below to add a new item!" });
const item3 = new Item({ name: "<-- checked on this box to delete the item!" });

const defaultItems = [item1, item2, item3];
const workItems = [({ name: "This is your first Work List!" })];

const listSchema = { name: String, items: [itemsSchema] };

const List = mongoose.model("List", listSchema);

app.get("/:customList", function (req, res) {
    const customList = _.capitalize(req.params.customList);

    if (customList === "About") {
        res.render("about");
    } else {
        List.findOne({ name: customList }, function (err, foundList) {
            if (!err) {
                if (!foundList) {
                    const list = new List({
                        name: customList,
                        items: defaultItems
                    });
                    list.save();
                    res.redirect("/" + customList);
                } else {
                    res.render("list", { listTitle: foundList.name, ejsNewListItems: foundList.items })
                }
            }
        })
    }
});

app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items to DB.");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", ejsNewListItems: foundItems });
        }
    })
});

app.post("/", (req, res) => {

    const newToDo = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: newToDo,
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", (req, res) => {
    const checkedItemId = mongoose.Types.ObjectId(req.body.checkbox.trim());
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                res.redirect("/");
                console.log("Successfully deleted item.");
            }
        });
    } else {
        List.findOneAndUpdate(
            {name: listName}, 
            {$pull: 
                {items: 
                    {_id: checkedItemId}
                }
            },
            function(err, foundList){
                if (!err) {
                    res.redirect("/" + listName);
                }
        })
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000, press CTRL C to abort.")
});