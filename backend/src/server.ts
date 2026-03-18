import { createApp } from "./app";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const app = await createApp();

    app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
      console.log(`API Documentation available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
