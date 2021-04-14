const pup = require("puppeteer");
const fs = require("fs");
let emailid = "hytheretemp@gmail.com";
let password = "tempemail@123";
let tab;
let classnames = [];
let classlink = [];
let browserPromise = pup.launch({
    headless: false,
    defaultViewport: false
})

const path = "./files/";


let visitedfiles = [];   //this array contains all files which are uploaded on classroom
let currentfile = [];    //this array contains all new files  
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

function uploadfile() {
    return new Promise(function (resolve, reject) {
        browserPromise.then(function (browser) {
            let pagesPromise = browser.pages(); //returning an arraylist of pages
            return pagesPromise;
        }).then(function (pages) {
            tab = pages[0];
            let pagereturnpromise = tab.goto("https://accounts.google.com/signin/v2/identifier?service=classroom&continue=https%3A%2F%2Fclassroom.google.com%2F&ec=GAlAiQI&flowName=GlifWebSignIn&flowEntry=AddSession"); //going to login page of hackerrank
            return pagereturnpromise;
        }).then(function () {
            let typeidPromise = tab.type("#identifierId", emailid);
            return typeidPromise;
        }).then(function () {
            let buttonidpromise = tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
            return buttonidpromise;
        }).then(function () {
            let waitpassPromise = tab.waitForSelector("input[type='password']", { visible: true });
            return waitpassPromise;
        }).then(function () {
            let typepassPromise = tab.type("input[type='password']", password);
            return typepassPromise;
        }).then(function () {
            let buttonpassPromise = tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
            return buttonpassPromise;
        }).then(function () {
            let waithomePromise = tab.waitForSelector(".JwPp0e li", { visible: true });
            return waithomePromise;
        }).then(function () {
            let allclasses = tab.$$(".JwPp0e li h2 a div");
            return allclasses;
        }).then(function (data) {
            let temp = [];
            for (let i = 0; i < data.length; i++) {
                if (i % 2 == 0) {
                    let className = tab.evaluate(function (ele) {
                        return ele.textContent;
                    }, data[i]);
                    temp.push(className);
                }
            }
            return Promise.all(temp);
        }).then(function (data) {
            for (let i of data) {
                classnames.push(i);
            }
        }).then(function () {
            let allclasslink = tab.$$(".JwPp0e li h2 a");
            return allclasslink;
        }).then(function (data) {
            let temp = [];
            for (let i = 0; i < data.length; i++) {
                if (i % 2 != 0) {
                    let cl = tab.evaluate(function (ele) {
                        return ele.href;
                    }, data[i]);
                    temp.push(cl);
                }
            }
            return Promise.all(temp);
        }).then(function (data) {
            for (let i of data) {
                classlink.push(i);
            }
        }).then(function () {
            let link;
            if (currentfile.length > 0) {
                let filestrt = currentfile[0].split("-");
                let subnamet = filestrt[0];
                let filepatht = "./files"+filestrt[1];
                let submitass;
                if (classnames.includes(subnamet)) {
                    linkt = classlink[classnames.indexOf(subnamet)];
                    console.log(linkt);
                    submitassPromise = uploaded(filestrt,filepatht,linkt);
                }
                
                for (let i = 1; i < currentfile.length; i++) {
                    let filestr = currentfile[i].split("-");
                    let subname = filestr[0];
                    // console.log(subname);
                    // console.log(classnames);
                    // console.log(classlink);
                    if (classnames.includes(subname)) {
                        link = classlink[classnames.indexOf(subname)];
                        let fp = "./files"+filestr[1];
                        // submitassPromise = submitassPromise.then(function(){
                        //     return uploaded(filestr,fp,link)
                        // })
                        //console.log(link);
                        // visitedfiles.push(currentfile[i]);
                        // delete currentfile[i];
                        console.log(link);
                    } else {
                        console.log("null");
                    }
                }
            }
            console.log(currentfile);
            console.log(visitedfiles);
        })
    })
};


function uploaded(filename, filepath, link) {
    let assignName = [];
    let assignLink = []; 
    return new Promise(function (resolve, reject) {
        tab.goto(link).then(function () {
            let waitforAssignPromise = tab.waitForSelector(".lziZub.tLDEHd h2 span");
            return waitforAssignPromise;
        }).then(function(){
            let assignNamePromise = tab.$$(".lziZub.tLDEHd h2 span");
            return assignNamePromise;
        }).then(function(data){
            let temp = [];
            for (let i = 0; i < data.length; i++) {
                let cl = tab.evaluate(function (ele) {
                    return ele.textContent;
                }, data[i]);
                    temp.push(cl);
            }
            return Promise.all(temp);
        }).then(function(data){
            for(let i=0;i<data.length;i++){
                let assname = data[i].split(":");
                assignName.push(assname[1]);
            }
            return console.log(assignName);
        }).then(function(){
            let assigLinkPromise = tab.$$(".Zzplvb");
            return assigLinkPromise;
        }).then(function(data){
            assignLink = data;
        }).then(function(){
            let t = filename[1];
            let splitt = t.split(".");
            let Filename = splitt[0]; //"Assignment" Assignment
            let temp = " "+'"'+Filename+'"';
            if(assignName.includes(temp)){
                let link = assignLink[assignName.indexOf(temp)];
                tab.click(link);
            }
            return console.log(temp);
        })
    })
};

// let str = "Operating system-Assignment";
// let arr = str.split("-");
// uploadfile(arr,"./files/waste.js");
uploadfile();
