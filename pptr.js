const puppeteer = require('puppeteer-core');
const fs = require('fs');
const cheerio = require('cheerio');
// const Promise = require('promise');

url = 'https://manhua.dmzj.com/yongzhecizhibuganle/76257.shtml';

async function main(){
	const browser = await puppeteer.launch({executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'});
	console.log("Chrome browser started");
	const page = await browser.newPage();
	console.log("New tab created");

	try{
		option = {
			"timeout":0
		}
		const resp = await page.goto(url, option);
		console.log("Page loaded");
		if(resp.ok()){

			console.log("Evaluating comic pages...");
			var comicName = page.evaluate(() => g_comic_name);
			var comicChapter = page.evaluate(() => g_chapter_name);
			var comicPages = page.evaluate(() => pages);

			// comicDtl = await Promise.all([comicName, comicChapter, comicPages]);
			comicDtl = await page.evaluate(() => {return {'cname':g_comic_name, 'cchapter':g_chapter_name, 'clinks':pages}});

			DownloadComic(comicDtl);
			
			// console.log(comicPages);
		} else {
			console.error(resp.status(), resp.statusText());
		}
	} catch(err) {
		console.error(err);
	}
	
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

async function DownloadComic(comicDetails){
	const imgSrcDomain = 'https://images.dmzj.com/';
	const comicName = comicDetails['cname'];
	const comicChapter = comicDetails['cchapter'];
	const comicPages = comicDetails['clinks'];

	// console.log(comicName, comicChapter, comicPages);
	const urlFD = await OpenFile(comicName+comicChapter+'.txt');
	
	// await fs.open('./'+comicName+comicChapter+'.txt', 'w', async (err, fd) => {

	console.log(typeof(urlFD));
	comicPages.forEach(element => {
		
	});
}

function OpenFile(fileName){
	// https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
	return new Promise((resolve, reject) => {
		fs.open('./'+fileName, 'w', (err,fd) => {
			if (err) return reject(err);
			else return resolve(fd);
		});
	});
}

function ParseImageSrcUrl(document){
	const $ = document;

}

main(url);