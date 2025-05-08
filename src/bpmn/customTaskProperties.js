// @/bpmn/customTaskProperties.js
export default {
    name: 'TaskProperties',
    uri: 'http://yourcompany.com/schema/bpmn/task-properties',
    prefix: 'task',
    xml: {
      tagAlias: 'lowerCase'
    },
    associations: [],
    types: [
      {
        name: 'TaskAssignment',
        extends: ['bpmn:Task', 'bpmn:UserTask', 'bpmn:ServiceTask', 'bpmn:ManualTask'],
        properties: [
          {
            name: 'assigned_to',
            isAttr: true,
            type: 'String'
          },
          {
            name: 'deadline',
            isAttr: true,
            type: 'String'
          },
          {
            name: 'created_at',
            isAttr: true,
            type: 'String'
          },
          {
            name: 'priority',
            isAttr: true,
            type: 'Integer'
          }
        ]
      }
    ]
  };