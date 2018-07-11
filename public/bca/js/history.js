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

function convert_date(input_date){
    
    var created_date = new Date(input_date);
    created_date.setHours(created_date.getHours()-7);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = created_date.getFullYear();
    var month = months[created_date.getMonth()];
    var date = pad(created_date.getDate(),2);
    var hour = pad(created_date.getHours(),2);
    var min = pad(created_date.getMinutes(),2);
    var sec = pad(created_date.getSeconds(),2);
    return time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;    // final date with time, you can use this according your requirement
}

$(function () {

    $.ajax({
        url: site_url + '/bca/history/detail?id='+url.searchParams.get("id"),
        contentType: 'application/json',
        success: function (data) {
            var len = data.length;
            for(var x=0;x<len;x++){
                
                chat_user = '<li class="ChatLog__entry ChatLog__entry_mine"><div class="ChatLog__avatar" style="background-image:url(/bca/static//img/call-center.png);background-size: cover;"></div> <p class="ChatLog__message">' + data[x].user.ask + '</p><p class="time-info info-two">' + convert_date(data[x].datetime) + '</p></li>';
                chat_bot = '<li class="ChatLog__entry"><div class="ChatLog__avatar" style="background-image:url(/bca/static//img/call-center.png); background-size: cover;"></div><p class="ChatLog__message">'+ data[x].message + '</p><p class="time-info info-one">' + convert_date(data[x].datetime) + '</p></li>';
                $('.ChatLog').append(chat_user);
                $('.ChatLog').append(chat_bot);
                $('.ChatLog').animate({scrollTop: $('#content').prop("scrollHeight")}, 700);
                window.scrollTo(0, document.body.scrollHeight + 300); 
               
            }
            console.log(data);
        }
    });




});