export const lockStateMachine = (from) => {
  const states = {
    unlocked: ['locking'],
    locking: ['locked', 'unlocked'],
    locked: ['unlocking'],
    unlocking: ['unlocked', 'locked'],
  };
  return {
    next: () => states[from][0],
    prev: () => states[from][1],
  };
};

export const delay = (duration) => new Promise((r) => setTimeout(r, duration));
