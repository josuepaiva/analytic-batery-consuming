var contador = 0; // contador para gerar o eixo x do gráfico 

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

var tempoTotal = 0;
var consumoTotal = 0;
var resta_tensao = 0;
var tensao_ant = 0;
var tensao_atual = 0;

var controle = 0;
var tensao_Total = 0;
    //chamada da função dadosArduino que recebe os dados.
socket.on("dadosArduino", function(dado){


    var result = dado.valor.toString().split(",");
    var tensao = result[0];
    var corrente = result[2];
    var milisegundos = result[3];
    var tensaoTotal = result[1];
    var time = new Date(parseInt(result[3]));
    var segundos = 0;
    var minutos = 0;
    var horas = 0;
    var show_time = "";
    var dif = 0;
    var percentagem_bateriatensao = 0;

    if(controle == 0){
        tensao_Total = result[1];
        controle++;
    }

    tensao_ant = tensao_atual;

    tensao_atual = result[0];

    dif = tensao_Total - tensao_atual;

    tensao_Total -= Math.abs(dif); 

    console.log(tensao_Total);
    // // consumoTotal += Math.abs(result[4]);
    // consumoTotal += Math.abs(resta_tensao);
    // tempoTotal += parseInt(result[3]);
    // tensao_ant = tensao;

    // carga_maxima 12   100
    // carga_restante 2   x 

    percentagem_bateria = (tensao_Total*100)/tensaoTotal;

    // console.log(tensao_ant);
    var tempo_restante = (resta_tensao * tempoTotal)/consumoTotal;
    var time_res = new Date(parseInt(tempo_restante));
    show_time += "Faltam "+time_res.getHours()+" horas "+time_res.getMinutes()+" minutos "+" e "+time_res.getSeconds()+" segundos";
    // $("#estimativa").val((tempo_restante)/3600000);
    $("#estimativa").val(percentagem_bateria);

    if( tensao >= ((tensaoTotal * 80)/100)){
        $("#estimativa").css("background","green");

    }else if( tensao <= ((tensaoTotal * 60)/100)){
        $("#estimativa").css("background","yellow");
        $("#estimativa").css("color","black");        
    }else if( tensao <= ((tensaoTotal *20)/100)){
        $("#estimativa").css("background","red");
    }

    // console.log(result);
});