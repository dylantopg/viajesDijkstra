<template>
  <div id="app">
    <h1 class="text-center">Mapa y viajes</h1>
    <a href="#">By Dylan Guerrero</a>
    <div class="d-flex flex-wrap align-content-center mx-2">
      <div class="card my-1" style="width: 20rem">
        <div class="card-body">
          <h5 class="card-tittle">Añada una ciudad</h5>
          <input v-model="newNode" placeholder="Nombre de la ciudad" />
          <button class="btn btn-primary" @click="addNode">Añadir!</button>
        </div>
      </div>

      <div class="card my-1" style="width: 20rem">
        <div class="card-body">
          <h5 class="card-tittle">Borre una ciudad</h5>
          <input v-model="deleteNodeName" placeholder="Nombre de la ciudad" />
          <button class="btn btn-danger" @click="deleteNode">Borrar!</button>
        </div>
      </div>

      <div class="card my-1" style="width: 20rem">
        <div class="card-body">
          <h5 class="card-tittle">Crear/Borrar ruta entre ciudades</h5>
          <input v-model="node1" placeholder="Ciudad origen" />
          <input v-model="node2" placeholder="Ciudad destino" />
          <input v-model="edgeCost" min="0" type="number" placeholder="Costo" />
          <br />
          <button class="btn btn-primary" @click="addEdge">Añadir</button>
          <button class="btn btn-danger" @click="deleteEdge">Borrar</button>
        </div>
      </div>

      <div class="card my-1" style="width: 20rem">
        <div class="card-body">
          <h5 class="card-tittle">Verificar si hay ruta entre ciudades</h5>
          <input v-model="routeNode1" placeholder="Ciudad origen" />
          <input v-model="routeNode2" placeholder="Ciudad destino" />
          <br />
          <button class="btn btn-success" @click="checkRoute">
            Verificar!
          </button>
          <p v-if="routeExists !== null">Ruta existe: {{ routeExists }}</p>
        </div>
      </div>

      <div class="card my-1" style="width: 20rem">
        <div class="card-body">
          <h5 class="card-tittle">Ver ciudades conectadas para:</h5>
          <input v-model="connectedNode" placeholder="Nombre de la ciudad" />
          <button class="btn btn-success" @click="getConnectedNodes">
            Consultar!
          </button>
          <p>Ciudades conectadas: {{ connectedNodes }}</p>
        </div>
      </div>

      <div class="card my-1" style="width: 20rem">
        <div class="card-body">
          <h5 class="card-tittle">Consulte todas las rutas del mapa:</h5>
          <button class="btn btn-success" @click="getAllRoutes">
            Ver todas las rutas
          </button>
          <ul>
            <li v-for="route in allRoutes" :key="route.nodo1 + '-' + route.nodo2">
              {{ route.nodo1 }} - {{ route.nodo2 }}: {{ route.costo }}
            </li>
          </ul>
        </div>
      </div>

      <div class="card my-1" style="width: 20rem">
        <div class="card-body">
          <h5 class="card-tittle">Iniciar viaje con busqueda Dijkstra:</h5>
          <input v-model="dijkstraStart" placeholder="Ciudad origen" />
          <input v-model="dijkstraEnd" placeholder="Ciudad destino" />
          <br />
          <button class="btn btn-primary" @click="runDijkstra">Correr!</button>
          <p v-if="dijkstraResult">
            Camino más corto: {{ dijkstraResult.ruta.join(" -> ") }} con costo:
            {{ dijkstraResult.costo }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Grafo } from "./logica.ts";

export default defineComponent({
  data() {
    return {
      grafo: new Grafo(),
      newNode: "",
      deleteNodeName: "",
      node1: "",
      node2: "",
      edgeCost: 0,
      routeNode1: "",
      routeNode2: "",
      routeExists: null as boolean | null,
      connectedNode: "",
      connectedNodes: [] as string[],
      allRoutes: [] as { nodo1: string; nodo2: string; costo: number }[],
      dijkstraStart: "",
      dijkstraEnd: "",
      dijkstraResult: null as { ruta: string[]; costo: number } | null,
    };
  },
  methods: {
    addNode() {
      try {
        this.grafo.addNodo(this.newNode);
        this.newNode = "";
      } catch (error: any) {
        alert(error.message);
      }
    },
    deleteNode() {
      try {
        this.grafo.deleteNodo(this.deleteNodeName);
        this.deleteNodeName = "";
      } catch (error: any) {
        alert(error.message);
      }
    },
    addEdge() {
      try {
        this.grafo.addArista(this.node1, this.node2, this.edgeCost);
        this.node1 = "";
        this.node2 = "";
        this.edgeCost = 0;
      } catch (error: any) {
        alert(error.message);
      }
    },
    deleteEdge() {
      try {
        this.grafo.deleteArista(this.node1, this.node2);
        this.node1 = "";
        this.node2 = "";
      } catch (error: any) {
        alert(error.message);
      }
    },
    checkRoute() {
      try {
        this.routeExists = this.grafo.hayRuta(this.routeNode1, this.routeNode2);
      } catch (error: any) {
        alert(error.message);
      }
    },
    getConnectedNodes() {
      try {
        this.connectedNodes = this.grafo.getNodosConectados(this.connectedNode);
      } catch (error: any) {
        alert(error.message);
      }
    },
    getAllRoutes() {
      this.allRoutes = this.grafo.getAllRutas();
    },
    runDijkstra() {
      try {
        this.dijkstraResult = this.grafo.metodoDijkstra(
          this.dijkstraStart,
          this.dijkstraEnd
        );
      } catch (error: any) {
        alert(error.message);
      }
    },
  },
});
</script>
