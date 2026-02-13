import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

function TeacherDashboard() {
  const { currentUser, userData } = useAuth();

  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);

  // 🔹 CREATE CLASS
  const handleCreateClass = async () => {
    if (!className) return;

    await addDoc(collection(db, "classes"), {
      name: className,
      schoolId: userData.schoolId,
      teacherId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setClassName("");
    fetchClasses(); // refresh list after creating
  };

  // 🔹 FETCH CLASSES
  const fetchClasses = async () => {
    const q = query(
      collection(db, "classes"),
      where("teacherId", "==", currentUser.uid),
    );

    const snapshot = await getDocs(q);
    const classList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setClasses(classList);
  };

  // 🔹 RUN ON LOAD
  useEffect(() => {
    if (currentUser) {
      fetchClasses();
    }
  }, [currentUser]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Teacher Dashboard</h2>

      {/* Create Class Section */}
      <input
        type="text"
        placeholder="Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <button onClick={handleCreateClass}>Create Class</button>

      {/* Show Classes Section */}
      <h3>Your Classes</h3>
      <ul>
        {classes.map((c) => (
          <li
            key={c.id}
            style={{ cursor: "pointer", marginBottom: "8px" }}
            onClick={() => navigate(`/teacher/class/${c.id}`)}
          >
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeacherDashboard;
