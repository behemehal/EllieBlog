var fs = require('fs');
const moment = require('moment');
const axios = require('axios').default;
const { Octokit } = require('octokit');
require('dotenv').config();

//Parse key and value seperated by ':'
function parseKeyValue(str) {
   var arr = str.toString().split(':');
   return {
      key: arr[0].trim(),
      value: arr[1].trim(),
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
   if (source[temp - 1] === '\r') return '\r\n';
   return '\n';
}

var blogJSON = require('./blog.json');
//Loop over files in fileDir

const octokit = new Octokit({
   auth: process.env.API_KEY,
});

octokit.rest.users.getAuthenticated().then(loop);

async function createDiscussion(title, description) {
   const disq_id = await octokit.graphql(
      `mutation {
         createDiscussion(input: {repositoryId: "R_kgDOGdv8Ow", categoryId: "DIC_kwDOGdv8O84CAHDn", body: "${description}", title: "${title}"}) {
           discussion {
             id
           }
         }
       }`
   );
   return data;
}

async function readFile(fileLink) {
   var file = fs.readFileSync(fileLink, 'utf8');
   var lineEnding = whichLineEnding(fileLink);
   var lines = file.split(lineEnding);

   if (lines[0] != '---' || lines[7] != '---') {
      return {
         err: true,
         message: 'File ' + file + ' is not a valid blog file [config-error]',
      };
   } else {
      var conf = lines.slice(1, 7);
      var md = lines.slice(8);
      var parsedConf = convertToObject(conf.map((x) => parseKeyValue(x)));
      var correct = checkObject(parsedConf);

      if (correct) {
         if (moment(parsedConf.date, 'DD.MM.YYYY-hh.mm').isValid()) {
            return {
               err: false,
               parsedConf,
               md,
            };
         } else {
            return {
               err: true,
               message: 'File ' + file + ' has invalid date',
            };
         }
      } else {
         return {
            err: true,
            message: 'File ' + file + ' has invalid config',
         };
      }
   }
}

async function postWebhook(title, description, publisher, url) {
   return axios.post(process.env.WEBHOOKURL, {
      username: 'EllieBlog',
      avatar_url: 'https://www.ellie-lang.org/img/EllieCharIcon.png',
      embeds: [
         {
            title: title,
            type: 'article',
            description: description,
            thumbnail: {
               url: 'https://www.ellie-lang.org/img/EllieCharIcon.png',
            },
            color: '16181999',
            author: {
               name: publisher.replace('@', ''),
               url: publisher.replace('@', 'https://github.com/'),
               icon_url: publisher.replace('@', 'https://github.com/') + '.png',
            },
            url,
         },
      ],
   });
}

async function loop() {
   var fileDir = fs.readdirSync('./blogs/');
   let files = [];
   for (var i = 0; i < fileDir.length; i++) {
      var file = await readFile('./blogs/' + fileDir[i]);
      if (file.err) {
         console.log(file.message);
      } else {
         var id = moment(file.parsedConf.date, 'DD.MM.YYYY-hh.mm').format('x');
         let title = `${file.parsedConf.title}@${id.toString(16)}`;
         let disq_id;
         if (!blogJSON.find((x) => x.id === id)) {
            disq_id = await createDiscussion(title, file.parsedConf.description);
            await postWebhook(
               file.parsedConf.title,
               file.parsedConf.description,
               file.parsedConf.publisher,
               'https://www.ellie-lang.org/blog/' + fileDir[i].replace('.md', '')
            );
         } else {
            disq_id = blogJSON.find((x) => x.id === id).disq_id;
         }
         let blogData = {
            id,
            disq_id,
            title,
            publisher: file.parsedConf.publisher,
            updated_at: file.parsedConf.updated_at,
            updated_by: file.parsedConf.updated_by,
            description: file.parsedConf.description,
            date: moment(file.parsedConf.date, 'DD.MM.YYYY-hh.mm').format(),
            file_name: fileDir[i],
         };
         files.push(blogData);
      }
   }
   fs.writeFileSync('./blog.json', JSON.stringify(files));
}
