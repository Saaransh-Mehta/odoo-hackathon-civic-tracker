export function getDistanceInMeters(distanceLabel) {
  switch (distanceLabel) {
    case "Within 1 km": return 1000;
    case "Within 2 km": return 2000;
    case "Within 3 km": return 3000;
    case "Within 4 km": return 4000;
    case "Within 5 km": return 5000;
    default: return 50000; // "All Distances" means max radius
  }
}
