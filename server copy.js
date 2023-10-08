import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(`public`))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})


const upload = multer({
    storage: storage
})

app.post("/upload", upload.single('image'), (req, res) => {
    const image = req.file.filename;
    const sql = `INSERT INTO users (name, image) VALUES ('test', '${image}')`;
    db.query(sql, (err, result) => {
        if(err) return res.json({message: "Error"});
        return res.json({status: "Success"});
    })
})

app.get("/", (req, res) => {

    const sql = 'SELECT * FROM users';
    db.query(sql, (err, result) => {
        if(err) return res.json("Error");
        return res.json(result);
    })
})


app.listen(8000, () => {
    console.log("Running on port 8000");
})