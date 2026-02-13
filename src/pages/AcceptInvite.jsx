import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../services/firebase";

function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [invitationDocId, setInvitationDocId] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("No invitation token provided.");
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "invitations"),
        where("token", "==", token),
        where("status", "==", "pending"),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid or expired invitation.");
      } else {
        const docSnap = querySnapshot.docs[0];
        setInvitation(docSnap.data());
        setInvitationDocId(docSnap.id);
      }

      setLoading(false);
    };

    validateToken();
  }, [token]);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Create Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        invitation.email,
        password,
      );

      const user = userCredential.user;

      // 2️⃣ Create Firestore user document
      await setDoc(doc(db, "users", user.uid), {
        name,
        email: invitation.email,
        role: invitation.role,
        schoolId: invitation.schoolId,
        status: "active",
      });

      // 3️⃣ Mark invitation as accepted
      await updateDoc(doc(db, "invitations", invitationDocId), {
        status: "accepted",
      });

      // 4️⃣ Redirect
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Checking invitation...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Accept Invitation</h2>
      <p>Email: {invitation.email}</p>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default AcceptInvite;
