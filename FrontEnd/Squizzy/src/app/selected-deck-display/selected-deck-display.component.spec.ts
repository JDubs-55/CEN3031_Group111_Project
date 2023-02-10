import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDeckDisplayComponent } from './selected-deck-display.component';

describe('SelectedDeckDisplayComponent', () => {
  let component: SelectedDeckDisplayComponent;
  let fixture: ComponentFixture<SelectedDeckDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedDeckDisplayComponent ]
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
