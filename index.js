const express = require("express");
const phonebook = require("./phonebook.json");

const app = express();

app.use(express.json());

app.get("/api/persons", (request, response) => {
  //   const data = phonebook.findAll();

  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const data = phonebook.find((note) => note.id === id);

  response.json(data);
});

app.post("/api/persons", (request, response) => {
  const data = request.body;
  phonebook.concat(data);
  response.json(data);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const data = phonebook.filter((note) => note.id !== id);
  console.log(data);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const data = phonebook;
  const currentTime = new Date();
  const date = currentTime.toGMTString();

  response.json({
    message: `Phonebook has info for ${data.length} people`,
    date: date,
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
