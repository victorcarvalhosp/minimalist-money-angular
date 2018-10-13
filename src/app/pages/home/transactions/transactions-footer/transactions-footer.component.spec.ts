import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsFooterComponent } from './transactions-footer.component';

describe('TransactionsFooterComponent', () => {
  let component: TransactionsFooterComponent;
  let fixture: ComponentFixture<TransactionsFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
