import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationHeaderComponent } from './reconciliation-header.component';

describe('ReconciliationHeaderComponent', () => {
  let component: ReconciliationHeaderComponent;
  let fixture: ComponentFixture<ReconciliationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconciliationHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
