const exifParser = require('exif-parser');
const fs = require('fs');
const { RED_FLAG_THRESHOLDS } = require('../config/constants');

/**
 * Extract GPS coordinates from image EXIF data
 * @param {string} filePath - Path to image file
 * @returns {Promise<Object>} { latitude, longitude, timestamp, hasGPS }
 */
exports.extractGPSFromImage = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const parser = exifParser.create(buffer);
    const result = parser.parse();

    if (!result.tags.GPSLatitude || !result.tags.GPSLongitude) {
      return {
        hasGPS: false,
        error: 'No GPS data found in image',
      };
    }

    return {
      latitude: result.tags.GPSLatitude,
      longitude: result.tags.GPSLongitude,
      timestamp: result.tags.DateTimeOriginal || null,
      hasGPS: true,
    };
  } catch (error) {
    console.error('GPS extraction error:', error);
    return {
      hasGPS: false,
      error: error.message,
    };
  }
};

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param {Object} coord1 - { latitude, longitude }
 * @param {Object} coord2 - { latitude, longitude }
 * @returns {number} Distance in kilometers
 */
exports.calculateDistance = (coord1, coord2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const lat1 = coord1.latitude;
  const lon1 = coord1.longitude;
  const lat2 = coord2.latitude;
  const lon2 = coord2.longitude;

  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Validate GPS location against project site
 * @param {Object} photoGPS - GPS from uploaded photo
 * @param {Object} projectGPS - Project site GPS coordinates
 * @param {number} maxDistanceKM - Maximum allowed distance
 * @returns {Object} { isValid, distance, message }
 */
exports.validateGPSLocation = (photoGPS, projectGPS, maxDistanceKM = null) => {
  const maxDistance = maxDistanceKM || RED_FLAG_THRESHOLDS.GPS_MAX_DISTANCE_KM;

  const distance = exports.calculateDistance(photoGPS, projectGPS);
  const isValid = distance <= maxDistance;

  return {
    isValid,
    distance: parseFloat(distance.toFixed(2)),
    message: isValid
      ? `✔ Valid (${distance.toFixed(2)} km from site)`
      : `✗ Too far (${distance.toFixed(2)} km from site - max ${maxDistance} km allowed)`,
  };
};

/**
 * Process multiple images and validate GPS
 * @param {Array} files - Array of file objects
 * @param {Object} projectLocation - Project GPS coordinates
 * @returns {Promise<Array>} Array of processed file data
 */
exports.processAndValidateImages = async (files, projectLocation) => {
  const processedFiles = [];

  for (const file of files) {
    try {
      // Extract GPS
      const gpsData = await exports.extractGPSFromImage(file.path);

      let validation = null;
      if (gpsData.hasGPS) {
        // Validate location
        validation = exports.validateGPSLocation(
          { latitude: gpsData.latitude, longitude: gpsData.longitude },
          projectLocation
        );
      }

      processedFiles.push({
        originalName: file.originalname,
        path: file.path,
        gpsData: gpsData.hasGPS
          ? {
              latitude: gpsData.latitude,
              longitude: gpsData.longitude,
              timestamp: gpsData.timestamp,
            }
          : null,
        validation,
        hasGPS: gpsData.hasGPS,
      });
    } catch (error) {
      console.error(`Error processing file ${file.originalname}:`, error);
      processedFiles.push({
        originalName: file.originalname,
        path: file.path,
        error: error.message,
        hasGPS: false,
      });
    }
  }

  return processedFiles;
};
