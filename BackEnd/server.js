import express from "express";
import cors from "cors";
import userRoute from "./routes/user.js"
import GroupRoute from "./routes/Group.js"

import { config } from "dotenv";

const app = express();


app.use(cors());
app.use(express.json());

app.use("/", userRoute);
app.use("/group", GroupRoute);


config({ path: ".env" });
const PORT = process.env.PORT || 8900
app.listen(PORT, () => {
    console.log(`Server is running ${PORT} `);
  });