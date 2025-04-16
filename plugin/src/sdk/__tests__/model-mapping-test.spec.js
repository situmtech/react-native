import expect from "expect";
import buildings from "./resources/fetchBuildings.json";
import events from "./resources/fetchEventsFromBuilding.json";
import floors from "./resources/fetchFloorsFromBuilding.json";
import indoorPois from "./resources/fetchIndoorPOIsFromBuilding.json";
import map from "./resources/fetchMapFromFloor.json";
import outdoorPois from "./resources/fetchOutdoorPOIsFromBuilding.json";
import poiCategories from "./resources/fetchPoiCategories.json";
import iconNormal from "./resources/fetchPoiCategoryIconNormal.json";
import iconSelected from "./resources/fetchPoiCategoryIconSelected.json";
import route from "./resources/requestDirections.json";
import starting from "./resources/startPositioning/0_starting.json";
import preparePositioningModel from "./resources/startPositioning/1_preparingPositioningModel.json";
import startingPositioning from "./resources/startPositioning/2_startingPositioning.json";
import calculating from "./resources/startPositioning/3_calculating.json";
import position from "./resources/startPositioning/4_position.json";
let building, floor, indoorPoi, outdoorPoi, event, poiCategory, edge, node, point, step;
describe("Test fetchBuildings -> ", () => {
    it("Check reutrned value", () => {
        expect(buildings).toBeDefined();
        expect(buildings instanceof Array).toBe(true);
    });
    it("Check building", () => {
        expect((building = buildings[0]));
        expect(typeof building).toBe("object");
        expect(typeof building.address).toBe("string");
        expect(typeof building.bounds).toBe("object");
        expect(typeof building.boundsRotated).toBe("object");
        expect(typeof building.center).toBe("object");
        expect(typeof building.dimensions).toBe("object");
        expect(typeof building.infoHtml).toBe("string");
        expect(typeof building.name).toBe("string");
        expect(typeof building.pictureThumbUrl).toBe("string");
        expect(typeof building.pictureUrl).toBe("string");
        expect(typeof building.rotation).toBe("number");
        expect(typeof building.userIdentifier).toBe("string");
        expect(typeof building.buildingIdentifier).toBe("string");
        expect(typeof building.customFields).toBe("object");
    });
    it("Check building bounds", () => {
        testBounds(building.bounds);
    });
    it("Check building boundsRotated", () => {
        testBounds(building.boundsRotated);
    });
    it("Check building center", () => {
        testCoordinate(building.center);
    });
    it("Check building dimensions", () => {
        testDimension(building.dimensions);
    });
});
describe("Test fetchFloorsFromBuilding ->", () => {
    it("Check returned value", () => {
        expect(floors).toBeDefined();
        expect(floors instanceof Array).toBe(true);
    });
    it("Check floor", () => {
        expect((floor = floors[0]));
        expect(typeof floor).toBe("object");
        expect(typeof floor.altitude).toBe("number");
        expect(typeof floor.buildingIdentifier).toBe("string");
        expect(typeof floor.level).toBe("number");
        expect(typeof floor.mapUrl).toBe("string");
        expect(typeof floor.scale).toBe("number");
        expect(typeof floor.floorIdentifier).toBe("string");
    });
});
describe("Test fetchIndoorPOIsFromBuilding ->", () => {
    it("Check returned value", () => {
        expect(indoorPois).toBeDefined();
        expect(indoorPois instanceof Array).toBe(true);
    });
    it("Check indoorPOI", () => {
        expect((indoorPoi = indoorPois[0]));
        expect(typeof indoorPoi).toBe("object");
        expect(typeof indoorPoi.identifier).toBe("string");
        expect(typeof indoorPoi.buildingIdentifier).toBe("string");
        expect(typeof indoorPoi.cartesianCoordinate).toBe("object");
        expect(typeof indoorPoi.coordinate).toBe("object");
        expect(typeof indoorPoi.floorIdentifier).toBe("string");
        expect(typeof indoorPoi.poiName).toBe("string");
        expect(typeof indoorPoi.position).toBe("object");
        expect(typeof indoorPoi.isIndoor).toBe("boolean");
        expect(typeof indoorPoi.isOutdoor).toBe("boolean");
        expect(typeof indoorPoi.category).toBe("string");
        expect(typeof indoorPoi.infoHtml).toBe("string");
        expect(typeof indoorPoi.customFields).toBe("object");
    });
    it("Check indoorPOI cartesiansCoordinate", () => {
        testCartesianCoordinate(indoorPoi.cartesianCoordinate);
    });
    it("Check indoorPOI coordinate", () => {
        testCoordinate(indoorPoi.coordinate);
    });
    it("Check indoorPOI position", () => {
        testPoint(indoorPoi.position);
    });
});
describe("Test fetchOutdoorPOIsFromBuilding ->", () => {
    it("Check returned value", () => {
        expect(outdoorPois).toBeDefined();
        expect(outdoorPois instanceof Array).toBe(true);
    });
    it("Check outdoorPOI", () => {
        expect((outdoorPoi = outdoorPois[0]));
        expect(typeof outdoorPoi).toBe("object");
        expect(typeof outdoorPoi.identifier).toBe("string");
        expect(typeof outdoorPoi.buildingIdentifier).toBe("string");
        expect(typeof outdoorPoi.cartesianCoordinate).toBe("object");
        expect(typeof outdoorPoi.coordinate).toBe("object");
        expect(typeof outdoorPoi.floorIdentifier).toBe("string");
        expect(typeof outdoorPoi.poiName).toBe("string");
        expect(typeof outdoorPoi.position).toBe("object");
        expect(typeof outdoorPoi.isIndoor).toBe("boolean");
        expect(typeof outdoorPoi.isOutdoor).toBe("boolean");
        expect(typeof outdoorPoi.category).toBe("string");
        expect(typeof outdoorPoi.infoHtml).toBe("string");
        expect(typeof outdoorPoi.customFields).toBe("object");
    });
    it("Check outdoorPOI cartesiansCoordinate", () => {
        testCartesianCoordinate(outdoorPoi.cartesianCoordinate);
    });
    it("Check outdoorPOI coordinate", () => {
        testCoordinate(outdoorPoi.coordinate);
    });
    it("Check outdoorPOI position", () => {
        testPoint(outdoorPoi.position);
    });
});
describe("Test fetchEventsFromBuilding ->", () => {
    it("Check returned value", () => {
        expect(events).toBeDefined();
        expect(events instanceof Array).toBe(true);
    });
    it("Check event", () => {
        expect((event = events[0]));
        expect(typeof event).toBe("object");
        expect(typeof event.buildingIdentifier).toBe("number");
        expect(typeof event.identifier).toBe("number");
        expect(typeof event.floorIdentifier).toBe("number");
        expect(typeof event.infoHtml).toBe("string");
        expect(typeof event.conversionArea).toBe("object");
        expect(typeof event.customFields).toBe("object");
        expect(typeof event.radius).toBe("number");
        expect(typeof event.x).toBe("number");
        expect(typeof event.y).toBe("number");
        expect(typeof event.name).toBe("string");
        expect(typeof event.trigger).toBe("object");
        expect(typeof event.conversion).toBe("object");
    });
    it("Check event conversionArea", () => {
        testConversionArea(event.conversionArea);
    });
    it("Check event conversion", () => {
        testCircle(event.conversion);
    });
    it("Check event trigger", () => {
        testCircle(event.trigger);
    });
});
describe("Test fetchPoiCategories ->", () => {
    it("Check returned value", () => {
        expect(poiCategories).toBeDefined();
        expect(poiCategories instanceof Array).toBe(true);
    });
    it("Check POICategory", () => {
        expect((poiCategory = poiCategories[0]));
        expect(typeof poiCategory).toBe("object");
        expect(typeof poiCategory.poiCategoryCode).toBe("string");
        expect(typeof poiCategory.poiCategoryName).toBe("string");
        expect(typeof poiCategory.icon_selected).toBe("string");
        expect(typeof poiCategory.icon_unselected).toBe("string");
        expect(typeof poiCategory.public).toBe("boolean");
    });
});
describe("Test fetchMapFromFloor ->", () => {
    it("Check map", () => {
        expect(map).toBeDefined();
        expect(typeof map.data).toBe("string");
    });
});
describe("Test fetchPoiCategoryIconNormal ->", () => {
    it("Check iconNormal", () => {
        expect(iconNormal).toBeDefined();
        expect(typeof iconNormal.data).toBe("string");
    });
});
describe("Test fetchPoiCategoryIconSelected ->", () => {
    it("Chek iconSelected", () => {
        expect(iconSelected).toBeDefined();
        expect(typeof iconSelected.data).toBe("string");
    });
});
describe("Test requestDirections ->", () => {
    it("Check returned value", () => {
        expect(route).toBeDefined();
        expect(typeof route).toBe("object");
    });
    it("Check route", () => {
        expect(route.edges instanceof Array).toBe(true);
        expect(typeof route.firstStep).toBe("object");
        expect(typeof route.from).toBe("object");
        expect(route.indications instanceof Array).toBe(true);
        expect(typeof route.lastStep).toBe("object");
        expect(route.nodes instanceof Array).toBe(true);
        expect(route.points instanceof Array).toBe(true);
        expect(route.segments instanceof Array).toBe(true);
        expect(typeof route.TO).toBe("object");
        expect(route.steps instanceof Array).toBe(true);
    });
    it("Check edge route", () => {
        expect((edge = route.edges[0]));
        expect(typeof edge).toBe("object");
        testRouteStep(edge);
    });
    it("Check firstStep route", () => {
        testRouteStep(route.firstStep);
    });
    it("Check from route", () => {
        testPoint(route.from);
    });
    it("Check indication route", () => {
        const indication = route.indications[0];
        expect(typeof indication).toBe("object");
        testIndication(indication);
    });
    it("Check lastStep route", () => {
        testRouteStep(route.lastStep);
    });
    it("Check node route", () => {
        expect((node = route.nodes[0]));
        expect(typeof node).toBe("object");
        testPoint(node);
    });
    it("Check point route", () => {
        expect((point = route.points[0]));
        expect(typeof point).toBe("object");
        testPoint(point);
    });
    it("Check segment route", () => {
        const segment = route.segments[0];
        expect(typeof segment).toBe("object");
        testSegment(segment);
    });
    it("Check TO route", () => {
        testPoint(route.TO);
    });
    it("Check step route", () => {
        expect((step = route.steps[0]));
        expect(typeof step).toBe("object");
        testRouteStep(step);
    });
});
describe("Test startPositioning ->", () => {
    it("Check returned value", () => {
        expect(starting).toBeDefined();
        expect(typeof starting).toBe("object");
    });
    it("Check starting - statusOrdinal_0", () => {
        expect(typeof starting.statusName).toBe("string");
        expect(typeof starting.statusOrdinal).toBe("number");
    });
    it("Check returned value - statusOrdinal_1", () => {
        expect(preparePositioningModel).toBeDefined();
        expect(typeof preparePositioningModel).toBe("object");
    });
    it("Check preparePositioningModel", () => {
        expect(typeof preparePositioningModel.statusName).toBe("string");
        expect(typeof preparePositioningModel.statusOrdinal).toBe("number");
    });
    it("Check returned value - statusOrdinal_5", () => {
        expect(startingPositioning).toBeDefined();
        expect(typeof startingPositioning).toBe("object");
    });
    it("Check startingPositioning", () => {
        expect(typeof startingPositioning.statusName).toBe("string");
        expect(typeof startingPositioning.statusOrdinal).toBe("number");
    });
    it("Check returned value - statusOrdinal_7", () => {
        expect(calculating).toBeDefined();
        expect(typeof calculating).toBe("object");
    });
    it("Check calculating", () => {
        expect(typeof calculating.statusName).toBe("string");
        expect(typeof calculating.statusOrdinal).toBe("number");
    });
    it("Check returned value - position", () => {
        expect(position).toBeDefined();
        expect(typeof position).toBe("object");
    });
    it("Check position", () => {
        expect(typeof position.accuracy).toBe("number");
        expect(typeof position.bearing).toBe("object");
        expect(typeof position.bearingQuality).toBe("string");
        expect(typeof position.buildingIdentifier).toBe("string");
        expect(typeof position.cartesianBearing).toBe("object");
        expect(typeof position.cartesianCoordinate).toBe("object");
        expect(typeof position.coordinate).toBe("object");
        expect(typeof position.floorIdentifier).toBe("string");
        expect(typeof position.position).toBe("object");
        expect(typeof position.provider).toBe("string");
        expect(typeof position.quality).toBe("string");
        expect(typeof position.hasBearing).toBe("boolean");
        expect(typeof position.timestamp).toBe("number");
        expect(typeof position.hasCartesianBearing).toBe("boolean");
        expect(typeof position.isIndoor).toBe("boolean");
        expect(typeof position.isOutdoor).toBe("boolean");
        expect(typeof position.deviceId).toBe("string");
    });
    it("Check position bearing", () => {
        testBearing(position.bearing);
    });
    it("Check position cartesianBearing", () => {
        testBearing(position.cartesianBearing);
    });
    it("Check position cartesianCoordinate", () => {
        testCartesianCoordinate(position.cartesianCoordinate);
    });
    it("Check position coordinate", () => {
        testCoordinate(position.coordinate);
    });
    it("Check position position", () => {
        testPoint(position.position);
    });
});
const testBounds = (bounds) => {
    expect(typeof bounds.northEast).toBe("object");
    expect(typeof bounds.northWest).toBe("object");
    expect(typeof bounds.southEast).toBe("object");
    expect(typeof bounds.southWest).toBe("object");
    testCoordinate(bounds.northEast);
    testCoordinate(bounds.northWest);
    testCoordinate(bounds.southEast);
    testCoordinate(bounds.southWest);
};
const testCoordinate = (coordinate) => {
    expect(typeof coordinate.latitude).toBe("number");
    expect(typeof coordinate.longitude).toBe("number");
};
const testDimension = (dimension) => {
    expect(typeof dimension.width).toBe("number");
    expect(typeof dimension.height).toBe("number");
};
const testCartesianCoordinate = (cartesianCoordinate) => {
    expect(typeof cartesianCoordinate.x).toBe("number");
    expect(typeof cartesianCoordinate.y).toBe("number");
};
const testPoint = (p) => {
    expect(typeof p.buildingIdentifier).toBe("string");
    expect(typeof p.cartesianCoordinate).toBe("object");
    expect(typeof p.coordinate).toBe("object");
    expect(typeof p.floorIdentifier).toBe("string");
    expect(typeof p.isIndoor).toBe("boolean");
    expect(typeof p.isOutdoor).toBe("boolean");
    testCartesianCoordinate(p.cartesianCoordinate);
    testCoordinate(p.coordinate);
};
const testConversionArea = (conversionArea) => {
    expect(typeof conversionArea.floorIdentifier).toBe("number");
    expect(typeof conversionArea.topLeft).toBe("string");
    expect(typeof conversionArea.topRight).toBe("string");
    expect(typeof conversionArea.bottomLeft).toBe("string");
    expect(typeof conversionArea.bottomRight).toBe("string");
};
const testCircle = (circle) => {
    expect(typeof circle.radius).toBe("number");
    expect(typeof circle.center).toBe("object");
    testPoint(circle.center);
};
const testRouteStep = (routeStep) => {
    expect(typeof routeStep.distance).toBe("number");
    expect(typeof routeStep.distanceToGoal).toBe("number");
    expect(typeof routeStep.from).toBe("object");
    expect(typeof routeStep.id).toBe("number");
    expect(typeof routeStep.TO).toBe("object");
    expect(typeof routeStep.isFirst).toBe("boolean");
    expect(typeof routeStep.isLast).toBe("boolean");
    testPoint(routeStep.from);
    testPoint(routeStep.TO);
};
const testIndication = (indication) => {
    expect(typeof indication.distance).toBe("number");
    expect(typeof indication.distanceToNextLevel).toBe("number");
    expect(typeof indication.indicationType).toBe("string");
    expect(typeof indication.orientation).toBe("number");
    expect(typeof indication.orientationType).toBe("string");
    expect(typeof indication.stepIdxDestination).toBe("number");
    expect(typeof indication.stepIdxOrigin).toBe("number");
    expect(typeof indication.neededLevelChange).toBe("boolean");
    expect(typeof indication.humanReadableMessage).toBe("string");
};
const testSegment = (segment) => {
    expect(typeof segment.floorIdentifier).toBe("string");
    expect(segment.points instanceof Array).toBe(true);
};
const testBearing = (bearing) => {
    expect(typeof bearing.degrees).toBe("number");
    expect(typeof bearing.degreesClockwise).toBe("number");
    expect(typeof bearing.radians).toBe("number");
    expect(typeof bearing.radiansMinusPiPi).toBe("number");
};
