export default {
  start: (eventsManager) => {
    eventsManager.on('lock-changed-status', (lock, newStatus) => {
      const timestamp = new Date();
      console.log(
        `${timestamp.toISOString()} DOOR CHANGED STATUS ${newStatus} ${JSON.stringify(
          lock
        )}`
      );
    });

    eventsManager.on('error', (error) => {
      const timestamp = new Date();
      console.log(`${timestamp.toISOString()} ERROR ${error}`);
    });
  },
};

