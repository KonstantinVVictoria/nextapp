import Cors from "cors";
import data from "./data";
import initMiddleware from "../../lib/init-middleware";
let { people } = data;
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);

const isIDTaken = (id) => {
  if (people[`${id}`]) return people[`${id}`].name;
  else {
    return "Not a user";
  }
};

export default async function handler(req, res) {
  await cors(req, res);
  let name = null;
  console.log(req.body, 1);
  if (req.method === "POST") {
    name = isIDTaken(req.body.id);
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ name: name }));
}
