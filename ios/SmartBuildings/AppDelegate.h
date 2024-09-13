#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
@import UserNotifications;

@interface AppDelegate : UIResponder <UIApplicationDelegate,UNUserNotificationCenterDelegate>

// @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
