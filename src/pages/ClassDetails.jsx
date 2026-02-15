import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useParams } from "react-router-dom";

function ClassDetails() {
  const { classId } = useParams();
  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceMap, setAttendanceMap] = useState({});
  const [report, setReport] = useState([]);

  const generateReport = async () => {
    const q = query(
      collection(db, "attendance"),
      where("classId", "==", classId),
    );

    const snapshot = await getDocs(q);

    const totalDays = snapshot.size;

    if (totalDays === 0) {
      alert("No attendance data yet");
      return;
    }

    const stats = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();

      data.records.forEach((record) => {
        if (!stats[record.studentId]) {
          stats[record.studentId] = 0;
        }

        if (record.status === "present") {
          stats[record.studentId] += 1;
        }
      });
    });

    const reportData = students.map((student) => {
      const presentCount = stats[student.id] || 0;

      return {
        name: student.name,
        percentage: ((presentCount / totalDays) * 100).toFixed(1),
      };
    });

    setReport(reportData);
  };

  const fetchStudents = async () => {
    const q = query(
      collection(db, "students"),
      where("classId", "==", classId),
    );

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setStudents(list);
  };

  const handleAddStudent = async () => {
    if (!studentName) return;

    await addDoc(collection(db, "students"), {
      name: studentName,
      classId: classId,
      createdAt: serverTimestamp(),
    });

    setStudentName("");
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
    loadAttendanceForDate();
  }, [classId, selectedDate]);

  const handleSaveAttendance = async () => {
    if (Object.keys(attendanceMap).length === 0) {
      alert("Mark attendance first");
      return;
    }

    const records = Object.entries(attendanceMap).map(
      ([studentId, status]) => ({
        studentId,
        status,
      }),
    );

    // 🔍 Check if attendance already exists
    const q = query(
      collection(db, "attendance"),
      where("classId", "==", classId),
      where("date", "==", selectedDate),
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Update existing document
      const existingDoc = snapshot.docs[0];
      await updateDoc(doc(db, "attendance", existingDoc.id), {
        records,
      });

      alert("Attendance updated!");
    } else {
      // Create new document
      await addDoc(collection(db, "attendance"), {
        classId,
        date: selectedDate,
        records,
        createdAt: serverTimestamp(),
      });

      alert("Attendance saved!");
    }

    // setAttendanceMap({});
  };

  const loadAttendanceForDate = async () => {
    const q = query(
      collection(db, "attendance"),
      where("classId", "==", classId),
      where("date", "==", selectedDate),
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const existing = snapshot.docs[0].data();

      const map = {};
      existing.records.forEach((record) => {
        map[record.studentId] = record.status;
      });

      setAttendanceMap(map);
      console.error(map);
    } else {
      setAttendanceMap({});
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div className="avi_title mr-2">Mark Attendance for</div>

        <input
          type="date"
          className="font-semibold bg-transparent p-0 m-0"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <ul>
        {students.map((s) => (
          <li key={s.id} style={{ marginBottom: "8px" }}>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attendanceMap[s.id] === "present"}
                onChange={(e) => {
                  setAttendanceMap((prev) => ({
                    ...prev,
                    [s.id]: e.target.checked ? "present" : "absent",
                  }));
                }}
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-sm text-gray-700 font-semibold">{s.name}</span>
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSaveAttendance}>Save Attendance</button>
      <hr className="mt-4 mb-2 border-t border-gray-300" />
      <div className="avi_title mr-2">Add Student</div>

      <input
        type="text"
        className="my-2 block border w-full grow bg-gray py-1.5 pr-3 pl-1 text-base 
         placeholder:text-gray-400 focus:outline-none sm:text-sm/6 rounded"
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />

      <button onClick={handleAddStudent}>Add Student</button>
      <hr className="mt-4 mb-2 border-t border-gray-300" />

      <div className="avi_title mr-2">Attendance Report</div>
      <button onClick={generateReport}>Generate Report</button>

      <ul>
        {report.map((r, index) => (
          <li key={index} style={{ margin: "8px 0 8px 0" }}>
            <div className="avi_card">
              {r.name} — {r.percentage}%
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassDetails;
