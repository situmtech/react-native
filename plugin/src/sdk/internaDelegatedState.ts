import { Location, Error } from "./types";

// Internal state forwarded to the MapView as soon as possible.
export type DelegatedState = {
    location: Location | null;
    status: string | null;
    error: Error | null;
};
  
export class DelegatedStateManager {
  private static instance: DelegatedStateManager;
  private state: DelegatedState = {
    location: null,
    status: null,
    error: null,
  };

  private constructor() {}

  static getInstance(): DelegatedStateManager {
    if (!DelegatedStateManager.instance) {
      DelegatedStateManager.instance = new DelegatedStateManager();
    }
    return DelegatedStateManager.instance;
  }

  updateLocation(location: Location): void {
    this.state = {
      location,
      status: null,
      error: null,
    };
  }

  updateStatus(status: string): void {
    this.state = {
      location: null,
      status,
      error: null,
    };
  }

  updateError(error: Error): void {
    this.state = {
      location: null,
      status: null,
      error,
    };
  }

  getValues(): Readonly<DelegatedState> {
    return this.state;
  }
}