import { getLevels } from '../index'

describe('RangeSliderFacet', () => {
  describe('getLevels', () => {
    it('entries - np breaks', () => {
      const entries = [
        {
          label: '1',
          count: 0
        },
        {
          label: '2',
          count: 0
        },
        {
          label: '3',
          count: 0
        },
        {
          label: '4',
          count: 0
        },
        {
          label: '5',
          count: 150
        },
        {
          label: '6',
          count: 733
        },
        {
          label: '7',
          count: 1778
        },
        {
          label: '8',
          count: 1303
        },
        {
          label: '9',
          count: 198
        },
        {
          label: '10',
          count: 0
        }
      ]

      expect(getLevels(entries)).toMatchInlineSnapshot(`
        Array [
          Object {
            "hasResults": false,
            "max": 5,
            "min": 1,
          },
          Object {
            "hasResults": true,
            "max": 10,
            "min": 5,
          },
        ]
      `)
    })

    it('entries - with breaks', () => {
      const entries = [
        {
          label: '1',
          count: 0
        },
        {
          label: '2',
          count: 0
        },
        {
          label: '3',
          count: 100
        },
        {
          label: '4',
          count: 0
        },
        {
          label: '5',
          count: 150
        },
        {
          label: '6',
          count: 0
        },
        {
          label: '7',
          count: 1778
        },
        {
          label: '8',
          count: 1303
        },
        {
          label: '9',
          count: 198
        },
        {
          label: '10',
          count: 0
        }
      ]

      expect(getLevels(entries)).toMatchInlineSnapshot(`
        Array [
          Object {
            "hasResults": false,
            "max": 3,
            "min": 1,
          },
          Object {
            "hasResults": true,
            "max": 4,
            "min": 3,
          },
          Object {
            "hasResults": false,
            "max": 5,
            "min": 4,
          },
          Object {
            "hasResults": true,
            "max": 6,
            "min": 5,
          },
          Object {
            "hasResults": false,
            "max": 7,
            "min": 6,
          },
          Object {
            "hasResults": true,
            "max": 10,
            "min": 7,
          },
        ]
      `)
    })

    it('does', () => {
      const entries = JSON.parse(
        '[{"__typename":"FacetSetEntry","id":"metascore_0","label":"0","count":0},{"__typename":"FacetSetEntry","id":"metascore_5","label":"5","count":0},{"__typename":"FacetSetEntry","id":"metascore_10","label":"10","count":1},{"__typename":"FacetSetEntry","id":"metascore_15","label":"15","count":3},{"__typename":"FacetSetEntry","id":"metascore_20","label":"20","count":8},{"__typename":"FacetSetEntry","id":"metascore_25","label":"25","count":21},{"__typename":"FacetSetEntry","id":"metascore_30","label":"30","count":44},{"__typename":"FacetSetEntry","id":"metascore_35","label":"35","count":58},{"__typename":"FacetSetEntry","id":"metascore_40","label":"40","count":64},{"__typename":"FacetSetEntry","id":"metascore_45","label":"45","count":125},{"__typename":"FacetSetEntry","id":"metascore_50","label":"50","count":139},{"__typename":"FacetSetEntry","id":"metascore_55","label":"55","count":155},{"__typename":"FacetSetEntry","id":"metascore_60","label":"60","count":175},{"__typename":"FacetSetEntry","id":"metascore_65","label":"65","count":193},{"__typename":"FacetSetEntry","id":"metascore_70","label":"70","count":190},{"__typename":"FacetSetEntry","id":"metascore_75","label":"75","count":147},{"__typename":"FacetSetEntry","id":"metascore_80","label":"80","count":137},{"__typename":"FacetSetEntry","id":"metascore_85","label":"85","count":83},{"__typename":"FacetSetEntry","id":"metascore_90","label":"90","count":51},{"__typename":"FacetSetEntry","id":"metascore_95","label":"95","count":15},{"__typename":"FacetSetEntry","id":"metascore_100","label":"100","count":4}]'
      )
      expect(getLevels(entries)).toMatchInlineSnapshot(`
        Array [
          Object {
            "hasResults": false,
            "max": 10,
            "min": 0,
          },
          Object {
            "hasResults": true,
            "max": 100,
            "min": 10,
          },
        ]
      `)
    })
  })
})
