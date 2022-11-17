const express = require("express");
let phonebook = require("./phonebook.json");

const app = express();

app.use(express.json());

app.get("/api/persons", (request, response) => {
  //   const data = phonebook.findAll();

  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const data = phonebook.find((note) => note.id === id);
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
  phonebook.filter((note) => note.id !== id);
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

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
