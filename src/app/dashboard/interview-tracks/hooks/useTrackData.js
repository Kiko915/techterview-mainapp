"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { getUserByUID } from "@/lib/firestore";
import { getRecommendedTrack } from "../recommendationService";
import { 
  getSkillsByTrack, 
  getColorByTrack, 
  getCategoryByTrack 
} from "../utils";

/**
 * Custom hook for fetching and managing track data
 */
export const useTrackData = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from Firestore
        const tracksRef = collection(db, "tracks");
        const querySnapshot = await getDocs(tracksRef);
        
        if (!querySnapshot.empty) {
          // Fetch tracks with their modules count
          const firestoreTracks = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const data = doc.data();
              
              // Fetch modules count from subcollection
              let modulesCount = 0;
              try {
                const modulesRef = collection(db, "tracks", doc.id, "modules");
                const modulesSnapshot = await getDocs(modulesRef);
                modulesCount = modulesSnapshot.size;
              } catch (modulesError) {
                console.warn(`Error fetching modules for ${doc.id}:`, modulesError);
                // Fallback to calculation if subcollection query fails
                modulesCount = Math.ceil(data.estimatedTime * 1.5);
              }
              
              // Map Firebase data structure to our component structure
              return {
                id: doc.id,
                title: data.title,
                description: data.description,
                imageUrl: data.image, // Firebase uses 'image' field
                difficulty: data.difficulty,
                duration: `${data.estimatedTime} hours`, // Convert estimatedTime to duration string
                modules: modulesCount, // Use actual modules count from subcollection
                enrolled: data.enrolled || Math.floor(Math.random() * 1000) + 500, // Random enrollment if not provided
                rating: data.rating || (4.3 + Math.random() * 0.6), // Random rating if not provided
                skills: data.skills || getSkillsByTrack(data.title), // Generate skills based on track title
                color: getColorByTrack(data.title),
                isLocked: data.isLocked || false,
                completedModules: data.completedModules || 0,
                category: getCategoryByTrack(data.title),
                createdAt: data.createdAt
              };
            })
          );
          setTracks(firestoreTracks);
        } else {
          // No tracks found in Firestore
          console.log("No tracks found in Firestore");
          setTracks([]);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
        // Set empty array on error
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return { tracks, loading };
};

/**
 * Custom hook for fetching and managing user profile data
 */
export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserByUID(user.uid);
          console.log('User profile fetched:', profile);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  return { user, userProfile };
};

/**
 * Custom hook for getting candidate count
 */
export const useCandidateCount = () => {
  const [candidateCount, setCandidateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateCount = async () => {
      try {
        setLoading(true);
        
        // Fetch all users from Firestore
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        
        // Count users with role 'candidate'
        let count = 0;
        querySnapshot.docs.forEach(doc => {
          const userData = doc.data();
          if (userData.role === 'candidate') {
            count++;
          }
        });
        
        setCandidateCount(count);
      } catch (error) {
        console.error("Error fetching candidate count:", error);
        // Fallback to a reasonable number if there's an error
        setCandidateCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateCount();
  }, []);

  return { candidateCount, loading };
};

/**
 * Custom hook for managing track recommendations
 */
export const useRecommendations = (userProfile, tracks) => {
  const [recommendedTrack, setRecommendedTrack] = useState(null);

  useEffect(() => {
    console.log('Recommendation effect triggered:', {
      userProfile: userProfile,
      skill: userProfile?.skill,
      skillArea: userProfile?.skillArea,
      tracksLength: tracks.length,
      tracks: tracks
    });
    
    if (userProfile && tracks.length > 0) {
      // Check both 'skill' and 'skillArea' fields for backwards compatibility
      const userSkill = userProfile.skill || userProfile.skillArea;
      const recommended = getRecommendedTrack(userSkill, tracks);
      console.log('Recommended track result:', recommended);
      setRecommendedTrack(recommended);
    }
  }, [userProfile, tracks]);

  return { recommendedTrack };
};