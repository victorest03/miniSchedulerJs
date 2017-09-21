$(function(){
    var miniSheduler = $("#calendario").miniSheduler({
        ajax:{
            url:"/data.json"
        },
        onClick:function(data){
            console.log(data)
        }
    })

    $("#clear").on("click",()=>{
        miniSheduler.destroy();
    })

    $("#update").on("click",()=>{
        miniSheduler.load.update("&pk=" + 5);
    })
})