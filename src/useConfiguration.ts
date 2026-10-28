import { useReducer } from "react";
import { normaliseConfiguration } from "./configuration";
import type { Configuration } from "./configuration";
export type ConfigurationHistory = {
  past: Configuration[];
  present: Configuration;
  future: Configuration[];
};
export type ConfigurationAction =
  | { type: "change"; configuration: Configuration }
  | { type: "undo" }
  | { type: "redo" };
export function configurationReducer(
  state: ConfigurationHistory,
  action: ConfigurationAction,
): ConfigurationHistory {
  if (action.type === "undo") {
    if (!state.past.length) return state;
    return {
      past: state.past.slice(0, -1),
      present: state.past[state.past.length - 1],
      future: [state.present, ...state.future],
    };
  }
  if (action.type === "redo") {
    if (!state.future.length) return state;
    return {
      past: [...state.past, state.present],
      present: state.future[0],
      future: state.future.slice(1),
    };
  }
  const next = normaliseConfiguration(action.configuration);
  if (JSON.stringify(next) === JSON.stringify(state.present)) return state;
  return {
    past: [...state.past.slice(-79), state.present],
    present: next,
    future: [],
  };
}
export function useConfiguration(initial: Configuration) {
  const [state, dispatch] = useReducer(configurationReducer, initial, (c) => ({
    past: [],
    present: normaliseConfiguration(c),
    future: [],
  }));
  return {
    ...state,
    setConfig: (configuration: Configuration) =>
      dispatch({ type: "change", configuration }),
    undo: () => dispatch({ type: "undo" }),
    redo: () => dispatch({ type: "redo" }),
  };
}
