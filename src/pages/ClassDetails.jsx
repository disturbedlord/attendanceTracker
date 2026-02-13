import { useNavigate, useParams } from "react-router-dom";

function ClassDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const students = [
    { name: "Rahul Sharma", percentage: 82 },
    { name: "Priya Singh", percentage: 91 },
    { name: "Arjun Kumar", percentage: 67 },
  ];

  return (
    <div>
      <h3>Class {id}</h3>

      <button
        style={{ marginBottom: 20 }}
        onClick={() => navigate(`/class/${id}/attendance`)}
      >
        Mark Attendance
      </button>

      {students.map((student, index) => (
        <div key={index} className="card">
          <p>
            {student.name} - {student.percentage}%
          </p>
        </div>
      ))}
    </div>
  );
}

export default ClassDetails;
