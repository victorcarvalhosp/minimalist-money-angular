import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction
} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {ICategory} from '../../models/category';
import {from} from 'rxjs';
import {switchMap, take} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private categoriesCollection: AngularFirestoreCollection<ICategory>;
  private categoriesDoc: AngularFirestoreDocument<ICategory>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.initializeData();
  }

  public initializeData() {
    return this.authService.getCurrentUser().then(user => {
      this.categoriesCollection = this.afs.collection<any>(this.getPath(user),
        ref => ref.orderBy('name'));
    });
  }

  getAllCategories(): Observable<DocumentChangeAction<any>[]> {
    return this.categoriesCollection.snapshotChanges();
  }

  private getPath(user): string {
    return `users/${user.uid}/categories`;
  }

  delete(category: ICategory): Observable<any> {
    if (category.id) {
      return from(this.categoriesCollection.doc(category.id).delete());
    }
  }

  getCategory(categoryUid: string) {
    // return this.authService.getCurrentUser()
    //   .then(user => {
    //     console.log('UID' + user.uid);
    //     this.categoriesDoc = this.afs.doc(`users/${user.uid}/categories/${categoryUid}`);
    //     this.category = this.categoriesDoc.valueChanges();
    //   }, err => {
    //     console.log(err);
    //   });


    // return fromPromise(this.authService.getCurrentUser()).pipe(switchMap(res => {
    //   console.log(res)
    //   return this.afs.doc<any>(`categories$/${res.uid}/user_categories/${categoryUid}`).valueChanges();
    // }));
    // console.log('get category');
    //    this.afs.doc<any>(`JP1VKSxi3BX196Clk7eHr1rxmLn1/categories$/${categoryUid}`).snapshotChanges().pipe(map(res => {
    //
    //     console.log(res);
    //     return res.payload;
    //   })).subscribe(res => {
    //     console.log(res);
    //    });
  }

  save(category: ICategory): Observable<any> {
    if (category.id) {
      return from(this.categoriesCollection.doc(category.id).update(category));
    } else {
      const idBefore =  this.afs.createId();
      category.id = idBefore;
      return from(this.categoriesCollection.doc(idBefore).set(category));
    }
  }

  addDefaultCategories() {
    return this.initializeData().then(res => {
      const promises: Promise<any>[] = [];
      const defaultCategories: ICategory[] = [
        {
          name: 'Food',
          color: '#FF9900'
        },
        {
          name: 'Shopping',
          color: '#FFD719'
        },
        {
          name: 'Education',
          color: '#A3EAC2'
        },
        {
          name: 'Recreation',
          color: '#33FFFF'
        },
        {
          name: 'Housing',
          color: '#CCCCCC'
        },
        {
          name: 'Others',
          color: '#000000'
        },
        {
          name: 'Job',
          color: '#66FF99'
        },
        {
          name: 'Health',
          color: '#CC0000'
        },
        {
          name: 'Transport',
          color: '#FF8585'
        },
        {
          name: 'Clothing',
          color: '#8DD47F'
        }
      ];
      for (const c of defaultCategories) {
        promises.push(this.save(c).toPromise());
      }
      return promises;
    });
  }
}
