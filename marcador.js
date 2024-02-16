class Marcador {
  #elementId;
  #jugadores = [
    {
      name: 'X',
      puntos: 0,
    },

    {
      name: 'O',
      puntos: 0,
    }
  ]

  constructor(elementId='marcador') {
    this.#elementId = elementId;
    this.imprimir();
  }

  addPuntos(name) {
    let jugador = this.#jugadores.find(j => j.name === name);
    jugador.puntos++;
    this.imprimir();
  }

  imprimir() {
    let marcadorFrontend = document.getElementById(this.#elementId);
    let ul = document.createElement('ul');
    this.#jugadores.forEach(jugador => {
      let li = document.createElement('li');
      li.textContent = `Jugador ${jugador.name} tiene ${jugador.puntos} puntos`;
      ul.append(li);
    });
    marcadorFrontend.innerHTML = '';
    marcadorFrontend.append(ul);
  }

  //Programar la funcionalidad de pedir el número de rondas que se quieren jugar al principio. El programa debe jugar ese número de rondas y cuando llegue a dicho número deberá anunciar el ganador final.

  rondas() {
    let numeroRondas = prompt('¿Cuántas rondas quieres jugar?');
    for (let i = 0; i < numeroRondas; i++) {
      let tablero = new Tablero(3, false);
      tablero.imprimir('tablero');
      preGame.classList.toggle('hide');
      inGame.classList.toggle('hide');
    }
  }
}

export default Marcador;
