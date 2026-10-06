export type SitumAuth = { type: "apiKey" | "jwt"; value: string; }

type Listener = (auth?: SitumAuth) => void;

let currentAuth: SitumAuth | undefined;
const listeners = new Set<Listener>();

export const authStore = {
  getAuth() {
    return currentAuth;
  },

  setAuth(auth: SitumAuth) {
    currentAuth = { ...auth };
    listeners.forEach((listener) => listener(currentAuth));
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    listener(currentAuth);

    return () => {
      listeners.delete(listener);
    };
  },
};