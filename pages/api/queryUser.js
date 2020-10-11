import data from "./data";
let { people } = data;
import Cors from "cors";
// Initializing the cors middleware
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
const isIDTaken = (id) => {
  if (people[`${id}`]) return people[`${id}`].name;
  else {
    return { status: "Not a user", people: people };
  }
};

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  let name = null;
  console.log(req.body, 1);
  if (req.method === "POST") {
    name = isIDTaken(req.body.id);
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ name: name }));
}
