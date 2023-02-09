import { defineComponent, isVue2, h } from 'vue-demi';

/* eslint-disable no-debugger, no-console */
var VueDrawingCanvas = /*#__PURE__*/defineComponent({
  name: 'VueDrawingCanvas',
  props: {
    strokeType: {
      type: String,
      validator: value => {
        // 1
        return ['dash', 'line', 'arrow', 'tapeline', 'angle', 'square', 'circle', 'triangle', 'half_triangle'].indexOf(value) !== -1;
      },
      default: () => 'dash'
    },
    fillShape: {
      type: Boolean,
      default: () => false
    },
    width: {
      type: [String, Number],
      default: () => 600
    },
    height: {
      type: [String, Number],
      default: () => 400
    },
    image: {
      type: String,
      default: () => ''
    },
    eraser: {
      type: Boolean,
      default: () => false
    },
    color: {
      type: String,
      default: () => '#000000'
    },
    lineWidth: {
      type: Number,
      default: () => 5
    },
    lineCap: {
      type: String,
      validator: value => {
        return ['round', 'square', 'butt'].indexOf(value) !== -1;
      },
      default: () => 'round'
    },
    lineJoin: {
      type: String,
      validator: value => {
        return ['miter', 'round', 'bevel'].indexOf(value) !== -1;
      },
      default: () => 'miter'
    },
    lock: {
      type: Boolean,
      default: () => false
    },
    styles: {
      type: [Array, String, Object]
    },
    classes: {
      type: [Array, String, Object]
    },
    backgroundColor: {
      type: String,
      default: () => '#FFFFFF'
    },
    backgroundImage: {
      type: String,
      default: () => null
    },
    saveAs: {
      type: String,
      validator: value => {
        return ['jpeg', 'png'].indexOf(value) !== -1;
      },
      default: () => 'png'
    },
    canvasId: {
      type: String,
      default: () => 'VueDrawingCanvas'
    },
    outputWidth: {
      type: Number
    },
    outputHeight: {
      type: Number
    }
  },

  data() {
    return {
      loadedImage: null,
      drawing: false,
      context: null,
      images: [],
      strokes: {
        type: '',
        from: {
          x: 0,
          y: 0
        },
        coordinates: [],
        color: '',
        width: '',
        fill: false,
        lineCap: '',
        lineJoin: ''
      },
      guides: [],
      trash: []
    };
  },

  mounted() {
    this.setContext();
  },

  watch: {
    backgroundImage: function () {
      this.loadedImage = null;
    }
  },

  methods: {
    async setContext() {
      let canvas = document.querySelector('#' + this.canvasId);
      this.context = this.context ? this.context : canvas.getContext('2d');
      await this.setBackground();
    },

    clear() {
      this.context.clearRect(0, 0, Number(this.width), Number(this.height));
    },

    async setBackground() {
      this.clear();
      this.context.fillStyle = this.backgroundColor;
      // this.context.fillRect(0, 0, Number(this.width), Number(this.height));
      await this.$nextTick(async () => {
        await this.drawBackgroundImage();
      });
      this.save();
    },

    async drawBackgroundImage() {
      if (!this.loadedImage) {
        return new Promise(resolve => {
          if (!this.backgroundImage) {
            resolve();
            return;
          }
          const image = new Image();
          image.src = this.backgroundImage;
          image.onload = () => {
            this.context.save();
            console.log('call by drawBackgoundIamge')
            const pixelspacing = 0.100000001;
            const dHeight = (image.height * pixelspacing) / 25.4 * 96;
            const dWidth = (image.width * pixelspacing) / 25.4 * 96;

            this.context.translate(dWidth / -2.0, dHeight / -2.0);
            this.context.drawImage(image, 0, 0, image.width, image.height, 0, 0, dWidth, dHeight);
            this.context.translate(dWidth / 2.0, dHeight / 2.0);

            // this.context.drawImage(image, 0, 0, Number(this.width), Number(this.height));
            this.context.restore();
            this.loadedImage = image;
            resolve();
          };
        });
      } else {
        console.log('call by drawBackgoundIamge2');
        this.context.save();
        const cvs = document.getElementById('canvas');
        const canvasHeight = cvs.clientHeight;
        const canvasWidth = cvs.clientWidth;

        const pixelspacing = 0.100000001;
        const dHeight = (this.loadedImage.height * pixelspacing) / 25.4 * 96;
        const dWidth = (this.loadedImage.width * pixelspacing) / 25.4 * 96;

        const reSizeScale = Math.min(canvasHeight / dHeight, canvasWidth / dWidth);
        this.context.scale(reSizeScale, reSizeScale);
        this.context.translate(canvasWidth / reSizeScale / 2.0, canvasHeight / reSizeScale / 2.0);
        this.context.translate(dWidth / -2.0, dHeight / -2.0);
        this.context.drawImage(this.loadedImage, 0, 0, this.loadedImage.width, this.loadedImage.height, 0, 0, dWidth, dHeight);
        this.context.translate(dWidth / 2.0, dHeight / 2.0);
        this.context.restore();

        // this.context.drawImage(this.loadedImage, 0, 0, Number(this.width), Number(this.height));
      }
    },

    getCoordinates(event) {
      let x, y;

      const cvs = document.getElementById('canvas');
      const canvasHeight = cvs.clientHeight;
      const canvasWidth = cvs.clientWidth;
      const pixelspacing = 0.100000001;
      const dHeight = (this.loadedImage.height * pixelspacing) / 25.4 * 96;
      const dWidth = (this.loadedImage.width * pixelspacing) / 25.4 * 96;

      const reSizeScale = Math.min(canvasHeight / dHeight, canvasWidth / dWidth);
      if (event.touches && event.touches.length > 0) {
        let canvas = document.querySelector('#' + this.canvasId);
        let rect = canvas.getBoundingClientRect();
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
      } else {
        x = event.offsetX;
        y = event.offsetY;
      }
      return {
        x: (x - (canvasWidth / 2.0)) / reSizeScale,
        y: (y - (canvasHeight / 2.0)) / reSizeScale
      };
    },

    startDraw(event) {
      if (!this.lock) {
        this.drawing = true;
        let coordinate = this.getCoordinates(event);
        this.strokes = {
          type: this.eraser ? 'eraser' : this.strokeType,
          from: coordinate,
          coordinates: [],
          color: this.eraser ? this.backgroundColor : this.color,
          width: this.lineWidth,
          // 2
          fill: this.eraser ||
                this.strokeType === 'dash' ||
                this.strokeType === 'line' ||
                this.strokeType === 'tapeline' ||
                this.strokeType === 'angle' ||
                this.strokeType === 'arrow'
                    ? false : this.fillShape,
          lineCap: this.lineCap,
          lineJoin: this.lineJoin
        };
        this.guides = [];
      }
    },

    draw(event) {
      if (this.drawing) {
        if (!this.context) {
          this.setContext();
        }

        let coordinate = this.getCoordinates(event);

        if (this.eraser ||
            this.strokeType === 'dash' ||
            this.strokeType === 'tapeline' ||
            this.strokeType === 'angle') {
          this.strokes.coordinates.push(coordinate);
          console.log('call by draw');
          this.drawShape(this.context, this.strokes, false);
        } else {
          switch (this.strokeType) {
            case 'line':
              this.guides = [{
                x: coordinate.x,
                y: coordinate.y
              }];
              break;

            // 3
            case 'arrow':
              this.guides = [{
                x: coordinate.x,
                y: coordinate.y
              }];
              break;

            case 'square':
              this.guides = [{
                x: coordinate.x,
                y: this.strokes.from.y
              }, {
                x: coordinate.x,
                y: coordinate.y
              }, {
                x: this.strokes.from.x,
                y: coordinate.y
              }, {
                x: this.strokes.from.x,
                y: this.strokes.from.y
              }];
              break;

            case 'triangle':
              let center = Math.floor((coordinate.x - this.strokes.from.x) / 2) < 0 ? Math.floor((coordinate.x - this.strokes.from.x) / 2) * -1 : Math.floor((coordinate.x - this.strokes.from.x) / 2);
              let width = this.strokes.from.x < coordinate.x ? this.strokes.from.x + center : this.strokes.from.x - center;
              this.guides = [{
                x: coordinate.x,
                y: this.strokes.from.y
              }, {
                x: width,
                y: coordinate.y
              }, {
                x: this.strokes.from.x,
                y: this.strokes.from.y
              }];
              break;

            case 'half_triangle':
              this.guides = [{
                x: coordinate.x,
                y: this.strokes.from.y
              }, {
                x: this.strokes.from.x,
                y: coordinate.y
              }, {
                x: this.strokes.from.x,
                y: this.strokes.from.y
              }];
              break;

            case 'circle':
              /*let radiusX = (this.strokes.from.x - coordinate.x < 0 ?
                  (this.strokes.from.x - coordinate.x) * -1 : this.strokes.from.x - coordinate.x);
              this.guides = [{
                x: this.strokes.from.x > coordinate.x ? this.strokes.from.x - radiusX : this.strokes.from.x + radiusX,
                y: this.strokes.from.y
              }, {
                x: radiusX,
                y: radiusX
              }];*/
              let radiusX = (this.strokes.from.x - coordinate.x) / -2;
              let radiusY = (this.strokes.from.y - coordinate.y) / -2;
              this.guides = [{
                x: this.strokes.from.x + radiusX,
                y: this.strokes.from.y + radiusY
              }, {
                x: Math.abs(radiusX),
                y: Math.abs(radiusY)
              }];

              break;
          }
        }
      }
    },

    drawShape(context, strokes, closingPath) {
      context.strokeStyle = strokes.color;
      context.fillStyle = strokes.color;
      context.lineWidth = strokes.width;
      context.lineJoin = strokes.lineJoin === undefined ? this.lineJoin : strokes.lineJoin;
      context.lineCap = strokes.lineCap === undefined ? this.lineCap : strokes.lineCap;
      context.beginPath();
      context.setLineDash([]);

      if (strokes.type === 'circle') {
        context.ellipse(strokes.coordinates[0].x, strokes.coordinates[0].y, strokes.coordinates[1].x, strokes.coordinates[1].y, 0, 0, Math.PI * 2);
      } else if (strokes.type === 'angle'){
        context.moveTo(strokes.from.x, strokes.from.y);
        context.lineTo(strokes.coordinates[0].x, strokes.coordinates[0].y);
        context.moveTo(strokes.from.x, strokes.from.y);
        context.lineTo(strokes.coordinates[1].x, strokes.coordinates[1].y);
        if (closingPath) {
          context.closePath();
        }
      } else {
        context.save();
        const cvs = document.getElementById('canvas');
        const canvasHeight = cvs.clientHeight;
        const canvasWidth = cvs.clientWidth;

        const pixelspacing = 0.100000001;
        const dHeight = (this.loadedImage.height * pixelspacing) / 25.4 * 96;
        const dWidth = (this.loadedImage.width * pixelspacing) / 25.4 * 96;
        const reSizeScale = Math.min(canvasHeight / dHeight, canvasWidth / dWidth);
        context.scale(reSizeScale, reSizeScale);
        context.translate(canvasWidth / reSizeScale / 2.0, canvasHeight / reSizeScale / 2.0);
        context.moveTo(strokes.from.x, strokes.from.y);
        strokes.coordinates.forEach(stroke => {
          context.lineTo(stroke.x, stroke.y);

          /*if (strokes.type === 'arrow') {
            // 11.22. Arrow Mark
            var aWidth = 5;
            var aLength = 12;
            var dx = strokes.from.x - stroke.x;
            var dy = strokes.from.y - stroke.y;
            var angle = Math.atan2(dy, dx);
            var length = Math.sqrt(dx * dx + dy * dy);
            context.translate(stroke.x, stroke.y);
            context.rotate(angle);
            context.fillStyle = strokes.color;
            context.moveTo(length - aLength, -aWidth);
            context.lineTo(length, 0);
            context.lineTo(length - aLength, aWidth);
            context.fill();
            context.setTransform(1, 0, 0, 1, 0, 0);
            // Arrow Mark ENd
          }
          */
        });

        if (closingPath) {
          context.closePath();
        }
        context.restore();
      }

      if (strokes.fill) {
        context.fill();
      } else {
        context.stroke();
      }
    },

    stopDraw() {
      if (this.drawing) {
        console.log('call by stopDraw')
        this.strokes.coordinates = this.guides.length > 0 ? this.guides : this.strokes.coordinates;
        this.images.push(this.strokes);
        this.redraw(true);
        this.drawing = false;
        this.trash = [];
      }
    },

    reset() {
      if (!this.lock) {
        this.images = [];
        this.strokes = {
          type: '',
          coordinates: [],
          color: '',
          width: '',
          fill: false,
          lineCap: '',
          lineJoin: ''
        };
        this.guides = [];
        this.trash = [];
        this.redraw(true);
      }
    },

    undo() {
      if (!this.lock) {
        let strokes = this.images.pop();

        if (strokes) {
          this.trash.push(strokes);
          this.redraw(true);
        }
      }
    },

    redo() {
      if (!this.lock) {
        let strokes = this.trash.pop();

        if (strokes) {
          this.images.push(strokes);
          this.redraw(true);
        }
      }
    },

    async redraw(output) {
      output = typeof output !== 'undefined' ? output : true;
      await this.setBackground().then(() => {
        let baseCanvas = document.createElement('canvas');
        let baseCanvasContext = baseCanvas.getContext('2d');
        baseCanvas.width = Number(this.width);
        baseCanvas.height = Number(this.height);

        if (baseCanvasContext) {
          this.images.forEach(stroke => {
            baseCanvasContext.globalCompositeOperation = stroke.type === 'eraser' ? 'destination-out' : 'source-over';
            if (stroke.type !== 'circle' || stroke.type === 'circle' && stroke.coordinates.length > 0) {
                // 4
                this.drawShape(baseCanvasContext, stroke, stroke.type === 'eraser' ||
                                                                    stroke.type === 'dash' ||
                                                                    stroke.type === 'line' ||
                                                                    stroke.type === 'tapeline' ||
                                                                    stroke.type === 'angle' ||
                                                                    stroke.type === 'arrow' ? false : true);
              }
          });
          this.context.drawImage(baseCanvas, 0, 0, Number(this.width), Number(this.height));
        }
      }).then(() => {
        if (output) {
          this.save();
        }
      });
    },

    save() {
      /*let canvas = document.querySelector('#' + this.canvasId);
      let tempImage = document.createElement('canvas');
      let tempCtx = tempImage.getContext('2d');
      let tempWidth = this.outputWidth === undefined ? this.width : this.outputWidth;
      let tempHeight = this.outputHeight === undefined ? this.height : this.outputHeight;
      tempImage.width = Number(tempWidth);
      tempImage.height = Number(tempHeight);

      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0, Number(tempWidth), Number(tempHeight));
        this.$emit('update:image', tempImage.toDataURL('image/' + this.saveAs, 1));
        return tempImage.toDataURL('image/' + this.saveAs, 1);
      }*/
      console.log('call by save')
    },

    isEmpty() {
      return this.images.length > 0 ? false : true;
    },

    getAllStrokes() {
      return this.images;
    }

  },

  render() {
    if (isVue2) {
      return h('canvas', {
        attrs: {
          id: this.canvasId,
          width: Number(this.width),
          height: Number(this.height)
        },
        style: {
          'touchAction': 'none',
          // @ts-ignore
          ...this.styles
        },
        class: this.classes,
        on: {
          mousedown: event => this.startDraw(event),
          mousemove: event => this.draw(event),
          mouseup: () => this.stopDraw(),
          mouseleave: () => this.stopDraw(),
          touchstart: event => this.startDraw(event),
          touchmove: event => this.draw(event),
          touchend: () => this.stopDraw(),
          touchleave: () => this.stopDraw(),
          touchcancel: () => this.stopDraw(),
          pointerdown: event => this.startDraw(event),
          pointermove: event => this.draw(event),
          pointerup: () => this.stopDraw(),
          pointerleave: () => this.stopDraw(),
          pointercancel: () => this.stopDraw()
        },
        ...this.$propsS
      });
    }

    return h('canvas', {
      id: this.canvasId,
      height: Number(this.height),
      width: Number(this.width),
      style: {
        'touchAction': 'none',
        // @ts-ignore
        ...this.styles
      },
      class: this.classes,
      onMousedown: $event => this.startDraw($event),
      onMousemove: $event => this.draw($event),
      onMouseup: () => this.stopDraw(),
      onMouseleave: () => this.stopDraw(),
      onTouchstart: $event => this.startDraw($event),
      onTouchmove: $event => this.draw($event),
      onTouchend: () => this.stopDraw(),
      onTouchleave: () => this.stopDraw(),
      onTouchcancel: () => this.stopDraw(),
      onPointerdown: $event => this.startDraw($event),
      onPointermove: $event => this.draw($event),
      onPointerup: () => this.stopDraw(),
      onPointerleave: () => this.stopDraw(),
      onPointercancel: () => this.stopDraw()
    });
  }

});

export { VueDrawingCanvas as default };
