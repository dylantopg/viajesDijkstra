export class Grafo {

    private listaAdyacente: { [key: string]: { [key: string]: number } }

    constructor() {
        this.listaAdyacente = {};
    }

    addNodo(nodo: string) {
        if (!nodo) {
            throw new Error("el nodo no puede estar vacío");
        }
        if (!this.listaAdyacente[nodo]) {
            this.listaAdyacente[nodo] = {};
        }
    }

    deleteNodo(nodo: string) {
        if (!this.listaAdyacente[nodo]) {
            throw new Error(`Nodo ${nodo} no existe`);
        }

        delete this.listaAdyacente[nodo];

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
        if (typeof costo !== 'number' || costo < 0) {
            throw new Error("el costo no puede ser negativo");

        }
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
        const visitado: { [key: string]: boolean } = {};
        const cola: string[] = [];

        visitado[nodo1] = true;
        cola.push(nodo1);

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

    getNodosConectados(nodo: string) {
        if (!this.listaAdyacente[nodo]) {
            throw new Error(`Nodo ${nodo} no existe`);
        }
        return Object.keys(this.listaAdyacente[nodo]);
    }

    getAllRutas() {
        const aristas: { nodo1: string, nodo2: string, costo: number }[] = [];

        for (let nodo in this.listaAdyacente) {
            for (let vecino in this.listaAdyacente[nodo]) {
                if (nodo < vecino) {
                    aristas.push({
                        nodo1: nodo,
                        nodo2: vecino,
                        costo: this.listaAdyacente[nodo][vecino]
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

    metodoDijkstra(inicioNodo: string, finNodo: string) {

        if (!this.listaAdyacente[inicioNodo] || !this.listaAdyacente[finNodo]) {
            throw new Error("Ambos nodos deben existir");

        }

        const distancias: { [key: string]: number } = {};
        const previos: { [key: string]: string | null } = {};
        const cola: string[] = [];

        for (let nodo in this.listaAdyacente) {
            if (nodo === inicioNodo) {
                distancias[nodo] = 0;
            } else {
                distancias[nodo] = Infinity;
            }
            previos[nodo] = null;
            cola.push(nodo);
        }

        while (cola.length > 0) {
            cola.sort((a, b) => distancias[a] - distancias[b]);
            const actual: string | number = cola.shift() as string;

            if (actual === finNodo) {
                const ruta: string[] = [];

                let nodo: string | null = finNodo;
                while (nodo !== null) {
                    ruta.unshift(nodo);
                    nodo = previos[nodo];
                }

                return {
                    ruta,
                    costo: distancias[finNodo]
                };
            }
            if (distancias[actual] === Infinity) {
                break;
            }

            for (let vecino in this.listaAdyacente) {
                const costo = distancias[actual] + this.listaAdyacente[actual][vecino];

                if (costo < distancias[vecino]) {
                    distancias[vecino] = costo;
                    previos[vecino] = actual;
                }

            }

        }
        return null;

    }
}