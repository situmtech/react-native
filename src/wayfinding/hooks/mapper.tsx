import type { DirectionPoint, DirectionsOptions, Location, Poi } from "src/sdk";

export const poiToPoint = (poi: Poi): DirectionPoint => {
  return {
    floorIdentifier: poi.floorIdentifier,
    buildingIdentifier: poi.buildingIdentifier,
    cartesianCoordinate: poi.cartesianCoordinate,
    coordinate: poi.coordinate,
  };
};

export const locationToPoint = (location: Location): DirectionPoint => {
  return {
    floorIdentifier: location.position.floorIdentifier,
    buildingIdentifier: location.position.buildingIdentifier,
    cartesianCoordinate: location.position.cartesianCoordinate,
    coordinate: location.position.coordinate,
  };
};

export const destinationToPoint = (
  destination: DirectionsOptions["to"]
): DirectionPoint => {
  return {
    buildingIdentifier: destination.buildingIdentifier,
    floorIdentifier: destination.floorIdentifier,
    cartesianCoordinate: destination.cartesianCoordinate,
    coordinate: destination.coordinate,
  };
};
