import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmassetsComponent } from './pmassets.component';

describe('PmassetsComponent', () => {
  let component: PmassetsComponent;
  let fixture: ComponentFixture<PmassetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmassetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmassetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
