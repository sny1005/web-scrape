var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

app.get('/', function(req, res){

    // The URL we will scrape from - in our example Anchorman 2.

    url = 'https://manhua.dmzj.com/yongzhecizhibuganle/76257.shtml';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
/*
            var $ = cheerio.load(html);

            fs.writeFile('./output.html', $.html(), (err) => {
                if(err){
                    console.log('Error occured during saving output to file');
                    res.send("Error!");
                }
                else{
                    console.log('File saved to %s/output', __dirname);
                    res.send("Success!");
                }
            })
            //res.send($.html());
*/
            var options = {resources: "usable",
                runScripts: "dangerously"
//                runScripts: "outside-only"
            }
            JSDOM.fromURL(url, options).then(dom => {
                //console.log(dom.serialize());
                console.log(dom.window.document.pages);
            });
        }
    })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
