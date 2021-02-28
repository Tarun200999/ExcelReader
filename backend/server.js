const mysql = require("mysql");
const fs = require("fs");
const multer = require("multer");
const express = require("express");
const readXlsxFile = require("read-excel-file/node");
const app = express();
global.__basedir = __dirname;

//MULTER IS USE TO UPLOAD FILE IN TO YOUR SERVER WHICH IS COMMING
///FROM THE CLIENT SIDE

//THIS IS THE BIOLERPLATE CODE FOR DOING SOO
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "$" + Date.now() + ".xlsx");
  },
});

const upload = multer({ storage: storage });
//This instance will be used to store file in
//our server coming from client side

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@Tarun7782",
  database: "mydatabase",
  insecureAuth: true,
});

connection.connect((error) => {
  if (error) {
    console.log("Database is not connected");
  } else {
    console.log("Database is connected succesfully");
  }
});

app.get("/check", (req, res) => {
  res.json({ message: "app is working fine" });
});

app.delete("/delete/:tablename", (req, res) => {
  const table = req.params.tablename;
  console.log("table name on delete", table);
  const path = __basedir + "/uploads/" + table + ".xlsx";
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("deleted succesfully");
    }
  });
  var sql = `DROP TABLE ${table}`;
  connection.query(sql, (error, result) => {
    if (error) {
      return res.json({ error: "error while deleting" });
    }
    res.json({ message: "Deleted succesfully Now Choose Another one" });
  });
});
app.get("/showtable/:tablename", (req, res) => {
  const table = req.params.tablename;
  console.log("get the of tabnlr", table);
  var sql = `SELECT * FROM ${table}`;
  connection.query(sql, (error, result) => {
    if (error) {
      return res.json({ error: error });
    }
    res.json(result);
  });
});
app.post("/uploadfile", upload.single("uploadfile"), (req, res) => {
  console.log("something is uploaded", req.file);
  const excelfile = __basedir + "/uploads/" + req.file.filename; //uploaded file
  readXlsxFile(excelfile).then((rows) => {
    if (rows.length < 2) {
      return res.json({
        error:
          "Your excel must have 2 row with one with coloum label and second with data",
      });
    }
    rows.shift();
    var tablename = "";
    for (var i = 0; i < req.file.filename.length; i++) {
      if (req.file.filename[i] == ".") break;
      else {
        tablename += req.file.filename[i];
      }
    }
    console.log("table name while creating ", tablename);
    var sql = `CREATE TABLE  ${tablename} (Name VARCHAR(255), Roll_no VARCHAR(255),Class INT)`;

    connection.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        return res.json({ error: "Error while creating table in database" });
      }

      var query = `INSERT INTO ${tablename} (Name,Roll_no,Class) VALUES ?`;

      connection.query(query, [rows], (error, result) => {
        if (error) {
          return res.json({ error: "Error while insert data in database" });
        }
        res.json({
          message: "table is inserted succesfully",
          tablename: tablename,
        });
      });
    });
  });
});

let server = app.listen(8080, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("App listening at http://%s:%s", host, port);
});
