$(function(){
    $("#calendario").miniSheduler({
        url:"",
        customData:[
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
                ],
                footer:[
                    {
                        date: new Date(),
                        contend: "OT201711490"
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
                ],
                footer:[
                    {
                        date: new Date("09/08/2017"),
                        contend: "Guardia",
                        background: "red",
                        color: "white"
                    }
                ]
            }
        ]
    })
})