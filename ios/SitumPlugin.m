#import "SitumPlugin.h"
#import "SitumLocationWrapper.h"



static NSString *ResultsKey = @"results";

static NSString *StartingAngle=@"startingAngle";
static NSString *Accessible=@"accessible";

static BOOL IS_LOG_ENABLED = NO;

static NSString *DEFAULT_SITUM_LOG = @"SitumSDK >>: ";

@interface SitumPlugin() {}
        
@property (nonatomic, strong) SITRoute *computedRoute;

@end

@implementation SitumPlugin

RCT_EXPORT_MODULE();

@synthesize computedRoute = _computedRoute;


/**
* Set API Key & Email to authenticate use  to SitumSDK
* @author Noman Rafique
* @param email: user email address
* @param apiKey: generated API key from Situm Dashboard > Account
* @return A newly created message instance
*/
RCT_EXPORT_METHOD(setApiKey:(NSString *)email location:(NSString *)apiKey)
{
  NSLog(@"%@", [NSString stringWithFormat:@"Email: %@", email]);
//  [SITServices provideAPIKey:apiKey forEmail:email];
//
//  if (IS_LOG_ENABLED) {
//      NSArray *allPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
//      NSString *documentsDirectory = [allPaths objectAtIndex:0];
//      NSString *pathForLog = [documentsDirectory stringByAppendingPathComponent:@"logging.txt"];
//      freopen([pathForLog cStringUsingEncoding:NSASCIIStringEncoding],"a+",stderr);
//
//      NSLog(@"%@", [NSString stringWithFormat: @"%@ Logging ios calls", DEFAULT_SITUM_LOG]);
//  }

}


//- (void)setUserPass:(CDVInvokedUrlCommand *)command {
//    NSString* email = [command.arguments objectAtIndex:0];
//    NSString* password = [command.arguments objectAtIndex:1];
//    [SITServices provideUser:email password:password];
//}
//
//- (void)setCacheMaxAge:(CDVInvokedUrlCommand *)command {
//    NSNumber* cacheMaxAge = [command.arguments objectAtIndex:0]; // on iOS this value 
//    [[SITCommunicationManager sharedManager] setCacheMaxAge:[cacheMaxAge integerValue]]; 
//    NSString *operation = [NSString stringWithFormat:@"Setting cache max age to :%@ seconds", cacheMaxAge];
//
//    if (IS_LOG_ENABLED) {
//        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ ", DEFAULT_SITUM_LOG, operation]);
//        NSLog(@"%@", [NSString stringWithFormat: @"%@ Cache max age is %ld seconds", DEFAULT_SITUM_LOG, (long)[[SITCommunicationManager sharedManager] cacheMaxAge]]);
//    }
//}
//
//- (void)fetchBuildingInfo:(CDVInvokedUrlCommand *)command
//{
//    // TODO:
//    // Retrieve the buildingIdentifier
//    NSDictionary* buildingJO = (NSDictionary*)[command.arguments objectAtIndex:0];
//    
//    NSString *operation = @"Fetching building info request";
//    if (IS_LOG_ENABLED) {
//        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ with parameters: %@", DEFAULT_SITUM_LOG, operation, buildingJO]);
//    }
//    
//    NSString *buildingId = [buildingJO valueForKey:@"identifier"];
//    
//    [[SITCommunicationManager sharedManager] fetchBuildingInfo:buildingId withOptions:nil success:^(NSDictionary * _Nullable mapping) {
//        if (IS_LOG_ENABLED) {
//            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ Fetching buildings returned values", DEFAULT_SITUM_LOG, operation]);
//        }
//        
//        // Parse and convert to json
//        NSDictionary *buildingInfoJson = [SitumLocationWrapper.shared buildingInfoToJsonObject:mapping[@"results"]];
//        
//        // Send result outsidecon e
//        if (IS_LOG_ENABLED) {
//            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ retrieved building info: %@ of building: %@", DEFAULT_SITUM_LOG, operation, buildingInfoJson, buildingJO]);
//        }
//        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:buildingInfoJson.copy];
//        // }
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//        
//    } failure:^(NSError * _Nullable error) {
//        if (IS_LOG_ENABLED) {
//            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ error : %@ retrieving building info on building: %@", DEFAULT_SITUM_LOG, operation, error, buildingId]);
//        }
//        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
//    }];
//}
//
//- (void)fetchBuildings:(CDVInvokedUrlCommand*)command
//{
//    if (buildingsStored == nil) {
//        buildingsStored = [[NSMutableDictionary alloc] init];
//    }
//
//    NSString *operation = @"Fetching buildings request";
//    if (IS_LOG_ENABLED) {
//        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ ", DEFAULT_SITUM_LOG, operation]);
//    }
//    
//    // Forcing requests to go to the network instead of cache
//    NSDictionary *options = @{@"forceRequest":@YES,};
//    
//    [[SITCommunicationManager sharedManager] fetchBuildingsWithOptions:options success:^(NSDictionary *mapping) {
//        if (IS_LOG_ENABLED) {
//            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ Fetching buildings returned values", DEFAULT_SITUM_LOG, operation]);
//        }
//        NSArray *buildings = [mapping valueForKey:ResultsKey];
//        CDVPluginResult* pluginResult = nil;
//        if (buildings.count == 0) {
//            if (IS_LOG_ENABLED) {
//                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ No buildings were retrieved", DEFAULT_SITUM_LOG, operation]);
//            }
//            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"There are no buildings on the account. Please go to dashboard http://dashboard.situm.es and learn more about the first step with Situm technology"];
//        }
//        else {
//            NSMutableArray *ja = [[NSMutableArray alloc] init];
//            for (SITBuilding *obj in buildings) {
//                [ja addObject:[SitumLocationWrapper.shared buildingToJsonObject:obj]];
//                [buildingsStored setObject:obj forKey:[NSString stringWithFormat:@"%@", obj.identifier]];
//            }
//            if (IS_LOG_ENABLED) {
//                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ Retrieved the following buildings: %@", DEFAULT_SITUM_LOG, operation, buildings]);
//            }
//            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ja.copy];
//        }
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//    }
//                                                               failure:^(NSError *error) {
//                                                                   if (IS_LOG_ENABLED)
//                                                                    {
//                                                                        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ Error retrieving buildings: %@", DEFAULT_SITUM_LOG, operation, error]);
//                                                                    }
//                                                                   [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
//                                                               }];
//}
//
//- (void)fetchGeofencesFromBuilding:(CDVInvokedUrlCommand*)command 
//{
//    NSDictionary* buildingJO = (NSDictionary*)[command.arguments objectAtIndex:0];
//    
//    NSString *operation = @"Fetching geofences request";
//    if (IS_LOG_ENABLED) {
//        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ with parameters: %@", DEFAULT_SITUM_LOG, operation, buildingJO]);
//    }
//    
//    NSString *buildingId = [buildingJO valueForKey:@"identifier"];
//    SITBuilding *building = [[SITBuilding alloc]init];
//    building.identifier = buildingId;
//    
//    [[SITCommunicationManager sharedManager] fetchGeofencesFromBuilding:building
//                                                            withOptions:nil
//                                                         withCompletion:^(id  _Nullable array, NSError * _Nullable error) {
//        if (error) {
//            if (IS_LOG_ENABLED) {
//                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ error : %@ retrieving geofences on building: %@", DEFAULT_SITUM_LOG, operation, error, buildingJO]);
//            }
//            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
//            
//            return;
//        }
//        
//        // A success has been returned
//        if (IS_LOG_ENABLED) {
//            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ responded", DEFAULT_SITUM_LOG, operation]);
//        }
//
//        NSMutableArray *ja = [[NSMutableArray alloc] init];
//        if (IS_LOG_ENABLED) {
//            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ results: %@", DEFAULT_SITUM_LOG, operation, array]);
//        }
//        for (SITGeofence *obj in array) {
//            NSDictionary *jsonObject = [SitumLocationWrapper.shared geofenceToJsonObject:obj];
//            if (IS_LOG_ENABLED) {
//                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ parsed floor: %@", DEFAULT_SITUM_LOG, operation, jsonObject]);
//            }
//            [ja addObject:jsonObject];
//            if (IS_LOG_ENABLED) {
//                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ json array has : %@", DEFAULT_SITUM_LOG, operation, ja]);
//            }
//        }
//        CDVPluginResult* pluginResult = nil;
//        // Not having geofences is not an error
//        if (IS_LOG_ENABLED) {
//            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ retrieved geofences: %@ on building: %@", DEFAULT_SITUM_LOG, operation, array, buildingJO]);
//        }
//        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ja.copy];
//        // }
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//    }];
//}
//
//
//- (void)fetchFloorsFromBuilding:(CDVInvokedUrlCommand*)command
//{
//    NSDictionary* buildingJO = (NSDictionary*)[command.arguments objectAtIndex:0];
//    
//    NSString *operation = @"Fetching floors request";
//    if (IS_LOG_ENABLED) {
//        NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ with parameters: %@", DEFAULT_SITUM_LOG, operation, buildingJO]);
//    }
//
//    if (floorStored == nil) {
//        floorStored = [[NSMutableDictionary alloc] init];
//    }
//    
//    NSString *buildingId = [buildingJO valueForKey:@"identifier"];
//    
//    [[SITCommunicationManager sharedManager] fetchFloorsForBuilding:buildingId withOptions:nil success:^(NSDictionary *mapping) {
//        if (IS_LOG_ENABLED) {
//            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ responded", DEFAULT_SITUM_LOG, operation]);
//        }
//
//        NSMutableArray *ja = [[NSMutableArray alloc] init];
//        NSArray *floors = [mapping objectForKey:@"results"];
//        if (IS_LOG_ENABLED) {
//            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ results: %@", DEFAULT_SITUM_LOG, operation, floors]);
//        }
//        for (SITFloor *obj in floors) {
//            NSDictionary *floorJson = [SitumLocationWrapper.shared floorToJsonObject:obj];
//            if (IS_LOG_ENABLED) {
//                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ parsed floor: %@", DEFAULT_SITUM_LOG, operation, floorJson]);
//            }
//            [ja addObject:floorJson];
//            if (IS_LOG_ENABLED) {
//                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ json array has : %@", DEFAULT_SITUM_LOG, operation, ja]);
//            }
//            [floorStored setObject:obj forKey:[NSString stringWithFormat:@"%@", obj.identifier]];
//            if (IS_LOG_ENABLED) {
//                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ added: %@ to dictionary results", DEFAULT_SITUM_LOG, operation, obj]);
//            }
//        }
//        CDVPluginResult* pluginResult = nil;
//        if (floors.count == 0) {
//            if (IS_LOG_ENABLED) {
//                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ no floors on building: %@", DEFAULT_SITUM_LOG, operation, buildingJO]);
//            }
//            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"The selected building does not have floors. Correct that on http://dashboard.situm.es"];
//        } else {
//            if (IS_LOG_ENABLED) {
//                NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ retrieved floors: %@ on building: %@", DEFAULT_SITUM_LOG, operation, floors, buildingJO]);
//            }
//            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ja.copy];
//        }
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//    } failure:^(NSError *error) {
//        if (IS_LOG_ENABLED) {
//            NSLog(@"%@", [NSString stringWithFormat: @"%@ %@ error : %@ retrieving floors on building: %@", DEFAULT_SITUM_LOG, operation, error, buildingJO]);
//        }
//        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
//    }];
//}
//
//
//- (void)fetchIndoorPOIsFromBuilding:(CDVInvokedUrlCommand*)command
//{
//    NSDictionary* buildingJO = (NSDictionary*)[command.arguments objectAtIndex:0];
//    
//    if (poisStored == nil) {
//        poisStored = [[NSMutableDictionary alloc] init];
//    }
//    
//    [[SITCommunicationManager sharedManager] fetchPoisOfBuilding:[buildingJO valueForKey:@"identifier"]  withOptions:nil success:^(NSDictionary *mapping) {
//        NSArray *list = [mapping objectForKey:@"results"];
//        NSMutableArray *ja = [[NSMutableArray alloc] init];
//        for (SITPOI *obj in list) {
//            [ja addObject:[SitumLocationWrapper.shared poiToJsonObject:obj]];
//            [poisStored setObject:obj forKey:obj.name];
//        }
//        CDVPluginResult* pluginResult = nil;
//        if (list.count == 0) {
//            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"You have no poi. Create one in the Dashboard"];
//        } else {
//            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ja.copy];
//        }
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//    } failure:^(NSError *error) {
//        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
//    }];
//}
//
//- (void)fetchOutdoorPOIsFromBuilding:(CDVInvokedUrlCommand*)command
//{
//    NSDictionary* buildingJO = (NSDictionary*)[command.arguments objectAtIndex:0];
//    
//    if (poisStored == nil) {
//        poisStored = [[NSMutableDictionary alloc] init];
//    }
//    
//    [[SITCommunicationManager sharedManager] fetchOutdoorPoisOfBuilding:[buildingJO valueForKey:@"identifier"]  withOptions:nil success:^(NSDictionary *mapping) {
//        NSArray *list = [mapping objectForKey:@"results"];
//        NSMutableArray *ja = [[NSMutableArray alloc] init];
//        for (SITPOI *obj in list) {
//            [ja addObject:[SitumLocationWrapper.shared poiToJsonObject:obj]];
//            [poisStored setObject:obj forKey:obj.name];
//        }
//        CDVPluginResult* pluginResult = nil;
//        if (list.count == 0) {
//            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"You have no poi. Create one in the Dashboard"];
//        } else {
//            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ja.copy];
//        }
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//    } failure:^(NSError *error) {
//        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
//    }];
//}
//
//- (void)fetchEventsFromBuilding:(CDVInvokedUrlCommand*)command
//{
//    NSDictionary* buildingJO = (NSDictionary*)[command.arguments objectAtIndex:0];
//    
//    if (eventStored == nil) {
//        eventStored = [[NSMutableDictionary alloc] init];
//    }
//    
//    SITBuilding *building = [SITBuilding new];
//    building.identifier = buildingJO[@"identifier"];
//    
//    [[SITCommunicationManager sharedManager] fetchEventsFromBuilding:building withOptions:nil withCompletion:^SITHandler(NSArray<SITEvent *> *events, NSError *error) {
//        if (!error) {
//            NSMutableArray *ja = [[NSMutableArray alloc] init];
//            for (SITEvent *obj in events) {
//                [ja addObject:[SitumLocationWrapper.shared eventToJsonObject:obj]];
//                [eventStored setObject:obj forKey:[NSString stringWithFormat:@"%@", obj.name]];
//            }
//            CDVPluginResult* pluginResult = nil;
//            if (events.count == 0) {
//                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"You have no events. Create one in the Dashboard"];
//            } else {
//                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ja.copy];
//            }
//            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//        } else {
//            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
//        }
//        return false;
//    }];
//}
//
//- (void)fetchPoiCategories:(CDVInvokedUrlCommand *)command
//{
//    //NSDictionary* categoryJO = (NSDictionary*)[command.arguments objectAtIndex:0];
//    
//    if (categoryStored == nil) {
//        categoryStored = [[NSMutableDictionary alloc] init];
//    }
//    
//    [[SITCommunicationManager sharedManager] fetchCategoriesWithOptions:nil withCompletion:^(NSArray *categories, NSError *error) {
//        if (!error) {
//            NSMutableArray *ja = [[NSMutableArray alloc] init];
//            for (SITPOICategory *obj in categories) {
//                [ja addObject:[SitumLocationWrapper.shared poiCategoryToJsonObject:obj]];
//                [categoryStored setObject:obj forKey:[NSString stringWithFormat:@"%@", obj.name]];
//            }
//            CDVPluginResult* pluginResult = nil;
//            if (categories.count == 0) {
//                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"You have no categories. Create one in the Dashboard"];
//            } else {
//                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ja.copy];
//            }
//            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//        } else {
//            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
//        }
//    }];
//}
//
//- (void)fetchPoiCategoryIconNormal:(CDVInvokedUrlCommand *)command
//{
//    NSDictionary* categoryJO = (NSDictionary*)[command.arguments objectAtIndex:0];
//    
//    if (categoryStored == nil) {
//        categoryStored = [[NSMutableDictionary alloc] init];
//    }
//    
//    SITPOICategory *category = [[SitumLocationWrapper shared] poiCategoryFromJsonObject:categoryJO];
//    
//    [[SITCommunicationManager sharedManager] fetchSelected:false iconForCategory:category withCompletion:^(NSData *data, NSError *error) {
//        if (!error) {
//            CDVPluginResult* pluginResult = nil;
//            if (data == nil) {
//                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Icon not found"];
//            } else {
//                UIImage *icon = [UIImage imageWithData:data];
//                NSDictionary * dict = [[SitumLocationWrapper shared] bitmapToJsonObject:icon];
//                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dict];
//            }
//            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//        } else {
//            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
//        }
//    }];
//}
//
//- (void)fetchPoiCategoryIconSelected:(CDVInvokedUrlCommand *)command
//{
//    NSDictionary* categoryJO = (NSDictionary*)[command.arguments objectAtIndex:0];
//    
//    if (categoryStored == nil) {
//        categoryStored = [[NSMutableDictionary alloc] init];
//    }
//    
//    SITPOICategory *category = [[SitumLocationWrapper shared] poiCategoryFromJsonObject:categoryJO];
//    
//    [[SITCommunicationManager sharedManager] fetchSelected:true iconForCategory:category withCompletion:^(NSData *data, NSError *error) {
//        if (!error) {
//            CDVPluginResult* pluginResult = nil;
//            if (data == nil) {
//                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Icon not found"];
//            } else {
//                UIImage *icon = [UIImage imageWithData:data];
//                NSDictionary * dict = [[SitumLocationWrapper shared] bitmapToJsonObject:icon];
//                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dict];
//            }
//            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//        } else {
//            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
//        }
//    }];
//}
//
//- (void)fetchMapFromFloor:(CDVInvokedUrlCommand *)command
//{
//    NSDictionary* floorJO = (NSDictionary*)[command.arguments objectAtIndex:0];
//    
//    if (floorStored == nil) {
//        floorStored = [[NSMutableDictionary alloc] init];
//    }
//    SITFloor* floor = [SitumLocationWrapper.shared jsonObjectToFloor:floorJO];
//    
//    [[SITCommunicationManager sharedManager] fetchMapFromFloor: floor withCompletion:^(NSData *imageData) {
//        NSMutableDictionary *jaMap = [[NSMutableDictionary alloc] init];
//        NSString *imageBase64Encoded = [imageData base64EncodedStringWithOptions:0];
//        [jaMap setObject:[NSString stringWithFormat:@"%@", imageBase64Encoded] forKey:@"data"];
//        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jaMap];
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//    }];
//}
//
//
//- (void)startPositioning:(CDVInvokedUrlCommand *)command {
//    locationCallbackId = command.callbackId;
//    SITLocationRequest *locationRequest = [SitumLocationWrapper.shared jsonObjectToLocationRequest:command.arguments];
//     
//    [[SITLocationManager sharedInstance] requestLocationUpdates:locationRequest];
//    [[SITLocationManager sharedInstance] setDelegate:self];
//}
//
//- (void)stopPositioning:(CDVInvokedUrlCommand *)command {
//    locationCallbackId = command.callbackId;
//    [[SITLocationManager sharedInstance] removeUpdates];
//}
//
//
//- (void)requestDirections:(CDVInvokedUrlCommand*)command
//{
//    
//    routeCallbackId = command.callbackId;
//    
//    if (routesStored == nil) {
//        routesStored = [[NSMutableDictionary alloc] init];
//    }
//    
//    SITDirectionsRequest* directionsRequest = [SitumLocationWrapper.shared jsonObjectToDirectionsRequest:command.arguments];
//    
//    if (directionsRequest == nil) {
//        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Unable to parse request"];
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:routeCallbackId];
//        return;
//    }
//    
//    [[SITDirectionsManager sharedInstance] setDelegate:self];
//    [[SITDirectionsManager sharedInstance] requestDirections:directionsRequest];
//}
//
//- (void)requestNavigationUpdates:(CDVInvokedUrlCommand*)command
//{
//    navigationProgressCallbackId = command.callbackId;
//    NSNumber* distanceToChangeFloorThreshold;
//    NSNumber* distanceToChangeIndicationThreshold;
//    NSNumber* distanceToGoalThreshold;
//    NSNumber* outsideRouteThreshold;
//    NSNumber* indicationsInterval;
//    NSNumber* timeToFirstIndication;
//    NSNumber* roundIndicationsStep;
//    NSNumber* timeToIgnoreUnexpectedFloorChanges;
//
//    if (command.arguments.count > 0) {
//        // Processing configuration parameters
//        NSDictionary *options = (NSDictionary*)[command.arguments objectAtIndex:0];
//        distanceToChangeFloorThreshold = (NSNumber*)[options objectForKey:@"distanceToFloorChangeThreshold"];
//        distanceToChangeIndicationThreshold = (NSNumber*)[options objectForKey:@"distanceToChangeIndicationThreshold"];
//        distanceToGoalThreshold = (NSNumber*)[options objectForKey:@"distanceToGoalThreshold"];
//        outsideRouteThreshold = (NSNumber*)[options objectForKey:@"outsideRouteThreshold"];
//        indicationsInterval = (NSNumber*)[options objectForKey:@"indicationsInterval"];
//        timeToFirstIndication = (NSNumber*)[options objectForKey:@"timeToFirstIndication"];
//        roundIndicationsStep = (NSNumber*)[options objectForKey:@"roundIndicationsStep"];
//        timeToIgnoreUnexpectedFloorChanges = (NSNumber*)[options objectForKey:@"timeToIgnoreUnexpectedFloorChanges"];
//    }
//    SITRoute *routeObj = self.computedRoute;
//    if (routeObj) {
//        SITNavigationRequest *navigationRequest = [[SITNavigationRequest alloc] initWithRoute:routeObj];
//        if (distanceToChangeIndicationThreshold != nil) {
//            NSInteger value = [distanceToChangeIndicationThreshold integerValue];
//            [navigationRequest setDistanceToChangeIndicationThreshold: value];
//            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.distanceToChangeIndicationThreshold: %ld", navigationRequest.distanceToChangeIndicationThreshold]);
//        }
//        if (distanceToChangeFloorThreshold != nil) {
//            NSInteger value = [distanceToChangeFloorThreshold integerValue];
//            [navigationRequest setDistanceToChangeFloorThreshold: value];
//            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.distanceToChangeFloorThreshold: %ld", navigationRequest.distanceToFloorChangeThreshold]);
//        }
//        if (distanceToGoalThreshold != nil) {
//            NSInteger value = [distanceToGoalThreshold integerValue];
//            [navigationRequest setDistanceToGoalThreshold: value];
//            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.distanceToGoalThreshold: %ld", navigationRequest.distanceToGoalThreshold]);
//        }
//        if (outsideRouteThreshold != nil) {
//            NSInteger value = [outsideRouteThreshold integerValue];
//            [navigationRequest setOutsideRouteThreshold: value];
//            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.outsideRouteThreshold: %ld", navigationRequest.outsideRouteThreshold]);
//        }
//        if (indicationsInterval != nil) {
//            NSInteger value = [indicationsInterval integerValue];
//            [navigationRequest setIndicationsInterval: value];
//            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.indicationsInterval: %ld", navigationRequest.indicationsInterval]);
//        }
//        if (timeToFirstIndication != nil) {
//            NSInteger value = [timeToFirstIndication integerValue];
//            [navigationRequest setTimeToFirstIndication: value];
//            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.timeToFirstIndication: %ld", navigationRequest.timeToFirstIndication]);
//        }
//        if (roundIndicationsStep != nil) {
//            NSInteger value = [roundIndicationsStep integerValue];
//            [navigationRequest setRoundIndicationsStep: value];
//            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.roundIndicationsStep: %ld", navigationRequest.roundIndicationsStep]);
//        }
//        if (timeToIgnoreUnexpectedFloorChanges != nil) {
//            NSInteger value = [timeToIgnoreUnexpectedFloorChanges integerValue];
//            [navigationRequest setTimeToIgnoreUnexpectedFloorChanges: value];
//            NSLog(@"%@", [NSString stringWithFormat: @"navigationRequest.timeToIgnoreUnexpectedFloorChanges: %ld", navigationRequest.timeToIgnoreUnexpectedFloorChanges]);
//        }
//
//        [[SITNavigationManager sharedManager]  setDelegate:self]; // Configure delegation first
//        [[SITNavigationManager sharedManager] requestNavigationUpdates:navigationRequest];
//        
//        
//    }
//}
//
//- (void)updateNavigationWithLocation:(CDVInvokedUrlCommand *)command {
//    
//    SITLocation *location = [SitumLocationWrapper.shared locationJsonObjectToLocation:(NSDictionary*)[command.arguments objectAtIndex:0]];
//    
//    [[SITNavigationManager sharedManager] updateWithLocation:location];
//
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Navigation updated"];
//    pluginResult.keepCallback = [NSNumber numberWithBool:true];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:locationCallbackId];
//}
//
//- (void) removeNavigationUpdates:(CDVInvokedUrlCommand *)command {
//    [[SITNavigationManager sharedManager] removeUpdates];
//}
//
//- (void) invalidateCache:(CDVInvokedUrlCommand *)command {
//    NSMutableDictionary *obj = [[NSMutableDictionary alloc] init];
//    [[SITCommunicationManager sharedManager] clearCache];
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:obj.copy];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:locationCallbackId];
//}
//
//// Realtime 
//- (void)requestRealTimeUpdates:(CDVInvokedUrlCommand *)command {
//    realtimeCallbackId = command.callbackId;
//    SITRealTimeRequest *request = [SitumLocationWrapper.shared realtimeRequestFromJson:(NSDictionary*)[command.arguments objectAtIndex:0]];
//
//    [[SITRealTimeManager sharedManager] requestRealTimeUpdates:request];
//    [SITRealTimeManager sharedManager].delegate = self;
//}
//
//- (void)removeRealTimeUpdates:(CDVInvokedUrlCommand *)command {
//    [[SITRealTimeManager sharedManager] removeRealTimeUpdates];
//}
//
//// SITRealtimeDelegate methods
//- (void)realTimeManager:(id <SITRealTimeInterface> _Nonnull)realTimeManager
// didUpdateUserLocations:(SITRealTimeData *  _Nonnull)realTimeData 
//{
//    // SITRealTimeData to json
//    NSDictionary *realtimeInfo = [SitumLocationWrapper.shared jsonFromRealtimeData:realTimeData];
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:realtimeInfo.copy];
//    pluginResult.keepCallback = [NSNumber numberWithBool:true];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:realtimeCallbackId];
//}
//
//- (void)realTimeManager:(id <SITRealTimeInterface>  _Nonnull)realTimeManager
//       didFailWithError:(NSError *  _Nonnull)error
//{
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description];
//    pluginResult.keepCallback = [NSNumber numberWithBool:true];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:realtimeCallbackId];
//}
//
//// SITLocationDelegate methods
//
//- (void)locationManager:(nonnull id<SITLocationInterface>)locationManager
//      didUpdateLocation:(nonnull SITLocation *)location {
//    if (location) {
//        NSDictionary *locationJO = [SitumLocationWrapper.shared locationToJsonObject:location];
//        
//        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:locationJO.copy];
//        pluginResult.keepCallback = [NSNumber numberWithBool:true];
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:locationCallbackId];
//    }
//}
//
//- (void)locationManager:(nonnull id<SITLocationInterface>)locationManager
//       didFailWithError: (NSError * _Nullable)error {
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description];
//    pluginResult.keepCallback = [NSNumber numberWithBool:true];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:locationCallbackId];
//}
//
//- (void)locationManager:(nonnull id<SITLocationInterface>)locationManager
//         didUpdateState:(SITLocationState)state {
//    NSDictionary *locationChanged = [SitumLocationWrapper.shared locationStateToJsonObject:state];
//    
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:locationChanged.copy];
//    pluginResult.keepCallback = [NSNumber numberWithBool:true];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:locationCallbackId];
//}
//
//
//// SITDirectionsDelegate
//
//- (void)directionsManager:(id<SITDirectionsInterface>)manager
// didFailProcessingRequest:(SITDirectionsRequest *)request
//                withError:(NSError *)error {
//
//
//    self.computedRoute = nil; // if something fails then the previous computedRoute is clean
//
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:routeCallbackId];
//}
//
//- (void)directionsManager:(id<SITDirectionsInterface>)manager
//        didProcessRequest:(SITDirectionsRequest *)request
//             withResponse:(SITRoute *)route {
//    NSString * timestamp = [NSString stringWithFormat:@"%f",[[NSDate date] timeIntervalSince1970] * 1000];
//    
//    NSMutableDictionary *routeJO = [[SitumLocationWrapper.shared routeToJsonObject:route] mutableCopy];
//    [routesStored setObject:route forKey:timestamp];
//
//    self.computedRoute = route; // We store the computed route in order to insert it into the navigation component if neccessary
//    
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:routeJO.copy];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:routeCallbackId];
//}
//
//// SITNavigationDelegate
//
//
//- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
//         didFailWithError:(NSError *)error {
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description];
//    pluginResult.keepCallback = [NSNumber numberWithBool:true];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:navigationProgressCallbackId];
//}
//
//- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
//        didUpdateProgress:(SITNavigationProgress *)progress
//                  onRoute:(SITRoute *)route {
//    NSMutableDictionary *navigationJO = [NSMutableDictionary dictionaryWithDictionary:[SitumLocationWrapper.shared navigationProgressToJsonObject:progress]];
//    [navigationJO setValue:@"progress" forKey:@"type"];
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:navigationJO.copy];
//    pluginResult.keepCallback = [NSNumber numberWithBool:true];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:navigationProgressCallbackId];
//}
//
//- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
//destinationReachedOnRoute:(SITRoute *)route {
//    NSMutableDictionary *navigationJO = [[NSMutableDictionary alloc] init];
//    [navigationJO setValue:@"destinationReached" forKey:@"type"];
//    [navigationJO setValue:@"Destination reached" forKey:@"message"];
//    
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:navigationJO.copy];
//    pluginResult.keepCallback = [NSNumber numberWithBool:true];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:navigationProgressCallbackId];
//}
//
//
//- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
//         userOutsideRoute:(SITRoute *)route {
//    NSMutableDictionary *navigationJO = [[NSMutableDictionary alloc] init];
//    [navigationJO setValue:@"userOutsideRoute" forKey:@"type"];
//    [navigationJO setValue:@"User outside route" forKey:@"message"];
//
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:navigationJO.copy];
//    pluginResult.keepCallback = [NSNumber numberWithBool:true];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:navigationProgressCallbackId];
//}
//
//
@end
