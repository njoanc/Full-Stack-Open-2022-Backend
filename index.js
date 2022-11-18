const express = require("express");
let phonebook = require("./phonebook.json");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");

const app = express();

//create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

//setup the logger

app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.json());
app.use(cors());

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const data = phonebook.find((person) => person.id === id);
  if (!data) {
    return response.status(404).send("The person not found");
  }
  return response.json(data);
});

app.post("/api/persons", (request, response) => {
  const id = phonebook.length > 0 ? Math.max(...phonebook.map((n) => n.id)) : 0;
  const data = request.body;
  data.id = id + 1;
  // console.log(data.name);
  if (!data.name || !data.number) {
    return response.status(400).send("Name and phone number are required");
  } else {
    const result = phonebook.find((person) => person.name === data.name);
    // console.log(result);
    if (!result) {
      phonebook = phonebook.concat(data);
      return response.json(phonebook);
    }
    return response.status(400).send("Name must be unique");
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);
  // console.log(data);

  return response.status(204).end();
});

app.get("/info", (response) => {
  const data = phonebook;
  const currentTime = new Date();
  const date = currentTime.toGMTString();

  return response.json({
    message: `Phonebook has info for ${data.length} people`,
    date: date,
  });
});

const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unkownEndpoint);

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
