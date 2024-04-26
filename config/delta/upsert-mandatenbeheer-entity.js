export default [
  {
    match: {
      graph: {
        type: 'uri',
        value: 'http://mu.semte.ch/graphs/mandaten-staging',
      },
    },
    callback: {
      url: 'http://lmb-upsert-ldes-entity/delta',
      method: 'POST',
    },
    options: {
      resourceFormat: 'v0.0.1',
      gracePeriod: 1000,
      ignoreFromSelf: true,
      optOutMuScopeIds: [
        'http://redpencil.data.gift/id/concept/muScope/deltas/initialSync',
      ],
    },
  },
]
