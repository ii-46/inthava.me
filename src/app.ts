import express from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import favicon from "serve-favicon";

// router
import main from "./router/main";
import { sendSitemap } from "./handler/sitemap";

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
    },
  }),
);
app.use(morgan("common"));
app.use("/sitemap.xml", sendSitemap);
app.use(express.static(path.join(__dirname, "../public")));
app.use("/statics", express.static(path.join(__dirname, "../public")));
app.use(
  "/upload/images",
  express.static(path.join(__dirname, "../upload/images")),
);
app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));
app.use("/", (req, res, next) => {
  res.setHeader("X-Powered-By", "inthava.me");
  next();
});

app.use(main);

app.use((req, res, next) => {
  res.send("PAGE NOT FOUND");
});
app.use((err, req, res, next) => {
  console.log(err);
  res.send("error happened");
});
export default app;
