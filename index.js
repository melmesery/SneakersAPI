import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import initApp from "./src/index.router.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "config/.env") });

const app = express();
const port = process.env.PORT || 5000;

initApp(app, express);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
