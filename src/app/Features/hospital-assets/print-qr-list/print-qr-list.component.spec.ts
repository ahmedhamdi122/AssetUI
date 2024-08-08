import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintQrListComponent } from './print-qr-list.component';

describe('PrintQrListComponent', () => {
  let component: PrintQrListComponent;
  let fixture: ComponentFixture<PrintQrListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintQrListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintQrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
