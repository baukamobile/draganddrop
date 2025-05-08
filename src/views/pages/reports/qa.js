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
            name: 'suitabilityScoreEl',
            isAttr: true,
            type: 'integer'
          },
          {
            name: 'lastChecked',
            isAttr: true,
            type: 'String'
          },
          {
            name: 'assignedTo',
            isAttr: true,
            type: 'String'
          },
          {
            name: 'status',
            isAttr: true,
            type: 'String'
          },
          {
            name: 'created_at',
            isAttr: true,
            type: 'String'
          },
          {
            name: 'deadline',
            isAttr: true,
            type: 'String'
          },
          {
            name: 'updated_at',
            isAttr: true,
            type: 'String'
          },
          {
            name: 'is_complete',
            isAttr: true,
            type: 'Boolean'
          },
          {
            name: 'return_reason',
            isAttr: true, 
            type: 'String'
          }
        ]
      }
    ],
    enumerations: [],
    associations: []
  };