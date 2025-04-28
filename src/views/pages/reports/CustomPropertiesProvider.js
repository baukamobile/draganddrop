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
                      return { suitable: 'Must be a number' };
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
                    return { extensionElements };
                  },
                },
              ],
            },
          ],
        },
      ];
    }
    return [];
  };
}

CustomPropertiesProvider.$inject = ['eventBus', 'bpmnFactory', 'elementRegistry', 'translate'];