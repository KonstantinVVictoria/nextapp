import Cors from "cors";
import initMiddleware from "../../lib/init-middleware";
import data from "./data";
let { people } = data;
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);
// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware

const isIDTaken = (person) => {
  console.log(people[`${person.id}`]);
  if (people[`${person.id}`]) return true;
  else {
    people[`${person.id}`] = { name: person.name };
    return false;
  }
};

export default async function handler(req, res) {
  await cors(req, res);
  let isTaken = null;
  console.log(req.body, 1);
  if (req.method === "POST") {
    isTaken = isIDTaken(req.body);
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ isTaken: isTaken, people: people }));
}
