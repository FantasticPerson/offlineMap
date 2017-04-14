/**
 * Created by wdd on 2017/4/13.
 */
var fs = require('fs');
var http = require('http');
fs.readFile('downloadList','utf-8',function(err,data) {
    // console.log(data);
    var downloadList = JSON.parse(data);

    var currentIndex = 0;
    var totalLength = downloadList.length;

    function getHttpReqCallback(imgSrc, dirName) {
        var callback = function(res) {
            console.log("request: " + imgSrc + " return status: " + res.statusCode);
            var contentLength = parseInt(res.headers['content-length']);
            var fileBuff = [];
            res.on('data', function (chunk) {
                var buffer = new Buffer(chunk);
                fileBuff.push(buffer);
            });
            res.on('end', function() {
                console.log("end downloading " + imgSrc);
                if (isNaN(contentLength)) {
                    console.log(imgSrc + " content length error");
                    return;
                }
                var totalBuff = Buffer.concat(fileBuff);
                console.log("totalBuff.length = " + totalBuff.length + " " + "contentLength = " + contentLength);
                if (totalBuff.length < contentLength) {
                    console.log(imgSrc + " download error, try again");
                    startDownloadTask(imgSrc, dirName);
                    return;
                }
                fs.appendFile(dirName, totalBuff, function(err){
                    if(!err){
                        currentIndex++;
                        download();
                    }
                });
            });
        };

        return callback;
    }

    function download(){
        if(currentIndex < totalLength){
            var item = downloadList[currentIndex];
            let fs = require('fs');
            let path = require('path');
            if(!fs.existsSync(path.resolve(__dirname,'./download'))){
                fs.mkdirSync(path.resolve(__dirname,'./download'));
            }
            let dirPath = item.path;
            let dirPathArr = dirPath.split('/');
            if(!fs.existsSync(path.resolve(__dirname,'./download/'+dirPathArr[0]))){
                fs.mkdirSync(path.resolve(__dirname,'./download/'+dirPathArr[0]));
            }
            if(!fs.existsSync(path.resolve(__dirname,'./download/'+dirPathArr[0]+'/'+dirPathArr[1]))){
                fs.mkdirSync(path.resolve(__dirname,'./download/'+dirPathArr[0]+'/'+dirPathArr[1]));
            }
            let pngPath = path.resolve(__dirname,'./download/'+dirPathArr[0]+'/'+dirPathArr[1]+'/'+dirPathArr[2]);
            startDownloadTask(item.url,pngPath);
        }
    }

    var startDownloadTask = function(imgSrc, dirName) {
        console.log("start downloading " + imgSrc);

        var req = http.request(imgSrc, getHttpReqCallback(imgSrc, dirName));
        req.on('error', function(e){
            console.log("request " + imgSrc + " error, try again");
            startDownloadTask(imgSrc, dirName);
        });
        req.end();
    }

    download();

    // downloadList.forEach(function(item, index, array) {
    //     let fs = require('fs');
    //     let path = require('path');
    //     if(!fs.existsSync(path.resolve(__dirname,'./download'))){
    //         fs.mkdirSync(path.resolve(__dirname,'./download'));
    //     }
    //     let dirPath = item.path;
    //     let dirPathArr = dirPath.split('/');
    //     if(!fs.existsSync(path.resolve(__dirname,'./download/'+dirPathArr[0]))){
    //         fs.mkdirSync(path.resolve(__dirname,'./download/'+dirPathArr[0]));
    //     }
    //     if(!fs.existsSync(path.resolve(__dirname,'./download/'+dirPathArr[0]+'/'+dirPathArr[1]))){
    //         fs.mkdirSync(path.resolve(__dirname,'./download/'+dirPathArr[0]+'/'+dirPathArr[1]));
    //     }
    //     let pngPath = path.resolve(__dirname,'./download/'+dirPathArr[0]+'/'+dirPathArr[1]+'/'+dirPathArr[2]);
    //     startDownloadTask(item.url, pngPath, index);
    // })
});
