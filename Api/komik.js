import cheerio from "cheerio"
import axios from "axios"
import express from "express"

const komik = express();
const base = "https://komiku.id";
const local = process.env.HOSTNAME || "http://localhost:8080/komik";



//filter
komik.get("/filter/:id",async(req,res) => {
const filter = req.params.id;
axios.get(base+'/daftar-komik/?tipe='+filter).then((e) => {
const $ = cheerio.load(e.data)
let data = [];
$(".ls12 .ls4").each((i,v) =>{
let title = $(v).find("h4").text();
let url = local+$(v).find("a").attr("href").replace("/manga/","/detail/");
let img = $(v).find("img").attr("data-src");
data.push({title,url,img})
});
let all = $('.ls12 .ls4 h4').length;
return res.send({
  "allpage" : all,
  data});
})
})
//cari
komik.get("/cari/:id",async(req,res) => {
const filter = req.params.id;
axios.get(`https://data.komiku.id/cari/?post_type=manga&s=`+filter).then((e) => {
const $ = cheerio.load(e.data)
let data = [];
$(".daftar").find(".bge").each((i,v) =>{
let url = local + "/detail/"+$(v).find("a").attr("href").split("/manga/")[1];
let title = $(v).find("h3").text().trim();
let des = $(v).find("p").text().trim();
let img = $(v).find("img").attr("data-src");

data.push({title,url,img,des})
});
let all = $('.daftar img').length;
return res.send({
  "search" : filter,
  "pencarian" : all,
  data});
})
})
// Detail 
komik.get("/detail/:id",async(req,res) =>{
const bas = base + "/manga/"+req.params.id;
axios.get(bas).then((e) => {
const $ = cheerio.load(e.data)
const img = $(".ims").find("img").attr("src");
const judul = $("#Judul").find("h1").text().trim();
const description = $(".desc").text().trim();
let data = [];
let xx = $(".judulseries > a");
xx.each((i,v) =>{
let url = local+$(v).attr("href");
data.push({url})
})
return res.send({
  status: 200,
  judul,img,description,
  chapter : data})
})
})
// chapter
komik.get("/ch/:id",async(req,res) =>{
  try{
const url = base+"/ch/"+req.params.id;
axios.get(url)
.then((e) =>{
const $ = cheerio.load(e.data)
let data = [];
$("#Baca_Komik > img").each((i,v) =>{
let img = $(v).attr("src").replace("cdn.komiku.co.id","img.komiku.id");
let no = $(v).attr("id");
data.push(img)
})
return res.send(data)
})
}catch(error){
 console.log(error) 
return res.send(error) 
}

})
/*
komik.get("/ch/:id",async(req,res) =>{
const url = base+"/ch/"+req.params.id;
axios.get(url)
.then((e) =>{
const $ = cheerio.load(e.data)
let data = [];
$("#Baca_Komik > img").each((i,v) =>{
let img = $(v).attr("src").replace("cdn.komiku.co.id","img.komiku.id");
let no = $(v).attr("id");
data.push(img)
})
res.send(data)
})
})
*/
komik.use("*",(req,res) =>{
     res.send({
    api: `KOMIK | v1`,
    status : 200,
    filter : [{
      manga : "/filter/manga",
      manhwa : "/filter/manhwa",
      manhua : "/filter/manhua"
     }],
    detail : '/detailt/url_judul',
    pencarian : '/cari/(input nama komik)',
    chapter : "/ch/url_chapter",
  })
})


export default komik;
