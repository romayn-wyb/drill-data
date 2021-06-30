var isFirefox = navigator.userAgent.indexOf("irefox") > -1 ? true : false;
var isIE = navigator.userAgent.toUpperCase().indexOf("MSIE") ? true : false;
var isChrome = navigator.userAgent.toUpperCase().indexOf("HROME") > -1 ? true : false;
//数据展示层
var Subway = function (element, options) {
    this.element = $(element);
    this.options = $.extend(true, {}, this.options, options);
    this.init();
}
Subway.prototype = {
    options: {
        id: "img_subway",
        image: null,
        color: "#fff",
        ranges: null,
    },
    init: function () {
        var me = this,
            el = me.element,
            opts = me.options;
        var _time = null;
        me._render();

        if (opts.ranges) {
            me.loadRanges(opts.ranges)
        };

        el.on("click", "path", function (e) {

            var data = me.getDataById(this.id);

            clearTimeout(_time);
            _time = setTimeout(function () {


                if (opts.itemclick) opts.itemclick.call(me, data);
            }, 300);
        }).on("dblclick", "path", function (e) {

            var data = me.getDataById(this.id);

            clearTimeout(_time);

            if (opts.itemDblClick) { opts.itemDblClick.call(me, data); }
        })
    },
    changeImage: function (url) {
        var me = this;
        me.svgImg.setAttribute("href", url);

    },
    showMsg: function (id) {
        layer.msg("此路标标识id为:" + id);
    },
    loadRanges: function (ranges) {

        var me = this,
            _d = [],
            svgId = me.options.id;

        if (ranges == null || ranges.length == 0) return;

        if (ranges) {
            $("svg path").remove();
            me.options.ranges = ranges;
        }


        for (var i = 0; i < ranges.length; i++) {

            var rang = ranges[i];

            if (!rang.color) {
                var color = me.options.color;
            }
            else {
                var color = rang.color;
            }

            var target = $(".svg-pan-zoom_viewport").length > 0 ? $(".svg-pan-zoom_viewport") : $("#" + svgId + "");


            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill", rang.color);
            path.setAttribute("fill-opacity", "0.6");
            path.setAttribute("stroke-width", 1);
            path.setAttribute("stroke", rang.color);
            path.setAttribute("stroke-opacity", "0.6");
            path.setAttribute("id", rang.id);
            path.setAttribute("d", rang.d);
            path.setAttribute("title", rang.NodeName);
            target.append(path);


            if (rang.AreaType == "rect") {
                _d = rang.d.split(" ");


                if (rang.GradientType == "top") {

                    _d[2] = _d[5] = parseFloat(_d[11]) - (parseFloat(_d[11]) - parseFloat(_d[2])) * rang.percent / 100;
                }
                else if (rang.GradientType == "right") {
                    _d[4] = _d[7] = parseFloat(_d[1]) + (parseFloat(_d[4]) - parseFloat(_d[1])) * rang.percent / 100;
                }
                else if (rang.GradientType == "bottom") {

                    _d[8] = _d[11] = parseFloat(_d[2]) + (parseFloat(_d[11]) - parseFloat(_d[2])) * rang.percent / 100;
                }
                else if (rang.GradientType == "left") {
                    _d[1] = _d[10] = parseFloat(_d[4]) - (parseFloat(_d[4]) - parseFloat(_d[1])) * rang.percent / 100;
                }
                else continue;

                var pct_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                pct_path.setAttribute("fill", "blue");
                pct_path.setAttribute("fill-opacity", "1");

                pct_path.setAttribute("id", rang.id);
                pct_path.setAttribute("d", _d.join(" "));
                pct_path.setAttribute("title", rang.NodeName);

                target.append(pct_path);
            }

        }



        // $("path").tooltip({
        //     target: me.element
        // })

    },
    _render: function () {
        var me = this,
            image = me.options.image,
            svgId = me.options.id;

        var svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgEl.setAttribute("id", svgId);
        svgEl.setAttribute("width", "100%");
        svgEl.setAttribute("height", "100%");

        if (!image) image = "";

        var width = me.element.parents('.mini-fit').width();
        var height = me.element.parents('.mini-fit').width()
        me.svgImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        me.svgImg.setAttribute("class", "svgImg");
        me.svgImg.setAttribute("href", image);
        me.svgImg.setAttribute("width", "1600");
        me.svgImg.setAttribute("height", "900");
        svgEl.appendChild(me.svgImg);
        me.element.append(svgEl);



    },
    getDataById: function (id) {
        var me = this,
            ranges = me.options.ranges;
        if (!ranges || ranges.length == 0) return true;
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            if (range.id == id) {
                return range;
            }
        }

    },

}


//设计层
var design = function (element, options) {
    this.element = $(element);
    this.options = $.extend(true, {}, this.options, options);
    this.init();
}
design.prototype = {
    options: {
        open: false,
        drawType: "polygon"


    },
    init: function () {
        var me = this,
            opts = me.options,
            el = me.element;
        var _time = null;
        me.refresh();
        el.find("path").on("click", function (e) {

            var data = me.getDataById(this.id);

            clearTimeout(_time);
            _time = setTimeout(function () {
                if (opts.itemclick) opts.itemclick.call(me, data);
            }, 300);
        }).on("dblclick", function (e) {

            var data = me.getDataById(this.id);

            clearTimeout(_time);

            if (opts.itemDblClick) { opts.itemDblClick.call(me, data); }
        })
    },
    refresh: function () {
        var me = this,
            opts = me.options,
            el = me.element;






        var open = this.options.open;

        if (open) {
            el.find("path").off("click");
            me._drawStart();
        }
        else {
            //保存选区后 不再选区
            el.find("svg").off("click");

            me.element.off("click")
        }
    },
    //开始绘制入口
    startDraw: function (drawType) {

        var me = this;

        if (me.options.open) {
            Power.ui.warning("正在绘制中..");
            return;
        }
        me.options.open = true;

        if (drawType && (drawType == "polygon" || drawType == "rect")) {
            me.options.drawType = drawType;
        }

        me.refresh();
    },
    //重置绘制(触发取消绘制)
    resetDraw: function () {
        var me = this;

        me.cancelDraw();
        return
        layer.confirm('确定重置此条设计么？', {
            btn: ['确定', '取消']
        }, function (index) {
            if (me.path) {

                me.cancelDraw();

                //me.path.setAttribute("d", me.d.join(" "));
            }
            else {
                layer.msg("没有开启绘制", { time: 900 })
            }
            layer.close(index);
        });
    },
    //取消绘制
    cancelDraw: function () {
        var me = this;

        $(".path-circle").remove();
        me.d = [];
        me.path.remove();
        delete me["path"];
        me.options.open = false;
        me.refresh();

    },
    //删除区域(丢弃)
    deletePath: function (id) {
        var me = this;

        ranges = subway.options.ranges;
        //根据id删除dom和数据

        subway.element.find("path#" + id).remove();
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            if (range.id == id) {
                ranges.splice(i, 1);
                //subway.options.ranges = ranges;
                break;
            }

        }
    },
    //清除数据(丢弃)
    deleteAllPath: function () {
        var me = this;
        layer.confirm('确定要删除所有设计么？', {
            btn: ['确定', '取消']
        }, function (index) {
            subway.element.find("path").remove();
            subway.options.ranges = [];
            layer.close(index);
        });

    },
    //切换图片
    changeImage: function (image) {
        var me = this;
        layer.confirm('确定要切换设计图么？', {
            btn: ['确定', '取消']
        }, function (index) {
            subway.svgImg.setAttribute("href", image);
            layer.close(index);
        });

    },
    //结束绘制
    endDraw: function (s) {
        var me = this,
            ranges = subway.options.ranges;
        var _d;
        var repeat;
        
        if (!me.d && !me.path) {
            layer.msg("没有开启绘制", { time: 900 });
            return;
        }
        if (me.d.length < 1) {
            $(".path-circle").empty();

            return;
        }
        else {

            me.d.push("z");

            var _d = me.d.join(" ");
            if (me.options.saveDesign) me.options.saveDesign.call(me, _d, me.options.drawType, me.path);

            me.path.setAttribute("fill-opacity", "0.5");
            me.path.setAttribute("stroke-opacity", "1");
            me.path.setAttribute("d", me.d.join(" "));
            ranges.push({ "d": me.d.join(" ") });
            $(".path-circle").remove();
            me.d = [];
            delete me["path"];
            me.options.open = false;
            me.refresh();

        }
    },
    //(丢弃)
    showPoup: function (id) {
        var me = this,
            ranges = subway.options.ranges;
        var thisPath = subway.element.find("path#" + id)
        var repeat;

        layer.prompt({
            btn: ['保存', '取消', "删除"],
            value: id,
            title: "信息",
            btn3: function (index) {
                me.deletePath(id);
            }
        }, function (val, index) {
            if (val == id) { layer.close(index); return; };
            //验证重复
            var repeat = me._validate(val);

            if (repeat) {
                for (var i = 0; i < ranges.length; i++) {
                    var range = ranges[i];
                    if (range.id == id) {
                        thisPath.attr("id", val);
                        range.id = val;
                        layer.close(index);
                    }
                }
            }
        });

    },
    //根据id获取data (丢弃)
    getDataById: function (id) {
        var me = this,
            ranges = subway.options.ranges;
        if (!ranges || ranges.length == 0) return true;
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            if (range.id == id) {
                return range;
            }
        }

    },
    //新建区块绑定id查重 (丢弃)
    _validate: function (val) {
        var index = 0;

        var me = this,
            ranges = subway.options.ranges;
        if (!ranges || ranges.length == 0) return true;

        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            //绑定一个唯一符号
            if (range.id == val) {
                layer.msg('此id已定义', { time: 800 });
                return false;
            }
        }
        return true;

    },
    //开始绘制dom
    _drawStart: function () {
        var index = 0;
        var me = this,
            drawType = me.options.drawType,
            el = me.element;

        var startX, StartY;

        me.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        me.path.setAttribute("class", "drawing ");

        me.path.setAttribute("fill", "#f06eaa");
        me.path.setAttribute("fill-opacity", "0.2");
        me.path.setAttribute("stroke-width", 1);
        me.path.setAttribute("stroke", "#f06eaa");
        me.path.setAttribute("stroke-opacity", "0.8");



        $("svg .svg-pan-zoom_viewport").append(me.path);

        me.d = [];

        var svg = el.find("svg");

        svg.on("click", function (e) {
            //如何在拖拽窗体时阻止
            //event.stopPropagation();

            var panView = PanZoom.getSizes();

            if (isChrome) {
                x = (e.offsetX - PanZoom.getPan().x) / panView.realZoom;
                y = (e.offsetY - PanZoom.getPan().y) / panView.realZoom;

            }
            else if (isFirefox) {
                x = e.offsetX;
                y = e.offsetY;
            }
            else {
                x = e.offsetX / panView.realZoom;
                y = e.offsetY / panView.realZoom;
            }

            circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

            circle.setAttribute("class", "path-circle");
            circle.setAttribute("fill", "white");
            circle.setAttribute("stroke", "black");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", 2);
            circle.setAttribute("width", 1);

            $("svg .svg-pan-zoom_viewport").append(circle);

            if (drawType == "polygon") {

                if (index == 0) {
                    me.d.push("M");
                    me.d.push(x);
                    me.d.push(y);
                }
                else {
                    me.d.push("L");
                    me.d.push(x);
                    me.d.push(y);
                }
                index++;
                if (me.path) {
                    me.path.setAttribute("d", me.d.join(" "));
                }
            }
            else if (drawType == "rect") {

                if (index == 0) {
                    me.d.push("M");
                    me.d.push(x);
                    me.d.push(y);
                    startX = x;
                    startY = y;
                }


                else if (index == 1) {
                    me.d.push("L");
                    me.d.push(x);
                    me.d.push(startY);

                    me.d.push("L");
                    me.d.push(x);
                    me.d.push(y);

                    me.d.push("L");
                    me.d.push(startX);
                    me.d.push(y);

                }
                else if (index == 2) {
                    index--;
                    //取消前的处理
                    me.d.splice(3, 9);
                    var circleNum = $("svg .svg-pan-zoom_viewport").find("circle").length;
                    $("svg .svg-pan-zoom_viewport").find("circle")[circleNum - 2].remove();

                    me.d.push("L");
                    me.d.push(x);
                    me.d.push(startY);

                    me.d.push("L");
                    me.d.push(x);
                    me.d.push(y);

                    me.d.push("L");
                    me.d.push(startX);
                    me.d.push(y);

                }
                index++;
                if (me.path) {
                    me.path.setAttribute("d", me.d.join(" "));
                }
            }






        })
    }
}