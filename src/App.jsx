import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SavedProvider } from './context/SavedContext';
import { TripProvider } from './context/TripContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchOverlay from './components/SearchOverlay';
import Toast from './components/Toast';
import ComparePanel from './components/ComparePanel';
import LoadingScreen from './components/LoadingScreen';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import DestinationDetails from './pages/DestinationDetails';
import MapPage from './pages/Map';
import Planner from './pages/Planner';
import Saved from './pages/Saved';
import Compare from './pages/Compare';
import Journal from './pages/Journal';
import JournalDetails from './pages/JournalDetails';
import About from './pages/About';
import NotFound from './pages/NotFound';

function AppRoutes() {
  const location = useLocation();

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<JournalDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <SavedProvider>
          <TripProvider>
            {/* Branded intro loading screen */}
            <LoadingScreen />

            {/* Application shell */}
            <div className="flex flex-col min-h-screen bg-aether-bgLight dark:bg-aether-bgDark text-aether-textMain dark:text-aether-textLight transition-colors duration-300">
              <Navbar />

              <div className="flex-1">
                <AppRoutes />
              </div>

              <Footer />

              {/* Global Overlays */}
              <SearchOverlay />
              <ComparePanel />
              <Toast />
            </div>
          </TripProvider>
        </SavedProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
