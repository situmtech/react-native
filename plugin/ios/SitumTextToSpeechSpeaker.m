//
//  SITTextToSpeechManager.m
//  SitumSDK
//
//  Created by Cristian on 26/8/25.
//  Copyright © 2025 Situm. All rights reserved.
//

#import <AVFoundation/AVFoundation.h>

#import "SitumTextToSpeechSpeaker.h"

@interface SitumTextToSpeechSpeaker () <AVSpeechSynthesizerDelegate>
@property (nonatomic, strong) AVSpeechSynthesizer *synthesizer;
@property (nonatomic) bool shouldSpeak;
@end

@implementation SitumTextToSpeechSpeaker

- (instancetype)init {
    self = [super init];
    if (self) {
        self.synthesizer = [AVSpeechSynthesizer new];
        self.synthesizer.delegate = self;
    }
    return self;
}

- (void)speakWithPayload:(NSDictionary<id,id> *)payload {

    if (![payload isKindOfClass:[NSDictionary class]]) return;

    NSString *text = payload[@"text"];
    NSString *lang = payload[@"lang"];
    NSNumber *pitchNum = payload[@"pitch"];
    NSNumber *rateNum  = payload[@"rate"];

    if (![text isKindOfClass:[NSString class]] ||
        ![lang isKindOfClass:[NSString class]] ||
        ![pitchNum isKindOfClass:[NSNumber class]] ||
        ![rateNum isKindOfClass:[NSNumber class]]) {
        return;
    }

    float pitch = pitchNum.floatValue;
    float rate  = rateNum.floatValue;

    [self speakText:text language:lang rate:rate pitch:pitch];
}

- (void)speakText:(NSString *)text language:(NSString *)language rate:(float)rate pitch:(float)pitch {
    if (text.length == 0) return;
    
    AVSpeechUtterance *utt = [[AVSpeechUtterance alloc] initWithString:text];
    utt.rate = rate;
    utt.pitchMultiplier = pitch;

    AVSpeechSynthesisVoice *voice = [AVSpeechSynthesisVoice voiceWithLanguage:language];
    if (voice) {
        utt.voice = voice;
    }

    dispatch_async(dispatch_get_main_queue(), ^{
        if ([self.synthesizer isSpeaking]) {
            [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
        }
        if (self.shouldSpeak) {
            [self.synthesizer speakUtterance:utt];
        }
    });
}

- (void)onVisibilityChanged:(bool) isVisible {
    _shouldSpeak = isVisible;
    if (!_shouldSpeak) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
        });
    }
}

@end
