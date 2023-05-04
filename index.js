const captcha = require("./captcha");
const express = require("express");
const app = express();
var tobematched=''
const bodyParser=require('body-parser')
const multer=require('multer')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//app.use(express.bodyParser())
app.use(express.json());

// Human checkable test path, returns image for browser
app.get("/test/:width?/:height?/", (req, res) => {
  const width = parseInt(req.params.width) || 200;
  const height = parseInt(req.params.height) || 100;
  const { image,text } = captcha(width, height);
  console.log(text)
  tobematched=text
  //res.setHeader('Content-type','text/html')
  res.send(`<html><body><img class="generated-captcha" src="${image}">
  <form method="POST" action="/test/next" enctype="multipart/form-data">
  <input id="captcha" type="text" name="captcha" placeholder="captcha">
  <button type="submit">send</button>
  </form></body></html>`);
});

app.post("/test/next",multer().any(),(req,res)=>{
    console.log(req.body.captcha)
    if(tobematched==req.body.captcha){
        res.send('yes')
    }
    else{
        res.send('nope')
    }
})
// Captcha generation, returns PNG data URL and validation text
app.get("/captcha/:width?/:height?/", (req, res) => {
  const width = parseInt(req.params.width) || 200;
  const height = parseInt(req.params.height) || 100;
  const { image, text } = captcha(width, height);
  res.send({ image, text });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`captcha-api listening on ${port}!`));