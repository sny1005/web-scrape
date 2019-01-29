const fs = require('fs');
const request = require('request');
const puppeteer = require('puppeteer-core');
var pretty = require('pretty');

// The URL we will scrape from - in our example Anchorman 2.

targetURL = 'http://www.dm5.com/m514236/';

// The structure of our request call
// The first parameter is our URL
// The callback function takes 3 parameters, an error, response status code and the html

async function main(){
    request(targetURL).pipe(fs.createWriteStream('./plain.html'));
    
	const browser = await puppeteer.launch({executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'});
	console.log("Chrome browser started");
	const page = await browser.newPage();
	console.log("New tab created");

	try{
		option = {
			"timeout":0
		}
		const resp = await page.goto(targetURL, option);
		console.log("Page loaded");
		if(resp.ok()){
            // console.log(resp);
            // resp.pipe(fs.createWriteStream('./full.html'));
            fs.writeFile('./full.html', pretty(await page.content()))

		} else {
			console.error(resp.status(), resp.statusText());
		}
	} catch(err) {
		console.error(err);
    }

    process.exit()
}
    
main();