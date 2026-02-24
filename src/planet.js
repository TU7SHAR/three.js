export const planets = [
  {
    name: "Mercury",
    radius: 0.8,
    distance: 60,
    speed: 0.02,
    description:
      "The closest planet to the Sun. It has a massive iron core that generates a magnetic field 1% as strong as Earth's. Its surface is covered in impact craters and 'lobate scarps' (cliffs) caused by the planet shrinking as it cooled.",
    moons: [],
  },
  {
    name: "Venus",
    radius: 1.2,
    distance: 75,
    speed: 0.015,
    description:
      "Venus has a surface temperature of 462°C, hot enough to melt lead. It rotates backwards (retrograde) compared to most other planets, meaning the Sun rises in the west and sets in the east.",
    moons: [],
  },
  {
    name: "Earth",
    radius: 1.5,
    distance: 95,
    speed: 0.01,
    description:
      "The only known world with plate tectonics and a nitrogen-oxygen atmosphere. Its unique position in the 'Goldilocks Zone' allows water to exist in all three states: solid, liquid, and gas.",
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 5,
        speed: 0.03,
        description:
          "The fifth largest moon in the Solar System. It was likely formed from a collision between Earth and a Mars-sized body called Theia.",
      },
    ],
  },
  {
    name: "Mars",
    radius: 1.0,
    distance: 125,
    speed: 0.008,
    description:
      "Mars features the largest volcano (Olympus Mons) and deepest canyon (Valles Marineris) in the solar system. Evidence suggests liquid water once flowed across its surface in the ancient past.",
    moons: [
      {
        name: "Phobos",
        radius: 0.2,
        distance: 2,
        speed: 0.04,
        description:
          "A lumpy, cratered moon that orbits Mars three times a day. It is slowly moving closer to Mars and will eventually be torn apart.",
      },
      {
        name: "Deimos",
        radius: 0.15,
        distance: 3.5,
        speed: 0.025,
        description:
          "One of the smallest moons in the solar system. It is composed of rock rich in carbonaceous material, similar to C-type asteroids.",
      },
    ],
  },
  {
    name: "Jupiter",
    radius: 4.5,
    distance: 185, // Pushed out for asteroid belt room
    speed: 0.004,
    description:
      "A gas giant with 2.5 times the mass of all other planets combined. It acts as a 'vacuum cleaner' for the solar system, using its gravity to intercept dangerous comets and asteroids.",
    moons: [
      {
        name: "Io",
        radius: 0.4,
        distance: 7,
        speed: 0.05,
        description:
          "The most geologically active object in the solar system, featuring over 400 active volcanoes fueled by tidal heating.",
      },
      {
        name: "Europa",
        radius: 0.38,
        distance: 10,
        speed: 0.035,
        description:
          "An icy moon with a smooth surface. It is the best candidate for finding extraterrestrial life within its deep subsurface saltwater ocean.",
      },
      {
        name: "Ganymede",
        radius: 0.5,
        distance: 13,
        speed: 0.025,
        description:
          "The largest moon in the solar system, larger than the planet Mercury. It has its own internally generated magnetic field.",
      },
      {
        name: "Callisto",
        radius: 0.45,
        distance: 16,
        speed: 0.015,
        description:
          "An ancient, heavily cratered world. It is the most distant of the Galilean moons and has the lowest density of the group.",
      },
    ],
  },
  {
    name: "Saturn",
    radius: 4.0,
    distance: 245,
    speed: 0.003,
    description:
      "Saturn’s rings are 280,000 km wide but only about 10 meters thick. They are made of 99.9% pure water ice, which is why they are so reflective and bright.",
    moons: [
      {
        name: "Titan",
        radius: 0.45,
        distance: 12,
        speed: 0.02,
        description:
          "The only moon with a thick atmosphere and liquid lakes on its surface. It is considered a 'prebiotic' world similar to early Earth.",
      },
      {
        name: "Rhea",
        radius: 0.3,
        distance: 9,
        speed: 0.03,
        description:
          "A highly cratered, icy body. It may have a very tenuous ring system of its own, though this remains unconfirmed.",
      },
      {
        name: "Enceladus",
        radius: 0.25,
        distance: 7,
        speed: 0.04,
        description:
          "A tiny moon that reflects almost 100% of the sunlight that hits it. Its south pole features active geysers that spray water ice into space.",
      },
      {
        name: "Mimas",
        radius: 0.2,
        distance: 5,
        speed: 0.05,
        description:
          "Famous for the giant Herschel crater, giving it a resemblance to the 'Death Star' from Star Wars.",
      },
    ],
  },
  {
    name: "Uranus",
    radius: 2.5,
    distance: 295,
    speed: 0.002,
    description:
      "An ice giant whose atmosphere contains 'diamond rain' deep within its layers. Its extreme 98-degree tilt causes the most extreme seasons in the solar system, lasting 21 years each.",
    moons: [
      {
        name: "Titania",
        radius: 0.35,
        distance: 8,
        speed: 0.02,
        description:
          "The largest moon of Uranus. Its surface is a mix of impact craters and massive fault-line valleys (chasmata).",
      },
      {
        name: "Oberon",
        radius: 0.32,
        distance: 11,
        speed: 0.015,
        description:
          "The outermost major moon of Uranus. Its craters are often surrounded by mysterious dark material of unknown origin.",
      },
      {
        name: "Ariel",
        radius: 0.28,
        distance: 5.5,
        speed: 0.03,
        description:
          "The brightest moon of Uranus. It shows evidence of recent geological activity, including broad valleys and ridges.",
      },
    ],
  },
  {
    name: "Neptune",
    radius: 2.4,
    distance: 345,
    speed: 0.001,
    description:
      "Neptune's winds can reach 2,100 km/h, the fastest in the solar system. It was the first planet discovered using mathematics before it was ever seen through a telescope.",
    moons: [
      {
        name: "Triton",
        radius: 0.4,
        distance: 8,
        speed: 0.025,
        description:
          "The only large moon that orbits in the opposite direction of its planet's rotation. It is a captured Kuiper Belt object with active nitrogen geysers.",
      },
      {
        name: "Proteus",
        radius: 0.2,
        distance: 5,
        speed: 0.04,
        description:
          "One of the darkest objects in the solar system. It is so lumpy and irregular because its gravity isn't strong enough to pull it into a sphere.",
      },
    ],
  },
];
