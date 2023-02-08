import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyComponent } from './study.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FlashCardTesterComponent } from '../flash-card-tester/flash-card-tester.component';
import { FlashCardComponent } from '../flash-card/flash-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StudyComponent', () => {
  let component: StudyComponent;
  let fixture: ComponentFixture<StudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTabsModule, BrowserAnimationsModule],
      declarations: [ StudyComponent, FlashCardTesterComponent, FlashCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
