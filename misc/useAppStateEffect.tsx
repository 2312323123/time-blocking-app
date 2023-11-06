// purpose of this is to encapsulate logic of detecting whether the context has been lost and if so, call callback to recover it
import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export const useAppStateEffect = (callback, ...dependencies) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    callback();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        callback();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [callback, ...dependencies]);
};
