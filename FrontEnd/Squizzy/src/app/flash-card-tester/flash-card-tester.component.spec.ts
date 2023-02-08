import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashCardTesterComponent } from './flash-card-tester.component';
import { FlashCardComponent } from '../flash-card/flash-card.component';
import { MatButtonModule } from '@angular/material/button';

describe('FlashCardTesterComponent', () => {
  let component: FlashCardTesterComponent;
  let fixture: ComponentFixture<FlashCardTesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatButtonModule],
      declarations: [ FlashCardTesterComponent, FlashCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashCardTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
