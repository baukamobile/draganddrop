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
  newTask, users
}= useTaskManager();
const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
const bpmnContainer = ref(null);
const modeler = ref(null);
const qualityAssuranceEl = ref(null);
const suitabilityScoreEl = ref(null);
const lastCheckedEl = ref(null);
const warningEl = ref(null);
const okayEl = ref(null);
const formEl = ref(null);
const value2 = ref('')
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
      html: `<div class="">
        </div>`
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
    <div ref="bpmnContainer" class="w-full h-[650px] w-[950px] border" style="display: flex; justify-content: center;"></div>
    
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
                      {{ u.position.position_name }}
                      👨
                    </option>
                  </select><br>
                  <img src="" alt="12#">
      </div>
        </div>
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