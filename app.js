var miTablero;
var tableroDeLaMaquina;
var colocarBarcosManualmente = true;
var direccionBarco;
var longitudBarcos = [5, 4, 4, 3, 2];
var barcoSiguiente = 0;
var posAtacadasDeLaMaquina = []; //guardamos las posiciones en la que ha atacado la maquina.


//Nada mas cargar la pagina, ocultamos los botones de horizontal y vertical.
window.onload = function () {
    document.getElementById("vertical").hidden = true;
    document.getElementById("dirhorizontal").hidden = true;
    document.getElementById("textoVerti").hidden = true;
    document.getElementById("textoHorizontal").hidden = true;
    document.getElementById("mensajePantalla").hidden = true;
};

function colocarBarcosManual() {
    document.getElementById("titulo").hidden = true;
    document.getElementById("JuegoAleatorio").hidden = true;
    document.getElementById("JuegoMano").hidden = true;
    document.getElementById("vertical").hidden = false;
    document.getElementById("dirhorizontal").hidden = false;
    document.getElementById("textoVerti").hidden = false;
    document.getElementById("textoHorizontal").hidden = false;
    document.getElementById("mensajePantalla").hidden = false;
    miTablero = new tablero("tableroMio", false);
    dibujarTablero(miTablero);
}


function controlador(e) {
    //caso de cuando colocamos los barcos de forma manual.
    if (colocarBarcosManualmente) {
        //solo salta este mensaje cuando no tienes ninguna posicion seleccionada.
        if(!comprobarDireccionBarcoAPoner()){
            alert("Selecciona la posicion del barco que quieres colocar.");
        }else{
        
        //Si al poner un barco, se pone en una posicion no deseada te devuelve falso y salta el mensaje de error.
        if (!miTablero.ponerBarcoAMano(longitudBarcos[barcoSiguiente], this.fila, this.columna, direccionBarco)) {
            alert("Coloca una posicion en la que puedas poner el barco.");
            return;
        } else {
            barcoSiguiente++;
        }

        miTablero.restarBarco();

        //si ya no tenemos mas barcos que colocar mostramos el tablero de la CPU.
        if (miTablero.obtenerBarcosAColocar() != 0) {

        } else {
            document.getElementById("titulo").hidden = true;
            document.getElementById("JuegoAleatorio").hidden = true;
            document.getElementById("JuegoMano").hidden = true;
            document.getElementById("vertical").hidden = true;
            document.getElementById("dirhorizontal").hidden = true;
            document.getElementById("textoHorizontal").hidden = true;
            document.getElementById("textoVerti").hidden = true;
            colocarBarcosManualmente = false;
            tableroDeLaMaquina = new tablero("tableroMaquina", true);
            dibujarTablero(tableroDeLaMaquina);
            quitarEventoClickDelTableroEntero(miTablero);
            tableroDeLaMaquina.generarBarcosAleatorio();
            
        }

        }
    }
    //una que tenemos los barcos colocados, empezamos a atacar.
    else {
        //atacamos primero nosotros a la maquina
        if (tableroDeLaMaquina.comprobarAtaqueDelUsuario(this.fila, this.columna)) {
            var contenido = document.getElementById('mensajePantalla');
            contenido.innerHTML="";
            crearMensajes('<span style="display:block;text-align:left;color:black;">Has tocado un barco</span>');
            this.style.backgroundColor = 'red';

            if (tableroDeLaMaquina.comprobarBarcoHundido()){
            var contenido = document.getElementById('mensajePantalla');
            contenido.innerHTML="";
            crearMensajes('<span style="display:block;text-align:left;color:black;">Has hundido un barco</span>');
            }

            if (tableroDeLaMaquina.comprobarSiFinalizaPartida()){
            alert("El usuario ha ganado. Fin de la partida");
            quitarEventoClickDelTableroEntero(tableroDeLaMaquina);
            return;
            }
        } else {
            this.style.backgroundColor = 'blue';
            var contenido = document.getElementById('mensajePantalla');
            contenido.innerHTML="";
            crearMensajes('<span style="display:block;text-align:left;color:black;">Has disparado al AGUA </span>');
        }
        quitarEventoClickDelTableroSoloUnaPos(tableroDeLaMaquina, this.fila, this.columna);

        //ataca la maquina.
        comprobarAtaqueDeLaMaquina();
    }
}

function comprobarDireccionBarcoAPoner() {
    if (document.getElementById('vertical').checked) {
        direccionBarco = 'v';
        return true;
    } 
    if (document.getElementById('dirhorizontal').checked) {
        direccionBarco = 'h';
        return true;
    } 
}

//Quitamos el evento controlador que es el que se encarga de añadir barcos, para que no te deje meter mas si ya estan todos puestos.
function quitarEventoClickDelTableroEntero(tablero) {
    for (let i = 1; i < tablero.arrayTablero.length; i++) {
        for (let j = 1; j < tablero.arrayTablero[i].length; j++) {
            tablero.arrayTablero[i][j].removeEventListener("click", controlador);
        }
    }
}


//funcion que permite quitar el vento click de la posicion en la que ya hemos cliqueado.
function quitarEventoClickDelTableroSoloUnaPos(tablero, posX, posY) {
    tablero.arrayTablero[posX][posY].removeEventListener("click", controlador);
}


function comprobarAtaqueDeLaMaquina() {
    var posicionesAtaque;
    do {
        posX = generarNumeroAleatorio();
        posY = generarNumeroAleatorio();

        posicionesAtaque = posX.toString() + posY.toString();
        var posOk = false;

        //posicionesatacadas es para saber donde ha atacado la maquina.
        for (let i = 0; i < posAtacadasDeLaMaquina.length; ++i) {
            if (posAtacadasDeLaMaquina[i] == posicionesAtaque) {
                posOk = true;
            }
        }


    } while (posOk);

    posAtacadasDeLaMaquina.push(posicionesAtaque);


    if (miTablero.comprobarAtaqueDelUsuario(posX, posY)) {
        miTablero.arrayTablero[posX][posY].style.backgroundColor = 'red';
         crearMensajes('<span style="display:block;text-align:right;color:black;">La CPU ha tocado tu barco</span>');
        
        if (miTablero.comprobarBarcoHundido()){
        crearMensajes('<span style="display:block;text-align:right;color:black;">La CPU ha hundido tu barco</span>');
        }

        if (miTablero.comprobarSiFinalizaPartida()) {
            alert("La CPU ha ganado. Fin de la partida");
            quitarEventoClickDelTableroEntero(tableroDeLaMaquina);
            return;
        }
    }
    else{
        miTablero.arrayTablero[posX][posY].style.backgroundColor = 'blue';
        crearMensajes('<span style="display:block;text-align:right;color:black;">La CPU ha disparado al agua</span>');
    }
}


//generamos el numero aleatoria para las posiciones x e y.
function generarNumeroAleatorio() {
    return Math.floor((Math.random() * 10) + 1);
}



function dibujarTablero(pintarTablero) {
    //obtenemos el nombre del tablero que estamos creando. Puedes ser: Tablero nuestro o el tablero de la maquina.
    var tablero = document.getElementById(pintarTablero.nombreTablero);
    var contador = 0;

    while (tablero.hasChildNodes()) {
        tablero.removeChild(tablero.firstChild);
    }

    for (let s = 0; s < pintarTablero.fila + 1; s++) {
        var fila = document.createElement("tr");
        for (let r = 0; r < pintarTablero.columa + 1; r++) {
            var col = document.createElement("td");
            fila.appendChild(col);
            if (s === 0 && r === 0) {
            } else if (s === 0 && r !== 0) {
                col.textContent = String.fromCharCode(65 + r);
            } else if (r === 0 && s !== 0) {
                col.textContent = s;

            } else {
                col.fila = s;
                col.columna = r;
                col.tablero = pintarTablero;
                col.addEventListener("click", controlador);
                pintarTablero.arrayTablero[s][r] = col;
                contador++;
            }
        }

        tablero.appendChild(fila);
    }
}


function crearMensajes(mensaje) {
    var contenido = document.getElementById('mensajePantalla');
    contenido.innerHTML = mensaje + '<br>' + contenido.innerHTML;
}


function colocarBarcosAleatorios() {
    document.getElementById("JuegoAleatorio").hidden = true;
    document.getElementById("JuegoMano").hidden = true;
    document.getElementById("mensajePantalla").hidden = false;
    document.getElementById("titulo").hidde=true;
    miTablero = new tablero("tableroMio", false);
    dibujarTablero(miTablero);
    miTablero.generarBarcosAleatorio();
    tableroDeLaMaquina = new tablero("tableroMaquina", true);
    quitarEventoClickDelTableroEntero(miTablero);
    dibujarTablero(tableroDeLaMaquina);
    tableroDeLaMaquina.generarBarcosAleatorio();
    colocarBarcosManualmente = false;
}


function ponerBarcosAleatorios() {
    miTablero.generarBarcosAleatorio();
}









