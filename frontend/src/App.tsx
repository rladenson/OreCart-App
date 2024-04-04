import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { useCallback } from "react";
import { useFonts, Oswald_400Regular, OpenSans_400Regular } from "@expo-google-fonts/dev";

import Home from "./app/Home";
import store from "./app/store";
import { type OuterParamList } from "./common/navTypes";
import Color from "./common/style/color";
import LayoutStyle from "./common/style/layout";
import { ADARequestScreen } from "./features/ada/ADARequestScreen";
import { AlertScreen } from "./features/alert/AlertScreen";
import { BugReportScreen } from "./features/report/BugReportScreen";
import { SettingsScreen } from "./features/settings/SettingsScreen";
import SplashScreen from "expo-splash-screen";
// -----
// DO NOT PUT ANY SUBSTANTIAL UI OR LOGIC INTO THIS FILE. ONLY INCLUDE SYSTEM CONFIGURATION.
// -----

if (Platform.OS === "android") {
  NavigationBar.setBackgroundColorAsync(Color.generic.white).catch(
    console.error,
  );
  // Enable later to do full edge-to-edge
  // NavigationBar.setPositionAsync("absolute");
  // // transparent backgrounds to see through
  // NavigationBar.setBackgroundColorAsync("#ffffff00");
  // // changes the color of the button icons "dark||light"
  // NavigationBar.setButtonStyleAsync("dark");
}

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator<OuterParamList>();

const App = (): React.JSX.Element => {

  let [fontsLoaded] = useFonts({
    Oswald_400Regular,
    OpenSans_400Regular
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View/>;
  }
  return (
    <Provider store={store}>
      <StatusBar style="auto" translucent backgroundColor="transparent" />
      <SafeAreaProvider>
        <View 
          style={LayoutStyle.fill}
          onLayout={onLayoutRootView}
        >
          <NavigationContainer>
            <Stack.Navigator
              id={"Outer"}
              screenOptions={{
                headerStyle: {
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                },
                cardStyle: { backgroundColor: Color.generic.white },
              }}
            >
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Alerts"
                component={AlertScreen}
                options={{ title: "Upcoming Alerts" }}
              />
              <Stack.Screen
                name="ADARequest"
                component={ADARequestScreen}
                options={{ title: "ADA Ride Request" }}
              />
              <Stack.Screen
                name="BugReport"
                component={BugReportScreen}
                options={{ title: "Bug Report" }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: "Settings" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast position="bottom" />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
};
export default App;
