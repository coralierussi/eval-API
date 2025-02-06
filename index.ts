import cors from "cors";
import "dotenv/config";
import express from "express";

import { usersRouter } from "./src/router/users";
import { instrumentsRouter } from "./src/router/instruments";
import { checkToken } from "./src/middlewares/checkToken";
import { authRouter } from "./src/router/auth";

const app = express();

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();
apiRouter.use("/users", usersRouter)
apiRouter.use("/instruments", checkToken,instrumentsRouter)
apiRouter.use("/auth", authRouter)

app.use("/api", apiRouter);


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
