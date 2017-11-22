$(function(){
    var miniSheduler = $("#calendario").miniSheduler({
        ajax:{
            url:"/data.json"
        },
        onClick:function(data){
            console.log(data)
        },
        tooltip:{
            background: "yellow",
            content:function(data){
                return `<div>${data.item.date}</div>`;
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