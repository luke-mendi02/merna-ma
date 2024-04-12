import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [instructor, setInstructor] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [selectedClassName, setSelectedClassName] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedClassInfo, setSelectedClassInfo] = useState(null);

  // Instructor Data
  useEffect(() => {
    axios.get('http://localhost:3001/Instructor')
      .then(response => setInstructor(response.data))
      .catch(error => console.error(error));
  }, []);

  // Class data
  useEffect(() => {
    axios.get('http://localhost:3001/Class')
      .then(response => setClasses(response.data))
      .catch(error => console.error(error));
  }, []);

  // Class section data
  useEffect(() => {
    axios.get('http://localhost:3001/ClassSection')
      .then(response => setClassSections(response.data))
      .catch(error => console.error(error));
  }, []);


  useEffect(() => {
    if (selectedClassName && selectedSection) {
      const matchingClass = classes.find(classItem => classItem.className === selectedClassName);
      const matchingSection = classSections.find(section => section.section === selectedSection && section.courseID === matchingClass.courseID);

      if (matchingClass && matchingSection) {
        setSelectedClassInfo({
          // Class collection information
          className: matchingClass.className,
          classID: matchingClass.classID,
          creditHours: matchingClass.creditHours,
          classDescription: matchingClass.classDescription,
          prerequisites: matchingClass.prerequisites,
          learningOutcomes: matchingClass.learningOutcomes,
          modules: matchingClass.modules,
          // Class Section collection information
          section: matchingSection.section,
          crn: matchingSection.crn,
          meetingTimes: matchingSection.meetingTimes,
          finalExam: matchingSection.finalExam,
          meetingLocation: matchingSection.meetingLocation,
          meetingDays: matchingSection.meetingDays,
        });
      } else {
        setSelectedClassInfo(null);
      }
    } else {
      setSelectedClassInfo(null);
    }
  }, [selectedClassName, selectedSection, classes, classSections]);

  return (
    <div>
      <h1>Instructor Information</h1>
      {instructor && (
        <div>
          <p>Name: {instructor.name}</p>
          <p>Office Hours: {instructor.officeHours}</p>
          <p>Appointment Requests: {instructor.appointmentRequests}</p>
          <p>Lewis Email: {instructor.lewisEmail}</p>
          <p>Lewis Phone: {instructor.lewisPhone}</p>
          <p>Office: {instructor.office}</p>
        </div>
      )}

      <h1>Select Class</h1>
      <select value={selectedClassName} onChange={e => setSelectedClassName(e.target.value)}>
        <option value="">Select a class name</option>
        {classes.map(classItem => (
          <option key={classItem._id} value={classItem.className}>{classItem.className}</option>
        ))}
      </select>

      <h1>Select Class Section</h1>
      <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
        <option value="">Select a section</option>
        {classSections.map(section => (
          <option key={section._id} value={section.section}>{section.section}</option>
        ))}
      </select>

      {selectedClassInfo && (
        <div>
          <p>Class Name: {selectedClassInfo.className}</p>
          <p>Class ID: {selectedClassInfo.classID}</p>
          <p>Section: {selectedClassInfo.section}</p>
          <p>CRN: {selectedClassInfo.crn}</p>
          <p>Credit Hours: {selectedClassInfo.creditHours}</p>
          <p>Description: {selectedClassInfo.classDescription}</p>
          <p>Prerequisites: {selectedClassInfo.prerequisites}</p>
          <p>Course Meeting Time: {selectedClassInfo.meetingTimes}</p>
          <p>Course Meeting Dates: {selectedClassInfo.meetingDays}</p>
          <p>Meeting Location: {selectedClassInfo.meetingLocation}</p>
          <p>Learning Outcomes: {selectedClassInfo.learningOutcomes}</p>
          <p>Final Exam Date/Time: {selectedClassInfo.finalExam}</p>
        </div>
      )}
    </div>
  );
}

export default App;