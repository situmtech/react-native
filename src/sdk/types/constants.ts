export enum NavigationStatus {
  START = "start",
  STOP = "stop",
  UPDATE = "update",
}

export enum NavigationUpdateType {
  progress = "PROGRESS",
  userOutsideRoute = "OUT_OF_ROUTE",
  destinationReached = "DESTINATION_REACHED",
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
