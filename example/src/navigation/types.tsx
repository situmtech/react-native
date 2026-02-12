// Specify default types for useNavigation.

export type RootTabsParamsList = {
  Home: undefined;
  Wayfinding: {
    elementIdentifier: string;
    action: "select" | "navigate" | "shareLiveLocation";
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabsParamsList {}
  }
}
