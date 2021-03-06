// Global Variables
var send_button = document.getElementById('message-send-button');
var text = document.getElementById('message-text');
var list = document.getElementById('message-data');
var reply = undefined;
var url = "http://api.asksusi.com/susi/chat.json?q=";
var body = document.getElementById('window');

function checkResponse(response) {
  if(response.status===200) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function getJSON(response) {
  return response.json();
}

var send_message = function(message) {
  fetch(url + encodeURI(message), { method: "get", cache: "no-store" })
    .then(checkResponse)
    .then(getJSON)
    .then(function(data) {
      reply = undefined;
      reply = data.answers[0].data[0].answer;
    })
    .catch(function(err) {
      reply=undefined;
      reply = "Sorry. There seems to be a problem."
    })
}

var append = function(text, attr){
  let el = document.createElement("div");
  el.setAttribute(attr.name, attr.val);
  el.appendChild(document.createTextNode(text));
  list.appendChild(el);
  if (attr.val === "from-them") {
    addTime({ name: "class", val: "susi", text: "susi" });
  } else {
    addTime({ name: "class", val: "me", text: "you" });
  }
  let clear = document.createElement("div");
  clear.setAttribute("class", "clear");
  list.appendChild(clear);
}

var addReply = function() {
  if(reply != undefined) {
    append(reply, { name: "class", val: "from-them" });
    reply = undefined;
  }
}

var addTime = function(attr) {
  let date = new Date();
  let time = document.createElement("div");
  time.setAttribute(attr.name, attr.val);
  time.innerHTML = attr.text + "    " + date.getHours() + ":" +date.getMinutes();
  list.appendChild(time);
}

text.onkeypress = function(e){
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13'){
    e.preventDefault();
    let message = text.value;
    if (message.length !== 0) {
      text.value = "";
      send_message(message);
      append(message, { name: "class", val: "from-me" });
      addReply();
    }
    $('html,body').animate({
      scrollTop: $("#message-data").offset().top + list.scrollHeight}, 1200);
    }
}
