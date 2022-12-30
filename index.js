const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).end();
  }

  // Validation check

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const nameExists = persons.find((person) => person.name === body.name);

  if (nameExists) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  let newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[+] Server listening on port ${PORT}`);
});
