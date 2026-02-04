import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import Dashboard from "./screens/Dashboard";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import SkillAssessment from "./screens/SkillAssessment";
import InterestAnalysis from "./screens/InterestAnalysis";
import CareerRecommendation from "./screens/CareerRecommendation";
import LearningRoadmap from "./screens/LearningRoadmap";
import ReportDownload from "./screens/ReportDownload";
import ReportView from "./screens/ReportView";
import Help from "./screens/Help";
import RoadmapGenerator from "./screens/RoadmapGenerator";

const Stack = createNativeStackNavigator();

const LandingStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LandingScreen" component={Landing} />
      <Stack.Screen name="LoginScreen" component={Login} />
    </Stack.Navigator>
  );
};

const CareerGuidanceStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SkillAssessment" component={SkillAssessment} />
      <Stack.Screen name="InterestAnalysis" component={InterestAnalysis} />
      <Stack.Screen name="CareerRecommendation" component={CareerRecommendation} />
      <Stack.Screen name="LearningRoadmap" component={LearningRoadmap} />
      <Stack.Screen name="ReportDownload" component={ReportDownload} />
      <Stack.Screen name="ReportView" component={ReportView} />
    </Stack.Navigator>
  );
};

const MainAppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardScreen" component={Dashboard} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="RoadmapGenerator" component={RoadmapGenerator} />
      <Stack.Screen name="CareerGuidance" component={CareerGuidanceStack} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" translucent={false} />
      <NavigationContainer>
        <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Landing"
      >
        <Stack.Screen
          name="Landing"
          component={LandingStack}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={MainAppStack}
          options={{ animationEnabled: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
