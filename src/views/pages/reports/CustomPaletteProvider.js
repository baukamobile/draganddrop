import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import '@/views/pages/reports/style/palette.css';
export default function CustomPaletteProvider(palette, create, elementFactory, handTool, lassoTool, spaceTool, globalConnect) {
    this._create = create;
    this._elementFactory = elementFactory;
    this.handTool = handTool;
    this.lassoTool = lassoTool;
    this.spaceTool = spaceTool;
    this.globalConnect = globalConnect;
  
    palette.registerProvider(this);
  }
  
  CustomPaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'handTool',
    'lassoTool',
    'spaceTool',
    'globalConnect'
  ];
  CustomPaletteProvider.prototype.getPaletteEntries = function(element) {
    const {
      _create,
      _elementFactory
    } = this;
  
    function createAction(type, group, className, title, options) {
      function createListener(event) {
        const shape = _elementFactory.createShape({ type, ...options });
        _create.start(event, shape);
      }
  
      return {
        group,
        className,
        title: title || type,
        action: {
          dragstart: createListener,
          click: createListener
        }
      };
    }
  
    return {
      'create.start-event': createAction(
        'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none white-green',
      ),
      'create.task': createAction(
        'bpmn:Task', 'activity', 'bpmn-icon-task green', 'Задача'
      ),
      'create.end-event': createAction(
        'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none red', 'Конец процесса',
      ),
      'create.parallel-gateway': createAction(
        'bpmn:ParallelGateway', 'gateway', 'bpmn-icon-gateway-parallel yellow', 'Параллельная задача'
      ),
      'create.exclusive-gateway': createAction(
        'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none orange', 'XOR задача'
      ),
  
      // Инструменты: их вручную добавляешь, потому что они не через factory
      'hand-tool': {
        group: 'tools',
        className: 'bpmn-icon-hand-tool dark-green',
        title: 'Ручной режим',
        action: {
          click: (event) => {
            this.handTool.activateHand(event);
          }
        }
      },
      
      'lasso-tool': {
        group: 'tools',
        className: 'bpmn-icon-lasso-tool blue',
        title: 'Выделение рамкой',
        action: {
          click: (event) => {
            this.lassoTool.activateSelection(event);
          }
        }
      },
  
      'space-tool': {
        group: 'tools',
        className: 'bpmn-icon-space-tool grey',
        title: 'Передвигать пространство',
        action: {
          click: (event) => {
            this.spaceTool.activateSelection(event);
          }
        }
      },
  
      'global-connect-tool': {
        group: 'tools',
        className: 'bpmn-icon-connection-multi white-green2',
        title: 'Связать элементы',
        action: {
          click: (event) => {
            this.globalConnect.toggle(event);
          }
        }
      }
    };
  };
  