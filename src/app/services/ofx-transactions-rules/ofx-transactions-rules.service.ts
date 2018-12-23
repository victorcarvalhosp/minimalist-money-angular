import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction
} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {IOfxTransactionRule} from "../../models/ofx-transaction-rule";
import {switchMap, take} from "rxjs/operators";
import {ITransactionOfx} from "../../models/transaction-ofx";
import {getOfxIfClauseObjectField} from "../../enums/ofxIfClause.enum";


@Injectable({
  providedIn: 'root'
})
export class OfxTransactionsRulesService {

  private ofxTransactionsRulesCollection: AngularFirestoreCollection<IOfxTransactionRule>;
  private ofxTransactionsRulesDoc: AngularFirestoreDocument<IOfxTransactionRule>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.initializeData();
  }

  public initializeData() {
    return this.authService.getCurrentUser().then(user => {
      this.ofxTransactionsRulesCollection = this.afs.collection<any>(this.getPath(user));
    });
  }

  getAllOfxTransactionsRules(): Observable<DocumentChangeAction<any>[]> {
    return this.ofxTransactionsRulesCollection.snapshotChanges();
  }


  getRulesForTransaction(ofxTransaction: ITransactionOfx): Observable<DocumentChangeAction<any>[]> {
    return this.authService.getCurrentUserObservable().pipe(take(1), switchMap(res => {
       this.ofxTransactionsRulesCollection = this.afs.collection<any>(`${this.getPath(res)}`,
        ref => ref.where('ifValueClause', '==', ofxTransaction.name));
      return this.ofxTransactionsRulesCollection.snapshotChanges();
    }));
  }

  private getPath(user): string {
    return `users/${user.uid}/ofxTransactionsRules`;
  }

  delete(category: IOfxTransactionRule): Observable<any> {
    if (category.id) {
      return from(this.ofxTransactionsRulesCollection.doc(category.id).delete());
    }
  }

  getOfxTransactionsRule(categoryUid: string) {
    // return this.authService.getCurrentUser()
    //   .then(user => {
    //     console.log('UID' + user.uid);
    //     this.ofxTransactionsRulesDoc = this.afs.doc(`users/${user.uid}/ofxTransactionsRules/${categoryUid}`);
    //     this.category = this.ofxTransactionsRulesDoc.valueChanges();
    //   }, err => {
    //     console.log(err);
    //   });


    // return fromPromise(this.authService.getCurrentUser()).pipe(switchMap(res => {
    //   console.log(res)
    //   return this.afs.doc<any>(`ofxTransactionsRules$/${res.uid}/user_ofxTransactionsRules/${categoryUid}`).valueChanges();
    // }));
    // console.log('get category');
    //    this.afs.doc<any>(`JP1VKSxi3BX196Clk7eHr1rxmLn1/ofxTransactionsRules$/${categoryUid}`).snapshotChanges().pipe(map(res => {
    //
    //     console.log(res);
    //     return res.payload;
    //   })).subscribe(res => {
    //     console.log(res);
    //    });
  }

  save(ofxTransactionRule: IOfxTransactionRule): Observable<any> {
    if (ofxTransactionRule.id) {
      return from(this.ofxTransactionsRulesCollection.doc(ofxTransactionRule.id).update(ofxTransactionRule));
    } else {
      const idBefore =  this.afs.createId();
      ofxTransactionRule.id = idBefore;
      return from(this.ofxTransactionsRulesCollection.add(ofxTransactionRule));
    }
  }

}
