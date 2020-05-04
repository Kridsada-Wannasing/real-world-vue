import EventService from "@/services/EventService";

export const namespaced = true;

export const state = {
  todos: [
    { id: 1, text: "...", done: true },
    { id: 2, text: "...", done: false },
    { id: 3, text: "...", done: true },
    { id: 4, text: "...", done: false },
  ],
  events: [],
  eventsTotal: Number,
  event: {},
  perPage: 3,
};

export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event);
  },
  SET_EVENTS(state, events) {
    state.events = events;
  },
  COUNT_EVENTS(state, eventsTotal) {
    state.eventsTotal = eventsTotal;
  },
  SET_EVENT(state, event) {
    state.event = event;
  },
};

export const actions = {
  createEvent({ commit, dispatch }, event) {
    return EventService.postEvent(event)
      .then(() => {
        commit("ADD_EVENT", event);
        const notification = {
          type: "success",
          message: "Your event has been created!",
        };
        dispatch("notification/add", notification, { root: true });
      })
      .catch((error) => {
        const notification = {
          type: "error",
          message: "There was a problem creating your event: " + error.message,
        };
        dispatch("notification/add", notification, { root: true });
        throw error;
      });
  },
  fetchEvents({ commit, dispatch, state }, { page }) {
    return EventService.getEvents(state.perPage, page)
      .then((response) => {
        commit("SET_EVENTS", response.data);
        commit("COUNT_EVENTS", response.headers["x-total-count"]);
      })
      .catch((error) => {
        const notification = {
          type: "error",
          message: "There was a problem fetching events: " + error.message,
        };
        dispatch("notification/add", notification, { root: true });
      });
  },
  fetchEvent({ commit, getters, state }, id) {
    if (id == state.event.id) return state.event;

    var event = getters.getEventById(id);

    if (event) {
      commit("SET_EVENT", event);
      return event;
    } else {
      return EventService.getEvent(id).then((response) => {
        commit("SET_EVENT", response.data);
        return response.data;
      });
    }
  },
};

export const getters = {
  catLength: (state) => {
    return state.categories.length;
  },
  doneTodos: (state) => {
    return state.todos.filter((todo) => todo.done);
  },
  activeTodos: (state) => {
    return state.todos.filter((todo) => !todo.done).length;
  },
  getEventById: (state) => (id) => {
    return state.events.find((event) => event.id === id);
  },
};
