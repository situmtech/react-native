// Specify default types for useNavigation.

export type RootTabsParamsList = {
    Home: undefined,
    Wayfinding: {
        poiIdentifier: string,
        action: 'select' | 'navigate' 
    }
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootTabsParamsList {}
    }
}