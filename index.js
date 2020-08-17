const puppeteer = require('puppeteer'); //node env
var stringify = require('csv-stringify');
var fs = require('file-system');

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // change to false to see the process
        //slowMo: 500, // to slowdown the process
    });
    const page = await browser.newPage();
        await page.setViewport({
            width: 1000,
            height: 1000,
            deviceScaleFactor:1,
        })
        // to go to specific page
        await page.goto("https://www.imdb.com/chart/top/?ref_=nv_mv_250");

        // to go to selection page
        // await page.select("select#lister-sort-by-options","us:descending",);
        const elementHandle = await page.$("input#suggestion-search")

        // to get info using HTML DOM
        const data = await page.evaluate(() => {
            let title = Array.from(document.querySelectorAll("tbody.lister-list tr td.titleColumn a")).map((list) => list.innerText);

            let year = Array.from(document.querySelectorAll("tbody.lister-list tr td.titleColumn span")).map((list) => list.innerText);

            let poster = Array.from(document.querySelectorAll("tbody.lister-list tr td.posterColumn a img")).map((list) => list.src);

            let rating = Array.from(document.querySelectorAll("tbody.lister-list tr td.ratingColumn strong")).map((list) => list.innerHTML);

            const movies = Array.from(
                document.querySelectorAll("tbody.lister-list tr")
            ).map((list) => ({
                title:list.querySelector("td.titleColumn a").innerText,
                poster:list.querySelector("td.posterColumn a img").src,
                year:list.querySelector("td.titleColumn span").innerText,
                rating:list.querySelector("td.ratingColumn strong").innerHTML
            }))

            return movies;
        })
        //await page.screenshot({path: 'images/example1.png'});

        console.log("list", data);
        stringify(data, function(err, output){
            fs.writeFile("file/movie.csv", output, "utf8", function(err){
                if (err){
                    console.log(
                        "Error - file cannot be saved"
                    )
                } else {
                    console.log("It's saved");
                }
            })
        });

    await browser.close();
})();