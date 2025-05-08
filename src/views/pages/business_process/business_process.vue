<script setup>
import { ref, onMounted, computed, watch,reactive } from 'vue';
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
const{
  newTask, users,formatDate
}= useTaskManager();

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




const assignedTo = ref(null);
const status = ref(null);
const createdAt = ref(null);
const deadline = ref(null);
const updatedAt = ref(null);
const isComplete = ref(null);
const returnReason = ref(null);
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

// Загрузка BPMN XML по ID диаграммы
const loadBpmnXml = async () => {
  if (!selectedProcessId.value) {
    console.warn('Process ID не указан:', selectedProcessId.value);
    return false;
  }

  try {
    // Получаем процесс
    const processResponse = await axios.get(`${API_BPM_PROCESS}${selectedProcessId.value}/`);
    const process = processResponse.data;
    if (!process.bpmn_xml) {
      throw new Error('bpmn_xml ID не найден');
    }

    // Получаем XML по ID диаграммы
    const diagramResponse = await axios.get(`${API_BPMNXML_PROCESS}${process.bpmn_xml}/`);
    const xml = diagramResponse.data.xml;
    if (!xml) {
      throw new Error('bpmn_xml.xml не найден');
    }

    await modeler.value.importXML(xml);
    console.log('BPMN загружен для процесса:', selectedProcessId.value);

    // Обновляем processes
    const existingProcess = processes.value.find(p => p.id === selectedProcessId.value);
    if (existingProcess) {
      existingProcess.bpmn_xml = process.bpmn_xml; // Сохраняем ID
    } else {
      processes.value.push(process);
    }

    modeler.value.get('canvas').zoom('fit-viewport');
    return true;
  } catch (err) {
    console.error('Ошибка загрузки XML:', err);
    return false;
  }
};

// Фаллбэк на пустую диаграмму
const loadInitialDiagram = async () => {
  const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                      xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                      id="Definitions_1"
                      targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn:process id="Process_1" isExecutable="true">
      </bpmn:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>`;

  await modeler.value.importXML(initialDiagram);
  console.log('Загружена пустая диаграмма');
  modeler.value.get('canvas').zoom('fit-viewport');
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

onMounted(async () => {
  // Проверка доступности контейнера
  if (!bpmnContainer.value) {
    console.error('bpmnContainer не найден!');
    return;
  }

  // Инициализация BPMN-моделера
  modeler.value = new BpmnModeler({
    container: bpmnContainer.value,
    keyboard: { bindTo: document },
    additionalModules: [
      {
        // Убираем дефолтный провайдер палитры
        paletteProvider: ['value', null]
      },
      {
        // Подключаем свой провайдер палитры
        __init__: ['customPaletteProvider'],
        customPaletteProvider: ['type', CustomPaletteProvider]
      }
    ],
    // Добавляем QA модульное расширение
    moddleExtensions: {
      qa: qaModdleExtension
    }
  });

  // Загрузка процессов
  await loadProcesses();

  // Загрузка BPMN XML для выбранного процесса
  const loaded = await loadBpmnXml();
  if (!loaded) {
    await loadInitialDiagram();
  }

  // QA функциональность - контекстное меню элементов
  modeler.value.on('element.contextmenu', HIGH_PRIORITY, (event) => {
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();

    // Игнорировать, если QA элементы недоступны
    if (!qualityAssuranceEl.value) return;
    
    qualityAssuranceEl.value.classList.remove('hidden');

    currentElement = event.element;

    // Игнорировать корневой элемент
    if (!currentElement.parent) {
      return;
    }

    // Используем getBusinessObject для получения бизнес-объекта
    businessObject = getBusinessObject(currentElement);

    let { suitable } = businessObject;

    suitabilityScoreEl.value.value = suitable ? suitable : '';
    suitabilityScoreEl.value.focus();

    analysisDetails = getExtensionElement(businessObject, 'qa:AnalysisDetails');
    lastCheckedEl.value.textContent = analysisDetails ? analysisDetails.lastChecked : '-';

    validate();
  });

  // Закрытие панели QA при клике вне панели
  window.addEventListener('click', (event) => {
    if (!qualityAssuranceEl.value) return;
    
    const { target } = event;

    if (target === qualityAssuranceEl.value || qualityAssuranceEl.value.contains(target)) {
      return;
    }

    qualityAssuranceEl.value.classList.add('hidden');
  });
  
  // Add dropdown overlay - если это нужно
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
      
      // Add event listener for dropdown
      const dropdown = document.querySelector('.dropdown');
      if (dropdown) {
        dropdown.addEventListener('change', (event) => {
          console.log('Selected view:', event.target.value);
          // Add your view change logic here
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

const saveDiagram = async () => {
  try {
    const { xml } = await modeler.value.saveXML({ format: true });
    console.log('Сохранённый XML:', xml);

    // Находим текущий процесс
    const process = processes.value.find(p => p.id === selectedProcessId.value);
    if (!process) {
      throw new Error('Процесс не найден');
    }
    
    // Если у процесса уже есть bpmn_xml, обновляем существующую запись
    if (process.bpmn_xml) {
      const response = await axios.put(`${API_BPM_PROCESS}${process.id}/update-xml/`, {
        bpmn_xml: process.bpmn_xml, // это ID bpmn_xml
        xml: xml, // сам XML как строка
      });
      console.log('Диаграмма обновлена на сервере:', response.data);
    } else {
      // Если bpmn_xml отсутствует, создаём новую запись
      const response = await axios.post(`${API_BPMNXML_PROCESS}`, {
        process_id: selectedProcessId.value,
        xml,
      });
      console.log('Диаграмма создана на сервере:', response.data);

      // Обновляем локальный processes с новым bpmn_xml ID
      process.bpmn_xml = response.data.id;
    }
  } catch (err) {
    console.error('Ошибка сохранения:', err);
  }
};

const startProcess = () => {
  console.log('Запуск процесса...');
  // Логика для запуска процесса
};
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
            <select id="assigned-to" v-model="formData.assignedTo" class="w-full p-2 border rounded">
              <option v-for="u in users" :key="u.id" :value="u.id">{{ u.first_name }} {{ u.last_name }} ({{ u.position.position_name }})</option>
            </select>
          </div>

          <div>
            <label class="block font-bold">Status</label>
            <select id="status" v-model="formData.status" class="w-full p-2 border rounded">
              <option v-for="(status, id) in bpmstatuses" :key="id" :value="parseInt(id)">{{ status.status_name }}</option>
            </select>
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


