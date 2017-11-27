
const int pino_tensao = A2;
const int pino_corrente = A4;

int controle = 0;
float tensao_init = 0;
int i = 0;
void setup() {
  
  pinMode(pino_tensao,INPUT);
  pinMode(pino_corrente,INPUT);
    
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  float milisegundos = millis();
  float correnteF = 0;
  int tensao_leitura = analogRead(pino_tensao);
  float tensao = tensao_leitura *( 5.0/1023.0);
  int corrente = analogRead(pino_corrente);

  if(controle == 0){
    float amostragem = 0;
    
    for(i = 0; i <1000; i++){
      amostragem += tensao * 10.7;
    }
    
    tensao_init = amostragem/1000;
    controle++;
  }
  
  float consumo = tensao_init - (tensao * 10.7);
  
  correnteF = (corrente*( 5.0/1023.0))/2.3;
  Serial.print("Tensao,\n");
  Serial.print(tensao*10.7);
  Serial.print(",");
  Serial.print(tensao_init);
  Serial.print(",");
  Serial.print(correnteF,5);
  Serial.print(",");
  Serial.print(milisegundos);
  Serial.print(",");
  Serial.print(consumo);
  Serial.print(",");

  delay(1000);
  
}
