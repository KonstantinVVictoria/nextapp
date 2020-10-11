import Cors from "cors";
import data from "./data";
let { people } = data;
const cors = Cors({
  methods: ["GET", "POST"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const isIDTaken = (person) => {
  console.log(people[`${person.id}`]);
  if (people[`${person.id}`]) return true;
  else {
    people[`${person.id}`] = { name: person.name };
    return false;
  }
};

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  let isTaken = null;
  console.log(req.body, 1);
  if (req.method === "POST") {
    isTaken = isIDTaken(req.body);
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ isTaken: isTaken, people: people }));
}
