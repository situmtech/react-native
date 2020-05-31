#import "SitumPlugin.h"
#import "SitumLocationWrapper.h"

#import <React/RCTAssert.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>

typedef NS_ENUM(NSInteger, RNCSitumAuthorizationLevel) {
    RNCSitumAuthorizationLevelDefault,
    RNCSitumAuthorizationLevelWhenInUse,
    RNCSitumAuthorizationLevelAlways,
};

typedef struct {
    BOOL skipPermissionRequests;
    RNCSitumAuthorizationLevel authorizationLevel;
} RNCSitumConfiguration;


@implementation RCTConvert (RNCSitumAuthorizationLevel)
RCT_ENUM_CONVERTER(RNCSitumAuthorizationLevel, (@{
    @"whenInUse": @(RNCSitumAuthorizationLevelWhenInUse),
    @"always": @(RNCSitumAuthorizationLevelAlways)}),
                   RNCSitumAuthorizationLevelDefault, integerValue)
@end

@implementation RCTConvert(RNCSitumConfiguration)

+ (RNCSitumConfiguration)RNCSitumConfiguration:(id)json
{
    NSDictionary<NSString *, id> *options = [RCTConvert NSDictionary:json];
    
    return (RNCSitumConfiguration) {
        .skipPermissionRequests = [RCTConvert BOOL:options[@"skipPermissionRequests"]],
        .authorizationLevel = [RCTConvert  RNCSitumAuthorizationLevel:options[@"authorizationLevel"]]
    };
}

@end

static NSString *ResultsKey = @"results";

static NSString *StartingAngle=@"startingAngle";
static NSString *Accessible=@"accessible";

static BOOL IS_LOG_ENABLED = NO;


static NSString *DEFAULT_SITUM_LOG = @"SitumSDK >>: ";

//@interface SitumPluginRequest : NSObject
//
//@property (nonatomic, copy) RCTResponseSenderBlock successBlock;
//@property (nonatomic, copy) RCTResponseSenderBlock errorBlock;
//
//@end
//
//@implementation SitumPluginRequest
//
//@end


@interface RNCSitumRequest : NSObject

@property (nonatomic, copy) RCTResponseSenderBlock successBlock;
@property (nonatomic, copy) RCTResponseSenderBlock errorBlock;

@end

@implementation RNCSitumRequest

@end

@interface SitumPlugin() {}

@property (nonatomic, strong) SITRoute *computedRoute;

@end

@implementation SitumPlugin

BOOL _positioningUpdates, _navigationUpdates;
CLLocationManager *_locationManager;
RNCSitumConfiguration _locationConfiguration;
RNCSitumRequest *routeRequest;

RCT_EXPORT_MODULE(RNCSitumPlugin);

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"locationChanged", @"statusChanged", @"locationError", @"navigationUpdated", @"navigationError"];
}

@synthesize computedRoute = _computedRoute;


RCT_EXPORT_METHOD(initSitumSDK)
{
    // only specific to Android at the moment
}

RCT_EXPORT_METHOD(setApiKey:(NSString *)email apiKey:(NSString *)apiKey withCallback:(RCTResponseSenderBlock)callback)
{
    BOOL success = [SITServices provideAPIKey:apiKey forEmail:email];
    
    NSDictionary *response = @{@"success":success ? @"true" : @"false"};
    if(callback)
        callback(@[response]);
    
    if (IS_LOG_ENABLED) {
        NSArray *allPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [allPaths objectAtIndex:0];
        NSString *pathForLog = [documentsDirectory stringByAppendingPathComponent:@"logging.txt"];
        freopen([pathForLog cStringUsingEncoding:NSASCIIStringEncoding],"a+",stderr);
        
        NSLog(@"%@", [NSString stringWithFormat: @"%@ Logging ios calls", DEFAULT_SITUM_LOG]);
    }
}

RCT_EXPORT_METHOD(setUserPass:(NSString *)email pass:(NSString *)pass withCallback:(RCTResponseSenderBlock)callback)
{
    BOOL success =[SITServices provideUser:email password:pass];
    
    NSDictionary *response = @{@"success":success ? @"true" : @"false"};
    if(callback)
        callback(@[response]);
}

RCT_EXPORT_METHOD(setCacheMaxAge:(nonnull NSNumber *)cacheMaxAge withCallback:(RCTResponseSenderBlock)callback)
{
    [[SITCommunicationManager sharedManager] setCacheMaxAge:[cacheMaxAge integerValue]];
    NSString *operation = [NSString stringWithFormat:@"Setting cache max age to :%@ seconds", cacheMaxAge];
    
    if (IS_LOG_ENABLED) {
        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ ", DEFAULT_SITUM_LOG, operation]);
        NSLog(@"%@", [NSString stringWithFormat: @"%@ Cache max age is %ld seconds", DEFAULT_SITUM_LOG, (long)[[SITCommunicationManager sharedManager] cacheMaxAge]]);
    }
    
    // return operation, because iOS SDK doesn't return a boolean value when setting max cache
    NSDictionary *response = @{@"success": operation};
    if(callback)
        callback(@[response]);
}

RCT_EXPORT_METHOD(fetchBuildings: (RCTResponseSenderBlock)successBlock errorCallback:(RCTResponseSenderBlock)errorBlock)
{
    if (buildingsStored == nil) {
        buildingsStored = [[NSMutableDictionary alloc] init];
    }
    
    NSString *operation = @"Fetching buildings request";
    if (IS_LOG_ENABLED) {
        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ ", DEFAULT_SITUM_LOG, operation]);
    }
    
    // Forcing requests to go to the network instead of cache
    NSDictionary *options = @{@"forceRequest":@YES,};
    
    [[SITCommunicationManager sharedManager] fetchBuildingsWithOptions:options success:^(NSDictionary *mapping) {
        if (IS_LOG_ENABLED) {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ Fetching buildings returned values", DEFAULT_SITUM_LOG, operation]);
        }
        NSArray *buildings = [mapping valueForKey:ResultsKey];
        
        if (buildings.count == 0) {
            if (IS_LOG_ENABLED) {
                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ No buildings were retrieved", DEFAULT_SITUM_LOG, operation]);
            }
            if(errorBlock)
                errorBlock(@[@"There are no buildings on the account. Please go to dashboard http://dashboard.situm.es and learn more about the first step with Situm technology"]);
        }
        else {
            NSMutableArray *ja = [[NSMutableArray alloc] init];
            for (SITBuilding *obj in buildings) {
                [ja addObject:[SitumLocationWrapper.shared buildingToJsonObject:obj]];
                [buildingsStored setObject:obj forKey:[NSString stringWithFormat:@"%@", obj.identifier]];
            }
            if (IS_LOG_ENABLED) {
                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ Retrieved the following buildings: %@", DEFAULT_SITUM_LOG, operation, buildings]);
            }
            successBlock(@[ja.copy]);
        }
    }
                                                               failure:^(NSError *error) {
        if (IS_LOG_ENABLED)
        {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ Error retrieving buildings: %@", DEFAULT_SITUM_LOG, operation, error]);
        }
        if(errorBlock)
            errorBlock(@[error.description]);
    }];
}

RCT_EXPORT_METHOD(fetchBuildingInfo:(NSDictionary *)buildingJO withSuccessCallback:(RCTResponseSenderBlock)successBlock errorCallback:(RCTResponseSenderBlock)errorBlock)
{
    
    NSString *operation = @"Fetching building info request";
    if (IS_LOG_ENABLED) {
        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ with parameters: %@", DEFAULT_SITUM_LOG, operation, buildingJO]);
    }
    
    NSString *buildingId = [buildingJO valueForKey:@"identifier"];
    
    
    [[SITCommunicationManager sharedManager] fetchBuildingInfo:buildingId withOptions:nil success:^(NSDictionary * _Nullable mapping) {
        if (IS_LOG_ENABLED) {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ Fetching buildings returned values", DEFAULT_SITUM_LOG, operation]);
        }
        
        // Parse and convert to json
        NSDictionary *buildingInfoJson = [SitumLocationWrapper.shared buildingInfoToJsonObject:mapping[@"results"]];
        
        // Send result outsidecon e
        if (IS_LOG_ENABLED) {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ retrieved building info: %@ of building: %@", DEFAULT_SITUM_LOG, operation, buildingInfoJson, buildingJO]);
        }
        
        successBlock(@[buildingInfoJson.copy]);
        
    } failure:^(NSError * _Nullable error) {
        if (IS_LOG_ENABLED) {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ error : %@ retrieving building info on building: %@", DEFAULT_SITUM_LOG, operation, error, buildingId]);
        }
        if(errorBlock)
            errorBlock(@[error.description]);
    }];
}

RCT_EXPORT_METHOD(fetchFloorsFromBuilding:(NSDictionary *)buildingJO withSuccessCallback:(RCTResponseSenderBlock)successBlock errorCallback:(RCTResponseSenderBlock)errorBlock)
{
    
    NSString *operation = @"Fetching floors request";
    if (IS_LOG_ENABLED) {
        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ with parameters: %@", DEFAULT_SITUM_LOG, operation, buildingJO]);
    }
    
    if (floorStored == nil) {
        floorStored = [[NSMutableDictionary alloc] init];
    }
    
    NSString *buildingId = [buildingJO valueForKey:@"identifier"];
    __block BOOL success;
    [[SITCommunicationManager sharedManager] fetchFloorsForBuilding:buildingId withOptions:nil success:^(NSDictionary *mapping) {
        
        if (IS_LOG_ENABLED) {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ responded", DEFAULT_SITUM_LOG, operation]);
        }
        
        NSMutableArray *ja = [[NSMutableArray alloc] init];
        NSArray *floors = [mapping objectForKey:@"results"];
        if (IS_LOG_ENABLED) {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ results: %@", DEFAULT_SITUM_LOG, operation, floors]);
        }
        for (SITFloor *obj in floors) {
            NSDictionary *floorJson = [SitumLocationWrapper.shared floorToJsonObject:obj];
            if (IS_LOG_ENABLED) {
                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ parsed floor: %@", DEFAULT_SITUM_LOG, operation, floorJson]);
            }
            [ja addObject:floorJson];
            if (IS_LOG_ENABLED) {
                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ json array has : %@", DEFAULT_SITUM_LOG, operation, ja]);
            }
            [floorStored setObject:obj forKey:[NSString stringWithFormat:@"%@", obj.identifier]];
            if (IS_LOG_ENABLED) {
                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ added: %@ to dictionary results", DEFAULT_SITUM_LOG, operation, obj]);
            }
        }
        if (floors.count == 0) {
            if (IS_LOG_ENABLED) {
                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ no floors on building: %@", DEFAULT_SITUM_LOG, operation, buildingJO]);
            }
            if(errorBlock)
                errorBlock(@[@"The selected building does not have floors. Correct that on http://dashboard.situm.es"]);
        } else {
            if (IS_LOG_ENABLED) {
                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ retrieved floors: %@ on building: %@", DEFAULT_SITUM_LOG, operation, floors, buildingJO]);
            }
            if(!success){
                successBlock(@[ja.copy]);
                success = YES;
            }
        }
    } failure:^(NSError *error) {
        if (IS_LOG_ENABLED) {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ error : %@ retrieving floors on building: %@", DEFAULT_SITUM_LOG, operation, error, buildingJO]);
        }
        if(errorBlock)
            errorBlock(@[error.description]);
    }];
}

RCT_EXPORT_METHOD(fetchMapFromFloor:(NSDictionary *)floorJO withSuccessCallback:(RCTResponseSenderBlock)successBlock errorCallback:(RCTResponseSenderBlock)errorBlock)
{
    
    if (floorStored == nil) {
        floorStored = [[NSMutableDictionary alloc] init];
    }
    SITFloor* floor = [SitumLocationWrapper.shared jsonObjectToFloor:floorJO];
    
    [[SITCommunicationManager sharedManager] fetchMapFromFloor: floor withCompletion:^(NSData *imageData) {
        NSMutableDictionary *jaMap = [[NSMutableDictionary alloc] init];
        NSString *imageBase64Encoded = [imageData base64EncodedStringWithOptions:0];
        successBlock(@[imageBase64Encoded]);
    }];
}

RCT_EXPORT_METHOD(startPositioning:(NSDictionary *)request)
{
    SITLocationRequest *locationRequest = [SitumLocationWrapper.shared dictToLocationRequest:request];
    
    _positioningUpdates = YES;
    [[SITLocationManager sharedInstance] requestLocationUpdates:locationRequest];
    [[SITLocationManager sharedInstance] setDelegate:self];
    
    
}

RCT_EXPORT_METHOD(stopPositioning:(RCTResponseSenderBlock)callback)
{
    _positioningUpdates = NO;
    [[SITLocationManager sharedInstance] removeUpdates];
    
}

RCT_EXPORT_METHOD(requestDirections: (NSArray *)requestArray withSuccessCallback:(RCTResponseSenderBlock)successBlock errorCallback:(RCTResponseSenderBlock)errorBlock)
{
    
    if (routesStored == nil) {
        routesStored = [[NSMutableDictionary alloc] init];
    }
    
    SITDirectionsRequest* directionsRequest = [SitumLocationWrapper.shared jsonObjectToDirectionsRequest:requestArray];
    
    
    if (directionsRequest == nil) {
        errorBlock(@[@"Unable to parse request"]);
        return;
    }
    if (IS_LOG_ENABLED) {
        NSLog(@"Start point properties: %@, cartesian coordinate:: x: %f, y: %f, ", directionsRequest.origin, directionsRequest.origin.cartesianCoordinate.x, directionsRequest.origin.cartesianCoordinate.y);
        
        NSLog(@"End point properties: %@, cartesian coordinate:: x: %f, y: %f, ", directionsRequest.destination, directionsRequest.destination.cartesianCoordinate.x, directionsRequest.destination.cartesianCoordinate.y);
    }
    
    routeRequest = [RNCSitumRequest new];
    routeRequest.successBlock = successBlock;
    routeRequest.errorBlock = errorBlock;
    
    [SITDirectionsManager sharedInstance].delegate = self;
    [[SITDirectionsManager sharedInstance] requestDirections:directionsRequest];
    
}

RCT_EXPORT_METHOD(fetchGeofencesFromBuilding:(NSDictionary *)buildingJO withSuccessCallback:(RCTResponseSenderBlock)successBlock errorCallback:(RCTResponseSenderBlock)errorBlock)
{
    NSString *operation = @"Fetching geofences request";
    if (IS_LOG_ENABLED) {
        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ with parameters: %@", DEFAULT_SITUM_LOG, operation, buildingJO]);
    }
    
    NSString *buildingId = [buildingJO valueForKey:@"identifier"];
    SITBuilding *building = [[SITBuilding alloc]init];
    building.identifier = buildingId;
    
    [[SITCommunicationManager sharedManager] fetchGeofencesFromBuilding:building
                                                            withOptions:nil
                                                         withCompletion:^(id  _Nullable array, NSError * _Nullable error) {
        if (error) {
            if (IS_LOG_ENABLED) {
                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ error : %@ retrieving geofences on building: %@", DEFAULT_SITUM_LOG, operation, error, buildingJO]);
            }
            if(errorBlock){
                errorBlock(@[error.description]);
            }
            
            return;
        }
        
        // A success has been returned
        if (IS_LOG_ENABLED) {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ responded", DEFAULT_SITUM_LOG, operation]);
        }
        
        NSMutableArray *ja = [[NSMutableArray alloc] init];
        if (IS_LOG_ENABLED) {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ results: %@", DEFAULT_SITUM_LOG, operation, array]);
        }
        for (SITGeofence *obj in array) {
            NSDictionary *jsonObject = [SitumLocationWrapper.shared geofenceToJsonObject:obj];
            if (IS_LOG_ENABLED) {
                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ parsed floor: %@", DEFAULT_SITUM_LOG, operation, jsonObject]);
            }
            [ja addObject:jsonObject];
            if (IS_LOG_ENABLED) {
                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ json array has : %@", DEFAULT_SITUM_LOG, operation, ja]);
            }
        }
        
        if (IS_LOG_ENABLED) {
            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ retrieved geofences: %@ on building: %@", DEFAULT_SITUM_LOG, operation, array, buildingJO]);
        }
        //successBlock(@[ja.copy]);
    }];
}

RCT_EXPORT_METHOD(fetchPoiCategories:(RCTResponseSenderBlock)successBlock errorCallback:(RCTResponseSenderBlock)errorBlock)
{
    if (categoryStored == nil) {
        categoryStored = [[NSMutableDictionary alloc] init];
    }
    
    [[SITCommunicationManager sharedManager] fetchCategoriesWithOptions:nil withCompletion:^(NSArray *categories, NSError *error) {
        if (!error) {
            NSMutableArray *ja = [[NSMutableArray alloc] init];
            for (SITPOICategory *obj in categories) {
                [ja addObject:[SitumLocationWrapper.shared poiCategoryToJsonObject:obj]];
                [categoryStored setObject:obj forKey:[NSString stringWithFormat:@"%@", obj.name]];
            }
            if (categories.count == 0) {
                if(errorBlock)
                    errorBlock(@[@"You have no categories"]);
            } else {
                successBlock(@[ja.copy]);
            }
        } else {
            if(errorBlock)
                errorBlock(@[error.description]);
        }
    }];
}

RCT_EXPORT_METHOD(fetchPoiCategoryIconNormal:(NSDictionary *)categoryJO withSuccessCallback:(RCTResponseSenderBlock)successBlock errorCallback:(RCTResponseSenderBlock)errorBlock)
{
    
    if (categoryStored == nil) {
        categoryStored = [[NSMutableDictionary alloc] init];
    }
    
    SITPOICategory *category = [[SitumLocationWrapper shared] poiCategoryFromJsonObject:categoryJO];
    
    [[SITCommunicationManager sharedManager] fetchSelected:false iconForCategory:category withCompletion:^(NSData *data, NSError *error) {
        if (!error) {
            if (data == nil) {
                if(errorBlock){
                    errorBlock(@[@"Icon not found"]);
                }
            } else {
                UIImage *icon = [UIImage imageWithData:data];
                NSDictionary * dict = [[SitumLocationWrapper shared] bitmapToJsonObject:icon];
                successBlock(@[dict]);
            }
        } else {
            if(errorBlock){
                errorBlock(@[error.description]);
            }
        }
    }];
}

RCT_EXPORT_METHOD(fetchPoiCategoryIconSelected:(NSDictionary *)categoryJO withSuccessCallback:(RCTResponseSenderBlock)successBlock errorCallback:(RCTResponseSenderBlock)errorBlock)
{
    if (categoryStored == nil) {
        categoryStored = [[NSMutableDictionary alloc] init];
    }
    
    SITPOICategory *category = [[SitumLocationWrapper shared] poiCategoryFromJsonObject:categoryJO];
    
    [[SITCommunicationManager sharedManager] fetchSelected:true iconForCategory:category withCompletion:^(NSData *data, NSError *error) {
        if (!error) {
            if (data == nil) {
                if(errorBlock){
                    errorBlock(@[@"Icon not found"]);
                }
            } else {
                UIImage *icon = [UIImage imageWithData:data];
                NSDictionary * dict = [[SitumLocationWrapper shared] bitmapToJsonObject:icon];
                successBlock(@[dict]);
            }
        } else {
            if(errorBlock){
                errorBlock(@[error.description]);
            }
        }
    }];
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

RCT_EXPORT_METHOD(requestNavigationUpdates:(NSDictionary *)options)
{
    NSNumber* distanceToChangeFloorThreshold;
    NSNumber* distanceToChangeIndicationThreshold;
    NSNumber* distanceToGoalThreshold;
    NSNumber* outsideRouteThreshold;
    NSNumber* indicationsInterval;
    NSNumber* timeToFirstIndication;
    NSNumber* roundIndicationsStep;
    NSNumber* timeToIgnoreUnexpectedFloorChanges;
    
    // Processing configuration parameters
    distanceToChangeFloorThreshold = (NSNumber*)[options objectForKey:@"distanceToFloorChangeThreshold"];
    distanceToChangeIndicationThreshold = (NSNumber*)[options objectForKey:@"distanceToChangeIndicationThreshold"];
    distanceToGoalThreshold = (NSNumber*)[options objectForKey:@"distanceToGoalThreshold"];
    outsideRouteThreshold = (NSNumber*)[options objectForKey:@"outsideRouteThreshold"];
    indicationsInterval = (NSNumber*)[options objectForKey:@"indicationsInterval"];
    timeToFirstIndication = (NSNumber*)[options objectForKey:@"timeToFirstIndication"];
    roundIndicationsStep = (NSNumber*)[options objectForKey:@"roundIndicationsStep"];
    timeToIgnoreUnexpectedFloorChanges = (NSNumber*)[options objectForKey:@"timeToIgnoreUnexpectedFloorChanges"];
    
    SITRoute *routeObj = self.computedRoute;
    if (routeObj) {
        SITNavigationRequest *navigationRequest = [[SITNavigationRequest alloc] initWithRoute:routeObj];
        if (distanceToChangeIndicationThreshold != nil) {
            NSInteger value = [distanceToChangeIndicationThreshold integerValue];
            [navigationRequest setDistanceToChangeIndicationThreshold: value];
            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.distanceToChangeIndicationThreshold: %ld", navigationRequest.distanceToChangeIndicationThreshold]);
        }
        if (distanceToChangeFloorThreshold != nil) {
            NSInteger value = [distanceToChangeFloorThreshold integerValue];
            [navigationRequest setDistanceToChangeFloorThreshold: value];
            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.distanceToChangeFloorThreshold: %ld", navigationRequest.distanceToFloorChangeThreshold]);
        }
        if (distanceToGoalThreshold != nil) {
            NSInteger value = [distanceToGoalThreshold integerValue];
            [navigationRequest setDistanceToGoalThreshold: value];
            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.distanceToGoalThreshold: %ld", navigationRequest.distanceToGoalThreshold]);
        }
        if (outsideRouteThreshold != nil) {
            NSInteger value = [outsideRouteThreshold integerValue];
            [navigationRequest setOutsideRouteThreshold: value];
            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.outsideRouteThreshold: %ld", navigationRequest.outsideRouteThreshold]);
        }
        if (indicationsInterval != nil) {
            NSInteger value = [indicationsInterval integerValue];
            [navigationRequest setIndicationsInterval: value];
            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.indicationsInterval: %ld", navigationRequest.indicationsInterval]);
        }
        if (timeToFirstIndication != nil) {
            NSInteger value = [timeToFirstIndication integerValue];
            [navigationRequest setTimeToFirstIndication: value];
            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.timeToFirstIndication: %ld", navigationRequest.timeToFirstIndication]);
        }
        if (roundIndicationsStep != nil) {
            NSInteger value = [roundIndicationsStep integerValue];
            [navigationRequest setRoundIndicationsStep: value];
            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.roundIndicationsStep: %ld", navigationRequest.roundIndicationsStep]);
        }
        if (timeToIgnoreUnexpectedFloorChanges != nil) {
            NSInteger value = [timeToIgnoreUnexpectedFloorChanges integerValue];
            [navigationRequest setTimeToIgnoreUnexpectedFloorChanges: value];
            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.timeToIgnoreUnexpectedFloorChanges: %ld", navigationRequest.timeToIgnoreUnexpectedFloorChanges]);
        }
        
        _navigationUpdates = YES;
        [[SITNavigationManager sharedManager]  setDelegate:self]; // Configure delegation first
        [[SITNavigationManager sharedManager] requestNavigationUpdates:navigationRequest];
        
        
    }
}

RCT_EXPORT_METHOD(updateNavigationWithLocation:(NSDictionary *)location  withSuccessCallback:(RCTResponseSenderBlock)successBlock errorCallback:(RCTResponseSenderBlock)errorBlock)
{
    @try {
        [[SITNavigationManager sharedManager] updateWithLocation:location];
        
        successBlock(@[@"Navigation updated"]);
    }
    @catch (NSException *exception) {
        if(errorBlock){
            errorBlock(@[exception.reason]);
        }
    }
}

RCT_EXPORT_METHOD(removeNavigationUpdates:(RCTResponseSenderBlock)callbackBlock)
{
    _navigationUpdates = NO;
    [[SITNavigationManager sharedManager] removeUpdates];
}

RCT_EXPORT_METHOD(requestRealTimeUpdates:(NSDictionary *)realtimeRequest)
{
    NSLog(@"requestRealTimeUpdates");
}

RCT_EXPORT_METHOD(removeRealTimeUpdates)
{
    NSLog(@"removeRealTimeUpdates");
}

RCT_EXPORT_METHOD(invalidateCache:(RCTResponseSenderBlock)callback)
{
    NSMutableDictionary *obj = [[NSMutableDictionary alloc] init];
    [[SITCommunicationManager sharedManager] clearCache];
    callback(@[obj.copy]);
    
}

RCT_EXPORT_METHOD(requestAuthorization){
    if (!_locationManager) {
        _locationManager = [CLLocationManager new];
        _locationManager.delegate = self;
    }
    BOOL wantsAlways = NO;
    BOOL wantsWhenInUse = NO;
    if (_locationConfiguration.authorizationLevel == RNCSitumAuthorizationLevelDefault) {
        if ([[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationAlwaysUsageDescription"] &&
            [_locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
            wantsAlways = YES;
        } else if ([[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationWhenInUseUsageDescription"] &&
                   [_locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
            wantsWhenInUse = YES;
        }
    } else if (_locationConfiguration.authorizationLevel == RNCSitumAuthorizationLevelAlways) {
        wantsAlways = YES;
    } else if (_locationConfiguration.authorizationLevel == RNCSitumAuthorizationLevelWhenInUse) {
        wantsWhenInUse = YES;
    }
    
    // Request location access permission
    if (wantsAlways) {
        [_locationManager requestAlwaysAuthorization];
        
        // On iOS 9+ we also need to enable background updates
        NSArray *backgroundModes  = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIBackgroundModes"];
        if (backgroundModes && [backgroundModes containsObject:@"location"]) {
            if ([_locationManager respondsToSelector:@selector(setAllowsBackgroundLocationUpdates:)]) {
                [_locationManager setAllowsBackgroundLocationUpdates:YES];
            }
        }
    } else if (wantsWhenInUse) {
        [_locationManager requestWhenInUseAuthorization];
    }
}
// SITLocationDelegate methods

- (void)locationManager:(nonnull id<SITLocationInterface>)locationManager
      didUpdateLocation:(nonnull SITLocation *)location {
    if (location) {
        NSDictionary *locationJO = [SitumLocationWrapper.shared locationToJsonObject:location];
        
        if (_positioningUpdates) {
            [self sendEventWithName:@"locationChanged" body:locationJO];
        }
    }
}

- (void)locationManager:(nonnull id<SITLocationInterface>)locationManager
       didFailWithError: (NSError * _Nullable)error {
    
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    [dict setObject:error.description forKey:@"message"];
    
    if (_positioningUpdates) {
        [self sendEventWithName:@"locationError" body:error.description];
    }
}

- (void)locationManager:(nonnull id<SITLocationInterface>)locationManager
         didUpdateState:(SITLocationState)state {
    
    NSDictionary *locationChanged = [SitumLocationWrapper.shared locationStateToJsonObject:state];
    if (_positioningUpdates) {
        [self sendEventWithName:@"statusChanged" body:locationChanged.copy];
    }
}

// SITDirectionsDelegate

- (void)directionsManager:(id<SITDirectionsInterface>)manager
 didFailProcessingRequest:(SITDirectionsRequest *)request
                withError:(NSError *)error {
    
    self.computedRoute = nil; // if something fails then the previous computedRoute is clean
    
    //    if(directionRequest.errorBlock){
    routeRequest.errorBlock(@[error.description]);
    //    }
}

- (void)directionsManager:(id<SITDirectionsInterface>)manager
        didProcessRequest:(SITDirectionsRequest *)request
             withResponse:(SITRoute *)route {
    
    NSString * timestamp = [NSString stringWithFormat:@"%f",[[NSDate date] timeIntervalSince1970] * 1000];
    
    NSMutableDictionary *routeJO = [[SitumLocationWrapper.shared routeToJsonObject:route] mutableCopy];
    [routesStored setObject:route forKey:timestamp];
    
    self.computedRoute = route; // We store the computed route in order to insert it into the navigation component if neccessary
    
    routeRequest.successBlock(@[routeJO.copy]);
}

// SITNavigationDelegate


- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
         didFailWithError:(NSError *)error {
    if (_navigationUpdates) {
        [self sendEventWithName:@"navigationError" body:error.description];
    }
}

- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
        didUpdateProgress:(SITNavigationProgress *)progress
                  onRoute:(SITRoute *)route {
    NSMutableDictionary *navigationJO = [NSMutableDictionary dictionaryWithDictionary:[SitumLocationWrapper.shared navigationProgressToJsonObject:progress]];
    [navigationJO setValue:@"progress" forKey:@"type"];
    
    if (_navigationUpdates) {
        [self sendEventWithName:@"navigationUpdates" body:navigationJO.copy];
    }
}

- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
destinationReachedOnRoute:(SITRoute *)route {
    NSMutableDictionary *navigationJO = [[NSMutableDictionary alloc] init];
    [navigationJO setValue:@"destinationReached" forKey:@"type"];
    [navigationJO setValue:@"Destination reached" forKey:@"message"];
    
    if (_navigationUpdates) {
        [self sendEventWithName:@"navigationUpdates" body:navigationJO.copy];
    }
}


- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
         userOutsideRoute:(SITRoute *)route {
    NSMutableDictionary *navigationJO = [[NSMutableDictionary alloc] init];
    [navigationJO setValue:@"userOutsideRoute" forKey:@"type"];
    [navigationJO setValue:@"User outside route" forKey:@"message"];
    
    if (_navigationUpdates) {
        [self sendEventWithName:@"navigationUpdates" body:navigationJO.copy];
    }
}


@end
