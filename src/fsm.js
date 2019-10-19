class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
      if (!config) {
        throw new Error("Config is empty");
      }
  
      const { initial, states } = config;
  
      this.initalState = initial;
      this.states = states;
  
      this.currentState = this.initalState;
      this.history = [this.initalState];
      this.currentHistoryIndex = 0;
    }
  
    updateState(state, skipIndex = false) {
      if (this.currentState === state) {
        return;
      }
  
      this.currentState = state;
      this.history.push(this.currentState);
  
      if (skipIndex) {
        return;
      }
  
      this.currentHistoryIndex = this.history.length - 1;
    }
  
    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this.currentState;
    }
  
    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
      if (!this.states[state]) {
        throw new Error("This state not found");
      }
  
      this.updateState(state);
    }
  
    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
      const { transitions } = this.states[this.currentState];
      const state = transitions[event];
      if (!state) {
        throw new Error("Transition event not found");
      }
  
      this.updateState(state);
    }
  
    /**
     * Resets FSM state to initial.
     */
    reset() {
      this.currentState = this.initalState;
      this.clearHistory();
    }
  
    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
      if (!event) {
        return Object.keys(this.states);
      }
  
      const eventStates = Object.keys(this.states).filter(
        state => !!this.states[state].transitions[event]
      );
  
      return eventStates;
    }
  
    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      if (!this.currentHistoryIndex) {
        return false;
      }
  
      const state = this.history[this.currentHistoryIndex - 1];
      this.updateState(state, true);
      this.currentHistoryIndex--;
  
      return true;
    }
  
    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if (this.currentHistoryIndex === this.history.length - 1) {
        return false;
      }
  
      const state = this.history[this.currentHistoryIndex + 1];
      if (this.currentState !== state) {
        this.currentState = state;
        this.currentHistoryIndex++;
      }
  
      return true;
    }
  
    /**
     * Clears transition history
     */
    clearHistory() {
      this.history = [this.initalState];
      this.currentHistoryIndex = 0;
    }
  }
  
  module.exports = FSM;
  
  /** @Created by Uladzimir Halushka **/
  