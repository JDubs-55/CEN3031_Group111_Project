import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashCardTesterComponent } from './flash-card-tester.component';

describe('FlashCardTesterComponent', () => {
  let component: FlashCardTesterComponent;
  let fixture: ComponentFixture<FlashCardTesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlashCardTesterComponent ]
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
