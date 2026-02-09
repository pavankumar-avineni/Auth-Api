const swaggerJSDoc = require("swagger-jsdoc");

module.exports = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "File Upload API",
      version: "1.0.0"
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./routes/*.js"]
});