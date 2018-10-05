import {Component, OnInit} from '@angular/core';
import {CategoriesService} from '../../../../services/categories/categories.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {CreateCategoryComponent} from './create-category/create-category.component';
import {ICategory} from '../../../../models/category';
import {CategoriesStore} from "../../../../state/categories/categories.store";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  isSmall: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]);

  constructor(private breakpointObserver: BreakpointObserver, public categoriesStore: CategoriesStore,
              public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  openNewCategoryDialog() {
    const category: ICategory = {
      name: '',
    };
    this.openDialog(category);
  }

  openDialog(category: ICategory): void {
    const dialogRef = this.dialog.open(CreateCategoryComponent, {
      width: '50%',
      maxWidth: '100wh',
      maxHeight: '100vh',
      disableClose: true,
      data: category
    });

    const smallDialogSubscription = this.isSmall.subscribe(size => {
      if (size.matches) {
        dialogRef.updateSize('100%', '100%');
      } else {
        dialogRef.updateSize('50%');
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      smallDialogSubscription.unsubscribe();
      // this.animal = result;
    });
  }

}
