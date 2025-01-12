import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import FlashMessage from "react-native-flash-message";
import { GlobalContextProvider } from "./context/GlobalContextProvider";
import reducer, { initState } from "./context/reducer";
import { SafeAreaView } from "react-native";
import Main from "./Main";
import SplashScreen from "./components/SplashScreen";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GlobalContextProvider initialState={initState} reducer={reducer}>
        <QueryClientProvider client={queryClient}>
          {isLoading ? <SplashScreen /> : <Main />}
        </QueryClientProvider>
      </GlobalContextProvider>
      <FlashMessage position="top" duration={5000} hideOnPress={true} />
    </SafeAreaView>
  );
};

export default App;
