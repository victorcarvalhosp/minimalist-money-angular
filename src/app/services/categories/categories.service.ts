import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {ICategory} from '../../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  public categories: Observable<ICategory[]>;
  private categoriesCollection: AngularFirestoreCollection<ICategory>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.initializeData();
  }

  private initializeData() {
    return this.authService.getCurrentUser()
      .then(user => {
        console.log('UID' + user.uid);
        this.categoriesCollection = this.afs.collection<any>(`categories/${user.uid}/user_categories`);
        this.categories = this.categoriesCollection.valueChanges();
      }, err => {
        console.log(err);
      });
  }

  addCategory(category: ICategory) {
    return this.categoriesCollection.add(category);
  }

  addDefaultCategories() {
    return this.initializeData().then(res => {
      const promises: Promise<any>[] = [];
      const defaultCategories: ICategory[] = [
        {name: 'Food'},
        {name: 'Fun'},
        {name: 'Study'},
      ];
      for (const c of defaultCategories) {
        promises.push(this.addCategory(c));
      }
      return promises;
    });
  }
}
