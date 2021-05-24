"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const FavoriteDoctor = require("./schema/FavoriteDoctor");
const FavoriteCompanion = require("./schema/FavoriteCompanion");
const router = express.Router();
const fetch = require("node-fetch");


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------

//GET where image is favorited (date (key) -> is_favorited?) 
//Inputs: .date (YYYY-MM-DD) from body
//Outputs: image or null
//{
//     "date": "2021-05-18",
//     "explanation": "What celestial body wears the Necklace Nebula? First, analyses indicate that the Necklace is a planetary nebula, a gas cloud emitted by a star toward the end of its life. Also, what appears to be diamonds in the Necklace are actually bright knots of glowing gas.  In the center of the Necklace Nebula are likely two stars orbiting so close together that they share a common atmosphere and appear as one in the featured image by the Hubble Space Telescope.  The red-glowing gas clouds on the upper left and lower right are the results of jets from the center.  Exactly when and how the bright jets formed remains a topic of research.  The Necklace Nebula is only about 5,000 years old, spans about 5 light years, and can best be found with a large telescope toward the direction of the constellation of the Arrow (Sagitta).",
//     "hdurl": "https://apod.nasa.gov/apod/image/2105/Necklace_Hubble_2029.jpg",
//     "media_type": "image",
//     "service_version": "v1",
//     "title": "Jets from the Necklace Nebula",
//     "url": "https://apod.nasa.gov/apod/image/2105/Necklace_Hubble_960.jpg"
// }

//POST favorites
//Inputs: image (json object)(copyright, date, explanation, hdurl, media_type, service_version, title, url)
//Outputs: 200 OK 

//DELETE favorites
//Inputs: .date
//Outputs: 200 OK

//GET NASA images (a weeks worth)
//https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}&start_date=2021-05-13&end_date=2021-05-19
//Set Start Date to today date - 7 days and end_date to today's date
//Inputs: 
//Outputs: images from api key or if that doesn't work: {response: [images]}

//GET all favorites
//Inputs: nothing
//Outputs: images from MongoDB
// images: [{
//     "date": "2021-05-18",
//     "explanation": "What celestial body wears the Necklace Nebula? First, analyses indicate that the Necklace is a planetary nebula, a gas cloud emitted by a star toward the end of its life. Also, what appears to be diamonds in the Necklace are actually bright knots of glowing gas.  In the center of the Necklace Nebula are likely two stars orbiting so close together that they share a common atmosphere and appear as one in the featured image by the Hubble Space Telescope.  The red-glowing gas clouds on the upper left and lower right are the results of jets from the center.  Exactly when and how the bright jets formed remains a topic of research.  The Necklace Nebula is only about 5,000 years old, spans about 5 light years, and can best be found with a large telescope toward the direction of the constellation of the Arrow (Sagitta).",
//     "hdurl": "https://apod.nasa.gov/apod/image/2105/Necklace_Hubble_2029.jpg",
//     "media_type": "image",
//     "service_version": "v1",
//     "title": "Jets from the Necklace Nebula",
//     "url": "https://apod.nasa.gov/apod/image/2105/Necklace_Hubble_960.jpg"
// },
// {
//     "copyright": "Jason Guenzel",
//     "date": "2021-05-19",
//     "explanation": "Normally faint and elusive, the Jellyfish Nebula is caught in this alluring scene. In the telescopic field of view two bright yellowish stars, Mu and Eta Geminorum, stand just below and above the Jellyfish Nebula at the left. Cool red giants, they lie at the foot of the celestial twin. The Jellyfish Nebula itself floats below and left of center, a bright arcing ridge of emission with dangling tentacles. In fact, the cosmic jellyfish is part of bubble-shaped supernova remnant IC 443, the expanding debris cloud from a massive star that exploded. Light from that explosion first reached planet Earth over 30,000 years ago. Like its cousin in astrophysical waters the Crab Nebula supernova remnant, the Jellyfish Nebula is known to harbor a neutron star, the remnant of the collapsed stellar core. Composed on April 30, this telescopic snapshot also captures Mars. Now wandering through early evening skies, the Red Planet also shines with a yellowish glow on the right hand side of the field of view. Of course, the Jellyfish Nebula is about 5,000 light-years away, while Mars is currently almost 18 light-minutes from Earth.",
//     "hdurl": "https://apod.nasa.gov/apod/image/2105/Guenzel-JellyfishMars30APR2021.jpg",
//     "media_type": "image",
//     "service_version": "v1",
//     "title": "The Jellyfish and Mars",
//     "url": "https://apod.nasa.gov/apod/image/2105/Guenzel-JellyfishMars30APR2021_1000.jpg"
// }]

router.route("/images")
    .get((req, res) => {
        console.log(`GET /images`);
        var end_date = new Date().toISOString().slice(0, 10)
        var start_date = new Date()
        start_date.setDate(start_date.getDate() - 7)
        start_date = start_date.toISOString().slice(0, 10)
        console.log("today's date is: ", end_date)
        console.log("start date is: ", start_date)
        console.log("")
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}&start_date=${start_date}&end_date=${end_date}`)
            .then(response => response.json())
            .then(data => {
                res.status(200).send(data)
            })
    });

router.route("/images/favorited")
    .get((req, res) => {
        console.log(`GET /images/favorited`);
        // Images.findOne({date: req.body.date})
        //     .then(response => {
        //         if (response)
        //             res.status(200).send(response)
        //         else
        //             res.status(404).send(null)
        //     })
        var data = {
                "date": "2021-05-18",
                "explanation": "What celestial body wears the Necklace Nebula? First, analyses indicate that the Necklace is a planetary nebula, a gas cloud emitted by a star toward the end of its life. Also, what appears to be diamonds in the Necklace are actually bright knots of glowing gas.  In the center of the Necklace Nebula are likely two stars orbiting so close together that they share a common atmosphere and appear as one in the featured image by the Hubble Space Telescope.  The red-glowing gas clouds on the upper left and lower right are the results of jets from the center.  Exactly when and how the bright jets formed remains a topic of research.  The Necklace Nebula is only about 5,000 years old, spans about 5 light years, and can best be found with a large telescope toward the direction of the constellation of the Arrow (Sagitta).",
                "hdurl": "https://apod.nasa.gov/apod/image/2105/Necklace_Hubble_2029.jpg",
                "media_type": "image",
                "service_version": "v1",
                "title": "Jets from the Necklace Nebula",
                "url": "https://apod.nasa.gov/apod/image/2105/Necklace_Hubble_960.jpg"
            }
        res.status(200).send(data)
    })
    .delete((req, res) => {
        console.log(`DELETE /images/favorited/${req.body.date}`);
        // Images.findOneAndDelete({date: req.body.date})
        //     .then(response => {
        //         if (response)
        //             res.status(200).send(null)
        //         else
        //             res.status(404).send("Couldn't find favorite image to delete")
        //     })
        res.status(200).send("Deleting from favorites")
    });

router.route("/images/favorites")
    .get((req, res) => {
        console.log("GET /images/favorites");

        // Images.find({})
        //     .then(data => {
        //         res.status(200).send(data);
        //     })
        //     .catch(err => {
        //         res.status(500).send(err);
        //     });
        var data = [{
                "date": "2021-05-18",
                "explanation": "What celestial body wears the Necklace Nebula? First, analyses indicate that the Necklace is a planetary nebula, a gas cloud emitted by a star toward the end of its life. Also, what appears to be diamonds in the Necklace are actually bright knots of glowing gas.  In the center of the Necklace Nebula are likely two stars orbiting so close together that they share a common atmosphere and appear as one in the featured image by the Hubble Space Telescope.  The red-glowing gas clouds on the upper left and lower right are the results of jets from the center.  Exactly when and how the bright jets formed remains a topic of research.  The Necklace Nebula is only about 5,000 years old, spans about 5 light years, and can best be found with a large telescope toward the direction of the constellation of the Arrow (Sagitta).",
                "hdurl": "https://apod.nasa.gov/apod/image/2105/Necklace_Hubble_2029.jpg",
                "media_type": "image",
                "service_version": "v1",
                "title": "Jets from the Necklace Nebula",
                "url": "https://apod.nasa.gov/apod/image/2105/Necklace_Hubble_960.jpg"
            },
            {
                "copyright": "Jason Guenzel",
                "date": "2021-05-19",
                "explanation": "Normally faint and elusive, the Jellyfish Nebula is caught in this alluring scene. In the telescopic field of view two bright yellowish stars, Mu and Eta Geminorum, stand just below and above the Jellyfish Nebula at the left. Cool red giants, they lie at the foot of the celestial twin. The Jellyfish Nebula itself floats below and left of center, a bright arcing ridge of emission with dangling tentacles. In fact, the cosmic jellyfish is part of bubble-shaped supernova remnant IC 443, the expanding debris cloud from a massive star that exploded. Light from that explosion first reached planet Earth over 30,000 years ago. Like its cousin in astrophysical waters the Crab Nebula supernova remnant, the Jellyfish Nebula is known to harbor a neutron star, the remnant of the collapsed stellar core. Composed on April 30, this telescopic snapshot also captures Mars. Now wandering through early evening skies, the Red Planet also shines with a yellowish glow on the right hand side of the field of view. Of course, the Jellyfish Nebula is about 5,000 light-years away, while Mars is currently almost 18 light-minutes from Earth.",
                "hdurl": "https://apod.nasa.gov/apod/image/2105/Guenzel-JellyfishMars30APR2021.jpg",
                "media_type": "image",
                "service_version": "v1",
                "title": "The Jellyfish and Mars",
                "url": "https://apod.nasa.gov/apod/image/2105/Guenzel-JellyfishMars30APR2021_1000.jpg"
            }]
        res.status(200).send(data);
    })
    .post((req, res) => {
        console.log(`POST /images/favorites/${req.body.date}`);
        // Images.create({
        //     "copyright": req.body.copyright,
        //     "date": req.body.date,
        //     "explanation": req.body.explanation,
        //     "hdurl": req.body.hdurl,
        //     "media_type": req.body.media_type,
        //     "service_version": req.body.service_version,
        //     "title": req.body.title,
        //     "url": req.body.url 
        // }).save()
        //     .then(image => {
        //         res.status(200).send()
        //     })
        //     .catch(err => {
        //         res.status(500).send("bad data for posting to favorites")
        //     })
        var data = {
            "date": "2021-05-18",
            "explanation": "What celestial body wears the Necklace Nebula? First, analyses indicate that the Necklace is a planetary nebula, a gas cloud emitted by a star toward the end of its life. Also, what appears to be diamonds in the Necklace are actually bright knots of glowing gas.  In the center of the Necklace Nebula are likely two stars orbiting so close together that they share a common atmosphere and appear as one in the featured image by the Hubble Space Telescope.  The red-glowing gas clouds on the upper left and lower right are the results of jets from the center.  Exactly when and how the bright jets formed remains a topic of research.  The Necklace Nebula is only about 5,000 years old, spans about 5 light years, and can best be found with a large telescope toward the direction of the constellation of the Arrow (Sagitta).",
            "hdurl": "https://apod.nasa.gov/apod/image/2105/Necklace_Hubble_2029.jpg",
            "media_type": "image",
            "service_version": "v1",
            "title": "Jets from the Necklace Nebula",
            "url": "https://apod.nasa.gov/apod/image/2105/Necklace_Hubble_960.jpg"
        }
        res.status(200).send(data)
    });



module.exports = router;