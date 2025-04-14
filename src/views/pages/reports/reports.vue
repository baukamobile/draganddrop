<script setup>
import { onMounted, ref } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

const bpmnContainer = ref(null);

onMounted(() => {
  const modeler = new BpmnModeler({
    container: bpmnContainer.value,
    keyboard: { bindTo: document },
  });

  const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                      xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                      id="Definitions_1"
                      targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn:process id="Process_1" isExecutable="true">
        <bpmn:startEvent id="StartEvent_1">
          <bpmn:outgoing>Flow_1</bpmn:outgoing>
        </bpmn:startEvent>
        <bpmn:task id="Task_1" name="Выполнить задачу">
          <bpmn:incoming>Flow_1</bpmn:incoming>
          <bpmn:outgoing>Flow_2</bpmn:outgoing>
        </bpmn:task>
        <bpmn:parallelGateway id="ParallelGateway_1">
          <bpmn:incoming>Flow_2</bpmn:incoming>
          <bpmn:outgoing>Flow_3</bpmn:outgoing>
        </bpmn:parallelGateway>
        <bpmn:endEvent id="EndEvent_1">
          <bpmn:incoming>Flow_3</bpmn:incoming>
        </bpmn:endEvent>
        <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
        <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="ParallelGateway_1"/>
        <bpmn:sequenceFlow id="Flow_3" sourceRef="ParallelGateway_1" targetRef="EndEvent_1"/>
      </bpmn:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
          <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
            <dc:Bounds x="800" y="100" width="36" height="36"/>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
            <dc:Bounds x="900" y="80" width="100" height="80"/>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="ParallelGateway_1_di" bpmnElement="ParallelGateway_1">
            <dc:Bounds x="1050" y="100" width="50" height="50"/>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
            <dc:Bounds x="1150" y="100" width="36" height="36"/>
          </bpmndi:BPMNShape>

          <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
            <dc:waypoint x="836" y="118"/>
            <dc:waypoint x="900" y="118"/>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
            <dc:waypoint x="1000" y="118"/>
            <dc:waypoint x="1050" y="118"/>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
            <dc:waypoint x="1100" y="118"/>
            <dc:waypoint x="1150" y="118"/>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNShape id="ParallelGateway_1_di" bpmnElement="ParallelGateway_1">
  <dc:Bounds x="950" y="50" width="50" height="50"/>
</bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>`;

  modeler.importXML(initialDiagram).then(() => {
    console.log('BPMN загружен!');
    modeler.get('canvas').zoom('fit-viewport');
  }).catch(err => {
    console.error('Ошибка загрузки BPMN:', err);
  });

  // const saveDiagram = async () => {
  //   try {
  //     const { xml } = await modeler.saveXML({ format: true });
  //     console.log('Сохранённый XML:', xml);
  //     // Для backend: await fetch('/api/processes/', { method: 'POST', body: JSON.stringify({ xml }) });
  //   } catch (err) {
  //     console.error('Ошибка сохранения:', err);
  //   }
  // };
  const saveDiagram = async () => {
  try {
    const { xml } = await modeler.saveXML({ format: true });
    console.log('Сохранённый XML:', xml);

    // Отправка на сервер
    const response = await fetch('127.0.0.1:8000/bpm/xml-processes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ xml }),
    });

    if (!response.ok) {
      throw new Error('Ошибка отправки на сервер');
    }

    console.log('Диаграмма успешно сохранена на сервере');
  } catch (err) {
    console.error('Ошибка сохранения:', err);
  }
};

  return { saveDiagram };
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div ref="bpmnContainer" class="w-full h-[700px] border" />
    <button @click="saveDiagram" class="mt-2 p-2 bg-blue-500 text-white self-start">
      Сохранить процесс
    </button>
  </div>
</template>

<style scoped>
/* Фикс для редактора */
:deep(.bjs-container) {
  height: 100%;
  width: 100%;
}

/* Стили для кнопки */
button {
  border-radius: 4px;
}

/* Контейнер */
.w-full {
  background-color: rgb(234, 234, 235);
}

/* Убираем кривые стили */
:deep(.djs-hit) {
  /* Ничего не делаем, color не работает для SVG */
}
</style>