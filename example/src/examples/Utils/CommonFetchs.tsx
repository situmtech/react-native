import SitumPlugin from '@situm/react-native';

const fetchBuilding = async (buildingId: String) => {
  return new Promise((resolve, reject) => {
    SitumPlugin.fetchBuildings(
      (buildings: any) => {
        if (!buildings || buildings.length == 0) {
          console.log(
            'No buildings, add a few buildings first by going to:\nhttps://dashboard.situm.es/buildings',
          );
          return;
        }
        var myBuilding = buildings.filter(
          b => b.buildingIdentifier == buildingId,
        );
        if (myBuilding.length == 0) {
          console.log(
            'Please specify a building ID that exists on your account (on situm.tsx file)',
          );
          return;
        }
        resolve(myBuilding[0]);
      },
      (error: any) => {
        reject(error);
      },
    );
  });
};

const fetchBuildingInfo = (building: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    SitumPlugin.fetchBuildingInfo(
      building,
      (buildingInfo: any) => {
        if (buildingInfo.floors.length == 0) {
          console.log('No buildingInfo found!');
          return;
        }
        resolve(buildingInfo);
      },
      (error: string) => {
        reject(error);
      },
    );
  });
};

export {fetchBuilding, fetchBuildingInfo};
