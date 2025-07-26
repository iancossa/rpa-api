const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: [__dirname + '/../routes/*.js'], // <- Use this relative path
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
