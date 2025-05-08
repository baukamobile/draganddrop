import BpmnModeler from 'bpmn-js/lib/Modeler';
import customProperties from '@/bpmn/customProperties';

export default {
  mounted() {
    this.modeler = new BpmnModeler({
      container: this.$refs.canvas,
      propertiesPanel: {
        parent: this.$refs.properties
      },
      additionalModules: [customProperties]
    });
  }
};