<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import './style/style.css';
import axios from 'axios';
import PageWrapper from '@/components/PageWrapper.vue';
import CustomPaletteProvider from '../reports/CustomPaletteProvider';
import { useTaskManager } from '@/components/dashboard/useTaskManger';
import qaModdleExtension from '@/views/pages/reports/qa';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getBpmTask } from '@/api/bpm_data';
import { getUsers } from '@/api/users';
const { newTask, users, formatDate, newBpmnTask } = useTaskManager();
const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
const API_BPM_TASK = import.meta.env.VITE_API_BPM_TASK;
const API_BPM_PROCESS = import.meta.env.VITE_API_PROCESS;
const bpmnContainer = ref(null);
const modeler = ref(null);
const route = useRoute();
const selectedProcessId = ref(Number(route.params.processId));
const qualityAssuranceEl = ref(null);
const suitabilityScoreEl = ref(null);
const lastCheckedEl = ref(null);
const warningEl = ref(null);
const okayEl = ref(null);
const formEl = ref(null);

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

// Статусы
const bpmstatuses = {
  1: { status_name: "Не начата" },
  2: { status_name: "В работе" },
  3: { status_name: "Заблокирована" },
  4: { status_name: "Выполнена" },
  5: { status_name: "Возвращена на доработку" },
};

const currentStatusName = computed(() => {
  return bpmstatuses[formData.status]?.status_name || 'Неизвестный статус';
});

// QA functionality
const HIGH_PRIORITY = 1500;
let analysisDetails = null;
let businessObject = null;
let currentElement = null;
let suitabilityScore = null;

// Локальное состояние для процессов
const processes = ref([]);

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

// Загрузка процессов
const loadProcesses = async () => {
  try {
    const response = await axios.get(`${API_BPM_PROCESS}`);
    processes.value = Array.isArray(response.data) ? response.data : [];
    console.log('Processes loaded:', processes.value);
  } catch (err) {
    console.error('Ошибка загрузки процессов:', err);
    processes.value = [];
  }
};

// Загрузка задач
const loadTasks = async () => {
  const tasks = await getBpmTask();
  console.log('Loaded tasks:', tasks);

  if (!modeler.value) return;

  const elementRegistry = modeler.value.get('elementRegistry');
  
  tasks.forEach(task => {
    const element = elementRegistry.get(task.bpmn_task_id);
    if (element) {
      const businessObject = getBusinessObject(element);
      const extensionElements = businessObject.extensionElements || modeler.value.get('moddle').create('bpmn:ExtensionElements');
      
      let analysisDetails = getExtensionElement(businessObject, 'qa:AnalysisDetails');
      if (!analysisDetails) {
        analysisDetails = modeler.value.get('moddle').create('qa:AnalysisDetails');
        extensionElements.get('values').push(analysisDetails);
      }

      analysisDetails.assignedTo = task.assigned_to;
      analysisDetails.status = task.status.toString();
      analysisDetails.return_reason = task.return_reason;
      analysisDetails.created_at = task.created_at;
      analysisDetails.deadline = task.deadline;
      analysisDetails.updated_at = task.updated_at;
      analysisDetails.is_complete = task.is_complete;

      modeler.value.get('modeling').updateProperties(element, { extensionElements });
    }
  });
};

// Загрузка начальной диаграммы
const loadInitialDiagram = async () => {
  const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.23.0">
  <bpmn:process id="Process_1" isExecutable="true" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
  try {
    await modeler.value.importXML(initialDiagram);
    console.log('Initial diagram loaded');
    modeler.value.get('canvas').zoom('fit-viewport');
  } catch (err) {
    console.error('Error loading initial diagram:', err);
  }
};

// Загрузка BPMN XML по ID диаграммы
const loadBpmnXml = async () => {
  if (!selectedProcessId.value) {
    console.warn('Process ID не указан:', selectedProcessId.value);
    return false;
  }

  try {
    const processResponse = await axios.get(`${API_BPM_PROCESS}${selectedProcessId.value}/`);
    const process = processResponse.data;
    if (!process.bpmn_xml) {
      throw new Error('bpmn_xml ID не найден');
    }

    const diagramResponse = await axios.get(`${API_BPMNXML_PROCESS}${process.bpmn_xml}/`);
    const xml = diagramResponse.data.xml;
    if (!xml) {
      throw new Error('bpmn_xml.xml не найден');
    }

    await modeler.value.importXML(xml);
    console.log('BPMN загружен для процесса:', selectedProcessId.value);

    const existingProcess = processes.value.find(p => p.id === selectedProcessId.value);
    if (existingProcess) {
      existingProcess.bpmn_xml = process.bpmn_xml;
    } else {
      processes.value.push(process);
    }

    modeler.value.get('canvas').zoom('fit-viewport');
    await loadTasks(); // Загружаем задачи после загрузки диаграммы
    return true;
  } catch (err) {
    console.error('Ошибка загрузки XML:', err);
    return false;
  }
};

// Выбранный процесс
const selectedProcess = computed(() => {
  if (!Array.isArray(processes.value)) {
    console.warn('Processes is not an array:', processes.value);
    return {};
  }
  const process = processes.value.find(p => p.id === selectedProcessId.value);
  console.log('Selected Process:', process);
  return process || {};
});

// Form submit handler for QA panel
const handleFormSubmit = async (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (!modeler.value || !businessObject || !currentElement) {
    console.error('You forgot the modeler, businessObject, or currentElement, genius!');
    return;
  }

  const suitabilityScore = Number(formData.suitabilityScore);
  if (isNaN(suitabilityScore)) {
    console.error('Suitability Score ain’t a number, you clown!');
    return;
  }

  const moddle = modeler.value.get('moddle');
  const modeling = modeler.value.get('modeling');
  let extensionElements = businessObject.extensionElements || moddle.create('bpmn:ExtensionElements');

  if (!analysisDetails) {
    analysisDetails = moddle.create('qa:AnalysisDetails');
    if (!extensionElements.get('values')) {
      extensionElements.values = [];
    }
    extensionElements.get('values').push(analysisDetails);
  }

  // Set all QA properties in analysisDetails
  analysisDetails.suitabilityScoreEl = suitabilityScore; // Per qa.js schema
  analysisDetails.assignedTo = formData.assignedTo || '';
  analysisDetails.status = formData.status.toString();
  analysisDetails.lastChecked = new Date().toISOString();
  analysisDetails.return_reason = formData.return_reason || '';
  analysisDetails.created_at = formData.created_at ? new Date(formData.created_at).toISOString() : null;
  analysisDetails.deadline = formData.deadline ? new Date(formData.deadline).toISOString() : null;
  analysisDetails.updated_at = new Date().toISOString();
  analysisDetails.is_complete = formData.is_complete || false;

  // Update businessObject with extensionElements and suitabilityScore
  modeling.updateProperties(currentElement, {
    extensionElements,
    suitable: suitabilityScore, // Keep this for backward compatibility
  });

  // Sync with newBpmnTask for backend
  newBpmnTask.bpmn_task_id = currentElement.id;
  newBpmnTask.assigned_to = formData.assignedTo;
  newBpmnTask.status = formData.status;
  newBpmnTask.return_reason = formData.return_reason;
  newBpmnTask.created_at = formData.created_at ? new Date(formData.created_at).toISOString() : '';
  newBpmnTask.deadline = formData.deadline ? new Date(formData.deadline).toISOString() : '';
  newBpmnTask.updated_at = analysisDetails.updated_at;
  newBpmnTask.is_complete = formData.is_complete;
  newBpmnTask.process = selectedProcessId.value.toString();

  // Save to backend
  try {
    await axios.put(API_BPM_TASK, newBpmnTask);
    console.log('Task saved to backend, you barely pulled it off!');
  } catch (err) {
    console.error('Backend save failed, nice job breaking it:', err);
  }

  // Save the diagram to ensure XML is updated
  await saveDiagram();

  qualityAssuranceEl.value.classList.add('hidden');
};

// Handle key events in the QA form
const handleFormKeydown = (event) => {
  if (event.key === 'Escape') {
    qualityAssuranceEl.value.classList.add('hidden');
  }
};

// QA функциональность - контекстное меню элементов
const setupContextMenu = () => {
  if (!modeler.value) return;
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

    formData.suitabilityScore = analysisDetails?.suitabilityScoreEl || suitable || '';
    formData.assignedTo = analysisDetails?.assignedTo || '';
    formData.status = analysisDetails ? parseInt(analysisDetails.status) || 1 : 1;
    formData.return_reason = analysisDetails?.return_reason || '';
    formData.created_at = analysisDetails?.created_at || null;
    formData.deadline = analysisDetails?.deadline || null;
    formData.updated_at = analysisDetails?.updated_at || null;
    formData.is_complete = analysisDetails?.is_complete || false;
    formData.bpmn_task_id = currentElement.id;

    lastCheckedEl.value.textContent = analysisDetails?.lastChecked || '-';
    validate();
  });
};

// Закрытие панели QA при клике вне панели
const setupClickOutside = () => {
  window.addEventListener('click', (event) => {
    if (!qualityAssuranceEl.value) return;
    
    const { target } = event;

    if (target === qualityAssuranceEl.value || qualityAssuranceEl.value.contains(target)) {
      return;
    }

    qualityAssuranceEl.value.classList.add('hidden');
  });
};

// Сохранение диаграммы
const saveDiagram = async () => {
  try {
    const { xml } = await modeler.value.saveXML({ format: true });
    console.log('Saved XML:', xml);

    // Verify qa:AnalysisDetails in XML
    if (xml.includes('qa:AnalysisDetails')) {
      console.log('QA properties found in XML, you didn’t totally screw it up!');
    } else {
      console.warn('No qa:AnalysisDetails in XML, did you even set the properties?');
    }

    const process = processes.value.find(p => p.id === selectedProcessId.value);
    if (!process) {
      throw new Error('Process not found, you lost it already?');
    }

    if (process.bpmn_xml) {
      const response = await axios.put(`${API_BPM_PROCESS}${process.id}/update-xml/`, {
        bpmn_xml: process.bpmn_xml,
        xml,
      });
      console.log('Diagram updated on server:', response.data);
    } else {
      const response = await axios.put(`${API_BPMNXML_PROCESS}`, {
        process_id: selectedProcessId.value,
        xml,
      });
      console.log('Diagram created on server:', response.data);
      process.bpmn_xml = response.data.id;
    }
  } catch (err) {
    console.error('Failed to save diagram, you’re killing me:', err);
  }
};

// Запуск процесса
const startProcess = () => {
  console.log('Запуск процесса...');
};

// Инициализация
onMounted(async () => {
  if (!bpmnContainer.value) {
    console.error('bpmnContainer не найден!');
    return;
  }

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

  await loadProcesses();
  await getUsers();
  const loaded = await loadBpmnXml();
  if (!loaded) {
    await loadInitialDiagram();
  }

  setupContextMenu();
  setupClickOutside();

  setTimeout(() => {
    if (modeler.value) {
      const overlays = modeler.value.get('overlays');
      overlays.add('Process_1', 'note', {
        position: {
          top: -30,
          right: 10,
        },
        html: `<div class=""></div>`
      });
      
      const dropdown = document.querySelector('.dropdown');
      if (dropdown) {
        dropdown.addEventListener('change', (event) => {
          console.log('Selected view:', event.target.value);
        });
      }
      
      modeler.value.get('canvas').zoom('fit-viewport');
    }
  }, 100);
});

// Следим за изменением selectedProcessId
watch(selectedProcessId, async (newId) => {
  console.log('Selected Process ID changed:', newId);
  const loaded = await loadBpmnXml();
  if (!loaded) {
    await loadInitialDiagram();
  }
});

// Обновляем selectedProcessId при изменении маршрута
watch(() => route.params.processId, (newId) => {
  selectedProcessId.value = Number(newId);
});
</script>


<template>
  <PageWrapper>
    <div class="flex flex-col h-full">
      <div style="display: flex; justify-content: center;">
      
      <h1 style="font-size: 20px; font-weight: bold;">{{ selectedProcess.name || 'Процесс не выбран' }}</h1>
    </div> 
      <div ref="bpmnContainer" class="w-full h-[650px] border flex justify-center"></div>
      
      <!-- Controls -->
      <div class="flex justify-between mt-2">
        <button @click="saveDiagram" class="p-2 bg-blue-500 text-white rounded">Save Process</button>
        <button @click="startProcess" class="p-2 bg-green-500 text-white rounded">Start Process</button>
      </div>
      
      <!-- Quality Assurance Panel -->
      <div ref="qualityAssuranceEl" id="quality-assurance" class="panel hidden fixed top-20 right-2 bg-white shadow-lg rounded-lg p-4 w-50">
        <form ref="formEl" id="form" @submit="handleFormSubmit" @keydown="handleFormKeydown" class="space-y-1">
          <div>
            <label class="block font-bold">Suitability Score</label>
            <input ref="suitabilityScoreEl" id="suitability-score" v-model="formData.suitabilityScore" type="text" placeholder="100" class="w-full p-2 border rounded" autocomplete="off" @input="validate">
            <p ref="warningEl" id="warning" class="hidden text-red-500 text-sm mt-1">Suitability Score must be a number</p>
          </div>

          <div>
            <label class="block font-bold">Assigned To</label>
            <select id="assigned-to" v-model="formData.assignedTo" class="w-full p-1 border rounded">
              <option v-for="u in users" :key="u.id" :value="u.id">{{ u.first_name }} {{ u.last_name }} ({{ u.position.position_name }})</option>
            </select>
          </div>

          <div>
            <label class="block font-bold">Status</label>
            <!-- <select id="status" v-model="formData.status" class="w-full p-2 border rounded">
              <option v-for="(status, id) in bpmstatuses" :key="id" :value="parseInt(id)">{{ status.status_name }}</option>
            </select> -->
            {{ formData.status.status_name }}
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold">Created At</label>
              <el-date-picker v-model="formData.created_at" type="datetime" format="YYYY-MM-DD HH:mm:ss" placeholder="Select date" class="w-full" />
            </div>
            <div>
              <label class="block font-bold">Deadline</label>
              <el-date-picker v-model="formData.deadline" type="datetime" format="YYYY-MM-DD HH:mm:ss" placeholder="Select date" class="w-full" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold">Updated At</label>
              <p ref="updatedAt" id="updated-at" class="text-gray-600">{{ formData.updated_at ? formatDate(formData.updated_at) : '-' }}</p>
            </div>
            <div>
              <label class="block font-bold">Last Checked</label>
              <p ref="lastCheckedEl" id="last-checked" class="text-gray-600">{{ formatDate(lastCheckedEl?.value?.textContent) }}</p>
            </div>
          </div>

          <div class="flex items-center mb-2">
            <input id="is-complete" type="checkbox" v-model="formData.is_complete" class="h-5 w-5 mr-2">
            <label class="font-bold">Is Complete</label>
          </div>

          <div>
            <label class="block font-bold">Return Reason</label>
            <textarea id="return-reason" v-model="formData.return_reason" placeholder="e.g. Needs revision" class="w-full p-2 border rounded" autocomplete="off" rows="2"></textarea>
          </div>

          <input ref="okayEl" id="okay" type="submit" value="Okay" class="w-full p-2 bg-blue-500 text-white rounded cursor-pointer mt-2">
        </form>
      </div>
    </div>
  </PageWrapper>
</template>


