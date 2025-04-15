<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import axios from 'axios';
import PageWrapper from '@/components/PageWrapper.vue';

const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
const bpmnContainer = ref(null);
const modeler = ref(null);
const route = useRoute();
const selectedProcessId = ref(Number(route.params.processId));

// Локальное состояние для процессов
const processes = ref([]);

// Загрузка процессов
const loadProcesses = async () => {
  try {
    const response = await axios.get(`${API_BPMNXML_PROCESS}`);
    processes.value = response.data;
    console.log('Processes loaded:', processes.value);
  } catch (err) {
    console.error('Ошибка загрузки процессов:', err);
    processes.value = [];
  }
};

// Фильтрация процессов с bpmn_xml
const filteredProcesses = computed(() => {
  if (!Array.isArray(processes.value)) {
    console.warn('Processes is not an array:', processes.value);
    return [];
  }
  return processes.value.filter(p => p.bpmn_xml && p.bpmn_xml.xml);
});

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

// Загрузка BPMN XML
const loadBpmnXml = async () => {
  if (!selectedProcessId.value || !selectedProcess.value.bpmn_xml) {
    console.warn('Процесс или bpmn_xml не найден:', {
      selectedProcessId: selectedProcessId.value,
      selectedProcess: selectedProcess.value,
    });
    return false;
  }

  try {
    const xml = selectedProcess.value.bpmn_xml.xml;
    await modeler.value.importXML(xml);
    console.log('BPMN загружен для процесса:', selectedProcessId.value);
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

onMounted(async () => {
  // Инициализация BPMN-моделера
  modeler.value = new BpmnModeler({
    container: bpmnContainer.value,
    keyboard: { bindTo: document },
  });

  // Загрузка процессов
  await loadProcesses();

  // Попытка загрузки BPMN XML
  const loaded = await loadBpmnXml();
  if (!loaded) {
    await loadInitialDiagram();
  }

  // Отладка
  console.log('Process ID:', selectedProcessId.value);
  console.log('Processes:', processes.value);
  console.log('Processes type:', Array.isArray(processes.value) ? 'Array' : typeof processes.value);
  console.log('Selected Process:', selectedProcess.value);
  console.log('Filtered Processes:', filteredProcesses.value);
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

    // Отправка на сервер
    const response = await axios.post(`${API_BPMNXML_PROCESS}`, {
      process_id: selectedProcessId.value,
      xml,
    });
    console.log('Диаграмма успешно сохранена на сервере');

    // Обновляем локальный processes
    const process = processes.value.find(p => p.id === selectedProcessId.value);
    if (process) {
      process.bpmn_xml.xml = xml;
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
      <h1>{{ selectedProcess.name || 'Процесс не выбран' }}</h1>
      <div ref="bpmnContainer" class="w-full h-[600px] border"></div>
      <div class="btn">
        <button @click="saveDiagram" class="mt-2 p-2 bg-blue-500 text-white self-start">
          Сохранить процесс
        </button>
        <br />
        <button @click="startProcess" class="mt-2 p-2 bg-green-500 text-white self-start">
          Запустить процесс
        </button>
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
.w-full {
  background-color: rgb(234, 234, 235);
}
.btn {
  padding: 10px;
}
</style>