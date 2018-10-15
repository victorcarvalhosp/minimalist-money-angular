import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {ICategory} from '../../models/category';
import {CategoriesService} from '../../services/categories/categories.service';
import {List} from 'immutable';

@Injectable({
  providedIn: 'root'
})
export class CategoriesStore {

  private _category: BehaviorSubject<ICategory> = new BehaviorSubject<ICategory>({name: ''});
  private _categories: BehaviorSubject<List<ICategory>> = new BehaviorSubject(List([]));

  constructor(private afs: AngularFirestore, private categoriesService: CategoriesService) {
    this.categoriesService.initializeData().then(res => {
      this.initializeData();
    });
    console.log('INITIALIZE CATEGORIES STORE');
  }

  private initializeData() {
    this.categoriesService.getAllCategories().subscribe(res => {
      const categories: ICategory[] = res.map(
        a => {
          const data = a.payload.doc.data() as ICategory;
          data.id = a.payload.doc.id;
          return data;
        }
      );
      this._categories.next(List(categories));
    });
  }

  save(category: ICategory): Observable<any> {
    return this.categoriesService.save(category);
  }

  delete(category: ICategory): Observable<any> {
    return this.categoriesService.delete(category);
  }

  get categories() {
    return this._categories.asObservable();
  }
}
