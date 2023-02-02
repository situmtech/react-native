const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = 0.001;

export const calculateBuildingLocation = (building: any) => {
  let bottomLeft = [
    building.bounds.southWest.latitude,
    building.bounds.southWest.longitude,
  ];
  let topRight = [
    building.bounds.northEast.latitude,
    building.bounds.northEast.longitude,
  ];
  let rotationDegrees = building.rotation * (180 / Math.PI);

  return {
    bounds: [bottomLeft, topRight],
    map_region: {
      latitude: building.center.latitude as number,
      longitude: building.center.longitude as number,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    bearing: rotationDegrees,
  };
};
