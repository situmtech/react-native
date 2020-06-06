#import "SitumLocationWrapper.h"
#import "Constants.h"

NSString* emptyStrCheck(NSString *str) {
    if (!str || str == nil) {
        return @"";
    }
    return str;
}

NSString* orientationTypeToString(kSITIndicationOrientation orientation) {
    NSString *type = @"";
    switch (orientation) {
        case kSITInvalidOrientation:
            type = @"INVALID_ORIENTATION";
            break;
        case kSITStraight:
            type = @"STRAIGHT";
            break;
        case kSITVeerRight:
            type = @"VEER_RIGHT";
            break;
        case kSITRight:
            type = @"RIGHT";
            break;
        case kSITSharpRight:
            type = @"SHARP_RIGHT";
            break;
        case kSITVeerLeft:
            type = @"VEER_LEFT";
            break;
        case kSITLeft:
            type = @"LEFT";
            break;
        case kSITSharpLeft:
            type = @"SHARP_LEFT";
            break;
        case kSITBackward:
            type = @"BACKWARD";
            break;
            
        default:
            break;
    }
    return type;
}

kSITIndicationOrientation stringToOrientationType(NSString *orientation) {
    kSITIndicationOrientation type = kSITInvalidOrientation;
    if ([orientation isEqualToString:@"INVALID_ORIENTATION"]) {
        type = kSITInvalidOrientation;
    } else if ([orientation isEqualToString:@"STRAIGHT"]) {
        type = kSITStraight;
    } else if ([orientation isEqualToString:@"VEER_RIGHT"]) {
        type = kSITVeerRight;
    } else if ([orientation isEqualToString:@"RIGHT"]) {
        type = kSITRight;
    } else if ([orientation isEqualToString:@"SHARP_RIGHT"]) {
        type = kSITSharpRight;
    } else if ([orientation isEqualToString:@"VEER_LEFT"]) {
        type = kSITVeerLeft;
    } else if ([orientation isEqualToString:@"LEFT"]) {
        type = kSITLeft;
    } else if ([orientation isEqualToString:@"SHARP_LEFT"]) {
        type = kSITSharpLeft;
    } else if ([orientation isEqualToString:@"BACKWARD"]) {
        type = kSITBackward;
    }
    return type;
}

// indicationType

NSString* indicationTypeToString(kSITIndicationActions action) {
    NSString *type = @"";
    switch (action) {
        case kSITInvalidAction:
            type = @"INVALID_ACTION";
            break;
        case kSITTurn:
            type = @"TURN";
            break;
        case kSITGoAhead:
            type = @"GO_AHEAD";
            break;
        case kSITChangeFloor:
            type = @"CHANGE_FLOOR";
            break;
        case kSITEnd:
            type = @"END";
            break;
        case kSITCalculating:
            type = @"CALCULATING";
            break;
        default:
            break;
    }
    return type;
}

kSITIndicationActions stringToIndicationType(NSString* action) {
    kSITIndicationActions type = kSITInvalidAction;
    if ([action isEqualToString:@"INVALID_ACTION"]) {
        type = kSITInvalidAction;
    } else if ([action isEqualToString:@"TURN"]) {
        type = kSITTurn;
    } else if ([action isEqualToString:@"GO_AHEAD"]) {
        type = kSITGoAhead;
    } else if ([action isEqualToString:@"CHANGE_FLOOR"]) {
        type = kSITChangeFloor;
    } else if ([action isEqualToString:@"END"]) {
        type = kSITEnd;
    }
    return type;
}

// locationState

SITLocationState stringToLocationState(NSString* state){
    SITLocationState type = kSITLocationStopped;
    if ([state isEqualToString:@"STOPPED"]) {
        type = kSITLocationStopped;
    } else if ([state isEqualToString:@"CALCULATING"]) {
        type = kSITLocationCalculating;
    } else if ([state isEqualToString:@"USER_NOT_IN_BUILDING"]) {
        type = kSITLocationUserNotInBuilding;
    } else if ([state isEqualToString:@"STARTING"]) {
        type = kSITLocationStarted;
    }
    return type;
}

static SitumLocationWrapper *singletonSitumLocationWrapperObj;

@implementation SitumLocationWrapper

+ (SitumLocationWrapper *)shared {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        singletonSitumLocationWrapperObj = [[SitumLocationWrapper alloc] init];
    });
    return singletonSitumLocationWrapperObj;
}

//Building

- (NSDictionary *) buildingToJsonObject:(SITBuilding *) building {
    
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:emptyStrCheck(building.address) forKey:@"address"];
    [jo setObject:[self boundsToJsonObject:building.bounds] forKey:@"bounds"];
    [jo setObject:[self boundsToJsonObject:building.rotatedBounds] forKey:@"boundsRotated"];
    [jo setObject:[self dimensionsToJsonObject:building.dimensions] forKey:@"dimensions"];
    [jo setObject:[self coordinateToJsonObject:building.center] forKey:@"center"];
    [jo setObject:emptyStrCheck(building.name) forKey:@"name"];
    [jo setObject:emptyStrCheck(building.infoHTML) forKey:@"infoHtml"];
    [jo setObject:emptyStrCheck(building.pictureThumbURL.direction) forKey:@"pictureThumbUrl"];
    [jo setObject:emptyStrCheck(building.pictureURL.direction) forKey:@"pictureUrl"];
    // [jo setObject:building.rotation forKey:@"rotation"];
    [jo setObject:[NSNumber numberWithFloat:[building.rotation degrees]] forKey:@"rotationDegrees"];
    [jo setObject:[NSNumber numberWithFloat:[building.rotation radians]] forKey:@"rotationRadians"];
    [jo setObject:[NSNumber numberWithFloat:[building.rotation radians]] forKey:@"rotation"];
    [jo setObject:emptyStrCheck(building.userIdentifier) forKey:@"userIdentifier"];
    [jo setObject:emptyStrCheck(building.identifier) forKey:@"identifier"];
    [jo setObject:emptyStrCheck(building.identifier) forKey:@"buildingIdentifier"];
    
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc]init];
    [dateFormatter setDateFormat:kDateFormat];
    
    [jo setObject:emptyStrCheck([dateFormatter stringFromDate:building.createdAt])
           forKey:@"createdAt"];
    
    [jo setObject:emptyStrCheck([dateFormatter stringFromDate:building.updatedAt])
           forKey:@"updatedAt"];
    
    if (building.customFields) {
        [jo setObject:building.customFields forKey:@"customFields"];
    }
    
    return jo.copy;
}

- (NSArray *)floorsToJsonArray:(NSArray *)floors
{
    NSMutableArray *ja = [[NSMutableArray alloc] init];
    for (SITFloor *obj in floors) {
        NSDictionary *floorJson = [self floorToJsonObject:obj];
        
        [ja addObject:floorJson];
    }
    return ja;
}

- (NSArray *)poisToJsonArray:(NSArray *)array
{
    NSMutableArray *ja = [[NSMutableArray alloc] init];
    for (SITPOI *obj in array) {
        NSDictionary *json = [self poiToJsonObject:obj];
        
        [ja addObject:json];
    }
    return ja;
}

- (NSArray *)eventsToJsonArray:(NSArray *)array
{
    NSMutableArray *ja = [[NSMutableArray alloc] init];
    for (SITEvent *obj in array) {
        NSDictionary *json = [self eventToJsonObject:obj];
        
        [ja addObject:json];
    }
    return ja;
}


// Building Info
- (NSDictionary *) buildingInfoToJsonObject:(SITBuildingInfo *)buildingInfo
{
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    
    // Building
    [jo setObject:[self buildingToJsonObject:buildingInfo.building] forKey:@"building"];
    // Floors
    [jo setObject:[self floorsToJsonArray:buildingInfo.floors] forKey:@"floors"];
    // Indoor Pois
    [jo setObject:[self poisToJsonArray:buildingInfo.indoorPois] forKey:@"indoorPois"];
    // Outdoor Pois
    [jo setObject:[self poisToJsonArray:buildingInfo.outdoorPois] forKey:@"outdoorPois"];
    // Events
    [jo setObject:[self eventsToJsonArray:buildingInfo.events] forKey:@"events"];
    // Geofences?
    
    return jo;
}

- (SITLocationRequest *) dictToLocationRequest: (NSDictionary *) dict {
    NSNumber *useDeadReckoning = nil;
    NSNumber *useGps = nil;
    NSString *buildingId;
    NSString *realtimeUpdateInterval;
    NSNumber *interval = nil;
    NSNumber *smallestDisplacement = nil;
    NSNumber *useBarometer = nil;
    SITRealtimeUpdateInterval realtimeInterval = 0;
    
    if (buildingId == nil) {
        buildingId = [NSString stringWithFormat:@"%@", [dict valueForKey:@"buildingIdentifier"]];
    }
    
    SITLocationRequest *locationRequest = [[SITLocationRequest alloc] initWithBuildingId:buildingId];
    if (useDeadReckoning != nil) {
        [locationRequest setUseDeadReckoning:[useDeadReckoning boolValue]];
        
    }
    if(useGps != nil) {
        [locationRequest setUseGps:[useGps boolValue]];
    }
    
    if(interval != nil) {
        [locationRequest setInterval:[interval intValue]];
    }
    
    if (smallestDisplacement != nil) {
        [locationRequest setSmallestDisplacement:[smallestDisplacement floatValue]];
    }
    
    if(useBarometer != nil) {
        [locationRequest setUseBarometer: [useBarometer boolValue]];
    }
    
    if (realtimeInterval != 0) {
        [locationRequest setUpdateInterval:realtimeInterval];
    }
    return locationRequest;
}

- (SITLocationRequest *) jsonObjectToLocationRequest: (NSArray *) json {
    NSDictionary *buildingJO;
    NSNumber *useDeadReckoning = nil;
    NSNumber *useGps = nil;
    NSString *buildingId;
    NSString *realtimeUpdateInterval;
    NSNumber *interval = nil;
    NSNumber *smallestDisplacement = nil;
    NSNumber *useBarometer = nil;
    SITRealtimeUpdateInterval realtimeInterval = 0;
    
    
    
    //The following if-else is necessary in order to mantain compatibility
    //with the startPositioning[building] method.
    //If params is an array, then it contains both a building and a locationRequest
    //If params is a dictionary, then it should only contain a building
    
    if ([json isKindOfClass:[NSArray class]]) {
        buildingJO = (NSDictionary*)[json objectAtIndex:0];
        if (json.count > 1) {
            NSDictionary *requestJO = (NSDictionary*)[json objectAtIndex:1];
            buildingId = [NSString stringWithFormat:@"%@", requestJO[@"buildingIdentifier"]];
            useDeadReckoning = [requestJO objectForKey: @"useDeadReckoning"];
            useGps = [requestJO objectForKey: @"useGps"];
            realtimeUpdateInterval = requestJO[@"realtimeUpdateInterval"];
            interval = requestJO[@"interval"];
            smallestDisplacement = requestJO[@"smallestDisplacement"];
            useBarometer = [requestJO objectForKey: @"useBarometer"];
        }
    } else {
        buildingJO = (NSDictionary*)json[0];
    }
    
    if (buildingId == nil) {
        buildingId = [buildingJO valueForKey:@"identifier"];
    }
    
    if (buildingId == nil) {
        buildingId = [NSString stringWithFormat:@"%@", [buildingJO valueForKey:@"buildingIdentifier"]];
    }
    
    if (realtimeUpdateInterval != nil && [realtimeUpdateInterval isKindOfClass: [NSString class]]) {
        
        if ([realtimeUpdateInterval isEqualToString:@"REALTIME"]) {
            realtimeInterval = kSITUpdateIntervalRealtime;
        } else if ([realtimeUpdateInterval isEqualToString:@"FAST"]) {
            realtimeInterval = kSITUpdateIntervalFast;
        } else if ([realtimeUpdateInterval isEqualToString:@"NORMAL"]) {
            realtimeInterval = kSITUpdateIntervalNormal;
        } else if ([realtimeUpdateInterval isEqualToString:@"SLOW"]) {
            realtimeInterval = kSITUpdateIntervalSlow;
        } else if ([realtimeUpdateInterval isEqualToString:@"BATTERY_SAVER"]) {
            realtimeInterval = kSITUpdateIntervalBatterySaver;
        }
    }
    
    SITLocationRequest *locationRequest = [[SITLocationRequest alloc] initWithBuildingId:buildingId];
    if (useDeadReckoning != nil) {
        [locationRequest setUseDeadReckoning:[useDeadReckoning boolValue]];
        
    }
    if(useGps != nil) {
        [locationRequest setUseGps:[useGps boolValue]];
    }
    
    if(interval != nil) {
        [locationRequest setInterval:[interval intValue]];
    }
    
    if (smallestDisplacement != nil) {
        [locationRequest setSmallestDisplacement:[smallestDisplacement floatValue]];
    }
    
    if(useBarometer != nil) {
        [locationRequest setUseBarometer: [useBarometer boolValue]];
    }
    
    if (realtimeInterval != 0) {
        [locationRequest setUpdateInterval:realtimeInterval];
    }
    return locationRequest;
}

- (NSString*) locationStateToString:(SITLocationState) state {
    NSString *type = @"";
    switch (state) {
        case kSITLocationStopped:
            type = @"STOPPED";
            break;
        case kSITLocationCalculating:
            type = @"CALCULATING";
            break;
        case kSITLocationUserNotInBuilding:
            type = @"USER_NOT_IN_BUILDING";
            break;
        case kSITLocationStarted:
            type = @"STARTING";
            break;
            
        default:
            break;
    }
    return type;
}

- (NSDictionary *) locationStateToJsonObject:(SITLocationState) state {
    
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setValue: [self locationStateToString:state] forKey: @"statusName"];
    NSNumber *status = [NSNumber numberWithInt:state];
    [jo setValue: status forKey: @"statusOrdinal"];
    return jo;
}

//deprecated method

- (NSDictionary *) buildingIndoorToJsonObject:(SITIndoorBuilding *) building __deprecated{
    
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:emptyStrCheck(building.address) forKey:@"address"];
    [jo setObject:[self boundsToJsonObject:building.bounds] forKey:@"bounds"];
    [jo setObject:[self boundsToJsonObject:building.boundsRotated] forKey:@"boundsRotated"];
    [jo setObject:[self coordinateToJsonObject:building.coordinate] forKey:@"center"];
    //    [jo setObject:[self dimensionsToJsonObject:building.dimensions] forKey:@"dimensions"];
    [jo setObject:emptyStrCheck(building.name) forKey:@"name"];
    [jo setObject:emptyStrCheck(building.picture_thumb_url) forKey:@"pictureThumbUrl"];
    [jo setObject:emptyStrCheck(building.picture_url) forKey:@"pictureUrl"];
    [jo setObject:building.rotation forKey:@"rotation"];
    //TODO check
    //[jo setObject:emptyStrCheck(building.user_identifier) forKey:@"userIdentifier"];
    [jo setObject:emptyStrCheck([NSString stringWithFormat:@"%@", building.identifier]) forKey:@"identifier"];
    
    // if (building.customFields) {
    //     [jo setObject:building.customFields forKey:@"customFields"];
    // }
    
    return jo.copy;
}


// Geofence
- (NSDictionary *)geofenceToJsonObject:(SITGeofence *)geofence {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    
    // Complete implementation
    [jo setObject:emptyStrCheck(geofence.identifier) forKey:@"identifier"];
    [jo setObject:emptyStrCheck(geofence.buildingIdentifier) forKey:@"buildingIdentifier"];
    [jo setObject:emptyStrCheck(geofence.floorIdentifier) forKey:@"floorIdentifier"];
    
    [jo setObject:emptyStrCheck(geofence.name) forKey:@"name"];
    
    // Polygon Points
    [jo setObject:[self pointsToJsonArray:geofence.polygonPoints] forKey:@"polygonPoints"];
    
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc]init];
    [dateFormatter setDateFormat:kDateFormat];
    
    [jo setObject:emptyStrCheck([dateFormatter stringFromDate:geofence.createdAt])
           forKey:@"createdAt"];
    
    [jo setObject:emptyStrCheck([dateFormatter stringFromDate:geofence.updatedAt])
           forKey:@"updatedAt"];
    
    if (geofence.customFields) {
        [jo setObject:geofence.customFields forKey:@"customFields"];
    } else {
        [jo setObject:[NSDictionary new] forKey:@"customFields"];
    }
    [jo setObject:emptyStrCheck(geofence.infoHtml) forKey:@"infoHtml"];
    
    
    
    return jo;
}

//Floor

- (NSDictionary *) floorToJsonObject:(SITFloor *) floor {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    //TODO review added altitude key
    [jo setObject:[NSNumber numberWithDouble:floor.altitude] forKey:@"altitude"];
    [jo setObject:emptyStrCheck([NSString stringWithFormat:@"%@", floor.buildingIdentifier]) forKey:@"buildingIdentifier"];
    [jo setObject:[NSNumber numberWithInteger: floor.level] forKey:@"level"];
    [jo setObject:[NSNumber numberWithInteger: floor.floor] forKey:@"floor"];
    [jo setObject:floor.mapURL.direction forKey:@"mapUrl"];
    [jo setObject:[NSNumber numberWithDouble:floor.scale] forKey:@"scale"];
    [jo setObject:[NSString stringWithFormat:@"%@", floor.identifier] forKey:@"floorIdentifier"];
    [jo setObject:emptyStrCheck(floor.identifier) forKey:@"identifier"];
    [jo setObject:emptyStrCheck(floor.name) forKey:@"name"];
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc]init];
    [dateFormatter setDateFormat:kDateFormat];
    
    [jo setObject:emptyStrCheck([dateFormatter stringFromDate:floor.createdAt])
           forKey:@"createdAt"];
    
    [jo setObject:emptyStrCheck([dateFormatter stringFromDate:floor.updatedAt])
           forKey:@"updatedAt"];
    
    return jo.copy;
}

- (SITFloor *) jsonObjectToFloor:(NSDictionary *) nsFloor {
    SITFloor *floor  = [[SITFloor alloc] init];
    
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc]init];
    [dateFormatter setDateFormat:kDateFormat];
    
    floor.createdAt = [dateFormatter dateFromString:nsFloor[@"createdAt"]];
    
    floor.updatedAt = [dateFormatter dateFromString:nsFloor[@"updatedAt"]];
    
    floor.scale = [[nsFloor objectForKey:@"scale"] doubleValue];
    floor.mapURL = [[SITURL alloc] initWithDirection:[nsFloor objectForKey:@"mapUrl"]];;
    floor.level = [[nsFloor objectForKey:@"level"] intValue];
    floor.floor = [[nsFloor objectForKey:@"floor"] intValue];
    floor.identifier = [nsFloor objectForKey:@"floorIdentifier"];
    floor.name = [nsFloor objectForKey:@"name"];
    floor.buildingIdentifier = [nsFloor objectForKey:@"buildingIdentifier"];
    floor.altitude = [nsFloor[@"altitude"] doubleValue];
    return floor;
}

//Event

- (NSDictionary *) eventToJsonObject:(SITEvent *) event {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    jo[@"identifier"] = event.identifier;
    jo[@"buildingIdentifier"] = event.project_identifier;
    jo[@"floorIdentifier"] = event.trigger.center.floorIdentifier;
    jo[@"infoHtml"] = event.info;
    jo[@"name"] = event.name;
    jo[@"radius"] = event.trigger.radius;
    jo[@"x"] = @(event.trigger.center.cartesianCoordinate.x);
    jo[@"y"] = @(event.trigger.center.cartesianCoordinate.y);
    
    jo[@"trigger"] = [self circleAreaToJsonObject:event.trigger];
    if (event.conversion != nil) {
        jo[@"conversion"] = [self circleAreaToJsonObject:event.conversion];
    }
    
    jo[@"conversionArea"] = [self conversionAreaToJsonObject:event.conversionArea];
    jo[@"customFields"] = event.customFields != nil ? event.customFields : [NSDictionary new];
    
    return jo.copy;
}

//Category

//Floor

- (NSDictionary *) poiCategoryToJsonObject:(SITPOICategory *) category {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSString stringWithFormat:@"%@", category.identifier] forKey:@"identifier"];
    [jo setObject:[NSNumber numberWithBool:category.isPublic] forKey:@"public"];
    [jo setObject:[NSString stringWithFormat:@"%@", category.code] forKey:@"poiCategoryCode"];
    [jo setObject:[NSString stringWithFormat:@"%@", [category.name value]] forKey:@"poiCategoryName"];
    [jo setObject:category.iconURL.direction forKey:@"icon_deselected"];
    [jo setObject:category.selectedIconURL.direction forKey:@"icon_selected"];
    return jo.copy;
}

- (SITPOICategory *) poiCategoryFromJsonObject:(NSDictionary *) jo {
    SITPOICategory *category = [[SITPOICategory alloc] init];
    category.name = [[SITMultilanguageString alloc] initWithValue:[jo objectForKey:@"poiCategoryName"] defaultLocale:[NSLocale currentLocale]];
    category.code = [jo objectForKey:@"poiCategoryCode"];
    category.isPublic = [jo objectForKey:@"public"];
    category.selectedIconURL = [[SITURL alloc] initWithDirection:[jo objectForKey:@"icon_selected"]];
    if([jo objectForKey:@"icon_unselected"]) {
        category.iconURL = [[SITURL alloc] initWithDirection:[jo objectForKey:@"icon_unselected"]];
    } else {
        category.iconURL = [[SITURL alloc] initWithDirection:[jo objectForKey:@"icon_deselected"]];
    }
    return category;
}

- (NSDictionary *)bitmapToJsonObject:(UIImage *)icon {
    NSString *base64 = [UIImagePNGRepresentation(icon) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    [dict setObject:base64 forKey:@"data"];
    return dict;
}

// POI

- (NSDictionary *) poiToJsonObject:(SITPOI *) poi {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:emptyStrCheck(poi.identifier) forKey:@"identifier"];
    [jo setObject:emptyStrCheck(poi.buildingIdentifier) forKey:@"buildingIdentifier"];
    [jo setObject:[self cartesianCoordinateToJsonObject:poi.position.cartesianCoordinate] forKey:@"cartesianCoordinate"];
    [jo setObject:[self coordinateToJsonObject:poi.position.coordinate] forKey:@"coordinate"];
    [jo setObject:emptyStrCheck(poi.position.floorIdentifier) forKey:@"floorIdentifier"];
    [jo setObject:emptyStrCheck(poi.name) forKey:@"poiName"];
    [jo setObject:[self pointToJsonObject:poi.position] forKey:@"position"];
    [jo setObject:[NSNumber numberWithBool:poi.position.isIndoor] forKey:@"isIndoor"];
    [jo setObject:[NSNumber numberWithBool:poi.position.isOutdoor] forKey:@"isOutdoor"];
    [jo setObject: [self poiCategoryToJsonObject:poi.category] forKey:@"category"];
    
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc]init];
    [dateFormatter setDateFormat:kDateFormat];
    
    [jo setObject:emptyStrCheck([dateFormatter stringFromDate:poi.createdAt])
           forKey:@"createdAt"];
    
    [jo setObject:emptyStrCheck([dateFormatter stringFromDate:poi.updatedAt])
           forKey:@"updatedAt"];
    
    if (poi.customFields) {
        [jo setObject:poi.customFields forKey:@"customFields"];
    } else {
        [jo setObject:[NSDictionary new] forKey:@"customFields"];
    }
    [jo setObject:emptyStrCheck(poi.infoHTML) forKey:@"infoHtml"];
    return jo.copy;
}

// Location

- (NSDictionary *) locationToJsonObject:(SITLocation *) location {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithFloat:location.accuracy] forKey:@"accuracy"];
    [jo setObject:[self angleToJsonObject:location.bearing] forKey:@"bearing"];
    [jo setObject:[self qualityStringFromQuality:location.bearingQuality] forKey:@"bearingQuality"];
    [jo setObject:emptyStrCheck(location.position.buildingIdentifier) forKey:@"buildingIdentifier"];
    [jo setObject:[self angleToJsonObject:location.cartesianBearing] forKey:@"cartesianBearing"];
    [jo setObject:[self cartesianCoordinateToJsonObject:location.position.cartesianCoordinate] forKey:@"cartesianCoordinate"];
    [jo setObject:[self coordinateToJsonObject:location.position.coordinate] forKey:@"coordinate"];
    [jo setObject:emptyStrCheck(location.position.floorIdentifier) forKey:@"floorIdentifier"];
    [jo setObject:[self pointToJsonObject:location.position] forKey:@"position"];
    [jo setObject:emptyStrCheck(location.provider) forKey:@"provider"];
    [jo setObject:[self qualityStringFromQuality:location.quality] forKey:@"quality"];
    [jo setObject:[NSNumber numberWithBool:location.hasBearing] forKey:@"hasBearing"];
    [jo setObject:[NSNumber numberWithDouble:location.timestamp] forKey:@"timestamp"];
    [jo setObject:[NSNumber numberWithBool:location.position.isIndoor] forKey:@"isIndoor"];
    [jo setObject:[NSNumber numberWithBool:location.position.isOutdoor] forKey:@"isOutdoor"];
    [jo setObject:emptyStrCheck(location.deviceId) forKey:@"deviceId"];
    [jo setValue:@"locationChanged" forKey:@"type"];
    return jo.copy;
}

- (NSString *)qualityStringFromQuality:(kSITQualityValues)quality {
    return quality == kSITHigh ? @"HIGH":@"LOW";
}

- (SITLocation *) locationJsonObjectToLocation:(NSDictionary *) jo {
    NSTimeInterval timestamp = [(NSNumber*)[jo valueForKey:@"timestamp"] doubleValue];
    SITPoint *position = [self pointJsonObjectToPoint:[jo objectForKey:@"position"]];
    
    float bearing = [[[jo objectForKey:@"bearing"] valueForKey:@"degrees"] floatValue];
    float cartesianBearing = [[[jo objectForKey:@"cartesianBearing"] valueForKey:@"radians"] floatValue];
    
    kSITQualityValues quality = [(NSString*)[jo valueForKey: @"quality"] isEqualToString: @"HIGH"] ? kSITHigh : kSITLow;
    kSITQualityValues bearingQuality = [(NSString*)[jo valueForKey: @"bearingQuality"] isEqualToString: @"HIGH"] ? kSITHigh : kSITLow;
    
    float accuracy = [(NSNumber*)[jo objectForKey:@"accuracy"] floatValue];
    
    SITLocation *location = [[SITLocation alloc] initWithTimestamp:timestamp position:position bearing:bearing cartesianBearing:cartesianBearing quality:quality accuracy:accuracy provider:[jo objectForKey:@"provider"]];
    location.bearingQuality = bearingQuality;
    return location;
}

- (NSDictionary *) coordinateToJsonObject:(CLLocationCoordinate2D) coordinate {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:coordinate.latitude] forKey:@"latitude"];
    [jo setObject:[NSNumber numberWithDouble:coordinate.longitude] forKey:@"longitude"];
    return jo.copy;
}
- (CLLocationCoordinate2D) jsonObjectToCoordinate:(NSDictionary *) json {
    double latitude = [(NSNumber*)[json valueForKey:@"latitude"] doubleValue];
    double longitude = [(NSNumber*)[json valueForKey:@"longitude"] doubleValue];
    
    
    CLLocationCoordinate2D coordinate;
    coordinate.latitude = latitude;
    coordinate.longitude = longitude;
    return coordinate;
}

// Coordinate

- (NSDictionary *) indoorPointToJsonObject:(SITIndoorPoint *) iPoint {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    
    if (iPoint == nil) {
        iPoint = [SITIndoorPoint new];
        iPoint.x = @(0);
        iPoint.y = @(0);
    }
    jo[@"x"] = iPoint.x;
    jo[@"y"] = iPoint.y;
    return jo.copy;
}

- (CLLocationCoordinate2D) coordinateJsonObjectToCoordinate:(NSDictionary *) jo {
    CLLocationDegrees latitude = [(NSNumber*)[jo objectForKey:@"latitude"] doubleValue];
    CLLocationDegrees longitude = [(NSNumber*)[jo objectForKey:@"longitude"] doubleValue];
    
    CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(latitude, longitude);
    return coordinate;
}


// Point
- (NSArray *) pointsToJsonArray:(NSArray<SITPoint *> *)points {
    NSMutableArray *pointsJO = [[NSMutableArray alloc]init];
    for(SITPoint* point in points) {
        [pointsJO addObject: [self pointToJsonObject: point]];
    }
    return pointsJO;
}

- (NSDictionary *) pointToJsonObject:(SITPoint *) point {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:emptyStrCheck(point.buildingIdentifier) forKey:@"buildingIdentifier"];
    [jo setObject:[self cartesianCoordinateToJsonObject:point.cartesianCoordinate] forKey:@"cartesianCoordinate"];
    [jo setObject:[self coordinateToJsonObject:point.coordinate] forKey:@"coordinate"];
    [jo setObject:emptyStrCheck(point.floorIdentifier) forKey:@"floorIdentifier"];
    [jo setObject:[NSNumber numberWithBool:point.isIndoor] forKey:@"isIndoor"];
    [jo setObject:[NSNumber numberWithBool:point.isOutdoor] forKey:@"isOutdoor"];
    return jo.copy;
    
}

- (SITPoint *) pointJsonObjectToPoint:(NSDictionary *) jo {
    SITPoint *point = nil;
    BOOL isOutdoor = [(NSNumber*)jo[@"isOutdoor"] boolValue];
    if(isOutdoor) {
        point = [[SITPoint alloc] initWithCoordinate: [self coordinateJsonObjectToCoordinate:[jo objectForKey:@"coordinate"]]
                                  buildingIdentifier:  [jo valueForKey:@"buildingIdentifier"]];
    } else {
        point = [[SITPoint alloc] initWithCoordinate:[self coordinateJsonObjectToCoordinate:[jo objectForKey:@"coordinate"]] buildingIdentifier:[jo valueForKey:@"buildingIdentifier"] floorIdentifier:[jo valueForKey:@"floorIdentifier"] cartesianCoordinate:[self cartesianCoordinateJsonObjectToCartesianCoordinate:[jo objectForKey:@"cartesianCoordinate"]]];
    }
    return point;
}

// CartesianCoordinate

- (NSDictionary *) cartesianCoordinateToJsonObject:(SITCartesianCoordinate *) cartesianCoordinate {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:cartesianCoordinate.x] forKey:@"x"];
    [jo setObject:[NSNumber numberWithDouble:cartesianCoordinate.y] forKey:@"y"];
    return jo.copy;
    
}

- (SITCartesianCoordinate *) cartesianCoordinateJsonObjectToCartesianCoordinate:(NSDictionary *) jo {
    SITCartesianCoordinate *cartesianCoordinate = [[SITCartesianCoordinate alloc] initWithX:[[jo valueForKey:@"x"] doubleValue] y:[[jo valueForKey:@"y"] doubleValue]];
    return cartesianCoordinate;
}

- (SITDirectionsRequest *) jsonObjectToDirectionsRequest: (NSArray *) json {
    NSDictionary* buildingJO = (NSDictionary*)[json objectAtIndex:0];
    NSDictionary* from = (NSDictionary*)[json objectAtIndex:1];
    NSMutableDictionary* fromPoint = [from mutableCopy];
    NSDictionary* to = (NSDictionary*)[json objectAtIndex:2];
    NSMutableDictionary* toPoint = [to mutableCopy];
    
    NSDictionary* options = nil;
    if(json.count>3)
        (NSDictionary*)[json objectAtIndex:3];
    
    NSDictionary* dimensionsJO = (NSDictionary*)[buildingJO objectForKey:@"dimensions"];
    NSDictionary* centerJo = (NSDictionary*)[buildingJO objectForKey:@"center"];
    
    SITDimensions *dimensions = [self jsonObjectToDimensions:dimensionsJO];
    CLLocationCoordinate2D center = [self jsonObjectToCoordinate:centerJo];
    
    float rotation =[[buildingJO valueForKey:@"rotation"] floatValue];
    
    SITAngle *angle = [[SITAngle alloc] initWithRadians:rotation];
    SITCoordinateConverter *converter = [[SITCoordinateConverter alloc]initWithDimensions:dimensions center:center rotation:angle];
    
    NSLog(@"building properties::: dimensions:: width: %f, height: %f; rotation: %f; angle: %@", dimensions.width, dimensions.height, rotation, angle);
    
    CLLocationCoordinate2D fromCoordinate = [self jsonObjectToCoordinate:(NSDictionary*)[fromPoint objectForKey:@"coordinate"]];
    [fromPoint setObject:[self cartesianCoordinateToJsonObject:[converter toCartesianCoordinate:fromCoordinate]] forKey:@"cartesianCoordinate"];
    
    CLLocationCoordinate2D toCoordinate = [self jsonObjectToCoordinate:(NSDictionary*)[toPoint objectForKey:@"coordinate"]];
    [toPoint setObject:[self cartesianCoordinateToJsonObject:[converter toCartesianCoordinate:toCoordinate]] forKey:@"cartesianCoordinate"];
    
    
    SITPoint *startPoint = [SitumLocationWrapper.shared pointJsonObjectToPoint:fromPoint];
    SITPoint *endPoint = [SitumLocationWrapper.shared pointJsonObjectToPoint:toPoint];
    
    
    SITDirectionsRequest *directionsRequest = [[SITDirectionsRequest alloc] initWithOrigin: startPoint withDestination: endPoint];
    
    
    //
    //    NSNumber *accessible;
    //    BOOL minimizeFloorChanges = false;
    //    NSString *accessibilityModeValue = nil;
    //    if(options) {
    //        accessible = (NSNumber*)[options valueForKey: @"accessible"];
    //        if (accessible == nil) {
    //            accessible = (NSNumber*)[options valueForKey: @"accessibleRoute"];
    //        }
    //        accessibilityModeValue = options[@"accessibilityMode"];
    //        minimizeFloorChanges = [(NSNumber*)[options valueForKey: @"minimizeFloorChanges"] boolValue];
    //    }
    //
    //    if (accessibilityModeValue != nil) {
    //        SITAccessibilityMode accessibilityMode;
    //        if ([accessibilityModeValue isEqualToString:@"CHOOSE_SHORTEST"]) {
    //            accessibilityMode = kSITChooseShortest;
    //        } else if ([accessibilityModeValue isEqualToString:@"ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES"]) {
    //            accessibilityMode = kSITOnlyNotAccessibleFloorChanges;
    //        } else {
    //            accessibilityMode = kSITOnlyAccessible;
    //        }
    //        [directionsRequest setAccessibility:accessibilityMode];
    //    } else if (accessible != nil) {
    //
    //        [directionsRequest setAccessible: [accessible boolValue]];
    //    }
    //
    //    [directionsRequest setMinimizeFloorChanges: minimizeFloorChanges];
    return directionsRequest;
}


// Dimensions

- (NSDictionary *) dimensionsToJsonObject:(SITDimensions *) dimensions {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:dimensions.width] forKey:@"width"];
    [jo setObject:[NSNumber numberWithDouble:dimensions.height] forKey:@"height"];
    return jo.copy;
}

- (SITDimensions *) jsonObjectToDimensions:(NSDictionary *) json {
    double width = [(NSNumber*)[json valueForKey:@"width"] doubleValue];
    double height = [(NSNumber*)[json valueForKey:@"height"] doubleValue];
    SITDimensions *dimension  = [[SITDimensions alloc] initWithWidth:width height:height];
    return dimension;
}

// Bounds

- (NSDictionary *) boundsToJsonObject:(SITBounds) bounds {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[self coordinateToJsonObject:bounds.northEast] forKey:@"northEast"];
    [jo setObject:[self coordinateToJsonObject:bounds.northWest] forKey:@"northWest"];
    [jo setObject:[self coordinateToJsonObject:bounds.southEast] forKey:@"southEast"];
    [jo setObject:[self coordinateToJsonObject:bounds.southWest] forKey:@"southWest"];
    return jo.copy;
}

- (NSDictionary *) circleAreaToJsonObject:(SITCircularArea *) ca {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    
    jo[@"center"] = ca != nil ? [self pointToJsonObject:ca.center] : nil;
    jo[@"radius"] = ca != nil ? ca.radius : nil;
    
    return jo.copy;
}

- (NSDictionary *) conversionAreaToJsonObject:(SITRectangularArea *) ca {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    
    if (ca == nil) {
        ca = [SITRectangularArea new];
    }
    
    jo[@"topLeft"] = [self indoorPointToJsonObject:ca.topLeft];
    jo[@"topRight"] = [self indoorPointToJsonObject:ca.topRight];
    jo[@"bottomRight"] = [self indoorPointToJsonObject:ca.bottomRight];
    jo[@"bottomLeft"] = [self indoorPointToJsonObject:ca.bottomLeft];
    jo[@"floorIdentifier"] = ca.center.level_identifier != nil ? ca.center.level_identifier : @(0);
    
    return jo.copy;
}


// Angle

- (NSDictionary *) angleToJsonObject:(SITAngle *) angle {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:angle.degrees] forKey:@"degrees"];
    [jo setObject:[NSNumber numberWithDouble:angle.radians] forKey:@"radians"];
    [jo setObject:[NSNumber numberWithDouble:angle.degressClockwise] forKey:@"degressClockwise"];
    [jo setObject:[NSNumber numberWithDouble:angle.degressClockwise] forKey:@"degreesClockwise"];
    [jo setObject:[NSNumber numberWithDouble:angle.radiansMinusPiPi] forKey:@"radiansMinusPiPi"];
    return jo.copy;
}

// Route

- (NSDictionary *) routeToJsonObject:(SITRoute *) route {
    
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    
    NSMutableArray *stepsJsonArray = [[NSMutableArray alloc] init];
    for (SITRouteStep *routeStep in route.routeSteps) {
        [stepsJsonArray addObject:[self routeStepToJsonObject:routeStep]];
    }
    
    NSMutableArray *pointsJsonArray = [[NSMutableArray alloc] init];
    for(SITPoint* point in route.points) {
        [pointsJsonArray addObject:[self pointToJsonObject: point]];
    }
    
    NSMutableArray *indicationsJsonArray = [[NSMutableArray alloc] init];
    for (SITIndication *indication in route.indications) {
        [indicationsJsonArray addObject:[self indicationToJsonObject:indication]];
    }
    
    NSMutableArray* segmentsJsonArray = [NSMutableArray new];
    for(SITRouteSegment* segment in route.segments) {
        [segmentsJsonArray addObject: [self routeSegmentToJsonObject: segment]];
    }
    
    [jo setObject: [self pointToJsonObject:route.origin] forKey:@"from"];
    [jo setObject: [self pointToJsonObject:route.destination] forKey:@"to"];
    [jo setObject: stepsJsonArray.copy forKey:@"steps"];
    [jo setObject: pointsJsonArray.copy forKey:@"points"];
    [jo setObject: indicationsJsonArray.copy forKey:@"indications"];
    [jo setObject: segmentsJsonArray.copy forKey: @"segments"];
    
    if (route.routeSteps.count == 0) return jo; // No steps on the route
    
    
    [jo setObject:stepsJsonArray.copy forKey:@"edges"];
    [jo setObject:stepsJsonArray.firstObject forKey:@"firstStep"];
    [jo setObject:stepsJsonArray.lastObject forKey:@"lastStep"];
    [jo setObject:pointsJsonArray forKey:@"nodes"];
    
    return jo.copy;
}

// RouteSegment

- (NSDictionary*) routeSegmentToJsonObject: (SITRouteSegment*) segment {
    
    NSMutableDictionary* jo = [NSMutableDictionary new];
    [jo setObject: segment.floorIdentifier forKey: @"floorIdentifier"];
    NSMutableArray* pointsJO = [NSMutableArray new];
    for(SITPoint* point in segment.points) {
        [pointsJO addObject: [self pointToJsonObject: point]];
    }
    [jo setObject: pointsJO forKey: @"points"];
    
    return [jo copy];
}

//RouteStep

- (NSDictionary *) routeStepToJsonObject:(SITRouteStep *) routeStep {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:routeStep.stepDistance] forKey:@"distance"];
    [jo setObject:[NSNumber numberWithDouble:routeStep.distanceToGoal] forKey:@"distanceToGoal"];
    [jo setObject:[self pointToJsonObject:routeStep.from] forKey:@"from"];
    [jo setObject:[NSNumber numberWithInteger:routeStep.nextStepIndex] forKey:@"nextStepIndex"];
    [jo setObject:[self pointToJsonObject:routeStep.to] forKey:@"to"];
    [jo setObject:[self pointToJsonObject:routeStep.to] forKey:@"TO"];
    [jo setObject:[NSNumber numberWithInteger:routeStep.index] forKey:@"id"];
    [jo setObject:[NSNumber numberWithBool:routeStep.isFirst] forKey:@"isFirst"];
    [jo setObject:[NSNumber numberWithBool:routeStep.isLast] forKey:@"isLast"];
    return jo.copy;
}

- (SITRouteStep *) routeStepJsonObjectToRouteStep:(NSDictionary *) jo {
    SITPoint *fromPoint = (SITPoint*)[jo objectForKey:@"from"];
    SITPoint *toPoint = (SITPoint*)[jo objectForKey:@"to"];
    
    SITRouteStep *routeStep = [[SITRouteStep alloc] initWithIndex:[(NSNumber*)[jo valueForKey:@"id"] integerValue] from:fromPoint to:toPoint isFirst:[(NSNumber*)[jo valueForKey:@"isFirst"] boolValue] isLast:[(NSNumber*)[jo valueForKey:@"isLast"] boolValue] nextStepIndex:[(NSNumber*)[jo valueForKey:@"nextStepIndex"] integerValue] stepDistance:[(NSNumber*)[jo valueForKey:@"distance"] doubleValue] distanceToGoal:[(NSNumber*)[jo valueForKey:@"distanceToGoal"] doubleValue]];
    
    return routeStep;
}

// Indication

- (NSDictionary *) indicationToJsonObject:(SITIndication *) indication {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:indication.horizontalDistance] forKey:@"distance"];
    [jo setObject:[NSNumber numberWithFloat:indication.verticalDistance] forKey:@"distanceToNextLevel"];
    [jo setObject:indicationTypeToString(indication.action) forKey:@"indicationType"];
    [jo setObject:[NSNumber numberWithFloat:indication.orientationChange] forKey:@"orientation"];
    [jo setObject:orientationTypeToString(indication.orientation) forKey:@"orientationType"];
    [jo setObject:[NSNumber numberWithInteger:indication.destinationStepIndex] forKey:@"stepIdxDestination"];
    [jo setObject:[NSNumber numberWithInteger:indication.originStepIndex] forKey:@"stepIdxOrigin"];
    [jo setObject:[NSNumber numberWithBool:indication.needLevelChange] forKey:@"neededLevelChange"];
    [jo setObject:[indication humanReadableMessage] forKey:@"humanReadableMessage"];
    if (indication.nextLevel == nil) {
        NSLog(@"Next level is nil");
    } else {
        [jo setObject:indication.nextLevel forKey:@"nextLevel"];
    }
    return jo.copy;
}

- (SITIndication *) indicationJsonObjectToIndication:(NSDictionary *) jo {
    NSInteger stepIdxOrigin = [(NSNumber*)[jo valueForKey:@"stepIdxOrigin"] integerValue];
    NSInteger stepIdxDestination = [(NSNumber*)[jo valueForKey:@"stepIdxDestination"] integerValue];
    float horizontalDistance = [(NSNumber*)[jo valueForKey:@"distance"] floatValue];
    float orientationChange = [(NSNumber*)[jo valueForKey:@"orientation"] floatValue];
    float verticalDistance = [(NSNumber*)[jo valueForKey:@"distanceToNextLevel"] floatValue];
    NSNumber* nextLevel = (NSNumber*)[jo valueForKey:@"nextLevel"];
    kSITIndicationActions action = stringToIndicationType([jo valueForKey:@"indicationType"]);
    kSITIndicationOrientation orientation = stringToOrientationType([jo valueForKey:@"orientationType"]);
    
    SITIndication *indication = [[SITIndication alloc] initWithOriginStepIndex:stepIdxOrigin destinationStepIndex:stepIdxDestination action:action horizontalDistance:horizontalDistance orientation:orientation orientationChange:orientationChange verticalDistance:verticalDistance nextLevel:nextLevel];
    
    return indication;
}

// NavigationProgress

- (NSDictionary *) navigationProgressToJsonObject:(SITNavigationProgress *) navigationProgress {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    
    NSMutableArray *pointsJsonArray = [[NSMutableArray alloc] init];
    for(SITPoint* point in navigationProgress.points) {
        [pointsJsonArray addObject:[self pointToJsonObject: point]];
    }
    
    NSMutableArray* segmentsJsonArray = [NSMutableArray new];
    for(SITRouteSegment* segment in navigationProgress.segments) {
        [segmentsJsonArray addObject: [self routeSegmentToJsonObject: segment]];
    }
    
    [jo setObject: pointsJsonArray forKey: @"points"];
    [jo setObject: segmentsJsonArray forKey: @"segments"];
    [jo setObject:[self pointToJsonObject:navigationProgress.closestPointToRoute] forKey:@"closestPointInRoute"];
    [jo setObject:[NSNumber numberWithFloat:navigationProgress.distanceToClosestPointInRoute] forKey:@"distanceToClosestPointInRoute"];
    [jo setObject:[self indicationToJsonObject:navigationProgress.currentIndication] forKey:@"currentIndication"];
    [jo setObject:[self indicationToJsonObject:navigationProgress.nextIndication] forKey:@"nextIndication"];
    [jo setObject:[NSNumber numberWithInteger:navigationProgress.currentStepIndex] forKey:@"currentStepIndex"];
    [jo setObject:[NSNumber numberWithFloat:navigationProgress.distanceToGoal] forKey:@"distanceToGoal"];
    [jo setObject:[NSNumber numberWithFloat:navigationProgress.distanceToEndStep] forKey:@"distanceToEndStep"];
    [jo setObject:[NSNumber numberWithFloat:navigationProgress.timeToEndStep] forKey:@"timeToEndStep"];
    [jo setObject:[NSNumber numberWithFloat:navigationProgress.timeToGoal] forKey:@"timeToGoal"];
    [jo setObject:[self routeStepToJsonObject:navigationProgress.routeStep] forKey:@"routeStep"];
    [jo setObject:[self locationToJsonObject:navigationProgress.closestLocationInRoute] forKey:@"closestLocationInRoute"];
    return jo.copy;
}

// check nil string

// Realtime
- (SITRealTimeRequest *)realtimeRequestFromJson:(NSDictionary *)jo
{
    SITRealTimeRequest *request = [[SITRealTimeRequest alloc] init];
    
    NSDictionary *buildingJO = [jo valueForKey:@"building"];
    
    
    request.buildingIdentifier = [buildingJO valueForKey:@"identifier"];
    request.updateInterval = [[jo valueForKey:@"pollTime"] integerValue];
    
    return request;
}

- (NSDictionary *)jsonFromRealtimeData:(SITRealTimeData *)realtimeData
{
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    
    NSMutableArray *locations = [[NSMutableArray alloc]init];
    
    for (SITLocation *location in realtimeData.locations) {
        [locations addObject:[self locationToJsonObject:location]];
    }
    
    [jo setObject:locations forKey:@"locations"];
    
    return jo;
} 

@end
