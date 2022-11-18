const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

console.log("connected to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 10,
    maxLenght: 10,
    unique: true,
    // validate: {
    //   validator: function (v) {
    //     return /^(?(d{3}))?[- ]?(d{3})[- ]?(d{4})$/.test(v);
    //   },

    //   message: "Provided phone number is invalid",
    // },
  },
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject._v;
  },
});

module.exports = mongoose.model("Phonebook", phoneBookSchema);
