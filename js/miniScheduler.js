var drag, drop, allowDrop;
$(function () {
    const $miniSheduler = $(".miniSheduler");
    const $mnsToolbar = $miniSheduler.find(".mns-toolbar");
    const $mnsHead = $miniSheduler.find(".mns-head");
    const $mnsHeadMnsTimeArea = $mnsHead.find(".mns-time-area");

    const $mnsBody = $miniSheduler.find(".mns-body");
    const $mnsBodyMnsResourceArea = $mnsBody.find(".mns-resource-area");
    const $mnsBodyMnsTimeArea = $mnsBody.find(".mns-time-area");

    var rangeDateVisible,modeView;

    var customData = [
        {
            name: "Jose Terronez",
            data: [
                {
                    date: new Date(),
                    info: "OT201711490"
                },
                {
                    date: new Date(),
                    info: "OT201711433"
                },
                {
                    date: new Date(),
                    info: "OT201711666"
                }

            ]
        },
        {
            name: "Carlos Quispe",
            data: [
                {
                    date: new Date("09/07/2017"),
                    info: "OT201751210"
                }
            ]
        }
    ];

    var defaultConfig = {
        mode: "week",
        info: {
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"]
        }
    }

    $mnsBodyMnsTimeArea.find(".mns-scroller").on("scroll", function () {
        $mnsHeadMnsTimeArea.find(".mns-scroller").scrollLeft($(this).scrollLeft());
    });

    $mnsToolbar.find(".btnToday").on("click", function () {
        changeView();
    });

    $mnsToolbar.find(".btnBeforeWeek").on("click", function () {
        const d = rangeDateVisible.Monday;
        d.setDate(d.getDate() + 7);
        changeView(d);
    });

    $mnsToolbar.find(".btnAfterWeek").on("click", function () {
        const d = rangeDateVisible.Monday;
        d.setDate(d.getDate() - 7);
        changeView(d);
    });

    $mnsToolbar.find(".btnChangeView").on("click", function () {
        var $this = $(this);
        $mnsToolbar.find(".btnChangeView").removeClass("active");
        $this.addClass("active");

        if ($this.hasClass("btnMonthViewMode")) {
            modeView = "month";
        } else if ($this.hasClass("btnWeekViewMode")) {
            modeView = "week";
        }
        changeView();
        loadData();
    });

    $("body").on("click", ".time-area-item", function () {
        const $thisId = $(this).attr("id");
        console.log(customData[$thisId.split("-")[3]].data[$thisId.split("-")[4]]);
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

            for (let i = 0; i < $mnsHeadMnsTimeArea.find(".mns-content th.mns-days").length; i++) {
                var contendTd = $("<td>");
                var contendRow = $(`<div class="mns-row mns-area-row-${index}" ondrop="drop(event)" ondragover="allowDrop(event)">`);
                $.each(value.data, function (id, val) {
                    if ((modeView === "month" && val.date.getDate() - 1 === i) || (modeView === "week" && (val.date.getDay() === 0 ? 7 : val.date.getDay()) - 1 === i)) {
                        contendRow.append(`<div class='time-area-item' id='time-area-item-${index}-${i}' draggable='true' ondragstart="drag(event)">${val.info}</div>`);
                    }
                });
                contendTd.append(contendRow);
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
                if (maxHeight < $(e2).height())
                    maxHeight = $(e2).height();
            });
            $(`td>.mns-area-row-${i}`).height(maxHeight);
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

        loadData();
    }

    initial();
});