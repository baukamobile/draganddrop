<script setup>
import { onMounted, ref,reactive } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import CustomPaletteProvider from '@/views/pages/reports/CustomPaletteProvider';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useTaskManager } from '@/components/dashboard/useTaskManger';
// import flatpickr from 'flatpickr'; // Импортируем календарь
const{
  newTask,formatDate
}= useTaskManager();
const route = useRoute();
const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
const bpmnContainer = ref(null);
const modeler = ref(null);
const selectedProcessId = ref(Number(route.params.processId));
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
        const response = await axios.get(`${API_URL_USERS}/`);
        owners.value = response.data;
    } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
    }
};
onMounted(() => {
  modeler.value = new BpmnModeler({
  container: bpmnContainer.value,
  keyboard: { bindTo: document },
  additionalModules: [
    {
      // ТУТ МЫ УБИВАЕМ ДЕФОЛТНЫЙ ПРОВАЙДЕР
      paletteProvider: ['value', null]
    },
    {
      // ТУТ ПОДКЛЮЧАЕМ СВОЙ
      __init__: ['customPaletteProvider'],
      customPaletteProvider: ['type', CustomPaletteProvider]
    }
  ]
});

const initialDiagram =` <?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.23.0">
  <bpmn:process id="Process_1" isExecutable="true" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
;


  modeler.value.importXML(initialDiagram).then(() => {
    console.log('BPMN loaded!');

    // Добавляем выпадающий список как overlay
    const overlays = modeler.value.get('overlays');
    overlays.add('Process_038d7qw', 'note', {
      position: {
        top: -30,
        right: 10,
      },
      html: `
        <select class="dropdown" style="padding: 50px; border-radius: 14px; background-color: aqua; border: 10px solid #ccc;">
          <option value="">Select View</option>
          <option value="view1">user 1</option>
          <option value="view2">user 2</option>
          <option value="view3">user 3</option>
        </select>
        <div id="" class="">Нажмите <b>правую кнопку мыши</b> чтобы редактировать свойство.</div>
                  `
      ,
    });

    // Обработчик изменения выпадающего списка
    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
      dropdown.addEventListener('change', (event) => {
        console.log('Selected view:', event.target.value);
        // Здесь можно добавить свою логику обработки выбора
      });
    }

    // Добавляем календарь
    const taskElement = modeler.value.get('elementRegistry').get('Activity_05y6hjc'); // Например, для первой задачи
    const taskShape = modeler.value.get('canvas').getGraphics(taskElement);
    const calendarContainer = document.createElement('div');
    flatpickr(calendarContainer, {
      dateFormat: 'Y-m-d',
      onChange: (selectedDates, dateStr, instance) => {
        console.log('Selected date:', dateStr);
        taskElement.businessObject.dueDate = dateStr; // Пример использования выбранной даты
      }
    });

    taskShape.appendChild(calendarContainer);

    modeler.value.get('canvas').zoom('fit-viewport');
  }).catch(err => {
    console.error('Error loading BPMN:', err);
  });
});

const saveDiagram = async () => {
  try {
    const { xml } = await modeler.value.saveXML({ format: true });
    console.log('Saved XML:', xml);

    const response = await axios.post(`${API_BPMNXML_PROCESS}, { xml }`);
    console.log('Diagram successfully saved to server');
  } catch (err) {
    console.error('Error saving:', err);
  }
};

const startProcess = () => {
  console.log('Starting process...');
};
</script>

<template>
  <div class="flex flex-col h-full">
    <div ref="bpmnContainer" class="w-full h-[600px] border"></div>
    <div class="btn">
      <button @click="saveDiagram" class="mt-2 p-2 bg-blue-500 text-white self-start">
        Сохранить Процесс
      </button>
      <button @click="startProcess" class="mt-2 p-2 bg-green-500 text-white self-start">
        Запустить Процесс
      </button>
    </div>
  </div>
</template>

<style>
:deep(.bjs-container) {
  height: 100%;
  width: 100%;
}

button {
  border-radius: 4px;
}
.w-full {
  background-color: rgb(234, 234, 235);
  color: black;
}
.btn {
  padding: 10px;
  display: flex;
  gap: 10px;
}
</style>


