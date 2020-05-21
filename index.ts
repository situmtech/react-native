import NativeInterface from './src/nativeInterface';

class Situm {
  setApiKey(email: string, apiKey: string) {
    return NativeInterface.setApiKey(email, apiKey);
  }
}

// export default new Situm();
