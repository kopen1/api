import komik from "./Api/komik.js"
import express from "express"
import fs from "fs"
const ap =  express();
const port = process.env.PORT || 8080;



ap.use(express.static("./public"))
ap.use("/komik",komik)
ap.use("*",(req,res) =>{
res.writeHead(200,{"Content-Type":"text/html"});
fs.createReadStream("./public/index.html","UTF-8").pipe(res);
})

ap.listen(port, ()=>{
  console.log(" Starting....")
})
