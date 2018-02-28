// Initialize Firebase
var config = {
    apiKey: "AIzaSyDS12hR0KNwQl8vwZxgk5s0GAEsIT5UPKY",
    authDomain: "scoutingfrc7021.firebaseapp.com",
    databaseURL: "https://scoutingfrc7021.firebaseio.com",
    projectId: "scoutingfrc7021",
    storageBucket: "scoutingfrc7021.appspot.com",
    messagingSenderId: "72046391466"
  };
firebase.initializeApp(config);

firebase.firestore().enablePersistence()
.then(function() {
	// Initialize Cloud Firestore through firebase
    var db = firebase.firestore();
})
.catch(function(err) {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
    }
});