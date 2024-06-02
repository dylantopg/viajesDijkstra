export class Grafo {
  // aqui se crea la estructura de datos lista adyacente como diccionario
  private listaAdyacente: { [key: string]: { [key: string]: number } };

  constructor() {
    //En el constructor se inicializa la estructura en vacío
    this.listaAdyacente = {};
  }

  addNodo(nodo: string) {
    //Para agregar un nodo o ciudad primero se comprueba que se le este pasando algo a la funcion
    if (!nodo) {
      throw new Error("el nodo no puede estar vacío");
    }
    if (!this.listaAdyacente[nodo]) {
      this.listaAdyacente[nodo] = {};
    }
  }

  deleteNodo(nodo: string) {
    //para borrar un nodo se comprueba que el nodo exista
    if (!this.listaAdyacente[nodo]) {
      throw new Error(`Nodo ${nodo} no existe`);
    }
    //si existe se procede a borrarlo
    delete this.listaAdyacente[nodo];
    //consecuentemente se borran las rutas que hayan estado apuntando al nodo
    for (let key in this.listaAdyacente) {
      delete this.listaAdyacente[key][nodo];
    }
  }

  addArista(nodo1: string, nodo2: string, costo: number) {
    if (!nodo1 || !nodo2) {
      throw new Error("Ambos nodos deben existir");
    }
    if (!this.listaAdyacente[nodo1] || !this.listaAdyacente[nodo2]) {
      throw new Error("Ambos nodos deben existir");
    }
    if (typeof costo !== "number" || costo < 0) {
      throw new Error("el costo no puede ser negativo");
    }
    //despues de comprobar errores se crean las rutas o aristas, en este caso como el grafo no es dirigido entonces se hacen 2 rutas por que esto permite la ida y la vuelta de un nodo a otro
    this.listaAdyacente[nodo1][nodo2] = costo;
    this.listaAdyacente[nodo2][nodo1] = costo;
    // if (this.listaAdyacente[nodo1] && this.listaAdyacente[nodo2]) {
    //     this.listaAdyacente[nodo1][nodo2] = costo;
    //     this.listaAdyacente[nodo2][nodo1] = costo;
    // }
  }

  deleteArista(nodo1: string, nodo2: string) {
    if (!this.listaAdyacente[nodo1] || !this.listaAdyacente[nodo2]) {
      throw new Error("Ambos nodos deben existir");
    }
    //para borrar una arista se hace una verificacion y despues se elimina el camino de ida y el de vuelta con la funcion delete
    delete this.listaAdyacente[nodo1][nodo2];
    delete this.listaAdyacente[nodo2][nodo1];

    // if (this.listaAdyacente[nodo1] && this.listaAdyacente[nodo2]) {
    //     delete this.listaAdyacente[nodo1][nodo2];
    //     delete this.listaAdyacente[nodo2][nodo1];
    // }
  }

  hayRuta(nodo1: string, nodo2: string) {
    if (!this.listaAdyacente[nodo1] || !this.listaAdyacente[nodo2]) {
      throw new Error("Ambos nodos deben existir");
    }

    //Se inicializa visitado para llevr la cuenta de los nodos q se visitan
    //y en la cola se guardan los q faltan por visitar
    const visitado: { [key: string]: boolean } = {};
    const cola: string[] = [];
//se marca el primer nodo y se añade a la cola
    visitado[nodo1] = true;
    cola.push(nodo1);
//se elimina el primer nodo de la cola y se comprueba si es el siguiente
//si es el siguiente se devuelve true para indicar q si hay camino
//si el bucle termina sin encontrar el nodo siguiente o nodo2 se devuelve un undefined pero se toma como false
//asi se va garantizando que se exploren todos los nodos
//la funcion .shift() remueve el primer elemento de unarreglo y lo devuelve, la ventaja es que cuando lo remueve tambien reduce el tamaño del arreglo de forma dinamica, asi se guarda en la variable actual para ir avanzando
    while (cola.length > 0) {
      const actual: string = cola.shift() as string;
      if (actual === nodo2) {
        return true;
      }

      for (let vecino in this.listaAdyacente[actual]) {
        if (!visitado[vecino]) {
          visitado[vecino] = true;
          cola.push(vecino);
        }
      }
    }

    return false;
  }
//esta funcion basicamente imprime los valores que correspondan a la llave del objeto nodo que se le pase
  getNodosConectados(nodo: string) {
    if (!this.listaAdyacente[nodo]) {
      throw new Error(`Nodo ${nodo} no existe`);
    }
    return Object.keys(this.listaAdyacente[nodo]);
  }
//tambien simplemente hace una lectura pero se guarda todo en un arreglo de objetos para que sea más facil imprimirlo, solo que se necesitó crear el arreglo de objetos como aristas para ingresarle las rutas de nodo a nodo con su respectivo coste
  getAllRutas() {
    const aristas: { nodo1: string; nodo2: string; costo: number }[] = [];

    for (let nodo in this.listaAdyacente) {
      for (let vecino in this.listaAdyacente[nodo]) {
        if (nodo < vecino) {
          aristas.push({
            nodo1: nodo,
            nodo2: vecino,
            costo: this.listaAdyacente[nodo][vecino],
          });
        }
        // aristas.push({
        //     nodo1: nodo,
        //     nodo2: vecino,
        //     costo: this.listaAdyacente[nodo][vecino]
        // })
      }
    }
    return aristas;
  }
//para esta funcion se usaron los principios del metodo dijkstra
  metodoDijkstra(inicioNodo: string, finNodo: string) {
    if (!this.listaAdyacente[inicioNodo] || !this.listaAdyacente[finNodo]) {
      throw new Error("Ambos nodos deben existir");
    }
//se inicializan las distancias primero con el nodo de inicio en 0 y todas las demas tienden al infinito, para representar un numero muy grande y que de esta forma el bucle intente buscar más alla
    const distancias: { [key: string]: number } = {};
//los previos mantienen vigilando el previo para cada nodo en el camino y cuando se llegue al destino se pueda imprimir la ruta que se supone que es optima
    const previos: { [key: string]: string | null } = {};
 //la cola se encarga de meter todos los nodos para explorarlos
    const cola: string[] = [];

    //aqui se hacen los seteos de valores de 0 y de infitnitos o nulos
    for (let nodo in this.listaAdyacente) {
      if (nodo === inicioNodo) {
        distancias[nodo] = 0;
      } else {
        distancias[nodo] = Infinity;
      }
      previos[nodo] = null;
      cola.push(nodo);
    }
//este ciclo recorre la cola hasta que este vacia
    while (cola.length > 0) {
        //se e hce un sort para asegurar que el primero sea el de distancia mas corta
      cola.sort((a, b) => distancias[a] - distancias[b]);
    //aqui se remueve el nodo con menor distancia de la cola
      const actual: string | number = cola.shift() as string;
//aqui se reconstruye el camino usando los previos dado el caso de que se haya llegado al destino
      if (actual === finNodo) {
        const ruta: string[] = [];

        let nodo: string | null = finNodo;
        while (nodo !== null) {
          ruta.unshift(nodo);
          nodo = previos[nodo];
        }
//se retorna el objeto con el camino
        return {
          ruta,
          costo: distancias[finNodo],
        };
      }
      //si la distancia es infinita entonces se sale del ciclo por que entonces nunca se va a poder llegar al destino
      if (distancias[actual] === Infinity) {
        break;
      }
//para cada vecino del nodo se le calcula la distancia desde el nodo actual hacia el vecino
//si la distancia es mas pequeña que la distancia conocida actualmente entonces se actualiza la distancia para garantizar que siempre se vaya el viaje por la ruta mas corta de todas
      for (let vecino in this.listaAdyacente) {
        const costo = distancias[actual] + this.listaAdyacente[actual][vecino];

        if (costo < distancias[vecino]) {
          distancias[vecino] = costo;
          previos[vecino] = actual;
        }
      }
    }
    //dado el caso que no se encuentre camino entonces se devuelve null, aunque con la comprobacion de errores esto no deberia suceder
    return null;
  }
}
