import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsFooterDetailsComponent } from './transactions-footer-details.component';

describe('TransactionsFooterDetailsComponent', () => {
  let component: TransactionsFooterDetailsComponent;
  let fixture: ComponentFixture<TransactionsFooterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsFooterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsFooterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
