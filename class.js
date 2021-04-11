const pup = require("puppeteer");
const fs = require("fs");
let emailid = "hytheretemp@gmail.com";
let password = "tempemail@123";
let tab;
let classnames = [];
let classlink = [];
let onlyassign = [];
let assignLink = [];
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
            return console.log(classlink);
        }).then(function () {
            if (currentfile.length > 0) {
                let filet = currentfile[0];
                let filenamet = filet.split("-");
                let filepatht = "./files/" + filet;
                let subnamet = filenamet[0];
                let promiseUpload;
                if (classnames.includes(subnamet)) {
                    let link = classlink[classnames.indexOf(subname)];
                    promiseUpload = uploaded(filenamet,filepatht,link);
                }  
                for (let i = 1; i < currentfile.length; i++) {
                    let file = currentfile[i];
                    let filename = file.split("-");
                    let filepath = "./files/" + file;
                    let subname = filename[0];
                    if (classnames.includes(subname)) {
                        let link = classlink[classnames.indexOf(subname)];
                        promiseUpload = promiseUpload.then(function(){
                            return uploaded(filename,filepath,link);
                        })
                    }  
                }
            }
        })
    })
};

function uploaded(filename, filepath, link) {
    return new Promise(function (resolve, reject) {
        tab.goto(link).then(function () {
            let waitforass = tab.waitForSelector(".hrUpcomingAssignmentGroup a");
            return waitforass;
        }).then(function () {
            let assPromise = tab.$$(".hrUpcomingAssignmentGroup a");
            return assPromise;
        }).then(function (data) {
            let assign = [];
            for (let i of data) {
                let temp = tab.evaluate(function (ele) {
                    return ele.innerHTML;
                }, i);
                assign.push(temp);
            }
            return Promise.all(assign);
        }).then(function (data) {
            for (let i of data) {
                let divide = i.split(" ");
                onlyassign.push(divide[3]);
            }
            return onlyassign;
        }).then(function (data) {
            let waitforasslink = tab.$$(".hrUpcomingAssignmentGroup a");
            return waitforasslink;
        }).then(function (data) {
            let temparr = [];
            for (let i of data) {
                let temp = tab.evaluate(function (ele) {
                    return ele.href;
                }, i);
                temparr.push(temp);
            }
            return Promise.all(temparr);
        }).then(function (data) {
            assignLink = data;
            let l;
            if (onlyassign.includes(filename[1])) {
                l = assignLink[onlyassign.indexOf(filename[1])];
            }
            let assigntab = tab.goto(l);
            return assigntab;
        }).then(function () {
            let waittemp = tab.waitForNavigation({ waitUntil: "networkidle2" });
            return waittemp;
        }).then(function () {
            let waitclickbtn = tab.waitForSelector(".U26fgb.REtOWc.cd29Sd.p0oLxb.BEAGS.CG2qQ.bVp04e", { visible: true });
            return waitclickbtn;
        }).then(function (clickbtnfind) {
            let clickbtn = tab.click(".U26fgb.REtOWc.cd29Sd.p0oLxb.BEAGS.CG2qQ.bVp04e");
            return clickbtn;
        }).then(function () {
            let inputfilepromise = tab.$("input[type=file]");
            return inputfilepromise;
        }).then(function (inputfilepromise) {
            let uf = inputfilepromise.uploadFile(filepath);
            return uf;
        })
    })
};
// let str = "Operating system-Assignment";
// let arr = str.split("-");
// uploadfile(arr,"./files/waste.js");
uploadfile();