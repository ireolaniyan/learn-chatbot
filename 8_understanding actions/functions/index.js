const functions = require('firebase-functions');

// Initialize the default app
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

function bookHotel(params, response) {
    firestore.collection('orders')
        .add(params)
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
}

function showBookings(response) {
    firestore.collection('orders')
        .get()
        .then((querySnapshot) => {

            var orders = [];
            querySnapshot.forEach((doc) => { orders.push(doc.data()) });
            // now orders have something like this [ {...}, {...}, {...} ]

            // converting array to speech
            var speech = `You have ${orders.length} orders \n`;

            orders.forEach((eachOrder, index) => {
                speech += `number ${index + 1} is ${eachOrder.RoomType} room for ${eachOrder.persons} persons, ordered by ${eachOrder.name} contact email is ${eachOrder.email} \n`
            })

            response.send({
                fulfillmentText: speech
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);

            response.send({
                fulfillmentText: "something went wrong when reading from database"
            });
        });
}

function defaultResponse(response) {
    response.send({
        fulfillmentText: "no action matched in webhook"
    });
}


exports.webhook = functions.https.onRequest((request, response) => {
    console.log("request.body.queryResult.parameters: ", request.body.queryResult.parameters);

    switch (request.body.queryResult.action) {

        case 'bookHotel':
            let params = request.body.queryResult.parameters;
            bookHotel(params, response);
            break;

        case 'showBookings':
            showBookings(response);
            break;

        default:
            defaultResponse(response);
    }

});

