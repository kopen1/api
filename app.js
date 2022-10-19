import komik from "./Api/komik.js"
import express from "express"
import fs from "fs"
const ap =  express();

ap.use(express.static("./public"))
ap.use("/komik",komik)
ap.use("*",(req,res) =>{
res.writeHead(200,{"Content-Type":"text/html"});
fs.createReadStream("./public/index.html","UTF-8").pipe(res);
})

ap.listen(8080, ()=>{
  console.log(" Starting....")
})