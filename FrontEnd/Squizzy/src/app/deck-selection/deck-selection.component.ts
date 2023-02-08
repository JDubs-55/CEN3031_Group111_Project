import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ProgramStateService } from '../program-state.service';
import { DeckInfoProviderService } from '../deck-info-provider.service';

@Component({
  selector: 'app-deck-selection',
  templateUrl: './deck-selection.component.html',
  styleUrls: ['./deck-selection.component.css']
})
export class DeckSelectionComponent {
  get options(): string[] {
    return this.deckInfoProviderService.deckNameList;
  }

  myControl = new FormControl('');
  filteredOptions = new Observable<string[]>();

  constructor(private deckInfoProviderService:DeckInfoProviderService, private programState: ProgramStateService){

  }

  ngOnInit() {
    //This makes the auto complete filter by the content already typed
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    //Updates the selected deck for the program
    this.myControl.valueChanges.subscribe((value)=>{
      if(value == null){
        this.programState.selectedDeck = "";
      }else{
        this.programState.selectedDeck = value;
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue) && option != "");
  }
}
