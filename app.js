const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/gojek")
  .then(() => console.log("Connecting to MonogDB..."))
  .catch(err => console.log("Error: ", err));

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const Food = mongoose.model("foods", foodSchema);

// Create
async function createFood(name, price) {
  const food = new Food({
    name,
    price
  });

  const result = await food.save();
  console.log(result);
}

// Read
async function getFoods() {
  const result = await Food.find();
  console.log(result);
}

async function getFood(id) {
  const result = await Food.findById(id);
  console.log(result);
}

// Update
async function updateFood(id, name, price) {
  const result = await Food.updateOne(
    { _id: id },
    {
      $set: {
        name,
        price
      }
    },
    { new: true }
  );
  console.log(result);
}

// Delete
async function deleteFood(id) {
  const result = await Food.deleteOne({ _id: id });
  console.log(result);
}

createFood("Mie Kuah", 9000);
// getFoods();
// getFood("5cc2a4fe04ed0b0578bb4c72");
// updateFood("5cc2c5e43d8e9b2490819a55", "Nasi Gurih", 5000);
// deleteFood("5cc2c5e43d8e9b2490819a55");
