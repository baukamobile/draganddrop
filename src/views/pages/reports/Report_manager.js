import { getProjects } from "@/api/tasks";
import { useRoute } from "vue-router";
import { onMounted, ref, reactive } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import CustomPaletteProvider from '@/views/pages/reports/CustomPaletteProvider';
import axios from 'axios';
import qaModdleExtension from '@/views/pages/reports/qa';

export function ProjectsManager (){
const projects = ref([]);
const route = useRoute();
const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
const bpmnContainer = ref(null);
const modeler = ref(null);
const selectedProcessId = ref(Number(route.params.processId));
const qualityAssuranceEl = ref(null);
const suitabilityScoreEl = ref(null);
const lastCheckedEl = ref(null);
const warningEl = ref(null);
const okayEl = ref(null);
const formEl = ref(null);

const owners = ref([]);

const newProcess = reactive({
    template: null,
    name: "",
    description: "",
    owner: null,
    department: null,
    bpmn_xml: null,
    is_complete: false,
    is_recurring: false,
    recurring_interval: null
});

const fetchOwners = async () => {
    try {
        const response = await axios.get(`${API_URL_USERS}`);
        owners.value = response.data;
    } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
    }
};

// QA functionality
const HIGH_PRIORITY = 1500;
let analysisDetails = null;
let businessObject = null;
let currentElement = null;
let suitabilityScore = null;

// Validate suitability score
const validate = () => {
  if (!suitabilityScoreEl.value) return;
  
  const value = suitabilityScoreEl.value.value;
  
  if (isNaN(value)) {
    warningEl.value.classList.remove('hidden');
    okayEl.value.disabled = true;
  } else {
    warningEl.value.classList.add('hidden');
    okayEl.value.disabled = false;
  }
};

// Get extension element helper function
const getExtensionElement = (element, type) => {
  if (!element.extensionElements) {
    return;
  }

  return element.extensionElements.values.filter((extensionElement) => {
    return extensionElement.$instanceOf(type);
  })[0];
};

// Set up BPMN modeler and event handlers
onMounted(() => {
  // Create modeler with custom palette provider and QA moddle extension
  modeler.value = new BpmnModeler({
    container: bpmnContainer.value,
    keyboard: { bindTo: document },
    additionalModules: [
      {
        // Remove default palette provider
        paletteProvider: ['value', null]
      },
      {
        // Add custom palette provider
        __init__: ['customPaletteProvider'],
        customPaletteProvider: ['type', CustomPaletteProvider]
      }
    ],
    // Add QA moddle extension
    moddleExtensions: {
      qa: qaModdleExtension
    }
  });

  const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.23.0">
  <bpmn:process id="Process_1" isExecutable="true" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

  modeler.value.importXML(initialDiagram).then(() => {
    console.log('BPMN loaded!');
    
    // Add dropdown overlay
    const overlays = modeler.value.get('overlays');
    overlays.add('Process_1', 'note', {
      position: {
        top: -30,
        right: 10,
      },
      html: `
        <div class="">
        </div>
      `
    });

    // Add event listener for dropdown
    setTimeout(() => {
      const dropdown = document.querySelector('.dropdown');
      if (dropdown) {
        dropdown.addEventListener('change', (event) => {
          console.log('Selected view:', event.target.value);
          // Add your view change logic here
        });
      }
    }, 100);

    modeler.value.get('canvas').zoom('fit-viewport');
  }).catch(err => {
    console.error('Error loading BPMN:', err);
  });

  // QA functionality - element context menu
  modeler.value.on('element.contextmenu', HIGH_PRIORITY, (event) => {
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();

    // Ignore if QA elements aren't available yet
    if (!qualityAssuranceEl.value) return;
    
    qualityAssuranceEl.value.classList.remove('hidden');

    currentElement = event.element;

    // Ignore root element
    if (!currentElement.parent) {
      return;
    }

    // Use getBusinessObject to get the business object
    businessObject = getBusinessObject(currentElement);

    let { suitable } = businessObject;

    suitabilityScoreEl.value.value = suitable ? suitable : '';
    suitabilityScoreEl.value.focus();

    analysisDetails = getExtensionElement(businessObject, 'qa:AnalysisDetails');
    lastCheckedEl.value.textContent = analysisDetails ? analysisDetails.lastChecked : '-';

    validate();
  });

  // Close QA panel when clicking outside
  window.addEventListener('click', (event) => {
    if (!qualityAssuranceEl.value) return;
    
    const { target } = event;

    if (target === qualityAssuranceEl.value || qualityAssuranceEl.value.contains(target)) {
      return;
    }

    qualityAssuranceEl.value.classList.add('hidden');
  });
});

// Form submit handler for QA panel
const handleFormSubmit = (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (!modeler.value || !businessObject || !currentElement) return;

  suitabilityScore = Number(suitabilityScoreEl.value.value);

  if (isNaN(suitabilityScore)) {
    return;
  }

  const moddle = modeler.value.get('moddle');
  const modeling = modeler.value.get('modeling');
  
  const extensionElements = businessObject.extensionElements || moddle.create('bpmn:ExtensionElements');

  if (!analysisDetails) {
    analysisDetails = moddle.create('qa:AnalysisDetails');
    
    if (!extensionElements.get('values')) {
      extensionElements.values = [];
    }
    extensionElements.get('values').push(analysisDetails);
  }

  analysisDetails.lastChecked = new Date().toISOString();

  modeling.updateProperties(currentElement, {
    extensionElements,
    suitable: suitabilityScore
  });

  qualityAssuranceEl.value.classList.add('hidden');
};

// Handle key events in the QA form
const handleFormKeydown = (event) => {
  if (event.key === 'Escape') {
    qualityAssuranceEl.value.classList.add('hidden');
  }
};

// Save diagram to server
const saveDiagram = async () => {
  try {
    const { xml } = await modeler.value.saveXML({ format: true });
    console.log('Saved XML:', xml);

    const response = await axios.post(API_BPMNXML_PROCESS, { xml });
    console.log('Diagram successfully saved to server');
  } catch (err) {
    console.error('Error saving:', err);
  }
};

// Start process workflow
const startProcess = () => {
  console.log('Starting process...');
};

    onMounted(async () => {
        try {
            const projectsData = await getProjects();
            if (projectsData) {
                projects.value = projectsData;
                console.log('Данные закгружены: ', projects.value);
            }
        } catch (e) {
            console.log('Error по загрузке данных: ', e);
        }
    });

    return {
        projects,
     
    };
}
