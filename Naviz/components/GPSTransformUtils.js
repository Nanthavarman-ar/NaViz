// GPS Transform Utils for AR positioning
export class GPSTransformUtils {
    constructor() {
        Object.defineProperty(this, "referenceLocation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Initialize GPS transform utilities
    }
    setReferenceLocation(lat, lng, alt = 0) {
        this.referenceLocation = { lat, lng, alt };
    }
    gpsToLocalCoordinates(lat, lng, alt = 0) {
        if (!this.referenceLocation) {
            throw new Error('Reference location not set');
        }
        // Simplified GPS to local coordinate conversion
        // In a real implementation, this would use proper geospatial transformations
        const latDiff = lat - this.referenceLocation.lat;
        const lngDiff = lng - this.referenceLocation.lng;
        const altDiff = alt - this.referenceLocation.alt;
        // Convert to meters (approximate)
        const x = lngDiff * 111320; // meters per degree longitude
        const z = latDiff * 110540; // meters per degree latitude
        const y = altDiff;
        return { x, y, z };
    }
    localToGPSCoordinates(x, y, z) {
        if (!this.referenceLocation) {
            throw new Error('Reference location not set');
        }
        // Simplified local to GPS coordinate conversion
        const lng = this.referenceLocation.lng + (x / 111320);
        const lat = this.referenceLocation.lat + (z / 110540);
        const alt = this.referenceLocation.alt + y;
        return { lat, lng, alt };
    }
}
