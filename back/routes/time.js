var express = require("express");
var router = express.Router();
const User = require("../models/User");

// API endpoint to add a new time for a user
router.post("/addtime/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const newTime = req.body.time;
    console.log(newTime);
    if (!newTime) {
      return res.status(400).send("Time must be provided");
    } else if (user.times.includes(newTime)) {
      return res.status(400).send("Time already exists");
    }
    user.times.push(newTime);
    await user.save();
    res.send(user);
  } catch (error) {
    console.error("Error adding time to user", error);
    res.status(500).send("Error adding time to user");
  }
});

//Get api time with id
router.get("/gettime/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ times: user.times });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//delete time
router.delete("/deletetime/:id/:time", async (req, res) => {
  const userId = req.params.id;
  const time = req.params.time;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { times: time } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update time
router.put("/updatetime/:id/:time", async (req, res) => {
  const userId = req.params.id;
  const timeToUpdate = req.params.time;
  const newTime = req.body.time;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.times.findIndex((time) => time === timeToUpdate);
    if (index === -1) {
      return res.status(404).json({ message: "Time not found" });
    }

    user.times[index] = newTime;
    await user.save();

    res.json({ message: "Time updated successfully", user });
  } catch (error) {
    console.error("Error updating time", error);
    res.status(500).json({ message: "Error updating time" });
  }
});

module.exports = router;
