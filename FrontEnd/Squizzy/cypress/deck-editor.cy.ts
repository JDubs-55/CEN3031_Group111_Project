import { DeckEditorComponent } from "src/app/deck-editor/deck-editor.component"

describe('deck-editor.cy.ts', () => {
  it('playground', () => {
    cy.mount(DeckEditorComponent)
  })
})