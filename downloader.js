const puppeteer = require('puppeteer-core');
const fs = require('fs');
const request = require('request-promise-native');
const tcookie = require('tough-cookie');
const url = require('url');

targetURL = 'https://manhua.dmzj.com/yongzhecizhibuganle/76257.shtml';

async function main(){
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
			console.log("Evaluating comic pages...");
			const imgSrcDomain = 'https://images.dmzj.com/';

			// comicDtl = await Promise.all([comicName, comicChapter, comicPages]);
			comicDtl = await page.evaluate(() => {return {
				'cname':g_comic_name,
				'cchapter':g_chapter_name,
				'clinks':JSON.parse(pages)
			}});
			comicDtl['clinks'] = comicDtl['clinks'].map(page => imgSrcDomain+page);
			comicDtl['cookies'] = await page.cookies();
			PrepareDownload(comicDtl);
			DownloadEpisode(comicDtl);
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

function PrepareDownload(comicDetails){
	const comicName = comicDetails['cname'];
	const comicChapter = comicDetails['cchapter'];
	const comicPages = comicDetails['clinks'];

	let episodeFolder = './'+comicName+'/'+comicChapter;
	// Create comic episode folder
	MakeDirRecursive(episodeFolder);
	console.log('Directory '+episodeFolder+' created');

	// Output evaluated comic page URLs to file
	const urlWS = fs.createWriteStream(episodeFolder+'/'+comicName+comicChapter+'.txt');
	// console.log('URL Write stream created');
	WriteArrayToStream(urlWS, comicPages);
	// console.log('URL Write to stream submitted');
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

async function WriteChunkToStream(stream, chunk){
	let ready = true;
	while(ready){
		ready = stream.write(chunk);
	}
}

async function MakeDirRecursive(fullPath){
	folders = fullPath.split('/');
	// console.log(folders);
	for(let i=0; i<folders.length; i++){
		let path = folders.slice(0,i+1).join('/');
		if (!fs.existsSync(path)){
			console.log('Creating '+path);
			fs.mkdir(path).catch(err => console.error(err));
		}
		else console.log(path+' already exist');
	}
}

function DownloadEpisode(comicDetails){
	let episodeFolder = './'+comicDetails.cname+'/'+comicDetails.cchapter;
	
	// Prepare request
	let cookies = comicDetails.cookies;
	let j = new request.jar();
	const origin = (new url.URL(targetURL)).origin;
	for(let i=0; i<cookies.length; i++){
		let tCookie = tcookie.Cookie.fromJSON(cookies[i]);
		tCookie.key = cookies[i].name;
		// console.log(tCookie);
		j.setCookie(tCookie, origin, (err, cookie) => {
			if(err) throw err;
		});
		// console.log(j);
	}

	let comicPages = comicDetails.clinks;
	for (let i=0; i<comicPages.length; i++){
		const thisPage = comicPages[i];
		// console.log(thisPage);
		// console.log((new url.URL(thisPage).pathname.split('/').pop()));
		request.get({
			url: thisPage,
			jar: j,
			headers: {referer: targetURL}
		})
		.on('response', res => console.log('received response with status: '+res.statusCode+' from '+thisPage))
		.on('error', err => {
			console.error(err);
			throw err;
		})
/* 		.then(res => {
			console.log('received response with status: '+res.statusCode+' from '+thisPage);
		})
		.catch(err => {
			console.error(err);
			throw err;
		}) */
		.pipe(fs.createWriteStream(episodeFolder+'/'+(new url.URL(thisPage).pathname.split('/').pop())))
	};

/* 	let req = request.get({
		url: comicPages[0],
		jar: j,
		headers: {referer: targetURL}
	});
	req.pipe */

	// await fs.open('./'+comicName+comicChapter+'.txt', 'w', async (err, fd) => {
/* 	comicPages.forEach(element => {
		
	}); */
}

async function DownloadOnePage(){

}

main(targetURL);