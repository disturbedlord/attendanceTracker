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

  if (loading)
    return (
      <div className="min-h-screen text-black text-2xl flex items-center justify-center px-4">
        <p>Checking invitation...</p>
      </div>
    );
  // if (error)
  //   return (
  //     <div className="min-h-screen flex text-white items-center justify-center bg-gray-950 ">
  //       <p>{error}</p>
  //     </div>
  //   );

  return (
    <div>
      <div className="min-h-screen flex text-black items-center justify-center ">
        {error ? (
          <div className="text-2xl font-semibold">{error}</div>
        ) : (
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black backdrop-blur p-8 shadow-xl">
            <h1 className="text-2xl font-semibold text-white mb-2">
              Hi <span className="underline">{invitation.email}</span>,
            </h1>
            <h1 className="text-1xl font-semibold text-white mb-2">
              You’ve been invited
            </h1>

            <p className="text-sm text-gray-400 mb-6">
              An administrator has has invited you to this platform. Please
              create an account using your official email to access your
              dashboard.
            </p>

            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input
                  type="etextl"
                  placeholder="What do you want to be called ?"
                  className="w-full rounded-lg bg-gray-800 border border-white/10 px-3 py-2 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-500"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-gray-800 border border-white/10 px-3 py-2 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white 
                       hover:bg-blue-500 transition"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-xs text-gray-500 text-center">
              This is an invite-only platform. If you believe this invitation
              was sent in error, contact your administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptInvite;
