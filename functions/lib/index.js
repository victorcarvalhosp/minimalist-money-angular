"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp();
const db = admin.firestore();
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
exports.updateTotalsWhenNewTransaction = functions.firestore
    .document(`users/{userId}/transactions/{transactionId}`)
    .onCreate((snap, context) => {
    const userId = context.params.userId;
    const accountId = snap.data().account.id;
    const totalsCollection = db.collection(`users/${userId}/accounts/${accountId}/totals/`);
    return totalsCollection.add({
        date: snap.data().date,
        amount: snap.data().amount
    });
    // return db.runTransaction(transaction => {
    //   return transaction.get(totalsCollection).then(restDoc => {
    //     // Compute new number of ratings
    //     // var newNumRatings = restDoc.data(). + 1;
    //     //
    //     // // Compute new average rating
    //     // var oldRatingTotal = restDoc.data('avgRating') * restDoc.data('numRatings');
    //     // var newAvgRating = (oldRatingTotal + ratingVal) / newNumRatings;
    //
    //     // Update restaurant info
    //
    //       console.log('CREATE TOTALS');
    //       return transaction.set(restDoc, {
    //         avgRating: '10',
    //         numRatings: '20'
    //       });
    //   });
    // });
});
// export const updateTotals = functions.firestore
//   .document(`users/{userId}/transactions/{transactionId}`)
//   .onWrite((change, context) => {
//     // Get an object with the current document value.
//     // If the document does not exist, it has been deleted.
//     console.log('USER ID ' + context.params.userId);
//     console.log('TRANSACTION ID' + context.params.transactionId);
//     const
//
//     const document = change.after.exists ? change.after.data() : null;
//
//     // Get an object with the previous document value (for update or delete)
//     const oldDocument = change.before.data();
//
//     await db.doc(`users/${context.params.userId}/accounts_totals/{accountId}`).update(oldDocument.before.data());
//
//     await admin.firestore().doc(`userProfile/${id}`)
//       .set({
//         email: email,
//         id: id,
//         teamId: teamId,
//         teamAdmin: false
//       });
//
//     // perform desired operations ...
//   });
//# sourceMappingURL=index.js.map