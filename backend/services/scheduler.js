function generateSchedule(courses, teachers, classrooms) {

  // Validación para evitar errores
  if (!courses.length || !teachers.length || !classrooms.length) {
    return [];
  }

  let blocks = ["8-10", "10-12", "2-4", "4-6"];
  let days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  let schedule = [];
  let index = 0;

  for (let course of courses) {
    schedule.push({
      course: course.name,
      day: days[index % 5],
      hour: blocks[index % 4],
      classroom: classrooms[index % classrooms.length].code,
      teacher: teachers[index % teachers.length].name,
    });

    index++;
  }

  return schedule;
}

module.exports = { generateSchedule };