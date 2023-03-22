import { assign, createMachine } from 'xstate';
import { fetchCountries } from '../utils/api';

const fillCountries = {
  initial: "loading",
  states:{
    loading: {
      //consumo de servicios
      invoke: {
        id: 'getCountries',
        src: () => fetchCountries,
        onDone: {
          target: 'success',
          actions: assign({
            countries: (context, event) => event.data,
          })
        },
        onError:{
          target: 'failure',
          actions: assign({
            error: 'Fallo el request',
          })
        }
      }
    },
    success: {},
    failure:{
      on:{
        RETRY: {
          target: "loading"
        }
      }
    }
  }
}

const bookingMachine = createMachine({
  id: "Comprar tickets de vuelo",
  //estado inicial
  initial: "initial",
  //contexto
  context:{
    passengers:[],
    selectedCountry: '',
    countries: [],
    error: '',
  },
  //estados
  states: {
    initial: {
      //eventos que generan transiciones
      on: {
        START: {
          target: "search"
        },
      }
    },
    search: {
      on: {
        CONTINUE: {
          target: 'passengers',
          actions: assign({
            selectedCountry: (context, event) => event.selectedCountry
          })
        },
        CANCEL: "initial"
      },
      ...fillCountries,
    },
    passengers: {
      on: {
        DONE: {
          target: "tickets",
          cond: "moreThanOnePassenger"
        },
        CANCEL: {
          target: 'initial',
          actions: 'cleanContext',
        },
        ADD: {
          target: 'passengers',
          actions: assign(
            (context, event) => context.passengers.push(event.newPassenger)
          )
        }
      }
    },
    tickets: {
      after:{
        5000: {
          target: 'initial',
          actions: 'cleanContext',
        }
      },
      on: {
        FINISH: "initial"
      }
    }
  }
},
  {
    actions: {
      cleanContext: assign({
        selectedCountry: '',
        passengers: []
      })
    },
    guards:{
      moreThanOnePassenger: (context) => {
        return context.passengers.length > 0;
      }
    }
  }
);

export default bookingMachine;