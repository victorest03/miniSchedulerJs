$(function(){
    var miniSheduler = $("#calendario").miniSheduler({
        ajax:{
            url:"/data.json"
        },
        maxHeight : "200px",
        onClick:function(data){
            console.log(data)
        },
        tooltip:{
            background: "rgba(0,0,0,.8)",
            color: "yellow",
            width: "200px",
            fontSize: "11px",
            content:function(data){
                return `<div>
                            <span><b>Emergencia</b></span>: 08:00 - 14:00<br/>
                            <span>Supermercados Peruanos</span><br/>
                            <span>Plaza Vea Piura</span><br/>
                            <span>Rational - SCC WE 101G</span>
                        </div>`;
            }
        }
    })

    $("#clear").on("click",()=>{
        miniSheduler.destroy();
    })

    $("#update").on("click",()=>{
        miniSheduler.load.update("&pk=" + 5);
    })
})