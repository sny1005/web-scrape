const puppeteer = require('puppeteer-core');
const fs = require('fs');
const request = require ('request');
const req_promise = require('request-promise-native');
const tcookie = require('tough-cookie');
const url = require('url');
const util = require('util');

var targetURL = 'https://www.dm5.com/m514236';

async function main(){
	const browser = await puppeteer.launch({
		executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
		/* ,headless: false */});
	console.log("Chrome browser started");

	// TODO: refactor into 1 DownloadChapter function to allow downloading the whole book up to latest chapter
    let comicInfo = undefined;
	const imageLinks = [];
    let results = await extractOnePage(browser, targetURL, true)
    imageLinks.push(results[0]);
	comicInfo = results[1];

	const preparation = PrepareDownload(comicInfo);

	// TODO: this can be speed-up by start downloading the image once the url is obtained
	const pageLinks = [];
	for (let i=2; i<=comicInfo.totPages; i++){
		let thisPage = util.format("%s-p%s", targetURL, i);
		pageLinks.push(extractOnePage(browser, thisPage));
	}

	results = await Promise.all(pageLinks);
	results.map(result => imageLinks.push(result[0]));

	await preparation;

	await DownloadChapter(comicInfo, imageLinks);

	await browser.close();
	console.log("Browser closed");
};

async function extractOnePage(browser, url, firstPage = false) {
    const option = {
		"timeout": 0
		,"waitUntil": "domcontentloaded"
    };
	const ppage = await browser.newPage();

	let imageLink = undefined;
	let title = undefined;
	let chapter = undefined;
	let totPages = undefined;
	let cookies = undefined;
    try {
        const resp = await ppage.goto(url, option);
        console.log(url +" loaded");
		
        if (resp.ok()) {
			console.log(util.format("Getting %s image link...", url));
			imageLink = ppage.$eval("#cp_image", elem => elem.src);

            if(firstPage){
                console.log("Getting comic title...");
				title = ppage.$eval("div.title span>a", elem => elem.innerHTML.trim());
				console.log("Getting comic episode...");
				chapter = ppage.$eval("div.title span.active", elem => elem.innerHTML.trim());
				console.log("Getting total number of pages...");
				totPages = ppage.$$eval(".chapterpager a", elems => parseInt(elems[elems.length-1].innerHTML.trim()));
				console.log("Getting cookies...");
				cookies = ppage.cookies();
            }            
        }
        else {
			console.error(resp.status(), resp.statusText());
			return undefined;
        }
    }
    catch (err) {
		console.error(err.stack);
		return undefined;
    }

	const result = await Promise.all([imageLink, title, chapter, totPages, cookies])
	await ppage.close();

	let comicInfo = {};
	comicInfo.title = result[1];
	comicInfo.chapter = result[2];
	comicInfo.totPages = result[3];
	comicInfo.cookies = result[4];

    return [result[0], comicInfo];
}

async function PrepareDownload(comicInfo){
	const comicTitle = comicInfo['title'];
	const comicChapter = comicInfo['chapter'];
	const comicPages = comicInfo['totPages'];

	let episodeFolder = './'+comicTitle+'/'+comicChapter;
	// Create comic episode folder
	await MakeDirRecursive(episodeFolder);
	console.log(`Directory ${episodeFolder} created`);

	// Output evaluated comic page URLs to file
	const urlWS = fs.createWriteStream(episodeFolder+'/'+comicTitle+comicChapter+'.txt');
	WriteArrayToStream(urlWS, comicPages);
}

async function MakeDirRecursive(fullPath){
	folders = fullPath.split('/');
	// console.log(folders);
	for(let i=0; i<folders.length; i++){
		let path = folders.slice(0,i+1).join('/');
		if (!fs.existsSync(path)){
			console.log('Creating '+path);
			fs.mkdirSync(path);
		}
		else console.log(path+' already exist');
	}
}

async function WriteArrayToStream(stream, arr){
	let ready = true,
		index = 0;
	while(index<arr.length && ready){
		try {
			ready = await stream.write(arr[index]+'\n');
			index++;
		} catch (error) {
			console.error(error);
		}
	};
	if(index<arr.length){
		console.log('Write stream buffer fulled...waiting buffer to drain');
		stream.once('drain', () => WriteArrayToStream(stream, arr.slice(index+1, arr.length)));
	}
}

async function DownloadChapter(comicInfo, imageLinks){
	let episodeFolder = './'+comicInfo.title+'/'+comicInfo.chapter;
	
	// Prepare request
	let cookies = comicInfo.cookies;
	let j = new req_promise.jar();
	const origin = (new url.URL(targetURL)).origin;
	for(let i=0; i<cookies.length; i++){
		let tCookie = tcookie.Cookie.fromJSON(cookies[i]);
		tCookie.key = cookies[i].name;
		j.setCookie(tCookie, origin, (err, cookie) => {
			if(err) throw err;
		});
	}

	let gets = [];
	for (let i=0; i<imageLinks.length; i++){
		// gets.push(DownloadPagePromise(imageLinks[i], j));
		gets.push(DownloadPagePipe(i+1, imageLinks[i], j, episodeFolder));
	};

	await Promise.all(gets)
		.then(console.log(`Chapter ${comicInfo.chapter} downloaded successfully!`))
		.catch(err => console.error(err.stack));
}

async function DownloadPagePromise(pageLink, tCookieJar){
	return req_promise.get({
		url: thisPage
		,jar: tCookieJar
		// ,headers: {referer: targetURL}
	});
}

async function DownloadPagePipe(pageNum, pageLink, tCookieJar, targetFolder) {
	return new Promise((resolve, reject) => {
		let ws = fs.createWriteStream(`${targetFolder}/${(""+pageNum).padStart(2, "0")}.jpg`)
			.on("close", () => {
				console.log(`Downloaded page ${pageNum} successfully!`);
				resolve();
			});

		request.get({
			url: pageLink
			,jar: tCookieJar
			,headers: {referer: targetURL}
		})
			.on('response', res => console.log('received response with status: '+res.statusCode+' from '+ pageLink))
			.on('error', err => reject(err))
			.pipe(ws);
	})
}

main(targetURL)
	.then(() => process.exit())
/* 	.catch(err => {
		console.error(err.stack)
		process.exit(255);
	}); */