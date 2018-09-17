import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {ICategory} from '../../models/category';
import {map, switchMap} from "rxjs/internal/operators";
import {fromPromise} from "rxjs/internal/observable/fromPromise";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  public category: Observable<ICategory>;

  public categories: Observable<ICategory[]>;
  private categoriesCollection: AngularFirestoreCollection<ICategory>;
  private categoriesDoc: AngularFirestoreDocument<ICategory>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.initializeData();
  }

  private initializeData() {
    return this.authService.getCurrentUser()
      .then(user => {
        console.log('UID' + user.uid);
        this.categoriesCollection = this.afs.collection<any>(`users/${user.uid}/categories`);
        this.categories = this.categoriesCollection.valueChanges();
      }, err => {
        console.log(err);
      });
  }

  addCategory(category: ICategory) {
    return this.categoriesCollection.add(category);
  }

  getCategory(categoryUid: string) {
    return this.authService.getCurrentUser()
      .then(user => {
        console.log('UID' + user.uid);
        this.categoriesDoc = this.afs.doc(`users/${user.uid}/categories/${categoryUid}`);
        this.category = this.categoriesDoc.valueChanges();
      }, err => {
        console.log(err);
      });


    // return fromPromise(this.authService.getCurrentUser()).pipe(switchMap(res => {
    //   console.log(res)
    //   return this.afs.doc<any>(`categories/${res.uid}/user_categories/${categoryUid}`).valueChanges();
    // }));
    // console.log('get category');
    //    this.afs.doc<any>(`JP1VKSxi3BX196Clk7eHr1rxmLn1/categories/${categoryUid}`).snapshotChanges().pipe(map(res => {
    //
    //     console.log(res);
    //     return res.payload;
    //   })).subscribe(res => {
    //     console.log(res);
    //    });
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
        promises.push(this.addCategory(c));
      }
      return promises;
    });
  }
}
