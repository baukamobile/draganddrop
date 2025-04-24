<script setup>
import { onMounted, ref, reactive } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import CustomPaletteProvider from '@/views/pages/reports/CustomPaletteProvider';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useTaskManager } from '@/components/dashboard/useTaskManger';
import qaModdleExtension from '@/views/pages/reports/qa';

const{
  newTask, formatDate,newStatus, projects,users
}= useTaskManager();

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
const value1 = ref('')
const value2 = ref('')
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
</script>

<template>
  <div class="flex flex-col h-full">
    <div ref="bpmnContainer" class="w-full h-[850px] border"></div>
    
    <!-- Controls -->
    <div class="btn" style="display: flex; justify-content: space-between;">
      <button @click="saveDiagram" class="mt-2 p-2 bg-blue-500 text-white self-start">
        Save Process
      </button>
      <button @click="startProcess" class="mt-2 p-2 bg-green-500 text-white self-start">
        Start Process
      </button>
    </div>
    
    <!-- Quality Assurance Panel -->
    <div ref="qualityAssuranceEl" id="quality-assurance" class="panel hidden">
      <form ref="formEl" id="form" @submit="handleFormSubmit" @keydown="handleFormKeydown">
        <p>
          <b>Suitability Score</b>
        </p>
        <br />
        <input ref="suitabilityScoreEl" id="suitability-score" type="text" placeholder="100" autocomplete="off" @input="validate">
        <br />
        <br />
        <p ref="warningEl" id="warning" class="hidden">
          Suitability Score must be a number
        </p>
        <br />
        <div class="overlay-content">
          <div class="box">
        <!-- <br> -->
        <select id="users" v-model="newTask.assigned">
                    <option v-for="u in users" :key="u.id" :value="u.id">
                      {{ u.first_name }}
                      {{ u.last_name }}
                      <!-- {{ u.image }} -->
                      <img :src="u.image" alt="" class="img-department">
                      👨
                    </option>
                  </select><br>
                  <img src="data:image/jpeg;base64,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" alt="12#">
      </div>
        </div>
        <!-- <br> -->
        <div class="demo-datetime-picker">
    <div class="line" />
    <div class="block">
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="YYYY-MM-DD HH:mm:ss"
        date-format="YYYY/MM/DD ddd"
        time-format="A hh:mm:ss"
      />
    </div>
  </div><br>
        <p>
          <b>Last Checked</b>
        </p>
        <br />
        <p ref="lastCheckedEl" id="last-checked">
          -
        </p>
        <br />
        <input ref="okayEl" id="okay" type="submit" value="Okay">
      </form>
    </div>
  </div>
</template>

<style>

:deep(.bjs-container) {
  height: 100%;
  width: 100%;
}
.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  
}
.demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
}
.line {
  /* width: 1px; */
  background-color: var(--el-border-color);
}
button {
  border-radius: 4px;
}

.w-full {
  background-color: rgb(120, 207, 112);
  color: black;
}

.btn {
  padding: 10px;
  display: flex;
  gap: 10px;
}
p,b,input,form,select{
  color: #000;
}
/* Quality Assurance Panel styles */
.panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.hidden {
  display: none;
}

#form input[type="text"] {
  padding: 5px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 3px;
}

#form input[type="submit"] {
  padding: 5px 15px;
  background-color: #337ab7;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

#form input[type="submit"]:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

#warning {
  color: red;
  font-size: 12px;
}

.overlay-content {
  background: white;
  padding: 8px;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.box {
  /* position: absolute; */
   top: 50%;
  left: 50%; 
  /* transform: translate(-50%, -50%); */
}

.box select {
  background-color: #0563af;
  color: white;
  padding: 10px;
  width: 250px;
  border: none;
  font-size: 20px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  -webkit-appearance: button;
  appearance: button;
  outline: none;
}

.box::before {
  content: "\f13a";
  font-family: FontAwesome;
  position: absolute;
   top: 0;
  right: 0; 
  width: 20%;
  height: 100%;
  text-align: center;
  font-size: 28px;
  line-height: 45px;
  color: rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.box:hover::before {
  color: rgba(255, 255, 255, 0.6);
  background-color: rgba(255, 255, 255, 0.2);
}

.box select option {
  /* padding: 30px; */
}
</style>