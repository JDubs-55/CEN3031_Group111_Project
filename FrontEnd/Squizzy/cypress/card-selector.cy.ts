import { CardSelectorComponent } from "src/app/card-selector/card-selector.component"

describe('card-selector.cy.ts', () => {
  it('playground', () => {
     cy.mount(CardSelectorComponent)
  })

  it('should create', () => {
    expect(CardSelectorComponent).toBeTruthy();
  });
})