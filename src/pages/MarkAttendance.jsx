import { useState, useEffect } from "react";

function MarkAttendance() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "Rahul Sharma", present: true },
          { name: "Priya Singh", present: true },
          { name: "Arjun Kumar", present: true },
        ];
  });

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const toggleAttendance = (index) => {
    const updated = [...students];
    updated[index].present = !updated[index].present;
    setStudents(updated);
  };

  return (
    <div>
      <h3>Mark Attendance</h3>

      {students.map((student, index) => (
        <div key={index} className="card">
          <input
            type="checkbox"
            checked={student.present}
            onChange={() => toggleAttendance(index)}
          />{" "}
          {student.name}
        </div>
      ))}

      <button onClick={() => alert("Attendance Saved!")}>
        Save Attendance
      </button>
    </div>
  );
}

export default MarkAttendance;
