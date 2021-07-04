// All of the Login component's API calls and helpers go here.
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import "firebase/firestore";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const store = firebase.firestore();
firebase.auth().languageCode = "en";



/**
 * Logs in user. Returns a promise that resolves to user if successful
 * or rejects with error.
 * @param email User email address
 * @param password User password
 */
export async function login(email, password) {
  return new Promise((resolve, reject) => {
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (resp) => {        
        resolve(resp.user); // until login option selected do not proceed
      })
      .catch((error) => {
        console.log("Login failed: ", error.message);
        reject(error);
      });
  });
}

/**
 * Logs out the current user
 * @param None
 */
export async function logout() {
  firebaseApp
    .auth()
    .signOut()
    .then(() => {
      console.log("Successful log out");
    })
    .catch((err) => {
      console.log("Logout failed ", err);
    });
}

/**
 * Registers user by making its account and storing in database. User
 * is also signed in.
 * @param registrationData Object containing name, email and password of user
 */
export async function register(registrationData) {
  return new Promise((resolve, reject) => {
    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(
        registrationData.email,
        registrationData.password
      )
      .then((resp) => {
        const { password, ...data } = registrationData;
        
        setTimeout(() => {
          store
            .collection("user")
            .doc(resp.user.uid)
            .set({
              ...data
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


export async function upvoteAlert(alertID) {
  store
  .collection("alert")
  .doc(alertID)
  .update({ upvotes: firebase.firestore.FieldValue.increment(1) });
}


export async function downvoteAlert(alertID) {
  store
  .collection("alert")
  .doc(alertID)
  .update({ downvotes: firebase.firestore.FieldValue.increment(1) });
}


export async function submitAlert(user, data) {
  return new Promise((resolve, reject) => {
      store
      .collection("alert")
      .doc(user.uid)
      .set({
        ...data
      })
      .then(() => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export default firebaseApp;