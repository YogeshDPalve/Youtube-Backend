import express from "express";
import "dotenv/config";
import morgan from "morgan";
import logger from "./logger.js";

const app = express();
const port = process.env.PORT || 4000;
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(express.json());

let teaData = [];
let nextId = 1;

//! Add a new tea
app.post("/teas", (req, res) => {
  // logger.info("This is an info message");
  // logger.error("This is an error message");
  // logger.warn("This is a warning message");
  // logger.debug("This is a debug message");

  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

//! get all teas
app.get("/teas", (req, res) => {
  res.status(201).send(teaData);
});

//! get a tea with id
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not found");
  }
  res.status(200).send(tea);
});

//! update tea
app.put("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not found");
  }
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.status(200).send("Tea updated");
});

//! delete tea
app.delete("/teas/:id", (req, res) => {
  const index = teaData.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("tea not found");
  }
  teaData.splice(index, 1);
  return res.status(204).json({ msg: "tea DELETED !" });
});

app.listen(port, () => {
  console.log(`server is running at port ${port}...`);
});
