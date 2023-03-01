import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckPreviewComponent } from './deck-preview.component';

describe('DeckPreviewComponent', () => {
  let component: DeckPreviewComponent;
  let fixture: ComponentFixture<DeckPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let placeholder = "placeholder";
  it('placeholder', () => {
    expect(placeholder).toEqual("placeholder");
  });
});
