// All of the Login component's API calls and helpers go here.
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import "firebase/firestore";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const store = firebase.firestore();
firebase.auth().languageCode = "en";


export async function login(email, password) {
  return new Promise((resolve, reject) => {
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (resp) => {    
        getLoggedInUser()
        .then(async (user) => {
          let details = await getUserDetails(user.uid);
          resolve({ ...user, ...details });
        });    
      })
      .catch((error) => {
        console.log("Login failed: ", error.message);
        reject(error);
      });
  });
}

export async function logout() {
  firebaseApp
    .auth()
    .signOut()
    .then(() => {
      console.log("Successful log out");
      window.location.replace("#home");
      window.location.reload();
    })
    .catch((err) => {
      console.log("Logout failed ", err);
    });
}

export async function register(email, password, name, image_url) {
  return new Promise((resolve, reject) => {
    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(
        email,
        password
      )
      .then((resp) => {
        setTimeout(() => {
          store
            .collection("user")
            .doc(resp.user.uid)
            .set({
              email, name, image_url,
              uid: resp.user.uid,
              coins: 0,
              rep: 0,
              rank: 'Beginner'
            })
            .then(() => {
              resolve(resp.user);
            })
            .catch((error) => {
              reject(error);
            });
        }, 100);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


/**
 * Returns the current logged in user. If no logged in, return false.
 * @param None
 */
export async function getLoggedInUser() {
  return new Promise((resolve, reject) => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) resolve(user);
      else reject(false);
    });
  });
}


export async function getUserDetails(uid) {
    return new Promise((resolve, reject) => {
        store
        .collection("user")
        .doc(uid)
        .get()
        .then((details) => {
            if (details.exists) resolve(details.data());
            else reject(null);
        })
        .catch((err) => {
            reject(err);
        });
    });
}


export async function getAllAlerts() {
  return new Promise((resolve, reject) => {
    store
    .collection("alert")
    .get()
    .then((querySnapshot) => {
      let alertsList = [];
      querySnapshot.forEach(doc => {
        alertsList.push({id: doc.id, ...doc.data()});
      });
      resolve(alertsList);
    })
    .catch((err) => {
        reject(err);
    });
  });
}


/**
 * Uploads and/or updates (merges) the details of user on the database.
 * @param data data with updated details
 * @param uid id of the user
 */
export async function updateUserData(data, uid) {
    return store
        .collection("user")
        .doc(uid)
        .set({ ...data }, { merge: true });
}

export async function upvoteAlert(alertID, uid) {
  store
  .collection("alert")
  .doc(alertID)
  .update({ votes: firebase.firestore.FieldValue.increment(1)})
  .then(() => {
    store
    .collection("user")
    .doc(uid)
    .update({upvotes_list: firebase.firestore.FieldValue.arrayUnion(alertID)});
  });
}


export async function downvoteAlert(alertID, uid) {
  store
  .collection("alert")
  .doc(alertID)
  .update({ votes: firebase.firestore.FieldValue.increment(-1)})
  .then(() => {
    store
    .collection("user")
    .doc(uid)
    .update({downvotes_list: firebase.firestore.FieldValue.arrayUnion(alertID)});
  });
}

export async function removeUpvote(alertID, uid) {
  store
  .collection("alert")
  .doc(alertID)
  .update({ votes: firebase.firestore.FieldValue.increment(-1)})
  .then(() => {
    store
    .collection("user")
    .doc(uid)
    .update({upvotes_list: firebase.firestore.FieldValue.arrayRemove(alertID)});
  });
}

export async function removeDownvote(alertID, uid) {
  store
  .collection("alert")
  .doc(alertID)
  .update({ votes: firebase.firestore.FieldValue.increment(1)})
  .then(() => {
    store
    .collection("user")
    .doc(uid)
    .update({downvotes_list: firebase.firestore.FieldValue.arrayRemove(alertID)});
  });
}

export async function downvoteFromUpvoteAlert(alertID, uid) {
  store
  .collection("alert")
  .doc(alertID)
  .update({ votes: firebase.firestore.FieldValue.increment(-2)})
  .then(() => {
    store
    .collection("user")
    .doc(uid)
    .update({
      upvotes_list: firebase.firestore.FieldValue.arrayRemove(alertID)
    }).then(() => {
      store
      .collection("user")
      .doc(uid)
      .update({
        downvotes_list: firebase.firestore.FieldValue.arrayUnion(alertID)
      })
    })
    
  });
}


export async function upvoteFromDownvoteAlert(alertID, uid) {
  store
  .collection("alert")
  .doc(alertID)
  .update({ votes: firebase.firestore.FieldValue.increment(2)})
  .then(() => {
    store
    .collection("user")
    .doc(uid)
    .update({
      downvotes_list: firebase.firestore.FieldValue.arrayRemove(alertID)
    }).then(() => {
      store
      .collection("user")
      .doc(uid)
      .update({
        upvotes_list: firebase.firestore.FieldValue.arrayUnion(alertID)
      })
    })
    
  });
}


export async function submitAlert(uid, data) {
  return new Promise((resolve, reject) => {
      store
      .collection("alert")
      .doc(uid)
      .set({...data})
      .then(() => {
        resolve("Submitted.");
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export default firebaseApp;