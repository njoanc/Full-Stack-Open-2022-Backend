const mongoose = require("mongoose");
const mySecret = process.env["MONGO_URL"];

console.log("connected to", mySecret);

mongoose
  .connect(mySecret)
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
    required: [true, "User name required"],
  },
  number: {
    type: String,
    required: true,
    minLength: 10,
    maxLenght: 10,
    // validate: {
    //   validator: function (v) {
    //     return regex.test(v);
    //   },
    //   message: (props) =>
    //     `${props.value} is not a valid phone number! phone number should be valid like: (123) 456-7890,(123)456-7890,123-456-7890,1234567890`,
    // },
    required: [true, "User phone number required"],
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
