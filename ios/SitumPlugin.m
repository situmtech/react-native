#import "SitumPlugin.h"
#import "SitumLocationWrapper.h"



static NSString *ResultsKey = @"results";

static NSString *StartingAngle=@"startingAngle";
static NSString *Accessible=@"accessible";

static BOOL IS_LOG_ENABLED = NO;

static NSString *DEFAULT_SITUM_LOG = @"SitumSDK >>: ";

@interface SitumPluginRequest : NSObject

@property (nonatomic, copy) RCTResponseSenderBlock successBlock;
@property (nonatomic, copy) RCTResponseSenderBlock errorBlock;

@end

@implementation SitumPluginRequest

@end

@interface SitumPlugin() {}

@property (nonatomic, strong) SITRoute *computedRoute;

@end

@implementation SitumPlugin

RCT_EXPORT_MODULE(RNCSitumPlugin);

@synthesize computedRoute = _computedRoute;


RCT_EXPORT_METHOD(initSitumSDK)
{
    // only specific to Android at the moment
}

RCT_EXPORT_METHOD(setApiKey:(NSString *)email apiKey:(NSString *)apiKey withCallback:(RCTResponseSenderBlock)successBlock)
{
    BOOL success = [SITServices provideAPIKey:apiKey forEmail:email];
    
    NSDictionary *response = @{@"success":success ? @"true" : @"false"};
    successBlock(@[[NSNull null], response]);

    if (IS_LOG_ENABLED) {
        NSArray *allPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [allPaths objectAtIndex:0];
        NSString *pathForLog = [documentsDirectory stringByAppendingPathComponent:@"logging.txt"];
        freopen([pathForLog cStringUsingEncoding:NSASCIIStringEncoding],"a+",stderr);

        NSLog(@"%@", [NSString stringWithFormat: @"%@ Logging ios calls", DEFAULT_SITUM_LOG]);
    }
}

RCT_EXPORT_METHOD(setUserPass:(NSString *)email pass:(NSString *)pass withCallback:(RCTResponseSenderBlock)successBlock)
{
    NSLog(@"Email: %@, Password: %@", email, pass);
}

RCT_EXPORT_METHOD(setCacheMaxAge:(nonnull NSNumber *)cacheMaxAge withCallback:(RCTResponseSenderBlock)successBlock)
{
    NSLog(@"Cache Age: %ii", cacheMaxAge);
}

RCT_EXPORT_METHOD(fetchBuildings)
{
    NSLog(@"Fetch Buildings");
}

RCT_EXPORT_METHOD(fetchBuildingInfo:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchBuildingInfo");
}

RCT_EXPORT_METHOD(fetchGeofencesFromBuilding:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchGeofencesFromBuilding");
}

RCT_EXPORT_METHOD(fetchFloorsFromBuilding:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchFloorsFromBuilding");
}

RCT_EXPORT_METHOD(fetchPoiCategories:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchPoiCategories");
}

RCT_EXPORT_METHOD(fetchPoiCategoryIconNormal:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchPoiCategoryIconNormal");
}

RCT_EXPORT_METHOD(fetchPoiCategoryIconSelected:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchPoiCategoryIconSelected");
}

RCT_EXPORT_METHOD(fetchIndoorPOIsFromBuilding:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchIndoorPOIsFromBuilding");
}

RCT_EXPORT_METHOD(fetchOutdoorPOIsFromBuilding:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchOutdoorPOIsFromBuilding");
}

RCT_EXPORT_METHOD(fetchEventsFromBuilding:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchEventsFromBuilding");
}

RCT_EXPORT_METHOD(fetchMapFromFloor:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchMapFromFloor");
}

RCT_EXPORT_METHOD(startPositioning:(NSString *)locationCallbackId)
{
    NSLog(@"startPositioning");
}

RCT_EXPORT_METHOD(stopPositioning:(NSString *)locationCallbackId)
{
    NSLog(@"stopPositioning");
}

RCT_EXPORT_METHOD(requestDirections:(NSString *)routeCallbackId)
{
    NSLog(@"requestDirections");
}

RCT_EXPORT_METHOD(requestNavigationUpdates:(NSString *)navigationProgressCallbackId)
{
    NSLog(@"requestNavigationUpdates");
}

RCT_EXPORT_METHOD(updateNavigationWithLocation:(NSDictionary *)lastLocation)
{
    NSLog(@"updateNavigationWithLocation");
}

RCT_EXPORT_METHOD(removeNavigationUpdates)
{
    NSLog(@"removeNavigationUpdates");
}

RCT_EXPORT_METHOD(requestRealTimeUpdates:(NSDictionary *)realtimeRequest)
{
    NSLog(@"requestRealTimeUpdates");
}

RCT_EXPORT_METHOD(removeRealTimeUpdates)
{
    NSLog(@"removeRealTimeUpdates");
}

RCT_EXPORT_METHOD(invalidateCache)
{
    NSLog(@"invalidateCache");
}


@end
