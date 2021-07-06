// All of the Login component's API calls and helpers go here.
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import "firebase/firestore";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const store = firebase.firestore();
firebase.auth().languageCode = "en";


export const rankList = ['Beginner', 'Watcher', 'Patrol Guard', 'Crime Fighter', 'Bane of Justice', 'Batman'];
export const rankColor = ['white', 'darkseagreen', 'lightblue', 'mediumpurple', 'lightcoral', 'gold'];

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
              coins: 100,
              rep: 0,
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

export async function getAlertComments(alertId) {
  return new Promise((resolve, reject) => {
      store
      .collection("comment")
      .where('alert_id','==',alertId)
      .get()
      .then((snapshot) => {
          if (snapshot.empty) {
            resolve([]);
          }
          else {
            resolve(snapshot.docs.map(docs => docs.data()));
          }  
      })
      .catch((err) => {
          reject(err);
      });
  });
}

export async function getAllAlerts() {
  const querySnapshot = await store.collection("alert").get();
  
  let alertsList = [];
  querySnapshot.forEach(doc => {
    alertsList.push({id: doc.id, ... doc.data()});
  });

  return Promise.all(alertsList.map(async alert => {
    const user = await getUserDetails(alert.uid);
    const rankIndex = Math.min(Math.floor(user.rep / 200), rankList.length-1);
    alert.uname = user.name;
    alert.ucolor = rankColor[rankIndex];

    const comments = await getAlertComments(alert.id);
    alert.comments = await Promise.all(comments.map(async comment => {
      const user = await getUserDetails(comment.uid);
      const rankIndex = Math.min(Math.floor(user.rep / 200), rankList.length-1);
      comment.uname = user.name;
      comment.ucolor = rankColor[rankIndex];
      return comment;
    }));
    return alert;
  }));
}


export async function getShopItems() {
  return new Promise((resolve, reject) => {
    store
    .collection("shop")
    .get()
    .then((querySnapshot) => {
      let shopItems = [];
      querySnapshot.forEach(doc => {
        shopItems.push({id: doc.id, ...doc.data()});
      });
      resolve(shopItems);
    })
    .catch((err) => {
        reject(err);
    });
  });
}

export async function purchaseItem(costCoins, uid) {
  return store
  .collection("user")
  .doc(uid)
  .update({ coins: firebase.firestore.FieldValue.increment(-costCoins)});
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
    .update({upvotes_list: firebase.firestore.FieldValue.arrayUnion(alertID),
      coins: firebase.firestore.FieldValue.increment(10),
      rep: firebase.firestore.FieldValue.increment(100)});
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
    .update({downvotes_list: firebase.firestore.FieldValue.arrayUnion(alertID),
      coins: firebase.firestore.FieldValue.increment(-10),
      rep: firebase.firestore.FieldValue.increment(-100)});
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
    .update({upvotes_list: firebase.firestore.FieldValue.arrayRemove(alertID),
      coins: firebase.firestore.FieldValue.increment(-10),
      rep: firebase.firestore.FieldValue.increment(-100)});
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
    .update({downvotes_list: firebase.firestore.FieldValue.arrayRemove(alertID),
      coins: firebase.firestore.FieldValue.increment(10),
      rep: firebase.firestore.FieldValue.increment(100)});
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
        downvotes_list: firebase.firestore.FieldValue.arrayUnion(alertID),
        coins: firebase.firestore.FieldValue.increment(-20),
        rep: firebase.firestore.FieldValue.increment(-200)
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
        upvotes_list: firebase.firestore.FieldValue.arrayUnion(alertID),
        coins: firebase.firestore.FieldValue.increment(20),
        rep: firebase.firestore.FieldValue.increment(200)
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


export async function postComment(alertId, uid, comment) {
  return new Promise((resolve, reject) => {
      store
      .collection("comment")
      .add({alert_id: alertId, uid: uid, description: comment, post_time: new Date().toLocaleString()})
      .then(() => {
        resolve("Posted.");
        window.location.reload();
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export default firebaseApp;