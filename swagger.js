// swagger.js

import swaggerJsDoc from "swagger-jsdoc";
import { glob } from "glob";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node Boilerplate 2023",
      version: "0.0.1",
      description:
        "Boilerplate comes with authentication system and swagger doc inbuild",
    },
  },
  apis: getRoutes(),
};

function getRoutes() {
  const files = glob.sync(path.resolve(__dirname, "./src/routes/**/*.js"));
  return files;
}

const specs = swaggerJsDoc(options);

export default specs;
