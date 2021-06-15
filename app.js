const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = { //refer to mailchip website
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data); //mailchip accepts data in the form of a string

  const url = "https://us4.api.mailchimp.com/3.0/lists/0818d515fb" //list Id

  const options = {
    method: "POST",
    auth: "<api-key>" //api key
  }

  //we use https.request instead of https.get because we want to post our data in the external server instead of receiving data from the external server.
  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    // response.on("data", function(data) { //these 2 lines of code are not necessary
    //   console.log(JSON.parse(data));
    // });
  })

  request.write(jsonData); //sending our jsonData to the external server
  request.end(); //sending our jsonData to the external server

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() { //Our program will run both on heroku and port 3000
  console.log("server is running on port 3000");
});

//API Key from mailchip
//35862d1efe3781e97250fcb423733eae-us4

//List Id from mailchip
//0818d515fb
