import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const classes = [
    { id: 1, name: "Class 10A", students: 48 },
    { id: 2, name: "Class 9B", students: 52 },
  ];

  return (
    <div>
      <h3>Good Morning 👋</h3>

      {classes.map((cls) => (
        <div
          key={cls.id}
          className="card"
          onClick={() => navigate(`/class/${cls.id}`)}
        >
          <h4>{cls.name}</h4>
          <p>{cls.students} Students</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
