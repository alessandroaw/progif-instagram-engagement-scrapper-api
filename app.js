const request = require('request');
const express = require('express');
const cheerio = require('cheerio');
// const _ = require('lodash');

var username = 'jokowi';

var url = `https://phlanx.com/engagement-calculator?insta=${username}`;

console.log(url);
request(url, (err, res, body) => {
  if(!err) {
    // console.log(res);
    var $ = cheerio.load(body);

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
    var avg_likes = parseInt(temp.replace(/,/g, ""));
    console.log(temp);

    temp = $('div.total-comments').text();
    var avg_comment = parseInt(temp.replace(/,/g, ""));
    console.log(temp);

    var json = {
      follower, image, engagement_rate, avg_likes, avg_comment
    }

    console.log(json);
  }
});
