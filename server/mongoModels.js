var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var DesignSchema = mongoose.Schema({
    id: Schema.Types.ObjectId,
    url: String,
    added: Date,
    modified: Date,
    tags: Array,
    title: String,
    description: String,
    imageData: String,
    likes: Number,
    submitterId: String,
    pending: Boolean
})

var DesignModel = mongoose.model("DesignModel", DesignSchema);

module.exports = {
    DesignModel
};