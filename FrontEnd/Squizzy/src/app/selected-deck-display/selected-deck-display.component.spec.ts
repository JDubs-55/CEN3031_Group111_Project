import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDeckDisplayComponent } from './selected-deck-display.component';
import { MatCardModule } from '@angular/material/card';

describe('SelectedDeckDisplayComponent', () => {
  let component: SelectedDeckDisplayComponent;
  let fixture: ComponentFixture<SelectedDeckDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports : [MatCardModule],
      declarations: [SelectedDeckDisplayComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectedDeckDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
