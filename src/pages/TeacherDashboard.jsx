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
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

function TeacherDashboard() {
  const navigate = useNavigate();

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
    <div className="py-2">
      {/* Show Classes Section */}
      <div className="avi_title">Your Classes</div>
      <ul>
        {classes.map((c) => (
          <li
            key={c.id}
            style={{ cursor: "pointer", marginBottom: "8px" }}
            onClick={() => navigate(`/teacher/class/${c.id}`)}
          >
            {/* <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center"> */}

            <div className=" shadow-sm p-2 rounded font-semibold z-50 border border-gray-200">
              {c.name}
            </div>
          </li>
        ))}
      </ul>

      {/* Create Class Section */}
      <div className="text-lg font-semibold mb-2 underline">
        Add a new Class
      </div>
      <input
        className="block border w-full grow bg-gray py-1.5 pr-3 pl-1 text-base 
         placeholder:text-gray-400 my-2 focus:outline-none sm:text-sm/6 rounded"
        type="text"
        placeholder="Ex. 10 A"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <button onClick={handleCreateClass}>Create Class</button>
    </div>
  );
}

export default TeacherDashboard;
