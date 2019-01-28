import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOfxTransactionRuleComponent } from './create-ofx-transaction-rule.component';

describe('CreateOfxTransactionRuleComponent', () => {
  let component: CreateOfxTransactionRuleComponent;
  let fixture: ComponentFixture<CreateOfxTransactionRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOfxTransactionRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOfxTransactionRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
