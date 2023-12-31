import { EuiGlobalToastList, EuiProvider, EuiThemeColorMode, EuiThemeProvider } from "@elastic/eui";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import ThemeSelector from "./components/ThemeSelector";
import CreateMeeting from "./pages/CreateMeeting";
import OneOnOneMeeting from "./pages/OneOnOneMeeting";
import { setToasts } from "./app/slices/MeetingSlice";
import VideoConference from "./pages/VideoConference";
import MyMeetings from "./pages/MyMeetings";
import Meeting from "./pages/Meeting";
import JoinMeeting from "./pages/JoinMeeting";

function App() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((zoom)=>zoom.meetings.toasts);
  const isDarkTheme = useAppSelector((zoom) => zoom.auth.isDarkTheme);
  const [isInitialEffect, setIsInitialEffect] = useState(true);
  const [theme, setTheme] = useState<EuiThemeColorMode>("light");
  useEffect(() => {
    const theme = localStorage.getItem("zoom-theme");
    if (theme) {
      setTheme(theme as EuiThemeColorMode);
    } else {
      localStorage.setItem("zoom-theme", "light");
    }
  }, []);
  useEffect(() => {
    if (isInitialEffect) {
      setIsInitialEffect(false);
    } else {
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkTheme]);
  const overrides = {
    colors: {
      LIGHT: { primary: "#0b5cff" },
      DARK: { primary: "#0b5cff" },
    },
  };
  const removeToast = (removeToast:{id:string})=>{
    dispatch(setToasts(
      toasts.filter((toast:{id:string})=>toast.id!==removeToast.id)
    ))
  }

  return (
    <ThemeSelector>
      <EuiProvider colorMode={theme}>
        <EuiThemeProvider modify={overrides}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreateMeeting/>}/>
            <Route path="/create1on1" element={<OneOnOneMeeting/>}/>
            <Route path="/videoconference" element={<VideoConference/>}/>
            <Route path="/mymeetings" element={<MyMeetings/>}/>
            <Route path="/meetings" element={<Meeting/>}/>
            <Route path="/join/:id" element={<JoinMeeting/>}/>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
          <EuiGlobalToastList
          toasts={toasts}
          dismissToast={removeToast}
          toastLifeTimeMs={5000}
          />
        </EuiThemeProvider>
      </EuiProvider>
    </ThemeSelector>
  );
}

export default App;
