// imports vendor
var express = require('express')
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bodyParser = require("body-parser")
var urlLib = require("url");
var http = require("http");
var rp = require("request-promise");

// imports app
var constants = require("../shared/constants")
var apiEndpoints = require("../shared/apiEndpoints")
var models = require("./mongoModels")
var helpers = require("./helpers")

// app setup
var app = express()
const PORT = process.env.PORT || constants.kServerPort;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mongo ORM setup
var mongoConnectionStr = 'mongodb://localhost/' + constants.kMongoDbName;
mongoose.Promise = global.Promise;
mongoose.connect(mongoConnectionStr);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to Mongo database");
});

// endpoint to approve a design
app.post(apiEndpoints.kApiApproveDesign, function (req, res) {
  let { designUrl } = req.body;
  // find the mongo object
  models.DesignModel.findOne({ "url": new RegExp(designUrl, "i") }).exec()
    .then((doc) => {
      if (doc) {
        // flip the approve switch
        doc.pending = false;
        let dateNow = Date.now()
        doc.modified = dateNow;
        doc.save();
        res.status(200).end("Successfully approved design!");
      }
    })
    .catch((error) => {
      res.end(404).end(error);
    })
})

// endpoint to update a design indexed by the design id ( can also approve)
app.put(apiEndpoints.kApiSubmitDesign, function (req, res) {
  let { design } = req.body;
  let dateNow = Date.now()
  design.modified = dateNow;
  // find the mongo object
  models.DesignModel.findOneAndUpdate({ "_id": design._id }, design).exec()
    .then((doc) => {
      if (doc) {
        res.status(200).end("Successfully updated design!");
      }
    })
    .catch((error) => {
      res.end(404).end(error);
    })
})

// endpoint to write a new design for approval
app.post(apiEndpoints.kApiSubmitDesign, function (req, res) {
  // parse the body for the design info
  let { url, title, description, imageData } = req.body;

  if (!(url.startsWith("http") && url.startsWith("https"))) {
    // assume http
    url = "http://" + url;
  }

  var options = {
    uri: url,
    followRedirect: true,
  }
  rp.get(options)
    .then(function (pingResponse) {
      // at this point we have verified that url is valid
      Promise.resolve();
    })
    .then(function () {
      // get the hostname to verify uniqueness
      let parsedUrl = urlLib.parse(url);
      let hostname = parsedUrl.hostname;
      // hostname only passes if the user entered the protocol. If he didn't then take the pathname as the web url
      if (!hostname)
        hostname = parsedUrl.pathname
      // check if that design has been submitted already
      return models.DesignModel.findOne({ "url": new RegExp(hostname, "i") }).exec();
    })
    .then(function (design) {
      // end request if found
      if (design) {
        throw new Error("A url for that website has already been submitted before.")
      } else if (imageData) {
        Promise.resolve(imageData);
      } else {
        return helpers.getUrlSnapshost(url);
      }
      // take a snaphost of the website
    })
    .then(function (image) {
      let dateNow = Date.now();
      // create a model
      let designModel = new models.DesignModel({
        url: url,
        description: description,
        title: title,
        imageData: image,
        added: dateNow,
        modified: dateNow,
        pending: true
      });
      return designModel.save();
    })
    .then(function (design) {
      res.status(200).send("Thank you for your contribution. We will review your submission promptly.");
    })
    .catch(function (err) {
      res.status(400).send(err);
    })
})

// endpoint to read the number of approvals
app.get(apiEndpoints.kApiNumApprovals, function (req, res) {
  let query = models.DesignModel.count({ "pending": true }).exec();
  query.then(function (designs) {
    res.status(200).json(designs);
  })
    .catch(function (err) {
      res.status(400).end("Could fetch number of approvals");
    });
});

// endpoint to read the approvals
app.get(apiEndpoints.kApiReadDesigns, function (req, res) {
  let skip = parseInt(req.query.skip);
  let limit = parseInt(req.query.limit);
  let pending = (req.query.approval == "true");
  let findPending = models.DesignModel.find({ "pending": pending }, null, { "skip": skip, "limit": limit, sort: { added: -1 } }).exec();
  findPending.then(function (designs) {
    res.status(200).json(designs);
  })
    .catch(function (err) {
      res.status(400).end("Could not fetch pending designs");
    });
});

// endpoint to read a single design
app.get(apiEndpoints.kApiReadDesign, function (req, res) {
  let designId = req.query.designId;
  models.DesignModel.findOne({ "_id": designId }).exec()
    .then(function (designs) {
      res.status(200).json(designs);
    })
    .catch(function (err) {
      res.status(400).end("Could not fetch pending designs");
    });
});

app.get("/api/heartbeat", function (req, res) {
  res.send("Successful connection through proxy.")
})

app.listen(PORT, function () {
  console.log('Example app listening on port', PORT)
})
