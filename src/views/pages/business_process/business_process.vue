<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import axios from 'axios';
import PageWrapper from '@/components/PageWrapper.vue';
import CustomPaletteProvider from '../reports/CustomPaletteProvider';
import { useTaskManager } from '@/components/dashboard/useTaskManger';
import qaModdleExtension from '@/views/pages/reports/qa';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
const{
  newTask, users
}= useTaskManager();
const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS; 
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
const value2 = ref('')
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
    console.log('Saved XML:', xml); // Check if <bpmn:documentation> is present

    // Verify XML contains comments
    if (!xml.includes('<bpmn:documentation>')) {
      console.warn('No comments found in XML. Ensure comments are set in the modeler.');
    }

    // Find the current process
    const process = processes.value.find(p => p.id === selectedProcessId.value);
    if (!process) {
      throw new Error('Process not found');
    }

    // API endpoint for updating/creating the process
    const API_PROCESS = 'http://127.0.0.1:8000/bpm/process/';
    if (process.bpmn_xml) {
      // Update existing process with new XML
      const response = await axios.patch(`${API_PROCESS}${process.id}/update-xml/`, {
        bpmn_xml: process.bpmn_xml, // Send the existing bpmn_xml ID
        xml, // Send only the XML string
      });
      console.log('Diagram updated on server:', response.data);
    } else {
      // Create new process with XML
      const response = await axios.post(`${API_PROCESS}`, {
        process_id: selectedProcessId.value,
        xml,
      });
      console.log('Diagram created on server:', response.data);

      // Update local processes with new bpmn_xml ID
      process.bpmn_xml = response.data.bpmn_xml; // Adjust based on backend response
    }
  } catch (err) {
    console.error('Error saving diagram:', err);
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
      <div ref="bpmnContainer" class="w-full h-[750px]  border"></div>
      <div class="btn">
        <button @click="saveDiagram" class="mt-2 p-2 bg-blue-500 text-white self-start">
          Сохранить процесс
        </button>
        <br />
        <button @click="startProcess" class="mt-2 p-2 bg-green-500 text-white self-start">
          Запустить процесс
        </button>
      </div>
      <div ref="qualityAssuranceEl" id="quality-assurance" class="panel hidden">
      <form ref="formEl" id="form" @submit="handleFormSubmit" @keydown="handleFormKeydown">
        <p>
          
        </p>
        <br />
        <input ref="suitabilityScoreEl" id="suitability-score" type="text" placeholder="100" autocomplete="off" @input="validate">
        <br />
        <br />
        <p ref="warningEl" id="warning" class="hidden">
          только цифры
        </p>
        <br />
        <div class="overlay-content">
          <div class="box">
        <!-- <br> -->
        <select id="users" v-model="newTask.assigned">
                    <option v-for="u in users" :key="u.id" :value="u.id">
                      {{ u.first_name }}
                      👨
                      {{ u.last_name }}
                      {{ u.position.position_name }}
                      {{ u.department.department_name }}

                    </option>
                  </select></br>
                  <br>
                  <input type="file">Прикрепите файл
                </br>
                  <img src="" alt="">
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
  </PageWrapper>
</template>

<style scoped>
:deep(.bjs-container) {
  height: 100%;
  width: 100%;
}
button {
  border-radius: 4px;
}
.bpmn-icon-start-event {
  color: red !important;
}

.bpmn-icon-end-event {
  color: yellow !important;
}

.w-full {
  background-color: rgb(120, 207, 112);
  color: black;
}
.btn {
  padding: 10px;
  display: flex;
  justify-content: space-between;
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
  width: 270px;
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
p,b,input,form,select{
  color: #000;
}
/* Общие стили для контейнера формы */
#quality-assurance {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
}

/* Панель скрытия */
.hidden {
  display: none;
}

/* Стили для полей ввода */
#suitability-score {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

#suitability-score:focus {
  border-color: #007BFF;
  outline: none;
}

#warning {
  color: #ff0000;
  font-size: 14px;
  display: none; /* скрыто по умолчанию */
}

/* Стили для кнопок и submit */
#okay {
  background-color: #007BFF;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#okay:hover {
  background-color: #0056b3;
}

/* Стили для выпадающего списка пользователей */
select#users {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

select#users:focus {
  border-color: #007BFF;
  outline: none;
}

/* Стили для выбора даты */
.demo-datetime-picker {
  margin-top: 20px;
}

.el-date-picker {
  width: 100%;
}

.overlay-content {
  margin-top: 20px;
}

/* Стили для файлового поля */
input[type="file"] {
  margin-top: 10px;
  font-size: 14px;
  padding: 5px;
}

input[type="file"]::file-selector-button {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

input[type="file"]::file-selector-button:hover {
  background-color: #0056b3;
}

/* Стиль для изображения */
img {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
}

/* Стиль для текста "Last Checked" */
#last-checked {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
}

</style>