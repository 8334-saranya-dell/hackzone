import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { LocationsView } from './components/LocationsView';
import { SavedView } from './components/SavedView';
import { AddHackathonView } from './components/AddHackathonView';
import { HackathonDetails } from './components/HackathonDetails';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginView, RegisterView } from './components/AuthModals';

const MainContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderRoute = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return <ExploreView />;
      case 'locations':
        return <LocationsView />;
      case 'saved':
        return <SavedView />;
      case 'add-hackathon':
        return <AddHackathonView />;
      case 'details':
        return <HackathonDetails />;
      case 'dashboard':
        return <StudentDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'login':
        return <LoginView />;
      case 'register':
        return <RegisterView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      <Navbar />
      <main className="flex-1">
        {renderRoute()}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
