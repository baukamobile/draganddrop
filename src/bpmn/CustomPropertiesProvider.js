// @/bpmn/CustomPropertiesProvider.js
import { is } from 'bpmn-js/lib/util/ModelUtil';

// This is a simplified properties provider
// For a complete implementation, you'd want to use bpmn-js-properties-panel
export default function CustomPropertiesProvider(propertiesPanel, translate) {
  // Make sure propertiesPanel is available
  if (!propertiesPanel) {
    return;
  }

  this.getGroups = function(element) {
    // Only return custom groups for supported elements
    if (!is(element, 'bpmn:Task') && 
        !is(element, 'bpmn:UserTask') && 
        !is(element, 'bpmn:ServiceTask') && 
        !is(element, 'bpmn:ManualTask')) {
      return [];
    }

    return [
      {
        id: 'taskAssignment',
        label: 'Task Assignment',
        entries: [
          {
            id: 'assigned_to',
            label: 'Assigned To',
            modelProperty: 'assigned_to',
            get: function(element) {
              return { assigned_to: element.businessObject.assigned_to || '' };
            },
            set: function(element, values) {
              return {
                'task:assigned_to': values.assigned_to || undefined
              };
            }
          },
          {
            id: 'deadline',
            label: 'Deadline',
            modelProperty: 'deadline',
            get: function(element) {
              return { deadline: element.businessObject.deadline || '' };
            },
            set: function(element, values) {
              return {
                'task:deadline': values.deadline || undefined
              };
            }
          },
          {
            id: 'priority',
            label: 'Priority',
            modelProperty: 'priority',
            get: function(element) {
              return { priority: element.businessObject.priority || '' };
            },
            set: function(element, values) {
              return {
                'task:priority': parseInt(values.priority) || undefined
              };
            }
          }
        ]
      }
    ];
  };
}