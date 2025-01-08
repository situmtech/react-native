## Unreleased
### Changed
- Now all `SitumPlugin` callbacks behave like setters. Until now, every time methods such as `SitumPlugin.onLocationUpdate(callback)` or `SitumPlugin.onEnterGeofences(callback)` were invoked, the callback functions were added as many times as the methods were called. This behavior was prone to unnecessary duplications and related issues. From now on, these methods will act as pure setters. 

This is a breaking change, and you may need to adapt your code accordingly.

If you need to establish more than one callback to listen for events from the Situm plugin, a straightforward solution is to subscribe to the Situm event and propagate it using state management or similar technologies — a pattern that is likely already familiar to you. For example, to handle geofence entry events:

#### Example Implementation

**Custom Hook to Manage Geofences:**

```typescript
// useGeofences.tsx
import React, { useEffect, useState } from 'react';
import SitumPlugin from '@situm/react-native';

const useGeofences = () => {
  const [enteredGeofences, setEnteredGeofences] = useState<any[]>([]);

  useEffect(() => {
    SitumPlugin.onEnterGeofences((items: any) => {
      setEnteredGeofences(items);
    });

    return () => {};
  }, []);

  return { enteredGeofences };
};

export default useGeofences;
```

**Usage in Your Application:**

With this hook, you can use `enteredGeofences` as many times as needed to react to geofence entry events:

```typescript
// App.tsx
import React, { useEffect } from 'react';
import useGeofences from 'path/to/useGeofences';

const Screen: React.FC = () => {
  const { enteredGeofences } = useGeofences();

  useEffect(() => {
    console.log('Geofence Event!!', enteredGeofences);
  }, [enteredGeofences]);

  return <></>;
};
```

#### Key Benefits
- Simplifies the management of multiple callbacks.
- Ensures clean state propagation throughout your app.
- Prevents redundant callback registrations while maintaining consistent event handling.

Make sure to update your code to leverage this pattern for better scalability and maintainability when working with the Situm plugin.