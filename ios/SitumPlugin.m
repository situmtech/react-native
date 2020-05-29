#import "SitumPlugin.h"
#import "SitumLocationWrapper.h"



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

RCT_EXPORT_METHOD(fetchGeofencesFromBuilding:(NSDictionary *)buildingJO)
{
    NSLog(@"fetchGeofencesFromBuilding");
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
