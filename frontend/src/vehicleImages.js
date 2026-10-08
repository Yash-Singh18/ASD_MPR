// Vehicle photos live in /public/images/vehicles (credits in /public/images/CREDITS.md).
// The API has no image field, so we pick a photo from the vehicle's name / description / type.

const IMG = (name) => `/images/vehicles/${name}.jpg`;

export const DEFAULT_VEHICLE_IMAGE = IMG("sedan");

// Order matters: the first rule that matches wins. Matching is on whole words.
const RULES = [
  { image: "bicycle", words: ["bicycle", "cycle", "mtb", "mountain bike", "road bike", "e-bike", "ebike", "hybrid bike"] },
  { image: "scooter", words: ["scooter", "activa", "jupiter", "vespa", "access", "dio", "moped", "scooty"] },
  { image: "motorcycle", words: ["motorcycle", "motorbike", "bike", "bullet", "enfield", "pulsar", "ktm", "duke", "splendor", "harley", "himalayan", "cruiser"] },
  { image: "offroad", words: ["thar", "jeep", "gypsy", "offroad", "off-road", "4x4", "wrangler", "defender"] },
  { image: "sports", words: ["sports", "sport", "porsche", "mustang", "ferrari", "lamborghini", "911", "supercar", "convertible", "coupe"] },
  { image: "van", words: ["van", "sprinter", "traveller", "tempo", "minibus", "bus", "tempo traveller"] },
  { image: "mpv", words: ["mpv", "innova", "ertiga", "carnival", "minivan", "family car"] },
  { image: "suv", words: ["suv", "suvs", "creta", "nexon", "seltos", "brezza", "venue", "fortuner", "xuv", "harrier", "scorpio", "crossover"] },
  { image: "hatchback", words: ["hatchback", "hatchbacks", "swift", "i20", "baleno", "polo", "alto", "wagon r", "tiago", "glanza", "compact"] },
  { image: "sedan", words: ["sedan", "sedans", "corolla", "city", "civic", "camry", "verna", "dzire", "accord", "sunny", "car", "cars"] },
].map((r) => ({
  image: r.image,
  regex: new RegExp(`\\b(${r.words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})s?\\b`, "i"),
}));

function match(text) {
  const hit = RULES.find((r) => r.regex.test(text));
  return hit ? IMG(hit.image) : null;
}

export function getVehicleImageUrl(vehicle) {
  if (!vehicle) return DEFAULT_VEHICLE_IMAGE;

  // 1. A custom image_url on the record wins
  if (vehicle.image_url) return vehicle.image_url;

  // 2. Vehicle name, then description
  const byName = match(vehicle.name || "");
  if (byName) return byName;
  const byDesc = match(vehicle.description || "");
  if (byDesc) return byDesc;

  // 3. Vehicle type (category) name
  const typeName = vehicle.category?.name || vehicle.category;
  if (typeof typeName === "string") {
    const byType = match(typeName);
    if (byType) return byType;
  }

  return DEFAULT_VEHICLE_IMAGE;
}
