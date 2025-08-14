import React, { useState } from 'react';
import { HomePage } from '../pages/home';
import { Header } from './ui/Header';
import type { ViewChangeEvent } from '../shared/types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'guide' | 'map' | 'community' | 'profile'>('home');

  const handleViewChange = (view: string) => {
    setCurrentView(view as any);
  };

  const renderCurrentPage = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onViewChange={handleViewChange} />;
      case 'guide':
        return <div className="container mx-auto px-4 py-8">고양이 도감 페이지 (준비 중)</div>;
      case 'map':
        return <div className="container mx-auto px-4 py-8">지도 페이지 (준비 중)</div>;
      case 'community':
        return <div className="container mx-auto px-4 py-8">커뮤니티 페이지 (준비 중)</div>;
      case 'profile':
        return <div className="container mx-auto px-4 py-8">프로필 페이지 (준비 중)</div>;
      default:
        return <HomePage onViewChange={handleViewChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentView={currentView}
        onViewChange={handleViewChange}
        notificationCount={3}
      />
      
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}