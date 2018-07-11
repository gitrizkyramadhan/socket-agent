// const socket = io.connect('http://localhost:9000')
const socket = io.connect('http://chatty-snake-4.localtunnel.me')
const current_url = window.location.href;
const url = new URL(current_url);
// const site_url = "http://localhost:9000/"
const site_url = "http://chatty-snake-4.localtunnel.me/"
//listener, whenever the server emits 'updatechat' this updates the chat body
socket.on('updatechat',function(username,data,type,jenis){
    if (type === 1) {
        var addHtml = '<div class="row message-body">'
        addHtml += '<div class="col-sm-12 message-main-sender">'
        addHtml += '<div class="sender">'
        addHtml += '<div class="message-text">'+data+'</div>'
        addHtml += '<span class="message-time pull-right">Sun</span>'
        addHtml += '</div>'
        addHtml += '</div>'
        addHtml += '</div>'
        $('#chatbox').append(addHtml)

    }else{
        var addHtml = '<div class="row message-body">'
        addHtml += '<div class="col-sm-12 message-main-receiver">'
        addHtml += '<div class="receiver receiver-mini">'
        addHtml += '<div class="message-text">'+data+'</div>'
        addHtml += '<span class="message-time pull-right">Sun</span>'
        addHtml += '</div>'
        addHtml += '</div>'
        addHtml += '</div>'
        $('#chatbox').append(addHtml)
    }
});
//on Load of Page
$(function(){

    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes();
    // ajax for list detail queue comunication from line to agent

    $.ajax({
        url: site_url + 'check-redis',
        dataType: 'json',
        success: function (data) {
            console.log(data)
            console.log("---")
            

            
            $.each(data,function(x){

                // if(data[x].handling_agent == 0 && data[x].stat_agent == 1){
                    // if(data[x].stat_agent == 1){
                    var addHtml = '<div class="row sidebararea-body chatbotback queue_'+data[x].msisdn+'" id="chatback">'
                    addHtml += '<div class="col-sm-3 col-xs-3 sidebararea-avatar">'
                    addHtml += '<div class="avatar-icon">'
                    addHtml += '<img src="/socket-agent/img/avatar.png">'
                    addHtml += '</div>'
                    addHtml += '</div>'
                    addHtml += '<div class="col-sm-9 col-xs-9 sidebararea-main">'
                    addHtml += '<div class="row">'
                    addHtml += '<div class="col-sm-8 col-xs-8 sidebararea-name">'
                    addHtml += '<span class="name-meta">'+data[x].msisdn+'</span>'
                    addHtml += '</div>'
                    addHtml += '<div class="col-sm-4 col-xs-4 pull-right sidebararea-time">'
                    addHtml += '<span class="time-meta pull-right">18:18</span>'
                    addHtml += '</div>'
                    addHtml += '</div>'
                    addHtml += '</div>'
                    addHtml += '</div>'
                    
                    $('#sidebararea').append(addHtml)

                    //action when detail msisdn on click
                    $("#sidebararea").on("click",".chatbotback.queue_"+data[x].msisdn,function(){
                       
                        socket.emit('started',data[x].msisdn);
                        
                        var addHtml = ''
                        addHtml += '<div class="side-two hidden-sm hidden-md hidden-lg">'
                        addHtml += '<div class="row newmessage-heading">'
                        addHtml += '<div class="row newmessage-main">'
                        addHtml += '<div class="col-sm-2 col-xs-2 newmessage-back">'
                        addHtml += '<i class="fa fa-arrow-left" aria-hidden="true"></i>'
                        addHtml += '</div>'
                        addHtml += '<div class="col-sm-10 col-xs-10 newmessage-title">'
                        addHtml += ' '+data[x].msisdn
                        addHtml += '</div>'
                        addHtml += '</div>'
                        addHtml += '</div>'
                        addHtml += '<div class="row composebox">'
                        addHtml += '<div class="col-sm-12 composebox-inner">'
                        addHtml += '<div class="form-group has-feedback">'
                        addHtml += '<input id="composetext" type="text" class="form-control" name="searchtext" placeholder="Search Chat">'
                        addHtml += '<span class="glyphicon glyphicon-search form-control-feedback"></span>'
                        addHtml += '</div>'
                        addHtml += '</div>'
                        addHtml += '</div>'
                        addHtml += '<div class="row compose-sidebararea compose-mini" id="chatbox">'
                        addHtml += '</div>'
                        $('.col-sm-4.side').append(addHtml)

                        $.ajax({
                            url:site_url+'history/detail?msisdn='+data[x].msisdn,
                            dataType: 'json',
                            success: function (inside_data) {
                                $.each(inside_data,function(x){
                                    if(inside_data[x].type == 'agent'){
                                        var addHtml = ''
                                        addHtml += '<div class="row message-body">'
                                        addHtml += '<div class="col-sm-12 message-main-receiver">'
                                        addHtml += '<div class="receiver receiver-mini">'
                                        addHtml += '<div class="message-text">'+inside_data[x].ask+'</div>'
                                        addHtml += '<span class="message-time pull-right">'+time+'</span>'
                                        addHtml += '</div>'
                                        addHtml += '</div>'
                                        addHtml += '</div>'
                                        $('#chatbox').append(addHtml)
                                    }else{
                                        var addHtml = ''
                                        addHtml += '<div class="row message-body">'
                                        addHtml += '<div class="col-sm-12 message-main-sender">'
                                        addHtml += '<div class="sender">'
                                        addHtml += '<div class="message-text">'+inside_data[x].ask+'</div>'
                                        addHtml += '<span class="message-time pull-right">'+time+'</span>'
                                        addHtml += '</div>'
                                        addHtml += '</div>'
                                        addHtml += '</div>'
                                        $('#chatbox').append(addHtml)
                                    }
                                });
                                
                                //auto scroll on load chat
                                $('#chatbox').animate({ scrollTop: $('#chatbox').prop("scrollHeight") - $('#chatbox').height() }, 1000);
                            }

                        });
                        var addHtml = ''
                        addHtml += '<div class="mini-chat">'
                        addHtml += '<div class="col-sm-1 col-xs-1 reply-emojis white-emojis">'
                        addHtml += '<i class="fa fa-smile-o fa-2x"></i>'
                        addHtml += '</div>'
                        addHtml += '<div class="col-sm-9 col-xs-9 reply-main white-reply-main">'
                        addHtml += '<textarea autofocus class="form-control" rows="1" id="comment"></textarea>'
                        addHtml += '</div>'
                        addHtml += '<div class="col-sm-1 col-xs-1 reply-recording white-reply-recording">'
                        addHtml += '<i class="fa fa-microphone fa-2x" aria-hidden="true"></i>'
                        addHtml += '</div>'
                        addHtml += '<div class="col-sm-1 col-xs-1 reply-send white-reply-send">'
                        addHtml += '<i class="fa fa-send fa-2x" aria-hidden="true"></i>'
                        addHtml += '</div>'
                        addHtml += '</div>'
                        addHtml += '</div>'
                        $('.col-sm-4.side').append(addHtml)
                        
                        // handling show popup chat per user msisdn
                        $(".side-two").css({
                            "left": "0"
                        });
                      
                        // handling when input text and click send button
                        $('.fa-send').click(function(){
                            var msg = $('textarea.form-control').val();
                            var msisdn = data[x].msisdn
                            var message = {
                                ask:msg,
                                id_line:msisdn
                            }
                            socket.emit('sendchat',message);
                            
                            $('textarea.form-control').val('');
                            $('#comment').focus();

//                            console.log("test "+$('#chatbox').prop("scrollHeight"));
                            //auto scroll after send msg
                            $('#chatbox').animate({ scrollTop: $('#chatbox').prop("scrollHeight") - $('#chatbox').height() }, 1000);
                        });

                        // handling close popup chat per user msisdn
                        $(".newmessage-back").click(function() {
                            $(".side-two").css({
                                "left": "-100%"
                            });
                            $(".side-two").remove();
                            $(".mini-chat").remove();
                        });

                    });

                // }

            });
        }

    });

    if($('#chatbox').length > 0 ){
        alert("wes full");
    }

});