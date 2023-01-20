import { getSatisfiedRules } from '../queryRules'
import { QueryRule } from '../types'

describe('getSatisfiedRules', () => {
  const rules: QueryRule[] = [
    {
      id: '1',
      conditions: [[{ context: 'query', value: 'test', match_type: 'exact' }]],
      actions: []
    },
    {
      id: '2',
      conditions: [[{ context: 'query', value: 'bob', match_type: 'prefix' }]],
      actions: []
    },
    {
      id: '3',
      conditions: [[{ context: 'query', value: 'ph', match_type: 'contains' }]],
      actions: []
    },
    {
      id: '4',
      conditions: [
        [
          { context: 'query', value: 'test', match_type: 'exact' },
          { context: 'context', value: ['test'] }
        ]
      ],
      actions: []
    },
    {
      id: '5',
      conditions: [
        [
          { context: 'query', value: 'test', match_type: 'exact' },
          { context: 'context', value: ['test'] }
        ]
      ],
      actions: []
    },
    {
      id: '6',
      conditions: [
        [{ context: 'filterPresent', values: [{ attribute: 'designerName', value: 'test' }] }]
      ],
      actions: []
    },
    {
      id: '7',
      conditions: [
        [
          {
            context: 'filterPresent',
            values: [
              { attribute: 'designerName', value: 'test2' },
              { attribute: 'type', value: 'clothing' }
            ]
          }
        ]
      ],
      actions: []
    }
  ]

  it('gets exact query rule match', () => {
    expect(
      getSatisfiedRules(
        {
          query: 'test',
          context: [],
          filters: []
        },
        rules
      )
    ).toEqual([rules[0]])
  })

  it('gets exact query rule match', () => {
    expect(
      getSatisfiedRules(
        {
          query: 'bobtest',
          context: [],
          filters: []
        },
        rules
      )
    ).toEqual([rules[1]])
  })

  it('gets exact query rule match', () => {
    expect(
      getSatisfiedRules(
        {
          query: 'joseph',
          context: [],
          filters: []
        },
        rules
      )
    ).toEqual([rules[2]])
  })

  describe('and & or', () => {
    it('gets exact query rule match', () => {
      expect(
        getSatisfiedRules(
          {
            query: 'test',
            context: [],
            filters: []
          },
          rules
        )
      ).toEqual([rules[0]])
    })
  })

  describe('context', () => {
    it('gets context rule match', () => {
      const x = getSatisfiedRules(
        {
          query: 'test',
          context: ['test'],
          filters: []
        },
        rules
      )
      expect(x).toEqual([rules[0], rules[3], rules[4]])
    })

    it('miss context rules match', () => {
      const x = getSatisfiedRules(
        {
          query: 'test2',
          context: ['test2'],
          filters: []
        },
        rules
      )
      expect(x).toEqual([])
    })
  })

  describe('filters', () => {
    it('gets filter rule match', () => {
      const x = getSatisfiedRules(
        {
          query: '',
          context: [],
          filters: [{ attribute: 'designerName', value: 'test' }]
        },
        rules
      )
      expect(x).toEqual([rules[5]])
    })

    it('miss context rules match', () => {
      const x = getSatisfiedRules(
        {
          query: '',
          context: [],
          filters: [{ attribute: 'designerName', value: 'fred' }]
        },
        rules
      )
      expect(x).toEqual([])
    })

    it('match on rules with multiple filters', () => {
      const x = getSatisfiedRules(
        {
          query: '',
          context: [],
          filters: [
            { attribute: 'designerName', value: 'test' },
            { attribute: 'type', value: 'clothing' }
          ]
        },
        rules
      )
      expect(x).toEqual([rules[5]])
    })
  })
})
