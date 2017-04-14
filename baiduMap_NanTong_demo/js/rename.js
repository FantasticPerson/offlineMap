/**
 * Created by wdd on 2017/4/11.
 */
let fs = require('fs');
let path = require('path');

function rename(originDir){
    let renameFiles = function(files,originDir){
        files.map((nameItem)=>{
            let oldPath = originDir+'\\'+nameItem;
            let type = checkFileType(nameItem);
            console.log('type:'+type);
            if(type == 1){
                let newPath = originDir+'\\'+nameItem.substr(1,nameItem.length-1);
                fs.renameSync(oldPath,newPath);
                console.log('rename'+oldPath+',to'+newPath);
                rename(newPath);
            } else if(type == 2){
                let newName = parseInt(nameItem.replace(/R0+/g,''),16);
                let newPath = originDir+'\\'+newName;
                fs.renameSync(oldPath,newPath);
                console.log('rename'+oldPath+',to'+newPath);
                rename(newPath);
            } else if(type == 3){
                let nameArr = nameItem.split('.');
                let nameBefore = nameArr[0];
                let nameBeforeNum = parseInt(nameBefore.replace(/C0+/g,''),16);
                let newPath = originDir+'\\'+nameBeforeNum+'.'+nameArr[1];
                console.log('rename'+oldPath+',to'+newPath);
                fs.renameSync(oldPath,newPath);
            }
        })
    };
    let files = fs.readdirSync(originDir);
    console.log('files',files);
    if(files && files.hasOwnProperty('length') && files.length > 0){
        renameFiles(files,originDir);
    }
}

function checkFileType(name){
    if(name[0] == 'L'){
        return 1;
    } else if(name[0] == 'R'){
        return 2;
    } else if(name[0] == 'C'){
        return 3;
    }
    return 0;
}

rename(path.resolve(__dirname,'./_alllayers'));