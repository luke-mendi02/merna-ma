const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const dotenv = require("dotenv")
dotenv.config()
app.use(cors())
const port = process.env.PORT || 3001


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@merna-ma.jo7ugk2.mongodb.net/syllabus?retryWrites=true&w=majority`;
mongoose.connect(uri);

const instructorSchema = new mongoose.Schema({
  name: String,
  officeHours: String,
  appointmentRequests: String,
  lewisEmail: String,
  lewisPhone: String,
  office: String,
  instructorID: Number
});

const classSchema = new mongoose.Schema({
  className: String,
  classID: String,
  classNumber: Number,
  creditHours: Number,
  classDescription: String,
  prerequisites: String,
  learningOutcomes: String,
  modules: String,
  instructorID: Number,
  courseID: Number
})

const sectionSchema = new mongoose.Schema({
  section: String,
  crn: String,
  meetingDays: String,
  meetingTime: String,
  finalExam: String,
  meetingLocation: String,
  courseID: Number,
  classSectionID: String,
})

const Instructor = mongoose.model('Instructor', instructorSchema, 'Instructor');
const Class = mongoose.model('Class', classSchema, 'Class')
const Section = mongoose.model('ClassSection', sectionSchema, 'ClassSection')
app.get('/Instructor', async (req, res) => {
  try {
    const instructor = await Instructor.findOne();
    if (!instructor) {
      console.log('No instructor found');
      res.status(404).json({ message: 'Instructor not found' });
      return;
    }
    console.log('Retrieved instructor:', instructor);
    res.json(instructor);
  } catch (error) {
    console.error('Error retrieving instructor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/Class', async (req, res) => {
  try {
    const classes = await Class.find({});
    if (!classes) {
      console.log('No classes found');
      res.status(404).json({ message: 'Classes not found' });
      return;
    }
    console.log('Retrieved classes:', classes);
    res.json(classes);
  } catch (error) {
    console.error('Error retrieving classes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/ClassSection', async (req, res) => {
  try {
    const classSection = await Section.find({});
    if (!classSection) {
      console.log('No class sections found');
      res.status(404).json({ message: 'Class sections not found' });
      return;
    }
    console.log('Retrieved class sections:', classSection);
    res.json(classSection);
  } catch (error) {
    console.error('Error retrieving class sections:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/ClassSectionAndInstructor', async (req, res) => {
  try {
    const classes = await Class.find({});

    const classSections = await Section.find({});

    const instructors = await Instructor.find({});

    const result = classes.map(classItem => {
      const matchingSection = classSections.find(section => section.courseID === classItem.courseID);
      const matchingInstructor = instructors.find(instructor => instructor.instructorID === classItem.instructorID);
      return {
        className: classItem.className,
        classID: classItem.classID,
        creditHours: classItem.creditHours,
        classDescription: classItem.classDescription,
        prerequisites: classItem.prerequisites,
        learningOutcomes: classItem.learningOutcomes,
        modules: classItem.modules,

        section: matchingSection ? matchingSection.section : null,
        crn: matchingSection ? matchingSection.crn : null,
        meetingDays: matchingSection ? matchingSection.meetingDays : null,
        meetingTimes: matchingSection ? matchingSection.meetingTimes : null,
        finalExam: matchingSection ? matchingSection.finalExam : null,
        meetingLocation: matchingSection ? matchingSection.meetingLocation : null,
        classSectionID: matchingSection ? matchingSection.classSectionID : null,

        instructorName: matchingInstructor ? matchingInstructor.name : null,
        appointmentRequests: matchingInstructor ? matchingInstructor.appointmentRequests : null,
        lewisEmail: matchingInstructor ? matchingInstructor.lewisEmail : null,
        lewisPhone: matchingInstructor ? matchingInstructor.lewisPhone : null,
        office: matchingInstructor ? matchingInstructor.office : null,
        officeHours: matchingInstructor ? matchingInstructor.officeHours : null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching class section and instructor data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Custom 404 page.
app.use((request, response) => {
  response.type('text/plain')
  response.status(404)
  response.send('404 - Not Found')
})

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message)
  response.type('text/plain')
  response.status(500)
  response.send('500 - Server Error')
})

app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` +
  `press Ctrl-C to terminate.`)
)
