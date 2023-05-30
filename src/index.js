const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const multer = require("multer");
const { uuid } = require("uuidv4");
const cors = require("cors");
const initializePassport = require("./controllers/Passport/passport.js");
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname));
  },
  destination: path.join(__dirname, "../public/uploads"),
});
app.use(cors());
app.use("/assets", express.static("public"));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  multer({
    storage,
    dest: path.join(__dirname, "../public/uploads"),
    limits: { fieldSize: 5000000 },
    fileFilter: (req, file, cb) => {
      const filetypes = /jpg|jpeg|png/;
      const mimetype = filetypes.test(file.mimetype);
      const exname = filetypes.test(path.extname(file.originalname));
      if (mimetype && exname) {
        return cb(null, true);
      }
      cb("Error: Archivo debe ser una imagen valida");
    },
  }).single("image")
);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
initializePassport(passport);
const Admin = require("./routes/Admin.routes.js");
app.use(Admin);
const index = require("./routes/Index.routes.js");
app.use(index);
const user = require("./routes/user.routes.js");
app.use(user);
const admreq = require("./routes/admreq.routes.js");
app.use(admreq);
app.listen(3200);
