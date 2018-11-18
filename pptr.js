const puppeteer = require('puppeteer-core');
const fs = require('fs');
const cheerio = require('cheerio');

url = 'https://manhua.dmzj.com/yongzhecizhibuganle/76257.shtml';

async function main(){
	const browser = await puppeteer.launch({executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'});
	console.log("Chrome browser started");
	const page = await browser.newPage();
	console.log("New tab created");

	const resp = await page.goto(url);
	console.log("Page loaded");
	console.log(resp.status(), resp.statusText());
	
	// page.once('domcontentloaded')
/* 	resp.then(() =>{
		if resp.
	}) */

/* 		.then(() => {return page.content()})
		.catch((err) => {console.log(err)}); */
	






/* 	fs.writeFile('./output.html', content, (err) => {
	if(err){
	    console.log('Error occured during saving output to file');
	}
	else{
	    console.log('File saved to %s/output.html', __dirname);
	}}); */

	// page.content();
	// await page.screenshot({path: 'example.png'});

	await browser.close();
	console.log("Browser closed");
};

function parseImageSrcUrl(document){
	const $ = document;

}

main(url);