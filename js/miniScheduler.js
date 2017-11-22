var drag, drop, allowDrop;

$.fn.extend({
    miniSheduler: function(parameters) {
        
        var rangeDateVisible,modeView,ajaxUrl;
        var customData = [];
        var defaultConfig = {
            mode: "week",
            info: {
                monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"]
            },
            draggable: false
        }

        const $miniSheduler = $(this).addClass("miniSheduler");
        const $mnsToolbar = $(`<div class="mns-toolbar">
                                    <div class="mns-left">
                                        <button type="button" class="mns-btn btnToday">Hoy</button>
                                        <div class="mns-btn-group">
                                            <button type="button" class="mns-btn btnAfterWeek"><i class="mns-arrow-left"></i></button>
                                            <button type="button" class="mns-btn btnBeforeWeek"><i class="mns-arrow-right"></i></button>
                                        </div>
                                    </div>
                                    <div class="mns-center"></div>
                                    <div class="mns-right">
                                        <div class="mns-btn-group">
                                            <button type="button" class="mns-btn btnChangeView btnWeekViewMode active">Semana</button>
                                            <button type="button" class="mns-btn btnChangeView btnMonthViewMode">Mes</button>
                                        </div>
                                    </div>
                                </div>`).appendTo($miniSheduler);

        const $mnsContainer = $(`<div class="mns-container">
                                    <div class="mns-container-view mns-timelineWeek mns-timeline">
                                        <table class="table table-bordered">
                                        <colgroup>
                                            <col>
                                            <col>
                                            <col>
                                        </colgroup>
                                        <thead class="mns-head">
                                        <tr>
                                            <th class="mns-resource-area">
                                                <i class="fa fa-user" aria-hidden="true"></i> Tecnico
                                            </th>
                                            <th class="mns-divider mns-col-resizer"></th>
                                            <th class="mns-time-area">
                                                <table class="table table-bordered">
                                                    <thead>
                                                    <tr>
                                                        <th class="mns-year">
                                                            <div class="mns-year-content"></div>
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                </table>
                                                <div class="mns-scroller">
                                                    <div class="mns-scroller-inner">
                                                        <div class="mns-content">
                                                            <table class="table table-bordered">
                                                                <colgroup></colgroup>
                                                                <thead><tr></tr></thead>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody class="mns-body">
                                        <tr>
                                            <td class="mns-resource-area">
                                                <div class="mns-scroller">
                                                    <div class="mns-scroller-inner">
                                                        <div class="mns-content">
                                                            <div class="mns-rows">
                                                                <table class="table table-bordered">
                                                                    <tbody></tbody>
                                                                </table>
                                                            </div>
                                                            <div class="mns-pie"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="mns-divider mns-col-resizer"></td>
                                            <td class="mns-time-area">
                                                <div class="mns-scroller">
                                                    <div class="mns-scroller-inner">
                                                        <div class="mns-content">
                                                            <div class="mns-rows">
                                                                <table class="table table-bordered">
                                                                    <colgroup></colgroup>
                                                                    <tbody></tbody>
                                                                </table>
                                                            </div>
                                                            <div class="mns-pie"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                        </table>
                                    </div>
                                </div>`).appendTo($miniSheduler);

        const $mnsHead = $mnsContainer.find(".mns-head");
        const $mnsHeadMnsTimeArea = $mnsHead.find(".mns-time-area");
    
        const $mnsBody = $mnsContainer.find(".mns-body");
        const $mnsBodyMnsResourceArea = $mnsBody.find(".mns-resource-area");
        const $mnsBodyMnsTimeArea = $mnsBody.find(".mns-time-area");

        const $mnstooltip = $(`<div class='mns-tooltip'>
                                    <div class="mns-tooltip-arrow"></div>
                                    <div class="mns-tooltip-body"></div>
                            </div>`).appendTo($miniSheduler);
        const $mnstooltipbody = $mnstooltip.find(".mns-tooltip-body")
        const $mnstooltiparrow = $mnstooltip.find(".mns-tooltip-arrow")

        const $mnsloadview = $(`<div class='mns-loadview'>Cargando...</div>`).appendTo($miniSheduler);

        $mnsBodyMnsTimeArea.find(".mns-scroller").on("scroll", function () {
            $mnsHeadMnsTimeArea.find(".mns-scroller").scrollLeft($(this).scrollLeft());
        });
        
        $mnsToolbar.find(".btnToday").on("click", function () {
            $mnsloadview.toggleClass("active");
            changeView();
            ajaxRequest()
            loadData();
            $mnsloadview.toggleClass("active");
        });
    
        $mnsToolbar.find(".btnBeforeWeek").on("click", function () {
            $mnsloadview.toggleClass("active");
            const d = rangeDateVisible[0];
            if(modeView === "month"){
                d.setMonth(d.getMonth() + 1);
            }else{
                d.setDate(d.getDate() + 7);
            }
            
            changeView(d);
            ajaxRequest()
            loadData();
            $mnsloadview.toggleClass("active");
        });
    
        $mnsToolbar.find(".btnAfterWeek").on("click", function () {
            $mnsloadview.toggleClass("active");
            const d = rangeDateVisible[0];
            if(modeView === "month"){
                d.setMonth(d.getMonth() - 1);
            }else{
                d.setDate(d.getDate() - 7);
            }
            changeView(d);
            ajaxRequest()
            loadData();
            $mnsloadview.toggleClass("active");
        });
    
        $mnsToolbar.find(".btnChangeView").on("click", function () {
            var $this = $(this);
            if(!$this.hasClass("active")){
                $mnsloadview.toggleClass("active");
                $mnsToolbar.find(".btnChangeView").removeClass("active");
                $this.addClass("active");
        
                if ($this.hasClass("btnMonthViewMode")) {
                    modeView = "month";
                } else if ($this.hasClass("btnWeekViewMode")) {
                    modeView = "week";
                }
                changeView();
                ajaxRequest()
                loadData();
                $mnsloadview.toggleClass("active");
            }
        });

        $("body").on("click", ".time-area-item", function () {
            let $thisId = $(this).attr("id");
            let indexRow = $thisId.split("-")[3];
            let indexItem = $thisId.split("-")[4];
            
            let dataItem = {
                name: customData[indexRow].name,
                extra: customData[indexRow].extra,
                item: customData[indexRow].data[indexItem]
            }

            if(defaultConfig.onClick){
                defaultConfig.onClick(dataItem);
            }
        });

        $(document).on("mouseenter", ".time-area-item", function (e) {
            let $this = $(this);
            let $thisId = $(this).attr("id");
            let indexRow = $thisId.split("-")[3];
            let indexItem = $thisId.split("-")[4];
            let dataItem = {
                name: customData[indexRow].name,
                extra: customData[indexRow].extra,
                item: customData[indexRow].data[indexItem]
            }

            if(defaultConfig.tooltip){
                var pos = $this.position();
                $mnstooltip.css({
                    "left":pos.left + (($this.width() - parseInt(defaultConfig.tooltip.width, 10)) / 2) + 'px',
                    "top": pos.top + 17 + 'px'
                });

                $mnstooltiparrow.css({
                    "border-bottom-color": defaultConfig.tooltip.background
                })

                $mnstooltipbody.css({
                    "width": defaultConfig.tooltip.width,
                    "font-size": defaultConfig.tooltip.fontSize,
                    "background": defaultConfig.tooltip.background,
                    "color": defaultConfig.tooltip.color
                })

                $mnstooltipbody.html(defaultConfig.tooltip.content(dataItem));
                $mnstooltip.toggleClass("active");
            }
        });

        $(document).on("mouseleave", ".time-area-item", function (e) {
            $mnstooltip.toggleClass("active");
        });

        function changeView(requireDate) {
            rangeDateVisible = getRangeWeektoDate(requireDate);
            var fs = "";
            fs += `${defaultConfig.info.monthNamesShort[rangeDateVisible[0].getMonth()]} `;
            fs += `${(`00${rangeDateVisible[0].getDate()}`).substr(-2, 2)} `;
            if (rangeDateVisible[0].getFullYear() !== rangeDateVisible[rangeDateVisible.length - 1].getFullYear())
                fs += `, ${rangeDateVisible[0].getFullYear()} `;
            fs += "- ";
            if (rangeDateVisible[0].getMonth() !== rangeDateVisible[rangeDateVisible.length - 1].getMonth())
                fs += `${defaultConfig.info.monthNamesShort[rangeDateVisible[rangeDateVisible.length - 1].getMonth()]} `;
            fs += `${(`00${rangeDateVisible[rangeDateVisible.length - 1].getDate()}`).substr(-2, 2)} `;
            fs += `, ${rangeDateVisible[rangeDateVisible.length - 1].getFullYear()} `;
    
            $mnsHead.find("th.mns-year>.mns-year-content").html(fs);
    
            var minwidth = rangeDateVisible.length * 159 + 1;
            $mnsHeadMnsTimeArea.find(".mns-content").css({ "min-width": minwidth });
            $mnsBodyMnsTimeArea.find(".mns-content").css({ "min-width": minwidth });
    
            $mnsHeadMnsTimeArea.find(".mns-content>table>colgroup").html("");
            $mnsHeadMnsTimeArea.find(".mns-content>table>thead>tr:eq(0)").html("");
    
            $mnsBodyMnsTimeArea.find(".mns-content>.mns-rows colgroup").html("");
            const widthCol = 100 / rangeDateVisible.length;
            for (let i = 0; i < rangeDateVisible.length; i++) {
                $mnsHeadMnsTimeArea.find(".mns-content>table>colgroup").append(`<col style="width: ${widthCol}%">`);
                $mnsHeadMnsTimeArea.find(".mns-content>table>thead>tr:eq(0)").append(`<th class="mns-days">
                                                                                            <div class="mns-day"></div>
                                                                                        </th>`);
    
                $mnsBodyMnsTimeArea.find(".mns-content>.mns-rows colgroup").append(`<col style="width: ${widthCol}%">`);
            }
    
            $.each($mnsHead.find("th.mns-days"), function (index, value) {
                fs = (`${defaultConfig.info.dayNames[rangeDateVisible[index].getDay()]} ${(`00${rangeDateVisible[index].getDate()}`).substr(-2, 2)}/${defaultConfig.info.monthNamesShort[rangeDateVisible[index].getMonth()]}`);
                $(value).find(".mns-day").html(fs);
            });
        }

        function ajaxRequest(parmt){
            $.ajax({
                url: `${ajaxUrl}?start=${rangeDateVisible[0].getFullYear()}-${rangeDateVisible[0].getMonth() + 1}-${rangeDateVisible[0].getDate()}&end=${rangeDateVisible[rangeDateVisible.length - 1].getFullYear()}-${rangeDateVisible[rangeDateVisible.length - 1].getMonth() + 1}-${rangeDateVisible[rangeDateVisible.length - 1].getDate()}${parmt ? parmt:""}`,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    customData = data;
                    loadData();
                }
            });
        }
    
        function loadData() {
            $mnsBodyMnsResourceArea.find("table>tbody").html("");
            $mnsBodyMnsTimeArea.find("table>tbody").html("");
            $.each(customData, function (index, value) {
                var contendTr = $("<tr>");
    
                $mnsBodyMnsResourceArea.find("table>tbody").append(`<tr>
                                                                        <td>
                                                                            <div class="mns-row mns-area-row-${index}">
                                                                                ${value.name}
                                                                            </div>
                                                                        </td>
                                                                    </tr>`);
    
                for (let i = 0; i < rangeDateVisible.length; i++) {
                    var contendTd = $("<td>");
                    var contendRow = $(`<div class="mns-row mns-area-row-${index}" ${defaultConfig.draggable ? 'ondrop="drop(event)" ondragover="allowDrop(event)"':''}>`);
                    $.each(value.data, function (id, val) {
                        let dateCustom = new Date(val.date);
                        if (rangeDateVisible[i].getDate() === dateCustom.getDate() && rangeDateVisible[i].getMonth() === dateCustom.getMonth() && rangeDateVisible[i].getFullYear() === dateCustom.getFullYear()) {
                            contendRow.append(`<div class='time-area-item' id='time-area-item-${index}-${id}' ${val.background || val.color  ? `style="${val.background ? `background: ${val.background};`:""}${val.color ? `color: ${val.color};`:""}"`:''} ${defaultConfig.draggable ? 'draggable="true" ondragstart="drag(event)"':''}>${val.info}</div>`);
                        }
                    });
                    contendTd.append(contendRow);
                    if(value.footer){
                        $.each(value.footer, function (id, val) {
                            let dateCustom = new Date(val.date);
                            if (rangeDateVisible[i].getDate() === dateCustom.getDate() && rangeDateVisible[i].getMonth() === dateCustom.getMonth() && rangeDateVisible[i].getFullYear() === dateCustom.getFullYear()) {
                                let f = $(`<div class="mns-row-pie">${val.contend}</div>`);
                                if(val.background) f.css({background: val.background})
                                if(val.color) f.css({color: val.color})
                                contendTd.append(f)
                            }
                        });
                    }
                    
                    contendTr.append(contendTd);
                }
    
                $mnsBodyMnsTimeArea.find("table>tbody").append(contendTr);
            });
    
            setSizeMaxDiv();
        }
    
        function getRangeWeektoDate(date) {
            var numberDays;
            const returnArray = [], datainitial = date ? new Date(date) : new Date(new Date());
    
            if (modeView === "month") {
                numberDays = new Date(datainitial.getFullYear(), datainitial.getMonth() + 1, 0).getDate();
    
                if (datainitial.getDate() !== 1)
                    datainitial.setDate(1);
            }
            else {
                numberDays = 7;
                const day = datainitial.getDay() || 7;
    
                if (day !== 1)
                    datainitial.setHours(-24 * (day - 1));
            }
    
            for (let i = 0; i < numberDays; i++) {
                if (i === 0) {
                    returnArray[i] = new Date(datainitial);
                } else {
                    returnArray[i] = new Date(datainitial.setHours(24));
                }
            };
    
            return returnArray;
        }
    
        function setSizeMaxDiv() {
            $.each($mnsBodyMnsTimeArea.find("table>tbody>tr"), function (i, e) {
                var maxHeight = 0;
                $(`td>.mns-area-row-${i}`).css("height", "auto");
                $.each($(`td>.mns-area-row-${i}`), function (i2, e2) {
                    if (maxHeight < $(e2).parent().height())
                        maxHeight = $(e2).parent().height();
                    $(e2).css("height", `${$(e2).next(".mns-row-pie").length !== 0 ? "calc(100% - 25px)":"100%"}`);
                });
                $(`td>.mns-area-row-${i}`).parent().height(maxHeight);
            });
            
        }
    
        window.drag = function (ev) {
            ev.dataTransfer.setData("textID", ev.target.id);
        }
    
        window.drop = function (ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("textID");
            if ($(ev.target).hasClass("mns-row")) {
                ev.target.appendChild($(`#${data}`)[0]);
                setSizeMaxDiv();
            } else if ($(ev.target).parent().hasClass("mns-row")) {
                $(ev.target).parent()[0].appendChild($(`#${data}`)[0]);
                setSizeMaxDiv();
            }
            
        }
    
        window.allowDrop = function (ev) {
            ev.preventDefault();
        }
    
        function initial() {
            modeView = defaultConfig.mode;
            changeView();
            if(parameters.ajax.data) customData = parameters.ajax.data;
            else if(parameters.ajax.url && parameters.ajax.url.length !== 0){
                ajaxUrl = parameters.ajax.url;
                ajaxRequest();
            }

            if(parameters.icons){
                if(parameters.icons.arrow){
                    $mnsToolbar.find("i.mns-arrow-left").attr("class",parameters.icons.arrow.left)
                    $mnsToolbar.find("i.mns-arrow-right").attr("class",parameters.icons.arrow.right)
                }
            }
            
            defaultConfig.draggable = parameters.draggable;
            defaultConfig.onClick = parameters.onClick;
            defaultConfig.tooltip = parameters.tooltip;
            loadData();
        }
    
        initial();

        return {
            destroy : function(){
                $miniSheduler.html("");
            },
            load:{
                data:function(dataReload){
                    customData = dataReload;
                    loadData();
                },
                update:function(parmt){
                    ajaxRequest(parmt);
                }
            }
        }
    }
  });