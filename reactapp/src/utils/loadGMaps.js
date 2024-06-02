// src/utils/loadGMaps.js
export function loadGMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
      resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Failed to load the Google Maps API'));

    window.initGMaps = () => {
      delete window.initGMaps;
      resolve(window.google);
    };

    document.head.appendChild(script);
  });
}
