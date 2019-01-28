import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfxTransactionsRulesComponent } from './ofx-transactions-rules.component';

describe('OfxTransactionsRulesComponent', () => {
  let component: OfxTransactionsRulesComponent;
  let fixture: ComponentFixture<OfxTransactionsRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfxTransactionsRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfxTransactionsRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
