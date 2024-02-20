import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import Marcador from './marcador';

class Tablero {
  #casillas;
  #dimension;
  #turno;
  #elementID;
  #marcador;
  #versusMachine;
  #endGame = false;
  #registroJugadas;
  #maxRondas;

  constructor(dimension = 3, versusMachine = false, maxRondas = 3) {
    let numPartidas = document.getElementById('numPartidas').value;
    this.#casillas = new Array();
    this.#dimension = dimension;
    this.#versusMachine = versusMachine;
    this.#maxRondas = maxRondas;
    for (let i = 0; i < this.#dimension; i++) {
      this.#casillas[i] = new Array();
      for (let j = 0; j < this.#dimension; j++) {
        this.#casillas[i][j] = null;
      }
    }
    let elementID = 'marcador';
    this.#turno = 'X';
    this.#marcador = new Marcador(elementID, numPartidas);
    this.#registroJugadas = [];
  }

  imprimir(elementId = 'tablero') {
    let tablero = document.getElementById(elementId);
    this.#elementID = elementId;
    tablero.innerHTML = '';
    
    for (let fila = 0; fila < this.#dimension; fila++) {
      for (let columna = 0; columna < this.#dimension; columna++) {
        let casilla = document.createElement('div');
        casilla.dataset.fila = fila;
        casilla.dataset.columna = columna;
        casilla.dataset.libre = this.#casillas[fila][columna] || ''; // asignamos directamente el valor de la casilla
        
        // Crear elemento de imagen
        let imagen = document.createElement('img');
        imagen.classList.add('ficha');
  
        // Agregar la imagen a la casilla
        casilla.appendChild(imagen);
  
        tablero.appendChild(casilla);
        this.addEventClick(casilla);
      }
    }
    
    this.actualizarImagenes(); // Llamamos a la función para inicializar las imágenes

    tablero.style.gridTemplateColumns = `repeat(${this.#dimension}, 1fr)`;
  }

actualizarImagenes() {
  // Iterar sobre las casillas y actualizar las imágenes según el valor de la casilla
  let casillas = document.querySelectorAll('[data-fila][data-columna]');
  casillas.forEach(casilla => {
    let fila = casilla.dataset.fila;
    let columna = casilla.dataset.columna;
    let imagen = casilla.querySelector('img');

    if (this.#casillas[fila][columna] === 'X') {
      imagen.src = './docs/assets/X.jpg';
    } else if (this.#casillas[fila][columna] === 'O') {
      imagen.src = './docs/assets/O.png';
    }
  });
}

// Modifica la función setCasilla para que llame a la función actualizarImagenes
setCasilla(fila, columna, valor) {
  if (this.isFree(fila, columna)) {
    this.#casillas[fila][columna] = valor;
    this.actualizarImagenes(); // Actualizamos las imágenes después de cada movimiento
    return true;
  }
  return false;
}

  

  isFree(fila, columna) {
    return true ? this.#casillas[fila][columna] === null : false;
  }

  setCasilla(fila, columna, valor) {
    if (this.isFree(fila, columna)) {
      this.#casillas[fila][columna] = valor;
      return true;
    }
    return false;
  }

  getCasilla(fila, columna) {
    return this.#casillas[fila][columna];
  }

  toogleTurno() {
    if (this.#endGame) return false;

    if (this.#turno === 'X') {
      this.#turno = 'O';
      if (this.#versusMachine) {
        let posicionLibre = this.getCasillaFreeRandom();
        this.setCasilla(posicionLibre.i, posicionLibre.j, 'O');
        this.imprimir();
        this.comprobarResultados();
        if (this.#endGame) return false;
        this.toogleTurno();
      }
    } else {
      this.#turno = 'X';
    }
  }

  comprobarResultados() {
    let fila;
    let columna;
    let ganado = false;
    for (fila = 0; fila < this.#dimension && !ganado; fila++) {
      let seguidas = 0;
      for (columna = 0; columna < this.#dimension; columna++) {
        if (columna !== 0) {
          if (this.getCasilla(fila, columna) === this.getCasilla(fila, columna - 1)) {
            if (this.getCasilla(fila, columna) !== null) {
              seguidas++;
            }
          }
        }
      }
      if (seguidas === this.#dimension - 1) {
        console.log('Linea');
        ganado = true;
      }
    }

    for (columna = 0; columna < this.#dimension && !ganado; columna++) {
      let seguidas = 0;
      for (fila = 0; fila < this.#dimension; fila++) {
        if (fila !== 0) {
          if (this.getCasilla(fila, columna) === this.getCasilla(fila - 1, columna)) {
            if (this.getCasilla(fila, columna) !== null) {
              seguidas++;
            }
          }
        }
      }
      if (seguidas === this.#dimension - 1) {
        console.log('Columna');
        ganado = true;
      }
    }

    let seguidas = 0;
    for (let i = 0; i < this.#dimension; i++) {
      if (i !== 0) {
        if ((this.getCasilla(i, i) === this.getCasilla(i - 1, i - 1)) && this.getCasilla(i, i) !== null) {
          seguidas++;
        }
      }
    }

    if (seguidas === this.#dimension - 1) {
      console.log('Diagonal de izq a derecha');
      ganado = true;
    }

    seguidas = 0;
    for (let i = this.#dimension - 1; i >= 0; i--) {
      if (i !== this.#dimension - 1) {
        let j = this.#dimension - 1 - i;
        if ((this.getCasilla(i, j) === this.getCasilla(i + 1, j - 1)) && this.getCasilla(i, j) !== null) {
          seguidas++;
        }
      }
    }

    if (seguidas === this.#dimension - 1) {
      console.log('Diagonal de derecha a izquierda');
      ganado = true;
    }

    if (ganado) {
      this.#endGame = true;
      Toastify({
        text: `Ha ganado el jugador ${this.#turno}`,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "blue",
        },
        onClick: function () { }
      }).showToast();

      let libres = document.querySelectorAll('div[data-libre=""]');
      libres.forEach((casillaLibre) => {
        casillaLibre.dataset.libre = '-';
      });

      this.#marcador.addPuntos(this.#turno);
      document.querySelector('.clearGame').classList.toggle('show');

      if (this.#marcador.getRondasJugadas() === this.#maxRondas) {
        this.imprimirGanador();
        this.setEndGame();
      }

    } else {
      if (this.isFull()) {
        Toastify({
          text: `Han sido tablas`,
          newWindow: true,
          close: true,
          gravity: "top",


          position: "center",
          stopOnFocus: true,
          style: {
            background: "blue",
          },
          onClick: function () { }
        }).showToast();
        document.querySelector('.clearGame').classList.toggle('show');
        this.#endGame = true;
      }
    }
  }

  isFull() {
    return !this.#casillas.some(fila => fila.some(casilla => casilla === null));
  }

  addEventClick(casilla) {
    casilla.addEventListener('click', (e) => {
      let casillaSeleccionada = e.currentTarget;
      if (casillaSeleccionada.dataset.libre === '') {
        casillaSeleccionada.textContent = this.#turno;
        this.setCasilla(
          casillaSeleccionada.dataset.fila,
          casillaSeleccionada.dataset.columna,
          this.#turno
        );
        casillaSeleccionada.dataset.libre = this.#turno;
        this.#registroJugadas.push({
          jugador: this.#turno,
          casilla: {
            fila: casillaSeleccionada.dataset.fila,
            columna: casillaSeleccionada.dataset.columna,
          },
          hora: new Date().toLocaleTimeString(),
        });
        this.comprobarResultados();
        this.toogleTurno();
        this.imprimirRegistroJugadas();
      }
    });

    casilla.addEventListener('mouseover', (e) => {
      if (e.currentTarget.dataset.libre === '') {
        e.currentTarget.textContent = this.#turno;
      }
    });

    casilla.addEventListener('mouseleave', (e) => {
      if (e.currentTarget.dataset.libre === '') {
        e.currentTarget.textContent = '';
      }
    });
  }

  imprimirRegistroJugadas() {
    let registroContainer = document.getElementById('registroJugadas');
    registroContainer.innerHTML = '';

    this.#registroJugadas.forEach((jugada) => {
      let jugadaElement = document.createElement('div');
      jugadaElement.textContent = `El jugador ${jugada.jugador} ha puesto una ficha en la casilla ${jugada.casilla.fila},${jugada.casilla.columna} a las ${jugada.hora}`;
      registroContainer.appendChild(jugadaElement);
    });
  }

  get dimension() {
    return this.#dimension;
  }

  get elementID() {
    return this.#elementID;
  }

  limpiar() {
    this.#casillas = this.#casillas.map(casilla => casilla.map(c => null));
    this.#endGame = false;
    this.#registroJugadas = [];
    document.getElementById('registroJugadas').innerHTML = '';
    this.imprimir();
    document.querySelector('.clearGame').classList.toggle('show');
    this.ocultarBotonReiniciar();
  }

  getCasillaFreeRandom() {
    let i, j;
    do {
      i = Math.floor(Math.random() * (this.#dimension));
      j = Math.floor(Math.random() * (this.#dimension));
    } while (!this.isFree(i, j));
    return {
      i: i,
      j: j
    };
  }

  setEndGame() {
    this.#endGame = true;
  }

  imprimirGanador() {
    let ganador = this.#turno === 'X' ? 'O' : 'X';
    if (this.#marcador.getJugadores()[0].puntos === this.#marcador.getJugadores()[1].puntos) {
      Toastify({
        text: `Empate después de ${this.#maxRondas} rondas`,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "blue",
        },
        onClick: function () { }
      }).showToast();
    } else {
      Toastify({
        text: `El ganador es el jugador ${ganador} después de ${this.#maxRondas} rondas`,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "blue",
        },
        onClick: function () { }
      }).showToast();
    }
    if (this.#marcador.getRondasJugadas() === this.#maxRondas) {
      this.ocultarBotonReiniciar();
    }
  }

  ocultarBotonReiniciar() {
    document.querySelector('.resetGame').classList.remove('show');
    document.querySelector('.clearGameButton').classList.add('show');
  }
}

export default Tablero;