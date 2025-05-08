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
import { getBpmTask } from '@/api/bpm_data';
import { computed } from 'vue';

const { newTask, users, formatDate } = useTaskManager();
const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
const API_BPM_TASK = import.meta.env.VITE_API_BPM_TASK;
const bpmnContainer = ref(null);
const modeler = ref(null);
const qualityAssuranceEl = ref(null);
const suitabilityScoreEl = ref(null);
const lastCheckedEl = ref(null);
const assignedTo = ref(null);
const status = ref(null);
const createdAt = ref(null);
const deadline = ref(null);
const updatedAt = ref(null);
const isComplete = ref(null);
const returnReason = ref(null);
const warningEl = ref(null);
const okayEl = ref(null);
const bpmstatuses = {
  1: { status_name: "Не начата"},
  2: { status_name: "В работе"},
  3: { status_name: "Заблокирована"},
  4: { status_name: "Выполнена"},
  5: { status_name: "Возвращена на доработку"},
}
// Хранилище для формы
const formData = reactive({
  suitabilityScore: '',
  assignedTo: '',
  status: 1,
  return_reason: '',
  created_at: null,
  deadline: null,
  updated_at: null,
  is_complete: false,
  bpmn_task_id: null,
});
const currentStatusName = computed(() => {
  return bpmstatuses[formData.status]?.status_name || 'Неизвестный статус'
})
// QA functionality
const HIGH_PRIORITY = 1500;
let analysisDetails = null;
let businessObject = null;
let currentElement = null;

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

// Load tasks from backend
const loadTasks = async () => {
  const tasks = await getBpmTask();
  console.log('Loaded tasks:', tasks);
  // Можно синхронизировать newBpmnTask с задачами, если нужно
};

// Set up BPMN modeler and event handlers
onMounted(() => {
  modeler.value = new BpmnModeler({
    container: bpmnContainer.value,
    keyboard: { bindTo: document },
    additionalModules: [
      {
        paletteProvider: ['value', null]
      },
      {
        __init__: ['customPaletteProvider'],
        customPaletteProvider: ['type', CustomPaletteProvider]
      }
    ],
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
    modeler.value.get('canvas').zoom('fit-viewport');
    loadTasks(); // Загружаем задачи при инициализации
  }).catch(err => {
    console.error('Error loading BPMN:', err);
  });

  // QA functionality - element context menu
  modeler.value.on('element.contextmenu', HIGH_PRIORITY, (event) => {
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();

    if (!qualityAssuranceEl.value) return;
    
    qualityAssuranceEl.value.classList.remove('hidden');

    currentElement = event.element;

    if (!currentElement.parent) {
      return;
    }

    businessObject = getBusinessObject(currentElement);

    let { suitable } = businessObject;

    formData.suitabilityScore = suitable ? suitable : '';
    suitabilityScoreEl.value.value = suitable ? suitable : '';
    suitabilityScoreEl.value.focus();

    analysisDetails = getExtensionElement(businessObject, 'qa:AnalysisDetails');

    // Загружаем значения атрибутов
    formData.assignedTo = analysisDetails ? analysisDetails.assignedTo : '';
    formData.status = analysisDetails ? analysisDetails.status : '';
    formData.return_reason = analysisDetails ? analysisDetails.return_reason : '';
    formData.created_at = analysisDetails ? analysisDetails.created_at : null;
    formData.deadline = analysisDetails ? analysisDetails.deadline : null;
    formData.updated_at = analysisDetails ? analysisDetails.updated_at : null;
    formData.is_complete = analysisDetails ? analysisDetails.is_complete : false;

    lastCheckedEl.value.textContent = analysisDetails ? analysisDetails.lastChecked : '-';
    updatedAt.value.textContent = analysisDetails ? analysisDetails.updated_at : '-';

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
const handleFormSubmit = async (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (!modeler.value || !businessObject || !currentElement) return;

  const suitabilityScore = Number(formData.suitabilityScore);

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

  // Сохраняем все атрибуты
  analysisDetails.lastChecked = new Date().toISOString();
  analysisDetails.assignedTo = formData.assignedTo;
  analysisDetails.status = formData.status;
  analysisDetails.return_reason = formData.return_reason;
  analysisDetails.created_at = formData.created_at ? new Date(formData.created_at).toISOString() : null;
  analysisDetails.deadline = formData.deadline ? new Date(formData.deadline).toISOString() : null;
  analysisDetails.updated_at = new Date().toISOString();
  analysisDetails.is_complete = formData.is_complete;

  modeling.updateProperties(currentElement, {
    extensionElements,
    suitable: suitabilityScore
  });

  // Синхронизируем с newBpmnTask
  newBpmnTask.bpmn_task_id = currentElement.id;
  newBpmnTask.assigned_to = formData.assignedTo;
  newBpmnTask.status = formData.status;
  newBpmnTask.return_reason = formData.return_reason;
  newBpmnTask.created_at = formData.created_at;
  newBpmnTask.deadline = formData.deadline;
  newBpmnTask.updated_at = analysisDetails.updated_at;
  newBpmnTask.is_complete = formData.is_complete;

  // Отправляем задачу на бэкенд
  try {
    await axios.post(API_BPM_TASK, newBpmnTask);
    console.log('Task saved to backend');
  } catch (err) {
    console.error('Error saving task:', err);
  }

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
    console.log('Diagram successfully saved to server:', response.data);
  } catch (err) {
    console.error('Error saving:', err);
  }
};

// Start process workflow
const startProcess = () => {
  console.log('Starting process...');
};

</script><template>
  <div class="flex flex-col h-full">
    <div ref="bpmnContainer" class="w-full h-[650px] border" style="display: flex; justify-content: center;"></div>
    
    <!-- Controls -->
    <div class="flex justify-between mt-2">
      <button @click="saveDiagram" class="p-2 bg-blue-500 text-white rounded">Save Process</button>
      <button @click="startProcess" class="p-2 bg-green-500 text-white rounded">Start Process</button>
    </div>
    
    <!-- Quality Assurance Panel -->
    <div ref="qualityAssuranceEl" id="quality-assurance" class="panel hidden fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 w-80">
      <form ref="formEl" id="form" @submit="handleFormSubmit" @keydown="handleFormKeydown" class="space-y-4">
        <div>
          <label class="block font-bold">Suitability Score</label>
          <input ref="suitabilityScoreEl" id="suitability-score" v-model="formData.suitabilityScore" type="text" placeholder="100" class="w-full p-2 border rounded" autocomplete="off" @input="validate">
          <p ref="warningEl" id="warning" class="hidden text-red-500 text-sm mt-1">Suitability Score must be a number</p>
        </div>

        <div>
          <label class="block font-bold">Assigned To</label>
          <select id="assigned-to" v-model="formData.assignedTo" class="w-full p-2 border rounded">
            <option v-for="u in users" :key="u.id" :value="u.id">
              {{ u.first_name }} {{ u.last_name }} ({{ u.position.position_name }})
            </option>
          </select>
        </div>

        <div>
  <label class="block font-bold">Status</label>
  <select id="status" v-model="formData.status" class="w-full p-2 border rounded">
    <option v-for="(status, id) in bpmstatuses" :key="id" :value="parseInt(id)">
      {{ status.status_name }}
    </option>
  </select>
</div>

        <div>
          <label class="block font-bold">Created At</label>
          <el-date-picker
            v-model="formData.created_at"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select creation date"
            class="w-full"
          />
        </div>

        <div>
          <label class="block font-bold">Deadline</label>
          <el-date-picker
            v-model="formData.deadline"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select deadline"
            class="w-full"
          />
        </div>

        <div>
          <label class="block font-bold">Updated At</label>
          <p ref="updatedAt" id="updated-at" class="text-gray-600">{{ formData.updated_at ? formatDate(formData.updated_at) : '-' }}</p>
        </div>

        <div>
          <label class="block font-bold">Is Complete</label>
          <input id="is-complete" type="checkbox" v-model="formData.is_complete" class="h-5 w-5">
        </div>

        <div>
          <label class="block font-bold">Return Reason</label>
          <input id="return-reason" type="text" v-model="formData.return_reason" placeholder="e.g. Needs revision" class="w-full p-2 border rounded" autocomplete="off">
        </div>

        <div>
          <label class="block font-bold">Last Checked</label>
          <p ref="lastCheckedEl" id="last-checked" class="text-gray-600">{{ formatDate(lastCheckedEl?.value?.textContent) }}</p>
        </div>

        <input ref="okayEl" id="okay" type="submit" value="Okay" class="w-full p-2 bg-blue-500 text-white rounded cursor-pointer">
      </form>
    </div>
  </div>
</template>
<style scoped>

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