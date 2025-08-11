//
//  SITWebViewManager.m
//  ReactNativeSitumPlugin
//
//  Created by Rodrigo Lago on 11/8/25.
//

#import "SITWebViewManager.h"

@implementation SITWebViewManager

RCT_EXPORT_MODULE(WebView)

- (UIView *)view
{
  _view = [[SITMapView alloc] init];
  // TODO: usar arguments, SITMapViewConfiguration#fromMap().
  SITMapViewConfiguration *config = [[SITMapViewConfiguration alloc] initWithBuildingIdentifier:@"7033" profile:@""];
  [_view loadWithConfiguration:config withCompletion:^(id<SITMapViewController>  _Nonnull mapViewController, NSError * _Nullable error) {
      if (error) {
          NSLog(@"Error loading map: %@", error.localizedDescription);
      } else {
          NSLog(@"Map loaded properly");
      }
  }];
  return _view;
}

@end
