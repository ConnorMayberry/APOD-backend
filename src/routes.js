"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const FavoriteDoctor = require("./schema/FavoriteDoctor");
const FavoriteCompanion = require("./schema/FavoriteCompanion");
const router = express.Router();


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
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /doctors");
        Doctor.create({
            "name": req.body.name,
            "seasons": req.body.seasons
        }).save()
            .then(doctor => {
                res.status(201).send(doctor)
            })
            .catch(err => {
                res.status(500).send("Bad data for creating doctor")
            })
    });

// optional:
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        FavoriteDoctor.find({})
            .then(favorite_doctors => {
                let favorite_doctors_ids = []
                favorite_doctors.forEach(function (favorite_doctor){
                    favorite_doctors_ids.push(favorite_doctor.doctor)
                })
                Doctor.find({_id: {$in: favorite_doctors_ids}})
                    .then(doctors => {
                        res.status(200).send(doctors)
                    })
            })
            .catch(err => {
                res.status(500).send(err)
            })
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        Doctor.findOne({_id: req.body.doctor_id})
            .then(doctor => {
                FavoriteDoctor.findOne({doctor: req.body.doctor_id})
                    .then(doctor2 => {
                        if (doctor2){
                            res.status(500).send("Already in favorites.")
                        }
                        else {
                            // console.log("found doctor is: ", doctor)
                            if (doctor) {
                                FavoriteDoctor.create(doctor._id).save()
                                .then(favorite_doctor => {
                                    res.status(201).send(doctor)
                                })
                            }
                            else  {
                                res.status(500).send("Doctor not found")
                            }
                        }
                        
                    })
                
            })
            .catch(err => {
                //console.log("err2 is: ", err)
                res.status(500).send("Bad data for creating doctor favorite")
            })
    });
    
router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        Doctor.findById(req.params.id)
            .then(doctor => {
                res.status(200).send(doctor)
            })
            .catch(err => {
                res.status(404).send("Couldn't find doctor")
            })
    })
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        Doctor.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new: true}
        ).then(doctor => {
            if (doctor) {
                res.status(200).send(doctor)
            }
            else {
                res.status(404).send("Doctor not found.")
            }
        }).catch(() => res.status(501).send("Request was unsuccessful"))
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        Doctor.findOneAndDelete({_id: req.params.id})
            .then (response => {
                if (response)
                    res.status(200).send(null)
                else
                    res.status(404).send("couldn't find doctor to delete")
            })
    });
    
router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        Companion.find({ doctors: { $in: req.params.id } }).then(companions => {
            res.status(200).send(companions);
        })
        .catch (err => {
            res.status(404).send("Couldn't find doctor")
        })
    });
    

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/goodparent`);

        Companion.find({ doctors: { $in: req.params.id } }).then(companions => {
            for (let i = 0 ; i < companions.length; i++){
                if (!companions[i].alive){
                    res.status(200).send(false)
                    return;
                }
                
            }
            res.status(200).send(true)
        })
        .catch (err => {
            res.status(404).send("Couldn't find doctor")
        })
    });

// optional:
router.route("/doctors/favorites/:doctor_id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/${req.params.doctor_id}`);
        FavoriteDoctor.findByIdAndDelete(req.params.doctor_id)
            .then(response => {
                res.status(200).send(null)
            })
    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /companions");
        Companion.create({
            "name": req.body.name,
            "character": req.body.character,
            "doctors": req.body.doctors,
            "seasons": req.body.seasons,
            "alive": req.body.alive
        }).save()
            .then(companion => {
                res.status(201).send(companion)
            })
            .catch(err => {
                res.status(500).send("bad data for creating companion")
            })
    });

router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        Companion.find({})
        .then(companions => {
            var result = [];
            companions.forEach(function (companion) {
                if (companion.doctors.length > 1)
                    result.push(companion)
            })
            res.status(200).send(result)
        })
    });

// optional:
router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        FavoriteCompanion.find({})
            .then(favorite_companions => {
                let favorite_companions_ids = []
                favorite_companions.forEach(function (favorite_companion){
                    favorite_companions_ids.push(favorite_companion.companion)
                })
                Companion.find({_id: {$in: favorite_companions_ids}})
                    .then(companions => {
                        res.status(200).send(companions)
                    })
            })
            .catch(err => {
                res.status(500).send(err)
            })
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        Companion.findOne({_id: req.body.companion_id})
        .then(companion => {
            FavoriteCompanion.findOne({companion: req.body.companion_id})
                .then(companion2 => {
                    if (companion2){
                        res.status(500).send("Already in favorites.")
                    }
                    else {
                        // console.log("found doctor is: ", doctor)
                        if (companion) {
                            FavoriteCompanion.create(companion._id).save()
                            .then(favorite_companion => {
                                res.status(201).send(companion)
                            })
                        }
                        else  {
                            res.status(500).send("Companion not found")
                        }
                    }
                    
                })
            
        })
        .catch(err => {
            //console.log("err2 is: ", err)
            res.status(500).send("Bad data for creating companion favorite")
        })
    })

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        Companion.findById(req.params.id)
            .then(companion => {
                res.status(200).send(companion)
            })
            .catch(err => {
                res.status(404).send("Couldn't find companion")
            })
    })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        Companion.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new: true}
        ).then(companion => {
            if (companion) {
                res.status(200).send(companion)
            }
            else {
                res.status(404).send("Companion not found.")
            }
        }).catch(() => res.status(501).send("Request was unsuccessful"))
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        Companion.findOneAndDelete({_id: req.params.id})
            .then(response => {
                if (response)
                    res.status(200).send(null)
                else
                    res.status(404).send("Couldn't find companion to delete")
            })
    });

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);
        Companion.findById(req.params.id)
            .then(companion => {
                Doctor.find({_id: {$in: companion.doctors}})
                    .then(doctors => {
                        res.status(200).send(doctors)
                    })})
            .catch(err => {
                res.status(404).send("Couldn't find companion")
            })
    });

router.route("/companions/:id/friends")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        Companion.findById(req.params.id).then(companion => {
            Companion.find({$and: [{seasons: { $in: companion.seasons }}, {_id: {$not: {$eq: req.params.id}}}]})
                .then(companions => {
                    res.status(200).send(companions)
                })
                .catch (err => {
                    res.status(404).send("Couldn't find companions.")
            })
            }).catch (err => {
                res.status(404).send("Couldn't find companion")
            })
        
    });

// optional:
router.route("/companions/favorites/:companion_id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/${req.params.companion_id}`);
        FavoriteCompanion.findByIdAndDelete(req.params.companion_id)
            .then(response => {
                res.status(200).send(null)
            })
    });

module.exports = router;