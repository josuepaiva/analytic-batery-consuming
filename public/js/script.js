var valores = [];
    var config = {
        type: 'line',
        data: {
            labels: ["0min", "15min", "30min", "45min", "1h", "1h15m", "1h30m"],
            datasets: [{
                label: "Tensão",
                backgroundColor: ["#0000CD"],
                borderColor: ["#0000CD"],
                data: [
                    10,
                    20,
                    50,
                    3,
                    90,
                    21,
                    0
                ],
                fill: false,
            }, {
                label: "Corrente",
                backgroundColor: ["#800000"],
                borderColor: ["#800000"],
                fill: false,
                data: [
                    60,
                    20,
                    50,
                    31,
                    40,
                    31,
                    10
                ],
            }]
        },
        options: {
            responsive: true,
            title:{
                display:true,
                text:'Grafico Tensão Corrente'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Tempo'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true
                        // labelString: 'Value'
                    }
                }]
            }
        }
    };

     var ctx = document.getElementById("canvas").getContext("2d");
     window.myLine = new Chart(ctx, config);

var socket = io(); // instâcia o objeto socket..

//chamada da função dadosArduino que recebe os dados.
var tensao_restante = 0;
var controle = 0;
var tensao_atual = 0;
var tensao_ant = 0;

socket.on("dadosArduino", function(dado){


    var result = dado.valor.toString().split(",");
    var tensao = result[0];
    var corrente = result[2];
    var milisegundos = result[3];
    var tensao_inicial = result[1];
    var time = new Date(parseInt(result[3]));
    var dif = 0;
    var percentagem_consumida = 0;
    var percentagem_restante = 0;

    if(controle == 0){
        tensao_restante = result[1];
        controle++;
    }

    tensao_ant = tensao_atual;

    tensao_atual = result[0];

    dif = Math.abs(tensao_inicial - tensao_atual);

    percentagem_consumida = (dif*100)/tensao_inicial;

    percentagem_restante = 100 - percentagem_consumida;

    $("#estimativa").val(percentagem_restante.toFixed(2)+"%");

    $("#estimativa-consumida").val(percentagem_consumida.toFixed(2)+"%");

    if(percentagem_restante >= 80){
        $("#estimativa").css("background","green");
        $("#estimativa-consumida").css("background","green");

    }else if( percentagem_restante <= 60){
        $("#estimativa").css("background","yellow");
        $("#estimativa").css("color","black");

        $("#estimativa-consumida").css("background","yellow");
        $("#estimativa-consumida").css("color","black");

    }else if( percentagem_restante <=20){
        $("#estimativa").css("background","red");
        $("#estimativa-consumida").css("background","red");
    }
});