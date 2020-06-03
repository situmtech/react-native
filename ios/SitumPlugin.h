#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <SitumSDK/SitumSDK.h>

@interface SitumPlugin : RCTEventEmitter<SITDirectionsDelegate, SITLocationDelegate, SITNavigationDelegate, SITRealTimeDelegate> {
    NSMutableDictionary *buildingsStored;
    NSMutableDictionary *floorStored;
    NSMutableDictionary *eventStored;
    NSMutableDictionary *categoryStored;
    NSMutableDictionary<NSString *, SITPOI*> *poisStored;
    NSMutableDictionary *routesStored;
    
}

@end
