import fetch from 'node-fetch';
import config from 'config';

const apiUrl = config.get('SMART_LOCK.BASE_URL');

const smartLock = {
  locking: async (lockGuid, status) => {
    const req = {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await fetch(`${apiUrl}/locks/${lockGuid}/locking`, req).catch(
      (e) => {
        return {
          ok: false,
          statusText: e.message,
        };
      }
    );
    return {
      ok: res.ok,
      data: res.ok ? await res.json() : { error: res.statusText },
    };
  },
};

export default smartLock;

