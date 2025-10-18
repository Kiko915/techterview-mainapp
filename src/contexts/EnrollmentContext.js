"use client";

import { createContext, useContext, useState, useCallback } from 'react';

const EnrollmentContext = createContext();

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  
  // Return a fallback object if context is not available
  if (!context) {
    return {
      enrollments: {},
      updateEnrollment: () => {},
      getEnrollmentStatus: () => ({ isEnrolled: false, data: null }),
      clearEnrollment: () => {},
      refreshTrigger: 0,
      triggerRefresh: () => {}
    };
  }
  
  return context;
};

export const EnrollmentProvider = ({ children }) => {
  // Store enrollment status by trackId
  const [enrollments, setEnrollments] = useState({});
  
  // Update enrollment for a specific track
  const updateEnrollment = useCallback((trackId, isEnrolled, enrollmentData = null) => {
    setEnrollments(prev => ({
      ...prev,
      [trackId]: {
        isEnrolled,
        data: enrollmentData,
        updatedAt: Date.now()
      }
    }));
  }, []);

  // Get enrollment status for a track
  const getEnrollmentStatus = useCallback((trackId) => {
    return enrollments[trackId] || { isEnrolled: false, data: null };
  }, [enrollments]);

  // Clear enrollment for a track
  const clearEnrollment = useCallback((trackId) => {
    setEnrollments(prev => {
      const newEnrollments = { ...prev };
      delete newEnrollments[trackId];
      return newEnrollments;
    });
  }, []);

  // Trigger refresh for all components listening to a specific track
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const value = {
    enrollments,
    updateEnrollment,
    getEnrollmentStatus,
    clearEnrollment,
    refreshTrigger,
    triggerRefresh
  };

  return (
    <EnrollmentContext.Provider value={value}>
      {children}
    </EnrollmentContext.Provider>
  );
};