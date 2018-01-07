const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
var FieldValue = require("firebase-admin").firestore.FieldValue;

exports.userCreate = functions.auth.user().onCreate(event => {
	const user = event.data;
	const displayName = user.displayName;
	const uid = user.uid;
	console.log('new user Created:'+ displayName+' UID: '+uid);
	return 0;
});

// exports.loadTeamData = functions.database.ref('').onWrite(event => {
//
// });

exports.updateSeasonAverage = functions.firestore.document('/teams/{teamNum}/averages/{event}')
.onWrite(event => {
	console.log('Event Data Changed');
	console.log('Team#'+event.params.teamNum+' Event:'+event.params.event);
	var rootRef = db.collection("teams/"+event.params.teamNum+"/averages/");
	var numEvents = 0;
	var datapoints = 0;
	var autoShotPercent = 0;
	var avgTeleScores = 0;
	var matches = rootRef.get()
	.then(snapshot => {
		snapshot.forEach(doc => {
			jsonData = doc.data();
			numEvents++;
			datapoints+=jsonData.datapoints;
			autoShotPercent+=jsonData.autoShotPercent;
			avgTeleScores+=jsonData.avgTeleScores;
		});
		autoShotPercent = autoShotPercent/numEvents;
		avgTeleScores = avgTeleScores/numEvents;
		console.log('AutoShotPercent:'+autoShotPercent+' averageTeleScores:'+avgTeleScores+' Datapoints:'+datapoints);
		var saveRef = db.doc("teams/"+event.params.teamNum);
		var saveData = saveRef.set({
			seasonAverage: {
				avgTeleScores:avgTeleScores, 
				autoShotPercent:autoShotPercent,
				datapoints:datapoints,
				timestamp: FieldValue.serverTimestamp()
			}
		});
	})
	.catch(err => {
		console.log('Error getting document', err);
	});
	return 0;
});

exports.updateEventAverage = functions.firestore.document('/teams/{teamNum}/events/{event}/averages/{matchNum}')
.onWrite(event => {
	console.log('Event Data Changed');
	console.log('Team#'+event.params.teamNum+' Event:'+event.params.event+' Match#'+event.params.matchNum);
	var rootRef = db.collection("teams/"+event.params.teamNum+"/events/"+event.params.event+"/averages/");
	var numMatches = 0;
	var datapoints = 0;
	var autoShotPercent = 0;
	var avgTeleScores = 0;
	var matches = rootRef.get()
	.then(snapshot => {
		snapshot.forEach(doc => {
			jsonData = doc.data();
			numMatches++;
			datapoints+=jsonData.datapoints;
			autoShotPercent+=jsonData.autoShotPercent;
			avgTeleScores+=jsonData.avgTeleScores;
		});
		autoShotPercent = autoShotPercent/numMatches;
		avgTeleScores = avgTeleScores/numMatches;
		console.log('AutoShotPercent:'+autoShotPercent+' averageTeleScores:'+avgTeleScores+' Datapoints:'+datapoints);
		var saveRef = db.doc("teams/"+event.params.teamNum+"/averages/"+event.params.event);
		var saveData = saveRef.set({
			avgTeleScores:avgTeleScores, 
			autoShotPercent:autoShotPercent,
			datapoints:datapoints,
			timestamp: FieldValue.serverTimestamp()
		});
	})
	.catch(err => {
		console.log('Error getting document', err);
	});
	return 0;
});

exports.updateMatchAverage = functions.firestore.document('/teams/{teamNum}/events/{event}/matches/{matchNum}')
.onWrite(event => {
	console.log('Match Data Changed');
	console.log('Team#'+event.params.teamNum+' Event:'+event.params.event+' Match#'+event.params.matchNum);
	var rootRef = db.doc("teams/"+event.params.teamNum+"/events/"+event.params.event+"/matches/"+event.params.matchNum);
	var autoShotPercent = 0;
	var avgTeleScores = 0;
	var datapoints = 0;
	var trueAutoShot = 0;
	var totalTeleScores = 0;
	var matchData = rootRef.get()
	.then(doc => {
		jsonData = doc.data();
		for(var p in jsonData){
			if(jsonData[p].autoShot){
				trueAutoShot++;
			}
			totalTeleScores += jsonData[p].teleScores;
			datapoints ++;
		}
		autoShotPercent = (trueAutoShot/datapoints)*100;
		avgTeleScores = totalTeleScores/datapoints;
		console.log('AutoShotPercent:'+autoShotPercent+' averageTeleScores:'+avgTeleScores+' Datapoints:'+datapoints);
		var saveRef = db.doc("teams/"+event.params.teamNum+"/events/"+event.params.event+"/averages/"+event.params.matchNum);
		var saveData = saveRef.set({
			avgTeleScores:avgTeleScores, 
			autoShotPercent:autoShotPercent,
			datapoints:datapoints,
			timestamp: FieldValue.serverTimestamp()
		});
	})
	.catch(err => {
		console.log('Error getting document', err);
	});
	return 0;
});