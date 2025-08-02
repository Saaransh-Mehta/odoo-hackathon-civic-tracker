import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserReport {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  submittedAt: string;
  updatedAt: string;
  isAnonymous: boolean;
  submittedBy: string;
}

interface UserReportsState {
  reports: UserReport[];
  addReport: (report: Omit<UserReport, 'id' | 'submittedAt' | 'updatedAt'>) => string;
  updateReportStatus: (reportId: string, status: UserReport['status']) => void;
  getUserReports: (userId: string) => UserReport[];
  getReportById: (reportId: string) => UserReport | undefined;
  clearUserReports: () => void;
}

export const useUserReportsStore = create<UserReportsState>()(
  persist(
    (set, get) => ({
      reports: [],
      
      addReport: (reportData) => {
        const newReport: UserReport = {
          ...reportData,
          id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          reports: [newReport, ...state.reports]
        }));
        
        return newReport.id;
      },
      
      updateReportStatus: (reportId, status) => {
        set((state) => ({
          reports: state.reports.map(report =>
            report.id === reportId
              ? { ...report, status, updatedAt: new Date().toISOString() }
              : report
          )
        }));
      },
      
      getUserReports: (userId) => {
        const state = get();
        return state.reports.filter(report => report.submittedBy === userId);
      },
      
      getReportById: (reportId) => {
        const state = get();
        return state.reports.find(report => report.id === reportId);
      },
      
      clearUserReports: () => {
        set({ reports: [] });
      }
    }),
    {
      name: 'user-reports-storage',
      version: 1,
    }
  )
);
