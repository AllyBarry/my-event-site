import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  getDoc
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { db } from '../firebase';

const fetchUserDetails = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    return docSnap.data()
  } catch (err) {
    console.error(err);
    alert("An error occured while fetching user data");
  }
};

const fetchUser = async (userID) => {
    try {
      // const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      // If you want to query by User ID:
      console.log(userID)
      const userRef = doc(db, "users", userID);
      const docSnap = await getDoc(userRef);
      // If using 'Reference' field, query directly:
      // const docSnap = await getDoc(userRef);
      let data = null;
      if (docSnap.exists()) {
        data = docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      return data;
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

const getUserTickets = async (userRef) => {
  const tickets = [];
  const q = query(collection(db, "tickets"), where("Owner", "==", "AEEAnRlMg8V3xoigqvNM"))
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    tickets.push({...doc.data(), ID: doc.id})
  });
  return tickets;
}

const fetchUsers = async () => {
  try {
    // const q = query();
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      const newUser = doc.data();
      newUser.ID = doc.id;
      users.push(newUser);
      })
    return users;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

export {
  fetchUser,
  fetchUserDetails,
  fetchUsers
}