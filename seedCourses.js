const Course = require('./models/Course');
const sequelize = require('./config/database');

const bachelorCourses = [
  "Computer Science",
  "Information Technology",
  "Engineering",
  "Automotive Electronics Engineering",
  "Electrical and Automation Engineering",
  "Electrical and Biomedical Engineering",
  "Renwable Energy Engineering",
  "Mechanical Engineering",
  "Mechatronics and Material Engineering",
  "Cicil and Highway Engineering",
  "Civil Engineering",
  "Civil and Irrigation Engineering",
  "Labaratory Science and Industrial Technology",
  "Auto-Electrics and Electronics Engineering"
];

const diplomaCourses = [
  "Electronics and Telecommunication",
  "Computer Science",
  "Auto-Electric And Electronics Engineering",
  "Automotive Engineering",
  "Heavy Duty Equipment Engineering",
  "Electrical and Biomedical Engineering",
  "Electrical and Solar PV Systems Engineering",
  "Electrical and Wind Energy Systems Engineering",
  "Hydropower Engineering",
  "Instrumentation Engineering",
  "Mechanical and Bio-Energy Engineering",
  "Mechanical Engineering",
  "Pipe Works, Oil and Gas Engineering",
  "Civil and Highway Engineering",
  "Civil and Irrigation Engineering",
  "Civil Engineering"
];

async function seedCourses() {
  await sequelize.sync();
  for (const name of bachelorCourses) {
    await Course.findOrCreate({ where: { name, type: 'Bachelor' } });
  }
  for (const name of diplomaCourses) {
    await Course.findOrCreate({ where: { name, type: 'Diploma' } });
  }
  console.log('Courses seeded!');
  process.exit();
}

seedCourses();