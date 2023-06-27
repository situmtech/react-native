/* eslint-disable no-undef */

import { NativeModules } from 'react-native';
import SitumPlugin from '..';

describe('Test buildings related data (list, info, floors)', () => {
  it('should fetch buildings list and pass it to given callback', () => {
    const success = () => { };
    const error = () => { };

    SitumPlugin.fetchBuildings(success, error);

    expect(
      NativeModules.RNCSitumPlugin.fetchBuildings.mock.calls.length,
    ).toEqual(1);

    expect(NativeModules.RNCSitumPlugin.fetchBuildings.mock.calls[0][0]).toBe(
      success,
    );

    expect(NativeModules.RNCSitumPlugin.fetchBuildings.mock.calls[0][1]).toBe(
      error,
    );
  });
  it('should fetch building info from building and pass it to given callback', () => {
    const building = jest.mock();
    const success = () => { };
    const error = () => { };

    SitumPlugin.fetchBuildingInfo(building, success, error);

    expect(
      NativeModules.RNCSitumPlugin.fetchBuildingInfo.mock.calls.length,
    ).toEqual(1);

    expect(
      NativeModules.RNCSitumPlugin.fetchBuildingInfo.mock.calls[0][0],
    ).toBe(building);
    expect(
      NativeModules.RNCSitumPlugin.fetchBuildingInfo.mock.calls[0][1],
    ).toBe(success);

    expect(
      NativeModules.RNCSitumPlugin.fetchBuildingInfo.mock.calls[0][2],
    ).toBe(error);
  });

  it('should fetch floor list from building and pass it to given callback', () => {
    const building = jest.mock();
    const success = () => { };
    const error = () => { };

    SitumPlugin.fetchFloorsFromBuilding(building, success, error);

    expect(
      NativeModules.RNCSitumPlugin.fetchFloorsFromBuilding.mock.calls.length,
    ).toEqual(1);

    expect(
      NativeModules.RNCSitumPlugin.fetchFloorsFromBuilding.mock.calls[0][0],
    ).toBe(building);
    expect(
      NativeModules.RNCSitumPlugin.fetchFloorsFromBuilding.mock.calls[0][1],
    ).toBe(success);

    expect(
      NativeModules.RNCSitumPlugin.fetchFloorsFromBuilding.mock.calls[0][2],
    ).toBe(error);
  });

  it('should fetch floor map from floor and pass it to given callback', () => {
    const floor = jest.mock();
    const success = () => { };
    const error = () => { };

    SitumPlugin.fetchMapFromFloor(floor, success, error);

    expect(
      NativeModules.RNCSitumPlugin.fetchMapFromFloor.mock.calls.length,
    ).toEqual(1);

    expect(
      NativeModules.RNCSitumPlugin.fetchMapFromFloor.mock.calls[0][0],
    ).toBe(floor);
    expect(
      NativeModules.RNCSitumPlugin.fetchMapFromFloor.mock.calls[0][1],
    ).toBe(success);

    expect(
      NativeModules.RNCSitumPlugin.fetchMapFromFloor.mock.calls[0][2],
    ).toBe(error);
  });

  it('should fetch geofence from building and pass it to given callback', () => {
    const building = jest.mock();
    const success = () => { };
    const error = () => { };

    SitumPlugin.fetchGeofencesFromBuilding(building, success, error);

    expect(
      NativeModules.RNCSitumPlugin.fetchGeofencesFromBuilding.mock.calls.length,
    ).toEqual(1);

    expect(
      NativeModules.RNCSitumPlugin.fetchGeofencesFromBuilding.mock.calls[0][0],
    ).toBe(building);
    expect(
      NativeModules.RNCSitumPlugin.fetchGeofencesFromBuilding.mock.calls[0][1],
    ).toBe(success);

    expect(
      NativeModules.RNCSitumPlugin.fetchGeofencesFromBuilding.mock.calls[0][2],
    ).toBe(error);
  });

  it('should check if point is in a geofence', () => {
    const request = jest.mock();
    const callback = () => { };

    SitumPlugin.checkIfPointInsideGeofence(request, callback);

    expect(
      NativeModules.RNCSitumPlugin.checkIfPointInsideGeofence.mock.calls.length,
    ).toEqual(1);

    expect(
      NativeModules.RNCSitumPlugin.checkIfPointInsideGeofence.mock.calls[0][0],
    ).toBe(request);
    expect(
      NativeModules.RNCSitumPlugin.checkIfPointInsideGeofence.mock.calls[0][1],
    ).toBe(callback);
  });

  it('should fetch indoor POIs from building and pass it to given callback', () => {
    const building = jest.mock();
    const success = () => { };
    const error = () => { };

    SitumPlugin.fetchIndoorPOIsFromBuilding(building, success, error);

    expect(
      NativeModules.RNCSitumPlugin.fetchIndoorPOIsFromBuilding.mock.calls
        .length,
    ).toEqual(1);

    expect(
      NativeModules.RNCSitumPlugin.fetchIndoorPOIsFromBuilding.mock.calls[0][0],
    ).toBe(building);
    expect(
      NativeModules.RNCSitumPlugin.fetchIndoorPOIsFromBuilding.mock.calls[0][1],
    ).toBe(success);

    expect(
      NativeModules.RNCSitumPlugin.fetchIndoorPOIsFromBuilding.mock.calls[0][2],
    ).toBe(error);
  });

  it('should fetch outdoor POIs from building and pass it to given callback', () => {
    const building = jest.mock();
    const success = () => { };
    const error = () => { };

    SitumPlugin.fetchOutdoorPOIsFromBuilding(building, success, error);

    expect(
      NativeModules.RNCSitumPlugin.fetchOutdoorPOIsFromBuilding.mock.calls
        .length,
    ).toEqual(1);

    expect(
      NativeModules.RNCSitumPlugin.fetchOutdoorPOIsFromBuilding.mock
        .calls[0][0],
    ).toBe(building);
    expect(
      NativeModules.RNCSitumPlugin.fetchOutdoorPOIsFromBuilding.mock
        .calls[0][1],
    ).toBe(success);

    expect(
      NativeModules.RNCSitumPlugin.fetchOutdoorPOIsFromBuilding.mock
        .calls[0][2],
    ).toBe(error);
  });

  it('should fetch events from building and pass it to given callback', () => {
    const building = jest.mock();
    const success = () => { };
    const error = () => { };

    SitumPlugin.fetchEventsFromBuilding(building, success, error);

    expect(
      NativeModules.RNCSitumPlugin.fetchEventsFromBuilding.mock.calls.length,
    ).toEqual(1);

    expect(
      NativeModules.RNCSitumPlugin.fetchEventsFromBuilding.mock.calls[0][0],
    ).toBe(building);
    expect(
      NativeModules.RNCSitumPlugin.fetchEventsFromBuilding.mock.calls[0][1],
    ).toBe(success);

    expect(
      NativeModules.RNCSitumPlugin.fetchEventsFromBuilding.mock.calls[0][2],
    ).toBe(error);
  });
});
