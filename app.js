/*jslint node: true */
"use strict";

var soap = require("soap");
var express = require("express");
var fs = require("fs");

// the splitter function, used by the service
function splitter_function(args) {
  console.log("splitter_function");
  var splitter = args.splitter;
  var splitted_msg = args.message.split(splitter);
  var result = [];
  for (var i = 0; i < splitted_msg.length; i++) {
    result.push(splitted_msg[i]);
  }
  return {
    result: result,
  };
}

// the joiner function, used by the service
function join_function(args) {
  console.log("join_function");
  var joiner = args.joiner;
  var joins = args.message;
  var result = "";

  //joins.forEach((join) => {
  //  result = result + join + joiner;
  //});

  return joins.join(joiner);
}

// the service
var serviceObject = {
  MessageSplitterService: {
    MessageSplitterServiceSoapPort: {
      MessageSplitter: join_function,
    },
    MessageSplitterServiceSoap12Port: {
      MessageSplitter: join_function,
    },
  },
};

// load the WSDL file
var xml = fs.readFileSync("service.wsdl", "utf8");
// create express app
var app = express();

// root handler
app.get("/", function (req, res) {
  res.send(
    'Node Soap Example!<br /><a href="https://github.com/macogala/node-soap-example#readme">Git README</a>'
  );
});

// Launch the server and listen
var port = 8000;
app.listen(port, function () {
  console.log("Listening on port " + port);
  var wsdl_path = "/wsdl";
  soap.listen(app, wsdl_path, serviceObject, xml);
  console.log(
    "Check http://localhost:" +
      port +
      wsdl_path +
      "?wsdl to see if the service is working"
  );
});
