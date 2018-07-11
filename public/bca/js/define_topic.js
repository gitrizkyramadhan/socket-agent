/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



const site_url = 'http://localhost:7070';
//const site_url = 'http://202.152.19.228';
//const site_url = 'http://10.10.1.122';
//const site_url = 'http://10.20.219.172';
const url = new URL(window.location.href);

function getTime() {
    var d = new Date();
    return d.getHours() + ':' + d.getMinutes();
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

$(function () {

    $.ajax({
        // url: site_url + '/bca/history/detail?id='+url.searchParams.get("id"),
        url: site_url + '/bca/history/topic',
        contentType: 'application/json',
        success: function (data) {
            var len = data.length;
            
            var_max = getMax(data,"count");
            console.log(var_max);
            console.log("+++++++++++++++++++++");
            var random = var_max[Math.floor(Math.random() * var_max.length)];
            console.log(random);
            
            
            
            for(var x=0;x<len;x++){
                
//                console.log(data[x])
//                console.log(data[x]._id)
//                console.log(data[x].count)
                
//                chat_user = '<li class="ChatLog__entry ChatLog__entry_mine"><div class="ChatLog__avatar" style="background-image:url(/bca/static//img/call-center.png);background-size: cover;"></div> <p class="ChatLog__message">' + data[x].user.ask + '</p><p class="time-info info-two">' + convert_date(data[x].datetime) + '</p></li>';
//                chat_bot = '<li class="ChatLog__entry"><div class="ChatLog__avatar" style="background-image:url(/bca/static//img/call-center.png); background-size: cover;"></div><p class="ChatLog__message">'+ data[x].message + '</p><p class="time-info info-one">' + convert_date(data[x].datetime) + '</p></li>';
//                $('.ChatLog').append(chat_user);
//                $('.ChatLog').append(chat_bot);
//                $('.ChatLog').animate({scrollTop: $('#content').prop("scrollHeight")}, 700);
//                window.scrollTo(0, document.body.scrollHeight + 300); 
               
            }
//            console.log(data);
        }
    });




});


