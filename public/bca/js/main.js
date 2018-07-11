/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global io, text, res */

var socket = io.connect('http://127.0.0.1:9000');
// var socket = io.connect('http://heavy-wombat-14.localtunnel.me');
//var socket = io.connect('http://202.152.19.228');
//var socket = io.connect('http://10.10.1.122');
//var socket = io.connect('http://10.20.219.172');

const site_url = "http://localhost:9000/";
var content = $('#content');
var current_url = window.location.href;
var url = new URL(current_url);

claerResizeScroll = function() {
    $("#data").val("");
    $(".messages").getNiceScroll(0).resize();
    return $(".messages").getNiceScroll(0).doScrollTop(999999, 999);
  };

function getTime() {
    var d = new Date();
    return d.getHours() + ':' + d.getMinutes();
}

function disableInputText(status){
  if (status === true){
    $('.textarea').attr("disabled", true);
  }
  else {
    $('.textarea').attr("disabled", false);
  }
}

// ----------------------------------------------------- //
//on connection to server, ask for user's name with an anonymous callback
socket.on('connect',function(){
   //call the server-side function 'adduser' and send one parameter (value of promt)
   socket.emit('adduser',"agent");
});

//listener, whenever the server emits 'updatechat' this updates the chat body
socket.on('updatechat',function(username,data,type,jenis){
    
    //type 1 : agent
    //type 0 : user
    
    console.log(type);
    console.log(data);
    console.log(socket.id);
    if (type === 1) {
        
        if(jenis === 'quick1'){
            
            // do_html = '<li class="ChatLog__entry"><div class="ChatLog__avatar" style="background-image:url(/bca/static//img/call-center.png); background-size: cover;"></div><p class="ChatLog__message">'+ data + '</p><p class="time-info info-one">' + getTime() + '</p></li>';
            // do_html = do_html + '<br id="put_space" class="put_space"/><br id="put_space" class="put_space"/>';
            // do_html = do_html + quickreply_1();
            // $('.ChatLog').append(do_html);
            // $('.ChatLog').animate({
            //     scrollTop: $('#content').prop("scrollHeight")
            //   }, 700);
            // window.scrollTo(0, document.body.scrollHeight + 300);
            // disableInputText(true);   
        }else if(jenis === 'quick2'){
            // do_html = '<li class="ChatLog__entry"><div class="ChatLog__avatar" style="background-image:url(/bca/static//img/call-center.png); background-size: cover;"></div><p class="ChatLog__message">'+ data + '</p><p class="time-info info-one">' + getTime() + '</p></li>';
            // do_html = do_html + '<br id="put_space" class="put_space"/><br id="put_space" class="put_space"/>';
            // do_html = do_html + quickreply_2();
            // $('.ChatLog').append(do_html);
            // $('.ChatLog').animate({
            //     scrollTop: $('#content').prop("scrollHeight")
            //   }, 700);
            // window.scrollTo(0, document.body.scrollHeight + 300);
            // // disableInputText(true);    
        }else if(jenis === 'carosel'){
            //do_html = '<li class="ChatLog__entry"><div class="ChatLog__avatar" style="background-image:url(/bca/static//img/call-center.png); background-size: cover;"></div><p class="ChatLog__message">' + data + '</p><p class="time-info info-one">' + getTime() + '</p></li>';
            // do_html = '<br id="put_space" class="put_space"/><br id="put_space" class="put_space"/>';
            // do_html = do_html + show_static_carousel('start_greeting');
            // $('.ChatLog').append(do_html);
            // $('.ChatLog').animate({
            //     scrollTop: $('#content').prop("scrollHeight")
            //   }, 700);
            // window.scrollTo(0, document.body.scrollHeight + 300);
        }else{
            
            $(".messages").append("<li class=\"friend-with-a-SVAGina\"><div class=\"head\"><span class=\"name\">Pevita  </span><span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + " AM, Today</span></div><div class=\"message\">" + data + "</div></li>");
            claerResizeScroll();
        }
        
        
    } else {
        $(".messages").append("<li class=\"i\"><div class=\"head\"><span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + " AM, Today</span><span class=\"name\"> Aku</span></div><div class=\"message\">" + data + "</div></li>");
        claerResizeScroll();
    }
    
    
});

//on load of page
$(function(){
    
    $.ajax({
        url: site_url + 'check-redis',
        success: function (data) {
            console.log(data)
            console.log("---")
            var len = data.length;
            for(var x=0;x<len;x++){
                if(data[x].stat_agent === "1"){
                    $(".list-friends").append("<li> <img width=\"50\" height=\"50\" src=\"http://cs625730.vk.me/v625730358/1126a/qEjM1AnybRA.jpg\"><div class=\"info\"><div class=\"user\">"+data[x].msisdn+"</div><div class=\"status on\"> online</div></div></li>") 
                }
                
            }
        }
    });



    $(".messages").append("<li class=\"i\"><div class=\"head\"><span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + " AM, Today</span><span class=\"name\"> Aku</span></div><div class=\"message\">" + "customer mu ada yang tanya tucj" + "</div></li>");
    $('#data').focus();
    claerResizeScroll();
   //when the client clicks send
   $('#datasend').click(function(){
      var msg = $('#data').val();
      
      if(msg!==''){
          var message = {
            // nama:url.searchParams.get("fullName"),
            // address:url.searchParams.get("address"),
            // email:url.searchParams.get("email"),
            // mobile:url.searchParams.get("mobile"),
            id_line:url.searchParams.get("id_line"),
            ask:msg
            };

          $('#data').val('');
          //tell server to execute 'sendchat' and send along one parameter
          socket.emit('sendchat',message);
      }else{
         $('#data').focus(); 
      }
      
   });
   
   //when the client hits ENTER on their keyboard
   $('#data').keypress(function(e){
       if(e.which === 13){
           $(this).blur();
           $('#datasend').focus().click();
       }
   });
   
});
