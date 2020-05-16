//
//  AppDelegate.h
//  situmcordovaplugin
//
//  Created by Alberto Doval on 10/7/18.
//  Copyright © 2018 Alberto Doval. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreData/CoreData.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

@property (readonly, strong) NSPersistentContainer *persistentContainer;

- (void)saveContext;


@end

