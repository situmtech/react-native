import SitumPlugin, {Building, BuildingInfo} from '@situm/react-native';

export const fetchBuilding = async (buildingId: String): Promise<Building> => {
  try {
    const buildings = await SitumPlugin.fetchBuildings();

    if (!buildings || buildings.length === 0) {
      console.log(
        'No buildings, add a few buildings first by going to:\nhttps://dashboard.situm.es/buildings',
      );
      throw new Error('No buildings found');
    }

    const myBuilding = buildings.filter(
      b => b.buildingIdentifier === buildingId,
    );

    if (myBuilding.length === 0) {
      console.log(
        'Please specify a building ID that exists on your account (on situm.tsx file)',
      );
      throw new Error('Building ID not found');
    }

    return myBuilding[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchBuildingInfo = async (building: Building): Promise<any> => {
  try {
    const buildingInfo: BuildingInfo = await SitumPlugin.fetchBuildingInfo(
      building,
    );

    if (!buildingInfo || buildingInfo.floors.length === 0) {
      console.log('No buildingInfo found!');
      throw new Error('No buildingInfo found');
    }

    return buildingInfo;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
