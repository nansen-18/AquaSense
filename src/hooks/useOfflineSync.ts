import { useState, useEffect } from 'react';
import { HazardReport } from '../types';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingReports, setPendingReports] = useState<HazardReport[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending reports from localStorage
    const stored = localStorage.getItem('pending_reports');
    if (stored) {
      setPendingReports(JSON.parse(stored));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addPendingReport = (report: HazardReport) => {
    const updatedReports = [...pendingReports, report];
    setPendingReports(updatedReports);
    localStorage.setItem('pending_reports', JSON.stringify(updatedReports));
  };

  const syncPendingReports = async () => {
    if (!isOnline || pendingReports.length === 0) return;

    try {
      // In a real app, this would send reports to the server
      console.log('Syncing pending reports:', pendingReports);
      
      // Clear pending reports after successful sync
      setPendingReports([]);
      localStorage.removeItem('pending_reports');
      
      return true;
    } catch (error) {
      console.error('Failed to sync reports:', error);
      return false;
    }
  };

  useEffect(() => {
    if (isOnline) {
      syncPendingReports();
    }
  }, [isOnline]);

  return {
    isOnline,
    pendingReports,
    addPendingReport,
    syncPendingReports
  };
}