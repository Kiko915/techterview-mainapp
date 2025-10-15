/**
 * Profile update event system
 * Simple pub/sub for profile updates across components
 */

class ProfileEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

// Create a global instance
const profileEvents = new ProfileEventEmitter();

// Helper functions for profile update events
export const emitProfileUpdate = (updatedProfile) => {
  profileEvents.emit('profile-updated', updatedProfile);
};

export const onProfileUpdate = (callback) => {
  profileEvents.on('profile-updated', callback);
};

export const offProfileUpdate = (callback) => {
  profileEvents.off('profile-updated', callback);
};

export default profileEvents;