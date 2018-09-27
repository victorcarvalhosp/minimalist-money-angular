import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsHeaderComponent } from './transactions-header.component';

describe('TransactionsHeaderComponent', () => {
  let component: TransactionsHeaderComponent;
  let fixture: ComponentFixture<TransactionsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
