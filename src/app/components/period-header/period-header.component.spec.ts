import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodHeaderComponent } from './period-header.component';

describe('PeriodHeaderComponent', () => {
  let component: PeriodHeaderComponent;
  let fixture: ComponentFixture<PeriodHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
