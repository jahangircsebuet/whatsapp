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

window.read_msg = function read_msg(contact, index) {
    var Chats = Store.Chat.models;
    console.log("core read_msg function called with index: "+index);
    for(var chat=0;chat<Chats.length;chat++) {
        if(Chats[chat].__x_formattedTitle === contact) {
            console.log("index matched: "+chat);
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

window.send_msg = function send_msg(contact, msgs, index) {
    var Chats = Store.Chat.models;
    console.log("core send_msg called with index: "+index);
    for(var chat=0;chat< Chats.length;chat++) {
        if(Chats[chat].__x_formattedTitle === contact) {
            console.log("index matched: "+chat);
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

                if(attributeValue.indexOf('hover') > -1) {
//                    console.log("before $(mutation.target).removeClass: "+$(mutation.target).prop(mutation.attributeName));
//                    $(mutation.target).removeClass('hover');
                    var username = $(mutation.target).find('.chat-title').find('span').attr('title');

                    var Chats = Store.Chat.models;
                    console.log("$Chats object and user name");
                    console.log("$"+username);
//                    for(var chat=0;chat< Chats.length;chat++) {
//                        if(Chats[chat].__x_formattedTitle === username) {
//                            console.log("index: "+chat);
//                            var msgs = window.read_msg(username, chat);
//                            console.log(JSON.stringify(msgs));
////                            var msg_sent = window.send_msg(username, msgs, chat);
////                            console.log(JSON.stringify(Chats[chat]));
//                        }
//                    }

//                    console.log("before set timeout username: "+username);
//                    (function (username){
//                        setTimeout(function(){
//                            var Chats = Store.Chat.models;
//                            console.log("inside contact_observer");
//                            console.log("$Chats object and user name after 5 sec");
//                            console.log("$"+username);
//                            for(var chat=0;chat< Chats.length;chat++) {
//                                if(Chats[chat].__x_formattedTitle === username) {
//                                    console.log("index: "+chat);
////                                    console.log(JSON.stringify(Chats[chat]));
//                                }
//                            }
//                            console.log("local username: "+username);
//                            window.read_msg_recursively(username);
//                        }, 2000);
//                    })(username);

                    $(mutation.target).removeClass('unread');
//                    console.log("after $(mutation.target).removeClass: "+$(mutation.target).prop(mutation.attributeName));
                }
                console.log("exiting contact_observer");
            }
        });
    });
    return observer;
}
window.read_msg_recursively = function read_msg_recursively(contact) {
    Array.prototype.forEach.call(document.querySelectorAll('.chat'), function(element, index) {
        var attributeValue = element.getAttribute('class');
        var chat_meta_length = $(element).find('.chat-meta').find('span').find('div').length;
        var username = $(element).find('.chat-title').find('span').attr('title');

//        console.log("attributeValue: "+attributeValue);

        if(username === contact) {
            if(attributeValue.indexOf('unread') > -1 || chat_meta_length > 0) {
                console.log("inside recursive function contact: "+contact);
                console.log("inside recursive function username: "+username);
                console.log("chat_meta_length: "+chat_meta_length);
//                console.log("attributeValue: "+attributeValue);
                var Chats = Store.Chat.models;
                console.log("$Chats object and user name inside recursive function");
                console.log("$"+username);
                for(var chat=0;chat< Chats.length;chat++) {
                    if(Chats[chat].__x_formattedTitle === username) {
                        console.log("after called from contact_observer");
                        console.log("index: "+chat);
                        var msgs = window.read_msg(contact, chat);
                        console.log(JSON.stringify(msgs));
                        var msg_sent = window.send_msg(contact, msgs, chat);
                    }
                }


                $(element).find('.chat-meta').find('span').remove('div');
//                setTimeout(function() {
//                    console.log("recursive function call from recursive function");
//                    window.read_msg_recursively(contact);
//                }, 5000);
                console.log("before set timeout function username: "+username);
//                (function (username){
//                        setTimeout(function(){
//                            var Chats = Store.Chat.models;
//                            console.log("indside read_msg_recursively function");
//                            console.log("$Chats object and user name after 5 sec");
//                            console.log("$"+username);
//                            for(var chat=0;chat< Chats.length;chat++) {
//                                if(Chats[chat].__x_formattedTitle === username) {
//                                    console.log("index: "+chat);
////                                    console.log(JSON.stringify(Chats[chat]));
//                                }
//                            }
//                            console.log("local username: "+username);
//                            window.read_msg_recursively(username);
//                        }, 2000);
//                    })(username);
                element.classList.remove('unread');
            } else {
                return;
            }
        }
    });
}

window.check_manually_unread_msg = function() {
    console.log("entering manual check");
    Array.prototype.forEach.call(document.querySelectorAll('.chat'), function(element, index) {
        var attributeValue = element.getAttribute('class');
//        console.log("manual check class list: "+attributeValue);
        var chat_meta_length = $(element).find('.chat-meta').find('span').find('div').length;
//        console.log("chat_meta_length: "+chat_meta_length);

        if(chat_meta_length > 0 || attributeValue.indexOf('hover') > -1 || attributeValue.indexOf('unread') > -1 || attributeValue.indexOf('active') > -1) {
//            console.log("element.classList before remove: "+element.classList);
            element.classList.remove('hover');
            var username = $(element).find('.chat-title').find('span').attr('title');
//            console.log("username: "+username);

            var msgs = window.read_msg(contact);
            var msg_sent = window.send_msg(contact, msgs);
            $(element).find('.chat-meta').find('span').remove('div');

            var Chats = Store.Chat.models;
//            console.log("$check_manually_unread_msg function");
//            console.log("$Chats object and user name");
//            console.log("$"+username);
//            console.log("$"+JSON.stringify(Chats));
//            setTimeout(function() {
//                console.log("recursive function call from manual check function");
//                window.read_msg_recursively(username);
//            }, 5000);
//            (function (username){
//                        setTimeout(function(){
//                            var Chats = Store.Chat.models;
////                            console.log("$check_manually_unread_msg function");
////                            console.log("$Chats object and user name");
////                            console.log("$"+username);
////                            console.log("$"+JSON.stringify(Chats));
//                            window.read_msg_recursively(username);
//                        }, 5000);
//                    })(username);
            element.classList.remove('unread');
//            console.log("element.classList after remove: "+element.classList);
        }
    });
//    console.log("exiting manual check");
}

//window.contact_container_observer = function() {
//        var observer = new MutationObserver(function(mutations) {
//            mutations.forEach(function(mutation) {
//                if(typeof(mutation.addedNodes) == 'object') {
//                    window.contact_observer().disconnect();
//                    window.attach_contact_observer();
//                    window.check_manually_unread_msg();
//                }
//            return true;
//        });
//    });
//    return observer;
//};

//window.internet_status_observer = function() {
//    var observer = new MutationObserver(function() {
//        mutations.forEach(function(mutation) {
//            if(typeof(mutation.addedNodes) == 'object') {
//                console.log('internet gone..');
//            }
//        });
//    });
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

//window.attach_internet_status_observer = function() { //Computer Not Connected
//    Array.prototype.forEach.call(document.querySelectorAll('.chatlist-panel'), function(element, index) {
//        window.internet_status_observer().observe(element, {
//            childList: true
//        });
//    });
//};

window.attach_contact_container_observer();
window.attach_contact_observer();
//window.attach_internet_status_observer();
