  import { is } from 'bpmn-js/lib/util/ModelUtil';

  export default function CustomPropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate) {
    this.getTabs = function (element) {
      // Only show custom properties for specific elements (e.g., tasks)
      if (is(element, 'bpmn:Task')) {
        return [
          {
            id: 'qaProperties',
            label: 'QA Properties',
            groups: [
              {
                id: 'qaGroup',
                label: 'Quality Assurance',
                entries: [
                  {
                    id: 'suitabilityScore',
                    label: 'Suitability Score',
                    modelProperty: 'suitable',
                    widget: 'textBox',
                    get: function (element) {
                      const bo = element.businessObject;
                      return { suitable: bo.suitable || '' };
                    },
                    set: function (element, values) {
                      const bo = element.businessObject;
                      return { suitable: values.suitable };
                    },
                    validate: function (element, values) {
                      if (isNaN(values.suitable)) {
                        return { suitable: 'Must be a number, dumbass!' };
                      }
                      return {};
                    },
                  },
                  {
                    id: 'lastChecked',
                    label: 'Last Checked',
                    modelProperty: 'lastChecked',
                    widget: 'textBox',
                    get: function (element) {
                      const bo = element.businessObject;
                      const analysisDetails = bo.extensionElements?.values?.find(
                        (ext) => ext.$instanceOf('qa:AnalysisDetails')
                      );
                      return { lastChecked: analysisDetails?.lastChecked || '-' };
                    },
                    set: function (element, values) {
                      const bo = element.businessObject;
                      let extensionElements = bo.extensionElements || bpmnFactory.create('bpmn:ExtensionElements');
                      let analysisDetails = extensionElements.values?.find(
                        (ext) => ext.$instanceOf('qa:AnalysisDetails')
                      );
                
                      if (!analysisDetails) {
                        analysisDetails = bpmnFactory.create('qa:AnalysisDetails');
                        extensionElements.values = extensionElements.values || [];
                        extensionElements.values.push(analysisDetails);
                      }
                
                      analysisDetails.lastChecked = values.lastChecked || new Date().toISOString();
                      bo.extensionElements = extensionElements; // Ensure BO is updated
                      return { extensionElements };
                    },
                  },
                  {
                    id: 'assignedTo',
                    label: 'Assigned To',
                    modelProperty: 'assignedTo',
                    widget: 'textBox',
                    get: function (element) {
                      const bo = element.businessObject;
                      const analysisDetails = bo.extensionElements?.values?.find(
                        (ext) => ext.$instanceOf('qa:AnalysisDetails')
                      );
                      return { assignedTo: analysisDetails?.assignedTo || '-' }; // Fixed, you clown!
                    },
                    set: function (element, values) {
                      const bo = element.businessObject;
                      let extensionElements = bo.extensionElements || bpmnFactory.create('bpmn:ExtensionElements');
                      let analysisDetails = extensionElements.values?.find(
                        (ext) => ext.$instanceOf('qa:AnalysisDetails')
                      );
                
                      if (!analysisDetails) {
                        analysisDetails = bpmnFactory.create('qa:AnalysisDetails');
                        extensionElements.values = extensionElements.values || [];
                        extensionElements.values.push(analysisDetails);
                      }
                
                      analysisDetails.assignedTo = values.assignedTo || ''; // Actually set assignedTo, genius!
                      bo.extensionElements = extensionElements; // Update BO
                      return { extensionElements };
                    },
                  },
                  {
                    id: 'status', // Match the property name
                    label: 'Status',
                    modelProperty: 'status',
                    widget: 'textBox', // Or 'selectBox' for enums, etc.
                    get: function (element) {
                      const bo = element.businessObject;
                      const analysisDetails = bo.extensionElements?.values?.find(
                        (ext) => ext.$instanceOf('qa:AnalysisDetails')
                      );
                      return { status: analysisDetails?.status || '-' };
                    },
                    set: function (element, values) {
                      const bo = element.businessObject;
                      let extensionElements = bo.extensionElements || bpmnFactory.create('bpmn:ExtensionElements');
                      let analysisDetails = extensionElements.values?.find(
                        (ext) => ext.$instanceOf('qa:AnalysisDetails')
                      );
                  
                      if (!analysisDetails) {
                        analysisDetails = bpmnFactory.create('qa:AnalysisDetails');
                        extensionElements.values = extensionElements.values || [];
                        extensionElements.values.push(analysisDetails);
                      }
                  
                      analysisDetails.status = values.status || ''; // Set default as needed
                      bo.extensionElements = extensionElements;
                      return { extensionElements };
                    },
                    validate: function (element, values) {
                      // Add validation if needed, e.g., check for valid status values
                      return {};
                    },
                  }
                  // Add more entries for other properties like status, created_at, etc., following the same pattern
                ]
              },
            ],
          },
        ];
      }
      return [];
    };
  }

  CustomPropertiesProvider.$inject = ['eventBus', 'bpmnFactory', 'elementRegistry', 'translate'];