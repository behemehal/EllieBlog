var fs = require('fs');
const moment = require('moment');
var fileDir = fs.readdirSync('./blogs/');
const {
    Octokit,
    App
} = require("octokit");


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
    var keys = ['publisher', 'title', 'description', 'date', 'updated_at', 'updated_by'];
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
var blogJSON = require("./blog.json");
//Loop over files in fileDir

const octokit = new Octokit({
    auth: process.env.API_KEY
});

octokit.rest.users.getAuthenticated().then(loop);
async function loop() {
    for (var i = 0; i < fileDir.length; i++) {
        var file = fs.readFileSync("./blogs/" + fileDir[i], 'utf8');
        var lineEnding = whichLineEnding(file);
        var lines = file.split(lineEnding);
        if (lines[0] != '---' || lines[7] != '---') {
            console.error("File " + fileDir[i] + " is not a valid blog file [config-error]");
        } else {
            var conf = lines.slice(1, 7);
            var md = lines.slice(8);
            var parsedConf = convertToObject(conf.map(x => parseKeyValue(x)));
            var correct = checkObject(parsedConf);
            if (correct) {
                if (moment(parsedConf.date, 'DD.MM.YYYY-HH:mm').isValid()) {
                    var disq_id;
                    if (blogJSON.findIndex(x => x.id == moment(parsedConf.date, 'DD.MM.YYYY-HH:mm').format("x")) != -1) {
                        disq_id = blogJSON.find(x => x.id == moment(parsedConf.date, 'DD.MM.YYYY-HH:mm')).disq_id;
                        files.push({
                            id: moment(parsedConf.date, 'DD.MM.YYYY-HH:mm').format("x"),
                            publisher: parsedConf.publisher,
                            updated_at: parsedConf.updated_at,
                            updated_by: parsedConf.updated_by,
                            title: parsedConf.title,
                            description: parsedConf.description,
                            date: moment(parsedConf.date, 'DD.MM.YYYY-HH:mm').format(),
                            disq_id,
                            file_name: fileDir[i]
                        });
                    } else {
                        disq_id = await octokit.graphql(
                            `mutation {
                                    createDiscussion(input: {repositoryId: "R_kgDOGdv8Ow", categoryId: "DIC_kwDOGdv8O84CAHDn", body: "${parsedConf.description}", title: "${parsedConf.title}"}) {
                                      discussion {
                                        id
                                      }
                                    }
                                  }`
                        );

                        files.push({
                            id: moment(parsedConf.date, 'DD.MM.YYYY-HH:mm').format("x"),
                            publisher: parsedConf.publisher,
                            updated_at: parsedConf.updated_at,
                            updated_by: parsedConf.updated_by,
                            title: parsedConf.title,
                            description: parsedConf.description,
                            date: moment(parsedConf.date, 'DD.MM.YYYY-HH:mm').format(),
                            disq_id: disq_id.createDiscussion.discussion.id,
                            file_name: fileDir[i]
                        });
                    }

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
}