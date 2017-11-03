const qa=(val)=> `[data-qa='${val}']`
const hitStats = () => cy.get(`${qa('hits-stats')} > ${qa('info')}`)    
const hits = () => cy.get("[data-qa=hits] > div")
const searchInput = () => cy.get("[data-qa=query]")    

const texts = ($p)=> {
    return $p.map((i, el) => {
        return Cypress.$(el).text()
    }).get()  
}
describe('Searchkit movie test', function () {
 
    beforeEach(()=> {
        cy.server()
        cy.route('POST', '/api/movies/_search').as('search')
        cy.visit('/movie-app')
        cy.wait("@search")
    })
    
    it('Should have correct hit counts', function () {
        hitStats().should('contain', '4162 results found')    
        hits().should('have.length', 20)
    })

    it('should find matrix', ()=> {
        searchInput().type("matrix")
        cy.wait("@search")
        hitStats().should('contain', '3 results found')    
        hits().should('have.length', 3)
        hits().first().find(qa('title') + "> em")
            .should('contain', 'Matrix')
    })

    it("should refine actors", ()=> {
        cy.get('.filter--actorsFacet').as("actors")
            .get('.sk-panel__header')
            .should('contain', 'Actors')
        cy.get('@actors').find(qa('option'))
            .should('have.length', 10)
        cy.get('@actors').find(qa('option'))
            .first()
            .should('have.attr', 'data-key', 'Naveen Andrews')
            .click()
        
        hitStats().should('contain', '73 results found')
        hits().first().find(qa('title'))
            .should('contain', 'Lost')
    })

    it("should display hierachical menu correctly", ()=> {
        cy.get(".sk-hierarchical-menu-list__root [data-qa='option']")
            .should(($p)=> {                                   
                expect(texts($p)).to.deep.eq(["Movie3120", "Episode521", "Series473", "Game48"])
            })
        searchInput().type("batman")
        cy.wait("@search")
        cy.get("[data-key='Game']").click()
        cy.wait("@search")
        cy.get("[data-key='Game']+div [data-qa='option']").should(($p)=> {
            expect(texts($p)).to.deep.eq(["Action2", "Crime2", "Fantasy2"])
        })
    })
  
})