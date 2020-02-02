import Express from "express";
import { createConnection } from "typeorm";

const app = Express();

const main = async () => {
  let retryAttempts = 10;

  let connected: boolean = false;

  while (retryAttempts > 0 && !connected) {
    try {
      await createConnection({
        name: "default",
        type: "postgres",
        host: "postgres",
        port: 5432,
        username: "postgres",
        password: "postgres_password",
        database: "postgres",
        synchronize: true,
        logging: true,
        entities: ["src/entities/*.*"]
      });

      connected = true;

      retryAttempts--;
    } catch (e) {
      console.log(e);
    }
  }

  app.listen(4000, () => {
    console.log("app running");
  });
};

main();
