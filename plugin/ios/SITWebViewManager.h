//
//  SITWebViewManager.h
//  ReactNativeSitumPlugin
//
//  Created by Rodrigo Lago on 11/8/25.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
#import <SitumSDK/SitumSDK.h>


NS_ASSUME_NONNULL_BEGIN

@interface SITWebViewManager : RCTViewManager {
  SITMapView *_view;
}

@end

NS_ASSUME_NONNULL_END
