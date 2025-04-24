export default {
    name: 'QualityAssurance',
    uri: 'http://some-company/schema/bpmn/qa',
    prefix: 'qa',
    xml: {
      tagAlias: 'lowerCase'
    },
    types: [
      {
        name: 'AnalysisDetails',
        superClass: ['Element'],
        properties: [
          {
            name: 'lastChecked',
            isAttr: true,
            type: 'String'
          }
        ]
      }
    ],
    enumerations: [],
    associations: []
  };