import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from 'cors';
const app = express();
import bodyparser from "body-parser";
import urlExists from 'url-exists-nodejs'

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.use(bodyparser.urlencoded({extended: true}))

let urlArray = new Array("0 index ignored")

app.post("/api/shorturl/", async (req,res) => {
  let url = req.body.url;
  
  const exists = await urlExists(url);// check if it exists
  if(!exists) return res.json({error: 'invalid url'});

  let i = urlArray.findIndex((element) => element===url);
  if(i != -1){
    res.json({"original_url ": url,"short_url" : i})
  } else {
    urlArray.push(url);
    res.json({"original_url ": url,"short_url" : urlArray.length - 1})
  }
})

app.get("/api/shorturl/:shorturl", (req,res)=>{
  res.redirect(urlArray.at(parseInt(req.params.shorturl)))
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
