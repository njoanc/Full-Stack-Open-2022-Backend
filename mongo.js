const mongoose = require("mongoose");
require("dotenv").config();

const password = process.env.MONGO_PASSWORD;
if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

// const password = process.argv[2];

const url = `mongodb+srv://Jeanne:${password}@cluster0.djfpotd.mongodb.net/?retryWrites=true&w=majority`;

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Phonebook", phoneBookSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    const person = new Person({
      name: "Arto Hellas",
      number: "040-123456",
    });

    return person.save();
  })
  .then(() => {
    console.log("person saved!");
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));

Person.find({ name: "Arto Hellas" }).then((result) => {
  result.forEach((person) => {
    console.log(person.toJSON());
  });
  mongoose.connection.close();
});
