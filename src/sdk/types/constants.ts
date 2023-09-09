export enum NavigationStatus {
  START = "start",
  STOP = "stop",
  OUT_OF_ROUTE = "outOfRoute",
  UPDATE = "update",
}

export enum NavigationUpdateType {
  PROGRESS = "PROGRESS",
  OUT_OF_ROUTE = "OUT_OF_ROUTE",
  FINISHED = "DESTINATION_REACHED",
}

export enum SdkNavigationUpdateType {
  PROGRESS = "progress",
  OUT_OF_ROUTE = "userOutsideRoute",
  FINISHED = "destinationReached",
}

export enum LocationStatusName {
  STARTING = "STARTING",
  CALCULATING = "CALCULATING",
  // This status will always be sent to mapviewer-web, in case we recieve
  // a location from SDK.
  POSITIONING = "POSITIONING",
  USER_NOT_IN_BUILDING = "USER_NOT_IN_BUILDING",
  STOPPED = "STOPPED",
}
