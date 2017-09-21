$(function(){
    var miniSheduler = $("#calendario").miniSheduler({
        ajax:{
            url:"./data.json"
        },
        onClick:function(data){
            console.log(data)
        }
    })

    $("#clear").on("click",()=>{
        miniSheduler.destroy();
    })

    $("#reload").on("click",()=>{
        miniSheduler.load.url("/data2.json");
    })

    $("#update").on("click",()=>{
        miniSheduler.load.update();
    })
})