import data from "./data";
let { people } = data;

const isIDTaken = (id) => {
  if (people[`${id}`]) return people[`${id}`].name;
  else {
    return "Not a user";
  }
};

export default async function handler(req, res) {
  let name = null;
  console.log(req.body, 1);
  if (req.method === "POST") {
    name = isIDTaken(req.body.id);
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ name: name }));
}
