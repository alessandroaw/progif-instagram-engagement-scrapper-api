const request = require('request');
const cheerio = require('cheerio');

var getUserData = (username) => {
  var url = `https://phlanx.com/engagement-calculator?insta=${username}`;
  console.log(url);

  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if(!err && res.statusCode === 200) {
        var $ = cheerio.load(body);
        //
        var temp = $('.invalid-engagement-result').text();
        if(temp) {
          var error = {
            ig: username,
            code:400,
            message: temp
          }
          reject(error);
        }

        // follower
        var temp = $('.follow-count').text();
        var follower  = parseInt(temp.replace(/,/g, ""));
        // console.log(temp);

        // dp
        temp = $('.result-picture img').attr('src');
        var image = temp;

        //engagement rate
        temp = $('.detail-wrapper h4').text();
        var engagement_rate = parseFloat(temp)/100;

        // average Likes & Post
        temp = $('div.total-likes').text();
        var average_likes = parseInt(temp.replace(/,/g, ""));

        temp = $('div.total-comments').text();
        var average_comment = parseInt(temp.replace(/,/g, ""));

        var json = {
          username, follower, image, engagement_rate, average_likes, average_comment
        }

        resolve(json);
      }
      else{
        reject(err);
      }
    });

  })

}
// Tester
// var u = 'jokowi';
// getUserData(u).then((user) => {
//   console.log(JSON.stringify(user,undefined,2));
// }).catch((e) => {
//   console.log(e);
// })

module.exports = {getUserData}
