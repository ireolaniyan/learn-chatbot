const functions = require('firebase-functions');

// Initialize the default app
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.webhook = functions.https.onRequest((request, response) => {
    console.log("request.body.queryResult.parameters: ", request.body.queryResult.parameters);

    let params = request.body.queryResult.parameters;

    firestore.collection('orders').add(params)
    .then(() => {
        response.send({
            fulfillmentText:
                `${params.name} your hotel booking request for ${params.RoomType} room is forwarded for
                ${params.persons} persons, we will contact you on ${params.email} soon`
        });
    })
    .catch((e => {
        console.log("error: ", e);
        response.send({
            fulfillmentText:
                "Error occured while writing to database"
        });
    }));
  
});
