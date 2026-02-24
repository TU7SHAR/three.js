// nasaApi.js
export async function getLivePlanetData() {
  const API_KEY =
    import.meta.env.VITE_SOLAR_API_KEY ||
    "000a4848-b581-454c-a063-be45708e0947";
  const url = "/api/bodies/?filter[]=isPlanet,eq,true";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Double check there are no extra spaces in your .env key
        Authorization: `Bearer ${API_KEY.trim()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    return data.bodies.map((body) => ({
      name: body.englishName,
      eccentricity: body.eccentricity,
      gravity: body.gravity,
      semiMajorAxis: body.semimajorAxis,
      inclination: body.inclination,
    }));
  } catch (error) {
    console.error("NASA API Fetch failed:", error);
    return null;
  }
}
