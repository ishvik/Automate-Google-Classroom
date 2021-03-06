const pup = require("puppeteer");
const fs = require("fs");
const { resolve } = require("path");
// import path from 'path';
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


let visitedfiles = fs.readFileSync("visitedfiles.txt", "utf-8").split(" ");   //this array contains all files which are uploaded on classroom
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

//uploads only new files from Files folder to your google classroom
browserPromise.then(function (browser) {
    let pagesPromise = browser.pages(); //returning an arraylist of pages
    return pagesPromise;
}).then(function (pages) {
    tab = pages[0];
    let pagereturnpromise = tab.goto("https://accounts.google.com/signin/v2/identifier?service=classroom&continue=https%3A%2F%2Fclassroom.google.com%2F&ec=GAlAiQI&flowName=GlifWebSignIn&flowEntry=AddSession"); //going to login page of hackerrank
    return pagereturnpromise;
}).then(function () {
    let typeidPromise = tab.type("#identifierId", emailid); //typing email id to email id column
    return typeidPromise;
}).then(function () {
    let buttonidpromise = tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");
    return buttonidpromise;
}).then(function () {
    let waitpassPromise = tab.waitForSelector("input[type='password']", { visible: true });
    return waitpassPromise;
}).then(function () {
    let typepassPromise = tab.type("input[type='password']", password); //typing password to password column
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
        let file1stname = i.split(" ");
        classnames.push(file1stname[0]);  //storing all classes name to classnames array
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
        classlink.push(i);  //storing all classes link to classlink array
    }

}).then(function () {
    let link;
    if (currentfile.length > 0) {
        let filestrt = currentfile[0].split("_"); //splitting files with "-" [Compiler-Design-Assignment 2.js] -> ["Compiler","Design","Assignment 2.js"]
        let subnamet = filestrt[0];
        let filepatht = "/web_dev/Project-G-classroom/files/" + currentfile[0];
        let submitassPromise;
        if (classnames.includes(subnamet)) {
            linkt = classlink[classnames.indexOf(subnamet)];
            submitassPromise = uploaded(filestrt, filepatht, linkt);
        }

        for (let i = 1; i < currentfile.length; i++) {
            filestrt = currentfile[i].split("_");
            subnamet = filestrt[0];
            if (classnames.includes(subnamet)) {
                let link = classlink[classnames.indexOf(subnamet)];
                filepatht = "/web_dev/Project-G-classroom/files/" + currentfile[i];
                submitassPromise = submitassPromise.then(function () {
                    return uploaded(filestrt, filepatht, link);
                })
            } else {
                console.log("null");
            }
        }
    }
    for (let i = 0; i < currentfile.length; i++) {
        fs.appendFileSync("visitedfiles.txt", currentfile[i] + " ");
    }
    currentfile = [];
})

function uploaded(filename, filepath, link) {
    let assignName = [];
    let assignLink = [];
    return new Promise(function (resolve, reject) {
        tab.goto(link).then(function () {
            let waitforAssignPromise = tab.waitForSelector(".lziZub.tLDEHd h2 span");
            return waitforAssignPromise;
        }).then(function () {
            let assignNamePromise = tab.$$(".lziZub.tLDEHd h2 span");
            return assignNamePromise;
        }).then(function (data) {
            let temp = [];
            for (let i = 0; i < data.length; i++) {
                let cl = tab.evaluate(function (ele) {
                    return ele.textContent;
                }, data[i]);
                temp.push(cl);
            }
            return Promise.all(temp);
        }).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                let assnametemp = data[i].split(":");
                let assnametemp1 = assnametemp[1].split(" "); //"Assignment","2"
                let name = assnametemp1[1] + "" + assnametemp1[2];
                assignName.push(name);
            }
            return console.log(assignName);
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
            assignLink = data;  //storing assignment links into assignLink Array
            let t = filename[2];
            let splitt = t.split(".");
            let Filename = splitt[0]; //"Assignment" Assignment
            let temp = '"' + Filename + '"';
            if (assignName.includes(temp)) {
                let link = assignLink[assignName.indexOf(temp)];
                console.log(link);
                tab.goto(link);
            }
        }).then(function () {
            let temp = tab.waitForNavigation({ waitUntil: 'networkidle2' })
            return temp;
        }).then(function () {
            let clickPromise;
            for (let i = 0; i < 3; i++) {
                clickPromise = tab.keyboard.press("Tab");
            }
            clickPromise = tab.keyboard.press("Enter");
            return clickPromise;
        }).then(function () {
            let temp = tab.waitForNavigation({ waitUntil: 'networkidle2' })
            return temp;
        }).then(function () {
            let clickPromise;
            for (let i = 0; i < 2; i++) {
                clickPromise = tab.keyboard.press("ArrowDown");
            }
            clickPromise = tab.keyboard.press("Enter");
            return clickPromise;
        }).then(function () {
            let arr = [];
            arr[0] = tab.waitForFileChooser();
            return Promise.all(arr);
        }).then(function (data) {
            let up = data[0].accept([filepath]);
            return up;
        }).then(function () {
            let clickPromise;
            for (let i = 0; i < 6; i++) {
                clickPromise = tab.keyboard.press("Tab");
            }
            clickPromise = tab.keyboard.press("Enter");
            return clickPromise;
        })
    }).then(function () {
        resolve();
    })
};
