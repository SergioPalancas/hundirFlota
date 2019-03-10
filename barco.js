class barco{

    //creamos el constructor
    constructor(longitud, posX, posY, direccion){
        this.longitudBarcos = longitud;
        this.posX = posX;
        this.posY = posY;
        this.vidas = longitud;
        this.direccion = direccion;
        this.posicionesX = new Array(longitud); //guardamos las posiciones en un array para tenerlo controlado.
        this.posicionesY = new Array(longitud);
        this.calcularLonguitudBarcos();
        this.hundido = false;

    }

    //calculas las longuitudes de los barcos. Vamos rellendo la posicion X o Y +1 para pintar el barco luego.
    calcularLonguitudBarcos(){
        this.posicionesX[0] = this.posX;
        this.posicionesY[0] = this.posY;

        if(this.direccion == 'h'){
            for (let i = 0; i < this.longitudBarcos; i++) {
                this.posicionesY[i] = this.posY + i;
            }
            for (let i = 0; i < this.longitudBarcos; i++) {
                this.posicionesX[i] = this.posX;
            }
        }else{
            for (let i = 0; i < this.longitudBarcos; i++) {
                this.posicionesX[i] = this.posX + i;
            }
            for (let i = 0; i < this.longitudBarcos; i++) {
                this.posicionesY[i] = this.posY;
            }
        }
    }

    //fila
    obtenerCordenadasX(){
        return this.posicionesX;
    }

    //columna
    obtenerCordenadasY(){
        return this.posicionesY;
    }

    obtenerLongitud(){
        return this.longitudBarcos;
    }

    obtenerDireccion(){
        return this.direccion;
    }

    obtenerVidasBarcos(){
        return this.vidas;
    }

    obtenerEstadoHundido(){
        return this.hundido;
    }

    hundirBarco(){
        this.hundido = true;
    }

    quitarVidaBarco(){
        --this.vidas;
    }

}

