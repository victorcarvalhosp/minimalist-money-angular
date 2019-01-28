import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOfxFileDetailsComponent } from './import-ofx-file-details.component';

describe('ImportOfxFileDetailsComponent', () => {
  let component: ImportOfxFileDetailsComponent;
  let fixture: ComponentFixture<ImportOfxFileDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportOfxFileDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportOfxFileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
