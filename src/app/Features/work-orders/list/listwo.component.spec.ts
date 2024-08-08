import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWOComponent } from './listwo.component';

describe('ListComponent', () => {
  let component: ListWOComponent;
  let fixture: ComponentFixture<ListWOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
