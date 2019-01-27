"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp();
const db = admin.firestore();
const cors = require('cors')({ origin: true });
exports.getAccountsSummary = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield cors(request, response, () => __awaiter(this, void 0, void 0, function* () {
            if (request.method === 'GET') {
                const userId = request.headers.user;
                const totals = [];
                const accountsRef = db.collection(`users/${userId}/accounts/`);
                const snapshotAccounts = yield accountsRef.get();
                snapshotAccounts.forEach(account => {
                    totals.push({ accountId: account.data().id, accountName: account.data().name, amount: 0 });
                });
                const accountsSummary = { totalIncome: 0,
                    totalOutcome: 0,
                    total: 0,
                    accountsTotals: totals };
                const transactionsRef = db.collection(`users/${userId}/transactions/`).where('realized', '==', true);
                const snapshotTransactions = yield transactionsRef.get();
                snapshotTransactions.forEach(transaction => {
                    for (let total of totals) {
                        if (transaction.data().accountId === total.accountId) {
                            if (transaction.data().type === 'INCOME') {
                                total.totalIncome += transaction.data().amount;
                                total.amount += transaction.data().amount;
                                accountsSummary.totalIncome += transaction.data().amount;
                                accountsSummary.total += transaction.data().amount;
                            }
                            else if (transaction.data().type === 'OUTCOME') {
                                total.totalOutcome += transaction.data().amount;
                                total.amount -= transaction.data().amount;
                                accountsSummary.totalOutcome += transaction.data().amount;
                                accountsSummary.total -= transaction.data().amount;
                            }
                            break;
                        }
                    }
                });
                console.log(accountsSummary);
                response.status(200).json(accountsSummary);
            }
            else {
                response.status(500).json({ message: 'Not allowed' });
            }
        }));
    }
    catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
}));
exports.updateCategoriesNamesOnTransactions = functions.firestore
    .document(`users/{userId}/categories/{categoryId}`)
    .onUpdate((change, context) => {
    const batch = db.batch();
    console.log('BEFORE ==' + change.before.data().name);
    console.log('AFTER ==' + change.after.data().name);
    const userId = context.params.userId;
    const categoryId = context.params.categoryId;
    const transactionsCollection = db.collection(`users/${userId}/transactions/`).where('category.id', '==', categoryId).get();
    return transactionsCollection.then(res => {
        res.forEach(docTransaction => {
            console.log(docTransaction.data());
            const transactionRef = admin.firestore().doc(`users/${userId}/transactions/${docTransaction.data().id}`);
            batch.update(transactionRef, "category", change.after.data());
            // return admin.firestore().doc(`users/${userId}/transactions/${docTransaction.data().id}`).update({
            //   category: change.after.data()
            // });
        });
        return batch.commit();
    });
});
exports.updateAccountsNamesOnTransactions = functions.firestore
    .document(`users/{userId}/accounts/{accountId}`)
    .onUpdate((change, context) => {
    const batch = db.batch();
    console.log('BEFORE ==' + change.before.data().name);
    console.log('AFTER ==' + change.after.data().name);
    const userId = context.params.userId;
    const categoryId = context.params.categoryId;
    const transactionsCollection = db.collection(`users/${userId}/transactions/`).where('account.id', '==', categoryId).get();
    return transactionsCollection.then(res => {
        res.forEach(docTransaction => {
            console.log(docTransaction.data());
            const transactionRef = admin.firestore().doc(`users/${userId}/transactions/${docTransaction.data().id}`);
            batch.update(transactionRef, "account", change.after.data());
        });
        return batch.commit();
    });
});
exports.updateTotalsWhenNewTransaction = functions.firestore
    .document(`users/{userId}/transactions/{transactionId}`)
    .onCreate((snap, context) => {
    const batch = db.batch();
    const userId = context.params.userId;
    const accountId = snap.data().account.id;
    if (snap.data().realized) {
        const lastTotal = db.collection(`users/${userId}/accounts/${accountId}/totals/`).orderBy('date', 'desc').where('date', '<=', snap.data().date).limit(1).get();
        return lastTotal.then(restotal => {
            restotal.forEach(total => {
                console.log(total.data());
                console.log('TOTAL BEFORE');
                const newTotalRef = db.collection('users/${userId}/accounts/${accountId}/totals/');
                if (snap.data().type === 'INCOME') {
                    console.log('NEW TOTAL INCOME CREATED');
                    // batch.create(newTotalRef, { date: snap.data().date, amount: total.data().amount + snap.data().amount});
                    return newTotalRef.add({ date: snap.data().date, amount: total.data().amount + snap.data().amount });
                }
                else if (snap.data().type === 'OUTCOME') {
                    console.log('NEW TOTAL OUTCOME REALIZED');
                    // batch.create(newTotalRef, { date: snap.data().date, amount: total.data().amount - snap.data().amount});
                    return newTotalRef.add({ date: snap.data().date, amount: total.data().amount - snap.data().amount });
                }
                return new Promise(resolve => {
                    return true;
                });
            });
            return batch.commit();
        });
        // const totalsCollection = db.collection(`users/${userId}/accounts/${accountId}/totals/`).orderBy('date', 'desc').where('date', '<=', snap.data().date).get();
        // return totalsCollection.then(res => {
        //   res.forEach(totalTransaction => {
        //     console.log(totalTransaction.data());
        //     const transactionRef = admin.firestore().doc(`users/${userId}/accounts/${accountId}/totals/${totalTransaction.id}`);
        //     if(snap.data().type === 'INCOME') {
        //       console.log('NEW INCOME REALIZED');
        //       batch.update(transactionRef, "amount", totalTransaction.data().amount + snap.data().amount);
        //     } else if (snap.data().type === 'OUTCOME') {
        //       console.log('NEW OUTCOME REALIZED');
        //       batch.update(transactionRef, "amount", totalTransaction.data().amount - snap.data().amount);
        //     }
        //   });
        //   return batch.commit();
        // });
    }
    else {
        return new Promise(resolve => {
            return true;
        });
    }
    // return totalsCollection.add({
    //   date: snap.data().date,
    //   amount: snap.data().amount
    // });
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
//   .document(`users/{userId}/transactions$/{transactionId}`)
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