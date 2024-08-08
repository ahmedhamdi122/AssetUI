import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalreportComponent } from './hospitalreport.component';

describe('HospitalreportComponent', () => {
  let component: HospitalreportComponent;
  let fixture: ComponentFixture<HospitalreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
