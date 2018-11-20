import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {parse as parseOFX} from 'ofx-js/ofx.js';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp();
const db = admin.firestore();
const cors = require('cors')({origin: true});

export const getOfxData = functions.https.onRequest(async(request, response) => {
  const ofxString: string = 'OFXHEADER:100' +
    'DATA:OFXSGML' +
    'VERSION:102' +
    'SECURITY:NONE' +
    'ENCODING:USASCII' +
    'CHARSET:1252' +
    'COMPRESSION:NONE' +
    'OLDFILEUID:NONE' +
    'NEWFILEUID:NONE' +
    '' +
    '<OFX>' +
    '<SIGNONMSGSRSV1>' +
    '<SONRS>' +
    '<STATUS>' +
    '<CODE>0' +
    '<SEVERITY>INFO' +
    '</STATUS>' +
    '<DTSERVER>20121004210819' +
    '<LANGUAGE>ENG' +
    '</SONRS>' +
    '</SIGNONMSGSRSV1>' +
    '<BANKMSGSRSV1>' +
    '<STMTTRNRS>' +
    '<TRNUID>1349428292' +
    '<STATUS>' +
    '<CODE>0' +
    '<SEVERITY>INFO' +
    '</STATUS>' +
    '<STMTRS>' +
    '<CURDEF>NZD' +
    '<BANKACCTFROM>' +
    '<BANKID>01' +
    '<BRANCHID>0123' +
    '<ACCTID>1234567-00' +
    '<ACCTTYPE>SAVINGS' +
    '</BANKACCTFROM>' +
    '<BANKTRANLIST>' +
    '<DTSTART>20120101' +
    '<DTEND>20121003' +
    '<STMTTRN>' +
    '<TRNTYPE>INT' +
    '<DTPOSTED>20120928' +
    '<TRNAMT>19.90' +
    '<FITID>20120928.0' +
    '<MEMO>Credit Interest Paid' +
    '</STMTTRN>' +
    '<STMTTRN>' +
    '<TRNTYPE>DEBIT' +
    '<DTPOSTED>20120928' +
    '<TRNAMT>-1.01' +
    '<FITID>20120928.1' +
    '<MEMO>Withholding Tax' +
    '</STMTTRN>' +
    '<STMTTRN>' +
    '<TRNTYPE>DEBIT' +
    '<DTPOSTED>20120907' +
    '<TRNAMT>-100.00' +
    '<FITID>20120907.0' +
    '<NAME>06 0773 0214764 33' +
    '<MEMO>Debit Transfer: Bike' +
    '</STMTTRN>' +
    '<STMTTRN>' +
    '<TRNTYPE>DEBIT' +
    '<DTPOSTED>20120907' +
    '<TRNAMT>-71.99' +
    '<FITID>201209071' +
    '<NAME>Transfer' +
    '<MEMO>Debit Transfer: Postage' +
    '</STMTTRN>' +
    '<STMTTRN>' +
    '<TRNTYPE>DEBIT' +
    '<DTPOSTED>20120104' +
    '<TRNAMT>-20.01' +
    '<FITID>20120104.6' +
    '<NAME>Transfer' +
    '<MEMO>Debit Transfer Party' +
    '</STMTTRN>' +
    '</BANKTRANLIST>' +
    '<LEDGERBAL>' +
    '<BALAMT>4225.79' +
    '<DTASOF>20121004' +
    '</LEDGERBAL>' +
    '<AVAILBAL>' +
    '<BALAMT>12.79' +
    '<DTASOF>20121004' +
    '</AVAILBAL>' +
    '</STMTRS>' +
    '</STMTTRNRS>' +
    '</BANKMSGSRSV1>' +
    '</OFX>';
  parseOFX(ofxString).then(ofxData => {
    const statementResponse = ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
    const accountId = statementResponse.BANKACCTFROM.ACCTID;
    const currencyCode = statementResponse.CURDEF;
    const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
    console.log(accountId);
    console.log(transactionStatement);
    // do something...
  });
  console.log('GET OFX DATA 2');
});

export const getAccountsSummary = functions.https.onRequest(async(request, response) => {
  try {
    await cors(request, response, async () => {
      if (request.method === 'GET') {
        const date: Date = new Date(request.query.date);
        const userId = request.headers.user;
        const totals = [];
        const accountsRef = db.collection(`users/${userId}/accounts/`);
        const snapshotAccounts = await accountsRef.get();
        snapshotAccounts.forEach(account => {
          totals.push({accountId: account.data().id, accountName: account.data().name, total: 0, totalIncome: 0, totalOutcome: 0});
        });
        const accountsSummary = { totalIncome: 0,
        totalOutcome: 0,
        total: 0,
        accountsTotals: totals};

        const transactionsRef = db.collection(`users/${userId}/transactions/`).where("date", "<=", date);
        const snapshotTransactions = await transactionsRef.get();
        snapshotTransactions.forEach(transaction => {
          for (let total of totals) {
            if (transaction.data().accountId === total.accountId && transaction.data().realized) {
              if (transaction.data().type === 'INCOME') {
                total.totalIncome += transaction.data().amount;
                total.total += transaction.data().amount;
                accountsSummary.totalIncome +=  transaction.data().amount;
                accountsSummary.total += transaction.data().amount;
              } else if (transaction.data().type === 'OUTCOME') {
                total.totalOutcome += transaction.data().amount;
                total.total -= transaction.data().amount;
                accountsSummary.totalOutcome +=  transaction.data().amount;
                accountsSummary.total -= transaction.data().amount;
              }
            }
          }
        });
        console.log(accountsSummary);
        response.status(200).json(accountsSummary);
      } else {
        response.status(500).json({message: 'Not allowed'});
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }

});

export const getTotalRealized = functions.https.onRequest(async(request, response) => {
  try {
    await cors(request, response, async () => {
      if (request.method === 'GET') {
        const date: Date = new Date(request.query.date);
        const userId = request.headers.user;
        const totalRealized = {total: 0};
        const transactionsRef = db.collection(`users/${userId}/transactions/`).where("date", "<=", date);
        const snapshotTransactions = await transactionsRef.get();
        snapshotTransactions.forEach(transaction => {
            if (transaction.data().realized) {
              if (transaction.data().type === 'INCOME') {
                totalRealized.total += transaction.data().amount;
              } else if (transaction.data().type === 'OUTCOME') {
                totalRealized.total -= transaction.data().amount;
              }
          }
        });
        response.status(200).json(totalRealized);
      } else {
        response.status(500).json({message: 'Not allowed'});
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }

});

export const updateCategoriesNamesOnTransactions = functions.firestore
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

export const updateAccountsNamesOnTransactions = functions.firestore
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


export const updateTotalsWhenNewTransaction = functions.firestore
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
            return newTotalRef.add({date: snap.data().date, amount: total.data().amount + snap.data().amount});
          } else if (snap.data().type === 'OUTCOME') {
            console.log('NEW TOTAL OUTCOME REALIZED');
            // batch.create(newTotalRef, { date: snap.data().date, amount: total.data().amount - snap.data().amount});
            return newTotalRef.add({date: snap.data().date, amount: total.data().amount - snap.data().amount});
          }
          return new Promise(resolve => {
            return true
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
    } else {
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
