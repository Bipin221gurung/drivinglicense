const mongoose = require("mongoose");

const User = require("../models/user");
const Appointment = require("../models/appointment");

const timeSlots = {
  slot1: "09:00AM to 09:30AM",
  slot2: "09:30AM to 10:00AM",
  slot3: "10:00AM to 10:30AM",
  slot4: "10:30AM to 11:00AM",
  slot5: "11:00AM to 11:30AM",
  slot6: "11:30AM to 12:00PM",
  slot7: "12:00PM to 12:30PM",
  slot8: "12:30PM to 01:00PM",
  slot9: "01:00PM to 01:30PM",
  slot10: "01:30PM to 02:00PM",
};
// Render G page
const getG = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (mongoose.Types.ObjectId.isValid(user.gExam.appointmentID)) {
      const appointmentDetail = await Appointment.findById(
        mongoose.Types.ObjectId(user.gExam.appointmentID)
      );
      const appointmentObj = {
        firstName: user.firstName,
        date: appointmentDetail.date,
        time: timeSlots[appointmentDetail.time],
      };
      res.render("gtest", {
        user: user,
        date: null,
        appointment: appointmentObj,
      });
    } else {
      res.render("gtest", {
        user: user,
        date: null,
        appointment: null,
      });
    }
  } catch (error) {
    res.render("gtest", {
      user: false,
    });
  }
};

const updateUser = async (req, res) => {
  let user;
  try {
    user = await User.findById(req.session.userId);
    user.carDetails.make = req.body.make || user.carDetails.make;
    user.carDetails.model = req.body.model || user.carDetails.model;
    user.carDetails.year = req.body.year || user.carDetails.year;
    user.carDetails.platNumber =
      req.body.platNumber || user.carDetails.platNumber;

    user = await user.save();
    res.render("gtest", { user: user,appointment: null });
  } catch (error) {
    res.redirect("/");
  }
};

module.exports = {
  getG,
  updateUser,
};
