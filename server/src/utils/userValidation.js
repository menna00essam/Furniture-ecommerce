const Ajv = require("ajv");
const ajv = new Ajv();

// User schema validation using Ajv library
const userSchema = {
  type: "object",
  properties: {
    fName: { type: "string", pattern: "^[a-zA-Z]*$", minLength: 3 },
    lName: { type: "string", pattern: "^[a-zA-Z]*$", minLength: 3 },
    email: {
      type: "string",
      pattern: "^[a-zA-Z0-9._]+@(gmail|yahoo|outlook)+.[a-z]{2,4}$",
    },
    password: { type: "string", minLength: 8 },
    isAdmin: { type: "boolean" },
  },
  required: ["fName", "lName", "email", "password"],
  additionalProperties: false,
};
module.exports = ajv.compile(userSchema);
