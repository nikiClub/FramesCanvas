//Author by liushitao

'use strict'

function FramesCanvas(canvas, opts, callback) {
    this.canvas = canvas;

    this.width = opts.width; //宽度
    this.height = opts.height; //高度
    this.frame = opts.frame //序列帧图片总张数
    this.fps = opts.fps || 24; //fps(帧数)
    this.loop = opts.loop;//是否循环 true false
    this.loopCount = opts.loopCount;  //循环次数
    this.singleMode = opts.singleMode || false; //单模
    this.extension = opts.extension || '.png'; //序列帧的拓展名称

    this.callback = callback; //序列帧执行完之后的回调函数

    this._currentFrame = 0;
    this.source = this.canvas.getAttribute('data-source'); //序列帧图片路径
    this._setInterval;
    this._onloadLength = 0;

    this._frames = []; //预加载图片存放数组

    // 暂停序列帧
    this.pause = function () {
        if (this._setInterval) {
            clearInterval(this._setInterval);
        }
    }
    // 播放序列帧
    this.play = function () {
        let _this = this;

        this.pause();

        //判断图片是否可以加载完
        if (_this._onloadLength < _this.frame) {
            this.checkLoad();
        } else {
            this._setInterval = setInterval(function () {
                if (_this._onloadLength === _this.frame) {
                    _this.draw();
                }
            }, 1000 / this.fps)
        }
    }
    //校验是否加载完毕
    this.checkLoad = function () {
        let _this2 = this;
        this._setInterval = setInterval(function () {
            if (_this2._onloadLength === _this2.frame) {
                clearInterval(_this2._setInterval);
                _this2.play();

            }
        }, 1000 / this.fps);
    }
    // 渲染canvas图层
    this.draw = function () {
        let f = this._frames[this._currentFrame]; //拿到当前帧图片

        this._ctx.clearRect(0, 0, this.width, this.height); //擦除画布
        this._ctx.drawImage(f, 0, 0, this.width, this.height); //渲染画布

        if (this._currentFrame === this.frame - 1) {
            this._currentFrame = 0;
            if (!this.loop) {
                this.pause();
                if (this.callback) {
                    this.callback();
                }
            }

        } else {
            this._currentFrame++;
        }
    }
    //初始化
    this.init = function () {
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this._ctx = this.canvas.getContext("2d");

        let self = this;
        for (let i = 0; i < self.frame; i++) {
            let _img = new Image();
            _img.src = self.source + i + self.extension;
            self._frames.push(_img);

            _img.onload = function () {
                self._onloadLength++;
            }
        }
    }

    this.init();
}