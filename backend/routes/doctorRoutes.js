const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');


router.post('/add-doctor', async (req, res) => {
  try {
    const { name, specialization, experience, contact } = req.body;
    if (!name || !specialization || !experience || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const doctor = new Doctor({ name, specialization, experience, contact });
    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Error adding doctor', error: err.message });
  }
});

router.get('/list-doctor-with-filter', async (req, res) => {
  try {
    const { specialization, experience, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (specialization) filter.specialization = specialization;
    if (experience) filter.experience = { $gte: experience };

    const doctors = await Doctor.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ doctors });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
});

module.exports = router;
