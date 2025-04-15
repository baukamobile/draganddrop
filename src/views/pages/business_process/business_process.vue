<script setup>
import { ref, onMounted } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import axios from 'axios';
import PageWrapper from '@/components/PageWrapper.vue';

const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
const bpmnContainer = ref(null);
const modeler = ref(null);

onMounted(async () => {
  modeler.value = new BpmnModeler({
    container: bpmnContainer.value,
    keyboard: { bindTo: document },
  });

  // Загрузка последнего XML из базы
  try {
    const response = await axios.get(`${API_BPMNXML_PROCESS}10/`); // Эндпоинт для последнего XML
    const xml = response.data.xml;

    await modeler.value.importXML(xml);
    console.log('BPMN загружен из базы!');
    modeler.value.get('canvas').zoom('fit-viewport');
  } catch (err) {
    console.error('Ошибка загрузки XML:', err);

    // Фаллбэк на пустую диаграмму, если ошибка
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
  }
});

const saveDiagram = async () => {
  try {
    const { xml } = await modeler.value.saveXML({ format: true });
    console.log('Сохранённый XML:', xml);

    // Отправка на сервер
    const response = await axios.post(`${API_BPMNXML_PROCESS}`, { xml });
    console.log('Диаграмма успешно сохранена на сервере');
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
