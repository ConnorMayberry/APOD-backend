"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImagesSchema = new Schema({
    date: {
        type: Schema.Types.Date,
        required: true
    },
    explanation: {
        type: Schema.Types.String,
        required: true
    },
    hdurl: [{
        type: Schema.Types.String, 
        required: true
    }],
    media_type: [{
        type: Schema.Types.String, 
        required: true
    }],
    service_version: [{
        type: Schema.Types.String, 
        required: true
    }],
    title: [{
        type: Schema.Types.String, 
        required: true
    }],
    url: [{
        type: Schema.Types.String, 
        required: true
    }]
});

ImagesSchema.statics.create = function(obj) {
    const Images = mongoose.model("Images", ImagesSchema);
    const image = new Images();
    image.date = obj.date;
    image.explanation = obj.explanation;
    image.hdurl = obj.hdurl; //.map(doctor => doctor._id);
    image.media_type = obj.media_type;
    image.service_version = obj.service_version;
    image.title = obj.title;
    image.url = obj.url;
    return image;
}

module.exports = mongoose.model("Images", ImagesSchema);
