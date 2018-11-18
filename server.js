const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();
const puppeteer = require('puppeteer-core')

app.get('/', function(req, res){

    // The URL we will scrape from - in our example Anchorman 2.

    url = 'https://manhua.dmzj.com/yongzhecizhibuganle/76257.shtml';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    (async () => {
      const browser = await puppeteer.launch({executablePath: 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe -incognito'});
      const page = await browser.newPage();
      await page.goto(url);
      await page.screenshot({path: 'example.png'});

      await browser.close();
    })();

/*
    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request


        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality



            fs.writeFile('./output.html', jadom.serializeDocument(dom.window.document), (err) => {
            if(err){
                console.log('Error occured during saving output to file');
                res.send("Error!");
            }
            else{
                console.log('File saved to %s/output', __dirname);
                res.send("Success!");
            }});
        }
    })*/

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
