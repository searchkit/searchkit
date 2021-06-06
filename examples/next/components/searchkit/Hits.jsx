import React from 'react'
import { EuiFlexGrid, EuiFlexItem, EuiCard, EuiFlexGroup, EuiTitle, EuiText } from '@elastic/eui'

export const HitsGrid = ({ data }) => (
  <EuiFlexGrid gutterSize="l">
    {data?.results.hits.items.map((hit) => (
      <EuiFlexItem key={hit.id} grow={2}>
        <EuiCard
          grow={false}
          textAlign="left"
          image={<img src={hit.fields.poster} style={{ maxWidth: 200 }} alt="Nature" />}
          title={hit.fields.title}
          description={hit.fields.plot}
        />
      </EuiFlexItem>
    ))}
  </EuiFlexGrid>
)

export const HitsList = ({ data }) => (
  <EuiFlexGrid>
    {data?.results.hits.items.map((hit) => (
      <EuiFlexItem key={hit.id}>

        <EuiFlexGroup gutterSize="xl">
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem grow={false}>
                <img src={hit.fields.poster} alt="Nature" style={{ height: '150px' }} />
              </EuiFlexItem>
              <EuiFlexItem grow={4}>
                <EuiTitle size="xs">
                  <h6>{hit.fields.title}</h6>
                </EuiTitle>
                <EuiText grow={false}>
                  <p>{hit.fields.plot}</p>
                </EuiText>
              </EuiFlexItem>
              <EuiFlexItem grow={2}>
                <EuiText grow={false}>
                  <ul>
                    <li>
                      <b>ACTORS: </b>
                      {hit.fields.actors.join(', ')}
                    </li>

                    <li>
                      <b>WRITERS: </b>
                      {hit.fields.writers.join(', ')}
                    </li>
                  </ul>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    ))}
  </EuiFlexGrid>
)
