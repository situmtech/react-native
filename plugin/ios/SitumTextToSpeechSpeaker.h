//
//  SitumTextToSpeechSpeaker.h
//  ReactNativeSitumPlugin
//
//  Created by Cristian on 1/10/25.
//

#import <Foundation/Foundation.h>
NS_ASSUME_NONNULL_BEGIN

@interface SitumTextToSpeechSpeaker : NSObject
/**
 *  Init method. Call it to let this class instantiate its internal classes.
 */
- (instancetype)init;

/**
 Processes and speaks aloud a message that MapView's wants to communicate to the user through the 'ui.speak_aloud_text' javascript message.
 
 @param payload An internal dictionary from within MapView that contains the required information and parameters to be able to speak aloud texts.
 */
- (void)speakWithPayload:(NSDictionary<id, id> * _Nullable)payload;

- (void)onVisibilityChanged:(bool)isVisible;
@end

NS_ASSUME_NONNULL_END
