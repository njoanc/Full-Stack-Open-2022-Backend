const express = require("express");
// let phonebook = require("./phonebook.json");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Phonebook = require("./models/phonebook");

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

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then((phonebook) => {
    response.json(phonebook);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        return response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const data = request.body;

  if (!data.name || !data.number) {
    return response.status(400).send("Name and phone number are required");
  } else {
    const person = new Phonebook({
      name: data.name,
      number: data.number,
    });

    person.save().then((item) => {
      response.json(item).end();
    });
  }
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Phonebook.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((item) => {
      response.json(item);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
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

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
