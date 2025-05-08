import { is } from 'bpmn-js/lib/util/ModelUtil';

export default {
  __init__: ['customPropertiesProvider'],
  customPropertiesProvider: ['type', CustomPropertiesProvider]
};

function CustomPropertiesProvider(propertiesPanel, translate) {
  this.getTabs = function(element) {
    if (is(element, 'bpmn:Task')) {
      return [
        {
          id: 'custom',
          label: 'Custom Properties',
          groups: [
            {
              id: 'customProperties',
              label: 'Task Details',
              entries: [
                {
                  id: 'assigned',
                  label: 'Assigned To',
                  modelProperty: 'assigned',
                  widget: 'selectBox',
                  get: function(element) {
                    return { assigned: element.businessObject.assigned || '' };
                  },
                  set: function(element, values) {
                    element.businessObject.assigned = values.assigned;
                  },
                  selectOptions: async function() {
                    const response = await fetch('/api/users/');
                    const users = await response.json();
                    return users.map(user => ({ name: user.username, value: user.id }));
                  }
                },
                {
                  id: 'created_at',
                  label: 'Created At',
                  modelProperty: 'created_at',
                  widget: 'textBox',
                  get: function(element) {
                    return { created_at: element.businessObject.created_at || '' };
                  },
                  set: function(element, values) {
                    element.businessObject.created_at = values.created_at;
                  }
                },
                {
                  id: 'deadline',
                  label: 'Deadline',
                  modelProperty: 'deadline',
                  widget: 'textBox',
                  get: function(element) {
                    return { deadline: element.businessObject.deadline || '' };
                  },
                  set: function(element, values) {
                    element.businessObject.deadline = values.deadline;
                  }
                }
              ]
            }
          ]
        }
      ];
    }
    return [];
  };
}