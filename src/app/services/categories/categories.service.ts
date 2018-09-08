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
