import {
  getDocs,
  collection,
  where,
  query,
  addDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { db } from '../firebase';
import { fetchUser } from "./Users";

const newTicket = (type, price) => { return {
  Owner: "",
  OwnerName: "",
  Status: "Available",
  Type: type,
  Price: price
}}

// const getOwner = async (ownerID) => {
//   let owner = "Not Found"
//   if (owner) {
//     const userFound = await fetchUser(owner)
//     if (userFound) {
//       ownerName = `${userFound.Name} ${userFound.Surname}`
//     } 
//   }
//   return ownerName
// }

const fetchTickets = async () => {
  try {
    const q = query(collection(db, "tickets"));
    const querySnapshot = await getDocs(q);
    const tickets = [];
    querySnapshot.forEach((doc) => {
      const newTicket = doc.data();
      newTicket.ID = doc.id;
      tickets.push(newTicket);
      })
    console.log(tickets);
    return tickets;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const addTicket = async (type, price) => {
  try {
    await addDoc(collection(db, "tickets"), {
      Owner: "",
      OwnerName: "",
      Type: type,
      Price: price,
      Status: "Available"
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export {
  fetchTickets,
  addTicket
};