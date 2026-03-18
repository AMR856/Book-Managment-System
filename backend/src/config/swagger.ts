import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import fs from "fs";
import path from "path";
import { Express } from "express";

export const setupSwagger = (app: Express) => {
  try {
    const swaggerFilePath = path.join(__dirname, "../../swagger.yaml");
    const swaggerFile = fs.readFileSync(swaggerFilePath, "utf-8");
    const swaggerDocument = YAML.parse(swaggerFile);

    app.use("/api-docs", swaggerUi.serve);
    app.get("/api-docs", swaggerUi.setup(swaggerDocument, {
      swaggerOptions: {
        url: "/swagger.yaml",
      },
    }));

    app.get("/swagger.yaml", (req, res) => {
      res.setHeader("Content-Type", "application/x-yaml");
      res.sendFile(swaggerFilePath);
    });

    console.log("Swagger documentation available at http://localhost:5000/api-docs");
  } catch (error) {
    console.error("Error setting up Swagger:", error);
  }
};
