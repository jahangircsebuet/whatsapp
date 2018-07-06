window.isChatMessage = function isChatMessage(message) {
    if (message.__x_isSentByMe) {
        return false;
    }
    if (message.__x_isNotification) {
        return false;
    }
    if (!message.__x_isUserCreatedType) {
        return false;
    }
    return true;
}

window.read_msg = function read_msg(contact) {
    var Chats = Store.Chat.models;
    for(var chat=0;chat<Chats.length;chat++) {
        if(Chats[chat].__x_formattedTitle === contact) {
            var temp = {};
            temp.contact = Chats[chat].__x_formattedTitle;
            temp.messages = [];
            while(Chats[chat].__x_typing) {console.log(Chats[chat].__x_typing);continue;}
            var Chats = Store.Chat.models;
            var messages = Chats[chat].msgs.models;
            for (var i = messages.length - 1; i >= 0; i--) {
                if(messages[i].__x_isSentByMe) break;

                if (!messages[i].__x_isNewMsg) {
                    break;
                } else {
                    if (!isChatMessage(messages[i])) {
                        continue
                    }
                    messages[i].__x_isNewMsg = false;
                    temp.messages.push(messages[i].__x_body);
                }
            }
            return temp.messages;
        }
    }
}

window.send_msg = function send_msg(contact, msgs) {
    var Chats = Store.Chat.models;
    for(var chat=0;chat< Chats.length;chat++) {
        if(Chats[chat].__x_formattedTitle === contact) {
            for(var m = msgs.length - 1;m>=0;m--) {
                Chats[chat].sendMessage(msgs[m]);
            }
        }
    }
    return true;
}

window.contact_observer = function() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.attributeName === 'class') {
                console.log('class changed and entering contact_observer');
                var attributeValue = $(mutation.target).prop(mutation.attributeName);
                console.log("attributeValue: "+attributeValue);

                if(attributeValue.indexOf('unread') > -1) {
                    console.log('unread class found');
                    var username = $(mutation.target).find('.chat-title').find('span').attr('title');
                    console.log("mutated object");
                    console.log($(mutation.target));

//                    $(mutation.target).find('.chat-secondary').find('.chat-meta')[0].firstChild.innerHTML = "";
//                    var chat_meta = $(mutation.target).find('.chat-secondary').find('.chat-meta')[0].firstChild.innerHTML = "";
//                    console.log(chat_meta);
                    console.log("username: "+username);
                    var Chats = Store.Chat.models;
//                    for(var chat=0;chat< Chats.length;chat++) {
//                        if(Chats[chat].__x_formattedTitle === username) {
//                            console.log("username found");
//                            var msgs = window.read_msg(username, chat);
//                            var msg_sent = window.send_msg(username, msgs);
//                        }
//                    }
                    $(mutation.target).removeClass('unread');
                }


//                if(attributeValue.indexOf('hover') > -1) {
//                    console.log("before $(mutation.target).removeClass: "+$(mutation.target).prop(mutation.attributeName));
////                    $(mutation.target).removeClass('hover');
//                    var username = $(mutation.target).find('.chat-title').find('span').attr('title');
//
//                    var Chats = Store.Chat.models;
//                    for(var chat=0;chat< Chats.length;chat++) {
//                        if(Chats[chat].__x_formattedTitle === username) {
//                            console.log("chat: "+chat);
//                            break;
//                        }
//                    }
//
////                    while(Chats[chat].__x_hasUnread) {
//                        var msgs = window.read_msg(username);
//                        console.log("msgs: "+msgs);
////                        console.log("Chats[chat].__x_hasUnread: "+Chats[chat].__x_hasUnread);
////                        if(msgs.length > 0){
////                            console.log("msgs.length > 0 and msgs= "+msgs);
////                            var msg_sent = window.send_msg(username, msgs);
////                        }
////                    }

//
//                    console.log("after $(mutation.target).removeClass: "+$(mutation.target).prop(mutation.attributeName));
//                }
                console.log("exiting contact_observer");
            }
        });
    });
    return observer;
}



//window.check_manually_unread_msg = function() {
//    console.log("entering manual check");
//    Array.prototype.forEach.call(document.querySelectorAll('.chat'), function(element, index) {
//        var attributeValue = element.getAttribute('class');
//        console.log("manual check class list: "+attributeValue);
//
//        if((attributeValue.indexOf('hover') > -1 || attributeValue.indexOf('unread') > -1 || attributeValue.indexOf('active') > -1)) {
//            console.log("element.classList before remove: "+element.classList);
//            element.classList.remove('hover');
//            var username = $(element).find('.chat-title').find('span').attr('title');
//            console.log("username: "+username);
//
//            var msgs = window.read_msg(username);
//            console.log("msgs: "+msgs);
//            while(msgs.length > 0) {
//                console.log("msgs.length > 0 and msgs= "+msgs);
////                var msg_sent = window.send_msg(username, msgs);
//                var currentdate = new Date();
//                console.log("before time: "+currentdate);
////                setTimeout(function() {
////                    console.log('delaying..')
////                }, 10000);
//                msgs = window.read_msg(username);
//                currentdate = new Date();
//                console.log("after time: "+currentdate);
//            }
//            element.classList.remove('unread');
//            console.log("element.classList after remove: "+element.classList);
//        }
//    });
//    console.log("exiting manual check");
//}

//window.contact_container_observer = function() {
//        var observer = new MutationObserver(function(mutations) {
//            mutations.forEach(function(mutation) {
//                if(typeof(mutation.addedNodes) == 'object') {
//                    console.log("disconnecting...");
//                    window.contact_observer().disconnect();
//                    console.log("attaching...");
//                    window.attach_contact_observer();
//                    console.log("checking manually...");
//                    window.check_manually_unread_msg();
//                }
//            return true;
//        });
//    });
//    return observer;
//};

window.attach_contact_observer = function() {
    Array.prototype.forEach.call(document.querySelectorAll('.chat'), function(element, index) {
        window.contact_observer().observe(element, {
            attributes: true
        });
    });
}

//window.attach_contact_container_observer = function() {
//    Array.prototype.forEach.call(document.querySelectorAll('.chatlist-panel-body > div > div > div'), function(element, index) {
//        window.contact_container_observer().observe(element, {
//            childList: true
//        });
//    });
//    return true;
//};

//window.attach_contact_container_observer();
window.attach_contact_observer();

//                        $.ajax({
//                            url: 'https://25c295ef.ngrok.io/send_msg/echo_back/',
//                            type: "POST",
//                            data: {'user': username},
//                            success: function(data) {
//                                console.log("success");
//                                console.log(data);
//                            },
//                            error: function(data) {
//                                console.log("error");
//                                console.log(data);
//                            }
//                        });

