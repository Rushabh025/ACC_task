// express is used for routing or creating server
const express = require("express");
const app = express();
// to get path 
const path = require("path");
const port = process.env.PORT || 4000;

// importing local files
require("./db/con");
const Register = require("./models/registers");
const static_path = path.join(__dirname, "../public");

// middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");

// Get APi
app.get("/", (req, res) => {
  res.render("index");
});

 
// Post APi
app.post("/", async (req, res) => {
  try {
    const password = req.body.password;
    const rePassword = req.body.repassword;
    let flag = 0;
    if (password === rePassword) {
      await Register.findOne({ email: req.body.email }, function (err, docs) {

        if (err) {
          console.log(err);
        } else {

          if (docs && docs.email == req.body.email) {

          flag = 1;
            res.end("email already registered");
          }
        }
      });

      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        repassword: req.body.repassword,
      });
      if (flag == 0) {
        const registered = await registerEmployee.save();
        res.send("user registered successfully");
      }
      flag = 0;
    } else {
      res.send("pass error");
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`sever started at ${port}`);
});
