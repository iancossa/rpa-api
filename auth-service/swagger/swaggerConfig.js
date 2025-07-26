// auth-service/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Service API",
      version: "1.0.0",
      description: "API documentation for the Auth Service",
    },
    servers: [
      {
        url: "http://localhost:5000", 
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // Files with Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
