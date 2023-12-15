const express = require("express");
const mongoose = require("mongoose");
const expressSession = require("express-session");

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const loginRouter = require("./routes/login");
const examinerRouter = require("./routes/examiner");

const app = express();

const PORT = 3000;

// cloud connection string
mongoose.connect(
  "mongodb+srv://amaxmg:12345@cluster0.ftiej9m.mongodb.net/?retryWrites=true&w=majority"
);


const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => console.log("Connected to db successfully."));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  expressSession({
    resave: true,
    saveUninitialized: true,
    secret: "secretkey",
  })
);

global.loggedIn = null;

app.use("*", (req, res, next) => {
  loggedIn = req.session.userType;
  next();
});

app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", examinerRouter);
app.use("/", loginRouter);
app.get("*", (req, res) => {
  res.render("notfound");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
  console.log(`http://localhost:${port}`);
});
