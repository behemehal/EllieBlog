var blog_per_page = 10;
var fs = require('fs');
const moment = require('moment');
var fileDir = fs.readdirSync('./blogs/');

//Parse key and value seperated by ':'
function parseKeyValue(str) {
    var arr = str.toString().split(':');
    return {
        key: arr[0].trim(),
        value: arr[1].trim()
    };
}

//Convert object array which has key and value to object (This comment exist because co-pilot)
function convertToObject(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i].key] = arr[i].value;
    }
    return obj;
}

//Check object has [publisher, title, description, date] keys
function checkObject(obj) {
    var keys = ['publisher', 'title', 'description', 'date'];
    for (var i = 0; i < keys.length; i++) {
        if (!obj.hasOwnProperty(keys[i])) {
            return false;
        }
    }
    return true;
}

function whichLineEnding(source) {
    var temp = source.indexOf('\n');
    if (source[temp - 1] === '\r')
        return '\r\n'
    return "\n"
}

var files = [];
//Loop over files in fileDir
for (var i = 0; i < fileDir.length; i++) {
    var file = fs.readFileSync("./blogs/" + fileDir[i], 'utf8');
    var lineEnding = whichLineEnding(file);
    var lines = file.split(lineEnding);
    if (lines[0] != '---' || lines[5] != '---') {
        console.error("File " + fileDir[i] + " is not a valid blog file [config-error]");
    } else {
        var conf = lines.slice(1, 5);
        var md = lines.slice(6);
        var parsedConf = convertToObject(conf.map(x => parseKeyValue(x)));
        var correct = checkObject(parsedConf);
        if (correct) {
            if (moment(parsedConf.date, 'DD.MM.YYYY-HH:mm').isvalid()) {
                files.push({
                    publisher: parsedConf.publisher,
                    title: parsedConf.title,
                    description: parsedConf.description,
                    date: moment(parsedConf.date, 'DD.MM.YYYY-HH:mm').format()
                });
            } else {
                console.error("File " + fileDir[i] + " has invalid date");
            }
        } else {
            console.error("Error: " + fileDir[i] + " is not a valid blog file  [config-error-wrong-keys]");
            process.exit(1);
        }
    }

}
files.sort((a, b) => new moment(a.date).format() - new moment(b.date).format());
fs.writeFileSync("./blog.json", JSON.stringify(files, null, 2));