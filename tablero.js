const numBarcos = 5;

class tablero {
    constructor(nombreTablero, maquina) {
        this.fila = 10;
        this.columa = 10;
        this.nombreTablero = nombreTablero;
        this.numBarcos = 0;
        this.barcosAColocar = 5;
        this.maquina = maquina; //variable para saber si es la maquina o es el jugador
        this.barcos = new Array(numBarcos);
        this.arrayTablero = new Array(this.columa);

        //creamos el tablero 10x10
        for (let i = 0; i <= this.fila; ++i) {
            this.arrayTablero[i] = new Array(this.columa);
            for (let j = 0; j <= this.columa; ++j) {
                this.arrayTablero[i][j] = "";
            }
        }
    }

    ponerBarcoAMano(tamanio, posX, posY, direccion) {
        //es doce porque empieza en 1 por tanto 10 posiciones seria el 11
        if (direccion == 'v') {
            if (posX + tamanio < 12) {
                if (!this.comprobarSiChocanLosBarcos(tamanio, posX, posY, direccion))
                    return false;
            }else{
                return false;
            }
        }
        else {
            if (posY + tamanio < 12) {
                if (!this.comprobarSiChocanLosBarcos(tamanio, posX, posY, direccion))
                    return false;
                
            }else{
                return false;
            }
        }

        var barcoGenerado = new barco(tamanio, posX, posY, direccion);
        this.barcos[this.numBarcos] = barcoGenerado;
        this.pintarBarco(this.barcos[this.numBarcos]);
        this.numBarcos++;
        return true;

    }

    //funcion que comprobamos si los barcos se "chocan"
    comprobarSiChocanLosBarcos(longitudBarco, posX, posY, direccion) {
        //esta funciona comrpueba tantas veces como barcos haya colacados.
        var posXInicio = posX;
        var posYInicio = posY;

        for (let i = 0; i < this.numBarcos; ++i) {
            //le pasamos los datos del barco.
            var barcoAComprobar = this.barcos[i];
            //obtenemos las coordenadas del barco que vamos a colocar. 
            var posisicionesX = barcoAComprobar.obtenerCordenadasX();
            var posisicionesY = barcoAComprobar.obtenerCordenadasY();

            //longitudBarcoTemporalmente es la longuitud del array del barco a comprobar
            var longitudBarcoTemporalmente = barcoAComprobar.obtenerLongitud();
            longitudBarcoTemporalmente++;

            for (let k = 0; k < longitudBarco; ++k) {
                for (let j = 0; j < longitudBarcoTemporalmente; ++j) {
                    //aumentamos las variables de X e Y para saber si dicho valor coincide con el valor de las coordenadas del otro barco.
                    if (posX == posisicionesX[j] && posY == posisicionesY[j]) {
                        return false;
                    }
                }

                if (direccion == 'v'){
                    posX++;
                }
                else{
                    posY++;
                }
            }
            posX = posXInicio;
            posY = posYInicio;

        }
        return true;
    }   

    pintarBarco(barco) {
        var cordenadasX = barco.obtenerCordenadasX();
        var cordenadasY = barco.obtenerCordenadasY();

        for (let i = 0; i < barco.obtenerLongitud(); ++i) {
            this.arrayTablero[cordenadasX[i]][cordenadasY[i]].style.backgroundColor = 'green';
        }
    }

    restarBarco() {
        this.barcosAColocar--;
    }

    obtenerBarcosAColocar() {
        return this.barcosAColocar;
    }


    generarBarcosAleatorio() {
        //barco de 5
        this.ponerBarcoAleatorio(5);
        //barco de 4
        this.ponerBarcoAleatorio(4);
        this.ponerBarcoAleatorio(4);
        //barco de 3
        this.ponerBarcoAleatorio(3);
        //barco de 2
        this.ponerBarcoAleatorio(2);
    }

    ponerBarcoAleatorio(tamanio) {
    //Variable para saber si la posicion del barco es buena. 
    var posicionOk = false;
    var direccion = this.obtenerDireccionBarco();
    do {
        var posX = this.generarNumeroAleatorio();
        var posY = this.generarNumeroAleatorio();
        if (direccion == 'v') {
            if (posX + tamanio < 12) {
                if (!this.comprobarSiChocanLosBarcos(tamanio, posX, posY, direccion)){
                    posicionOk = false;
                }
                else{
                    posicionOk = true;
                }
            }
        }
        else {
            if (posY + tamanio < 12) {
                if (!this.comprobarSiChocanLosBarcos(tamanio, posX, posY, direccion)){
                    posicionOk = false;
                }
                else{
                    posicionOk = true;
                }
            }
        }

    } while (!posicionOk);

    var barcoGenerado = new barco(tamanio, posX, posY, direccion);
    this.barcos[this.numBarcos] = barcoGenerado;
    if(!this.maquina){
        this.pintarBarco(this.barcos[this.numBarcos]);
    }
       this.numBarcos++;
   }

   obtenerDireccionBarco() {
    var num = Math.floor((Math.random() * 2));
    if (num == 0){
        return 'v';
    }
    else{
        return 'h';
    }
}

generarNumeroAleatorio() {
    return Math.floor((Math.random() * 10) + 1);
}



//Funcion que atacamos nosostros o la maquina. En primer lugar ataca el usuario, despues la maquina.
comprobarAtaqueDelUsuario(cordenaFilaDelAtaque, cordenaColumnaDelAtaque) {
    for (let i = 0; i < this.numBarcos; ++i) {
        var cordenasXBarco = this.barcos[i].obtenerCordenadasX(); //cordenada de las filas
        var cordenasYBarco = this.barcos[i].obtenerCordenadasY(); //cordenada de las columnas

        for (let j = 0; j < this.barcos[i].obtenerLongitud(); ++j) {
            //Si las cordenas del barco en el que lo tenemos colocado coincide con la que estamos atacando devolvemos true y quitamos una vida al total de barcos.
            //Caso contario devolvemos false.
            if (cordenasXBarco[j] == cordenaFilaDelAtaque && cordenasYBarco[j] == cordenaColumnaDelAtaque) {
                this.barcos[i].quitarVidaBarco();
                return true;
            }
        }
    }
    return false;
}

comprobarBarcoHundido() {
    for (let i = 0; i < this.numBarcos; ++i) {
        var comprobarBarco = this.barcos[i];

    if (comprobarBarco.obtenerVidasBarcos() == 0 && comprobarBarco.obtenerEstadoHundido() == false) {
        comprobarBarco.hundirBarco();
        return true;
    }

    }
    return false;
}


comprobarSiFinalizaPartida() {
    for (let i = 0; i < this.numBarcos; ++i) {
        var comprobarBarco = this.barcos[i];

    if (comprobarBarco.obtenerEstadoHundido() == false) {
        return false;
    }
    }
    return true;
}

}

