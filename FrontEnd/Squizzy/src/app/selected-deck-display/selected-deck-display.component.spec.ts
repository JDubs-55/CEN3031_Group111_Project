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

  let placeholder = "placeholder";
  it('placeholder', () => {
    expect(placeholder).toEqual("placeholder");
  });
});
