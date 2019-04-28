const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost/gojek")
  .then(() => console.log("Connecting to MonogDB..."))
  .catch(err => console.log("Error: ", err));

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const Food = mongoose.model("foods", foodSchema);

// ---> READ <---                            ---                                ---> READ <--
async function getFoods() {
  const result = await Food.find();
  console.log(result.length);

  return result;
}

async function getFood(id) {
  const result = await Food.findById(id);
  return result;
}

// async function getTotalFood() {
//   const result = Food.find();
//   console.log;
// }

app.get("/api/foods", (req, res) => {
  const foodsPromise = getFoods();
  foodsPromise
    .then(result => res.send(result))
    .catch(err => res.status(404).send("Foods not Found!", err));
});

app.get("/api/foods/:id", (req, res) => {
  const foodFoundPromise = getFood(req.params.id);
  foodFoundPromise
    .then(result => res.send(result))
    .catch(err => res.status(404).send("Food not Found!", err));
});

// ---> CREATE <---                          ---                              ---> CREATE <--
async function createFood(food) {
  const newFood = new Food({
    name: food.name,
    price: food.price
  });
  const result = await newFood.save();
  return result;
}

app.post("/api/foods", (req, res) => {
  // validate
  // post
  const newFoodPromise = createFood(req.body);
  newFoodPromise
    .then(result => res.send(result))
    .catch(err => console.log("Error: " + err));
});

// ---> UPDATE <---                          ---                              ---> UPDATE <--
async function updateFood(id, name, price, altId) {
  const food = await Food.updateOne(
    { _id: id },
    {
      $set: {
        name,
        price,
        altId
      }
    },
    { new: true }
  );

  return food;
}

app.put("/api/foods/:id", (req, res) => {
  const updatedFood = updateFood(req.params.id, req.body.name, req.body.price);
  updatedFood
    .then(food => res.send(food))
    .catch(err => res.status(400).send("Cant update ", err));
});

// ---> DELETE <---                          ---                              ---> DELETE <--
async function deleteFood(id) {
  const result = Food.deleteOne({ _id: id });
  return result;
}

app.delete("/api/foods/:id", (req, res) => {
  const deletedFood = deleteFood(req.params.id);
  deletedFood
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
});

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}`));
