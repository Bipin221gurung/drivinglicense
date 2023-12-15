const User = require("../models/user");

// static time slots for the appointment booking
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

// loads examiner page
const getExaminer = async (req, res) => {
  if (req._parsedOriginalUrl.href == "/examiner") {
    const users = [];
    const userList = await User.find({
      $or: [
        {
          "g2Exam.appointmentID": { $exists: true },
          "g2Exam.isPassed": false,
        },
        { "gExam.appointmentID": { $exists: true }, "gExam.isPassed": false },
      ],
    })
      .populate("g2Exam.appointmentID")
      .populate("gExam.appointmentID");

    userList.forEach((user) => {
      const { g2Exam, gExam, userName, carDetails, comment, _id } = user;

      if (g2Exam.isPassed === true) {
        gExam.appointmentID.time = timeSlots[gExam.appointmentID.time];
        obj = { ...gExam, userName, carDetails, comment, _id };
      } else {
        g2Exam.appointmentID.time = timeSlots[g2Exam.appointmentID.time];
        obj = { ...g2Exam, userName, carDetails, comment, _id };
      }
      users.push(obj);
    });
    res.render("examiner", { users });
  } else if (req._parsedOriginalUrl.href == "/examiner/g2") {
    const users = [];
    const userList = await User.find({
      "g2Exam.appointmentID": { $exists: true },
      "g2Exam.isPassed": false,
    }).populate("g2Exam.appointmentID");
    userList.forEach((user) => {
      const { g2Exam, userName, carDetails, comment, _id } = user;

      g2Exam.appointmentID.time = timeSlots[g2Exam.appointmentID.time];
      obj = { ...g2Exam, userName, carDetails, comment, _id };

      users.push(obj);
    });
    res.render("examiner", { users });
  } else {
    const users = [];
    const userList = await User.find({
      "gExam.appointmentID": { $exists: true },
      "gExam.isPassed": false,
    }).populate("gExam.appointmentID");
    userList.forEach((user) => {
      const { gExam, userName, carDetails, comment, _id } = user;

      gExam.appointmentID.time = timeSlots[gExam.appointmentID.time];
      obj = { ...gExam, userName, carDetails, comment, _id };

      users.push(obj);
    });
    res.render("examiner", { users });
  }
};

// loads exam page
const takeExam = async (req, res) => {
  let user = await User.findById(req.params.id)
    .populate("g2Exam.appointmentID")
    .populate("gExam.appointmentID");

  const { g2Exam, gExam, userName, carDetails, comment, _id } = user;
  if (g2Exam.isPassed === true) {
    g2Exam.appointmentID.time = timeSlots[g2Exam.appointmentID.time];
    user = { ...g2Exam, userName, carDetails, comment, _id };
  } else {
    g2Exam.appointmentID.time = timeSlots[g2Exam.appointmentID.time];
    user = { ...g2Exam, userName, carDetails, comment, _id };
  }

  res.render("exam", { user });
};

const g2result = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.g2Exam.isPassed = req.body.result;
    user.g2Exam.comment = req.body.comment;
    user.g2Exam.hasTaken = true;

    await user.save();

    res.redirect("/examiner");
  } catch (error) {
    console.log(error);
    res.redirect("/examiner");
  }
};

const gresult = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.gExam.isPassed = req.body.result;
    user.gExam.comment = req.body.comment;
    user.gExam.hasTaken = true;

    await user.save();
    res.redirect("/examiner");
  } catch (error) {
    console.log(error);
    res.redirect("/examiner");
  }
};

// get candidates who book their appointments
const getCandidates = async (req, res) => {
  const users = [];
  const userList = await User.find({
    $or: [
      {
        "g2Exam.hasTaken": true,
      },
      { "gExam.hasTaken": true },
    ],
  })
    .populate("g2Exam.appointmentID")
    .populate("gExam.appointmentID");
  userList.forEach((user) => {
    const { g2Exam, gExam, userName, carDetails, _id } = user;

    if (g2Exam.isPassed === true) {
      obj = { ...g2Exam, userName, carDetails, _id };
    } else {
      obj = { ...gExam, userName, carDetails, _id };
    }
    users.push(obj);
  });
  res.render("candidates", { users });
};

module.exports = {
  getExaminer,
  takeExam,
  g2result,
  gresult,
  getCandidates,
};
