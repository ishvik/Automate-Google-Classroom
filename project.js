require("chromedriver");

let wd = require("selenium-webdriver");
let fs = require("fs");
let browser = new wd.Builder().forBrowser('chrome').build();
const path = "./files/";

let emailid = "hytheretemp@gmail.com";
let password = "tempemail@123";
let visitedfiles = [];   //this array contains all files which are uploaded on classroom
let currentfile = [];    //this array contains all new files  
let allsubject = {};       
try {
    const files = fs.readdirSync(path);   //getting all files synchrounously
    files.forEach(file => {
        if (!visitedfiles.includes(file)) {
            currentfile.push(file);       //if there is new file then that file add in currentfile
        }
    });

} catch (err) {
    console.log(err);
    return;                     //if there is any error then it prints and returns the function
}

async function uploadfiles() {
    await browser.get("https://accounts.google.com/signin/v2/identifier?service=classroom&continue=https%3A%2F%2Fclassroom.google.com%2F&ec=GAlAiQI&flowName=GlifWebSignIn&flowEntry=AddSession");
    let typeid = await browser.findElement(wd.By.css("#identifierId"));
    typeid.sendKeys(emailid);
    let idbutton = await browser.findElement(wd.By.css(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b"));
    idbutton.click();
    await browser.wait(wd.until.elementLocated(wd.By.css(".rFrNMe.ze9ebf.YKooDc.q9Nsuf.zKHdkd.sdJrJc")));
    let typepass = await browser.findElement(wd.By.css(".rFrNMe.ze9ebf.YKooDc.q9Nsuf.zKHdkd.sdJrJc"));
    await typepass.sendKeys(password);
}
uploadfiles();