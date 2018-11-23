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
			const comicName = page.evaluate(() => g_comic_name);
			const comicChapter = page.evaluate(() => g_chapter_name);
			const comicPages = page.evaluate(() => pages);
			const imgSrcDomain = 'https://images.dmzj.com/';

			// comicDtl = await Promise.all([comicName, comicChapter, comicPages]);
			comicDtl = await page.evaluate(() => {return {
				'cname':g_comic_name,
				'cchapter':g_chapter_name,
				'clinks':JSON.parse(pages)
			}});
			comicDtl['clinks'] = comicDtl['clinks'].map(page => imgSrcDomain+page);
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

	// console.log(comicPages);
	const urlWS = fs.createWriteStream('./'+comicName+comicChapter+'.txt');
	WriteStringArrayToStream(urlWS, comicPages).catch(err => console.error(err))
	// urlWS.write();
	
	
	
	// await fs.open('./'+comicName+comicChapter+'.txt', 'w', async (err, fd) => {
/* 	comicPages.forEach(element => {
		
	}); */
}

function OpenWriterbleStream(fileName){
	// https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
	return new Promise((resolve, reject) => {
		fs.createWriteStream('./'+fileName, 'w', (err,fd) => {
			if (err) return reject(err);
			else return resolve(fd);
		});
	});
}

function WriteStringArrayToStream(stream, data){
	return new Promise((resolve, reject) => {
		try{
			for(let i=0; i<data.length; i++){
				// console.log(data[i]);
				stream.write(data[i]+'\n');
			}
		} catch(err) {
			return reject(err);
		}
		return resolve("0");
	})
}

function ParseImageSrcUrl(document){
	const $ = document;

}

main(url);