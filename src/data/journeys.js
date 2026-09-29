// 8 Curated Featured Journeys for AETHER
export const curatedJourneys = [
  {
    id: "journey-1",
    title: "7 Days in Japan",
    subtitle: "Ancient Temples & Futuristic Horizons",
    tagline: "From neon Shibuya avenues to the mossy silence of Arashiyama",
    days: 7,
    destinationIds: [7, 1],
    destinations: ["Tokyo", "Kyoto"],
    route: "Tokyo → Hakone → Kyoto",
    estimatedBudget: 68000,
    currency: "INR",
    travelStyle: "Culture",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
    highlights: [
      "Bullet train Shinkansen with Mount Fuji views",
      "Gion geisha district evening walk in Kyoto",
      "teamLab digital art universe in Tokyo",
      "Traditional ryokan stay with onsen hot spring"
    ],
    overview: "A quintessential journey through Japan's contrasting poles: the futuristic metropolis of Tokyo and the thousand-year spiritual sanctuary of Kyoto. Experience high-speed transit, Michelin-starred culinary artistry, and ancient tea rituals."
  },
  {
    id: "journey-2",
    title: "10 Days through Italy",
    subtitle: "Renaissance Art & Mediterranean Sunsets",
    tagline: "Pastel cliffside villages, Brunelleschi domes, and coastal limoncello",
    days: 10,
    destinationIds: [21, 2],
    destinations: ["Florence", "Amalfi Coast"],
    route: "Rome → Florence → Amalfi Coast",
    estimatedBudget: 125000,
    currency: "INR",
    travelStyle: "Romantic",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
    highlights: [
      "Private vintage wooden boat tour around Capri",
      "Sunset over Florence from Piazzale Michelangelo",
      "Chianti wine estate lunch and olive oil tasting",
      "Hiking the Path of the Gods high above Positano"
    ],
    overview: "Savor the finest rhythms of Italian life. Walk among timeless masterpieces in Florence before descending to the sun-soaked cliffs of the Amalfi Coast where lemon groves meet sapphire waters."
  },
  {
    id: "journey-3",
    title: "Iceland Ring Road",
    subtitle: "Volcanoes, Glaciers & Dancing Auroras",
    tagline: "The complete elemental circuit through fire and ice",
    days: 8,
    destinationIds: [3],
    destinations: ["Reykjavik & Highlands"],
    route: "Reykjavik → Vik → Skaftafell → Akureyri",
    estimatedBudget: 135000,
    currency: "INR",
    travelStyle: "Adventure",
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=1200&auto=format&fit=crop",
    highlights: [
      "Stargazing under the Northern Lights",
      "Ice caving deep in Vatnajökull glacier",
      "Reynisfjara black basalt sand beach",
      "Geothermal dip in steaming mineral baths"
    ],
    overview: "Drive through otherworldly terrain shaped by tectonic forces. Discover roaring waterfalls plunging over volcanic cliffs, vast glacial lagoons carrying iridescent icebergs, and celestial auroras in the Arctic night."
  },
  {
    id: "journey-4",
    title: "Bali Slow Escape",
    subtitle: "Terraces, Temple Chants & Ocean Waves",
    tagline: "Rejuvenation, yoga retreats, and hidden coastal caves",
    days: 8,
    destinationIds: [5],
    destinations: ["Bali & Nusa Penida"],
    route: "Ubud → Sidemen → Uluwatu → Nusa Penida",
    estimatedBudget: 42000,
    currency: "INR",
    travelStyle: "Reset",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
    highlights: [
      "Sunrise trek to the rim of Mount Batur",
      "Sound healing and bamboo villas in Ubud",
      "Cliffside sunset Kecak fire dance in Uluwatu",
      "Snorkeling with giant manta rays off Nusa Penida"
    ],
    overview: "Unplug completely in an island paradise of emerald rice terraces, traditional incense rituals, world-renowned surf breaks, and restorative holistic sanctuaries."
  },
  {
    id: "journey-5",
    title: "Swiss Alpine Week",
    subtitle: "Peak Grandeur & Mountain Chalets",
    tagline: "Glacier trains, alpine meadows, and fondue under the Matterhorn",
    days: 7,
    destinationIds: [6],
    destinations: ["Zermatt & Swiss Alps"],
    route: "Zurich → Lucerne → Interlaken → Zermatt",
    estimatedBudget: 140000,
    currency: "INR",
    travelStyle: "Nature",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop",
    highlights: [
      "Gornergrat railway facing the iconic Matterhorn",
      "First Cliff Walk by Tissot suspended over abyss",
      "Pristine five-lake hike reflecting snow summits",
      "Historic fireside Swiss fondue in car-free Zermatt"
    ],
    overview: "Breathe the cleanest mountain air in Europe. Ride world-class panorama trains through granite passes and unwind in historic alpine villages surrounded by 4,000-meter peaks."
  },
  {
    id: "journey-6",
    title: "Patagonia Frontier Trek",
    subtitle: "Glaciers & Spires at the End of the Earth",
    tagline: "The legendary W-Trek and thundering glacial ice shelves",
    days: 9,
    destinationIds: [11],
    destinations: ["Patagonia & Torres del Paine"],
    route: "El Calafate → El Chaltén → Torres del Paine",
    estimatedBudget: 115000,
    currency: "INR",
    travelStyle: "Adventure",
    image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=1200&auto=format&fit=crop",
    highlights: [
      "Standing before the mighty Torres granite towers",
      "Hearing Perito Moreno glacier calve into blue water",
      "Trekking through golden windswept steppes",
      "Estancia barbecue with authentic Patagonian gauchos"
    ],
    overview: "An expedition to the southern tip of the Americas where ferocious winds, pristine turquoise lakes, and sheer granite spires create one of the earth's greatest wildernesses."
  },
  {
    id: "journey-7",
    title: "South Africa Coastal Safari",
    subtitle: "Table Mountain & The Big Five",
    tagline: "Ocean penguins, Cape Dutch vineyards, and wild predator game drives",
    days: 10,
    destinationIds: [9, 22],
    destinations: ["Cape Town", "Serengeti & Ngorongoro"],
    route: "Cape Town → Cape Point → Stellenbosch → Safari Lodge",
    estimatedBudget: 160000,
    currency: "INR",
    travelStyle: "Adventure",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&auto=format&fit=crop",
    highlights: [
      "Cable car ascent over Table Mountain",
      "Open-top 4x4 sunrise tracking of lions and leopards",
      "Meeting African penguins at Boulders Beach",
      "World-class wine estates in Stellenbosch"
    ],
    overview: "The quintessential fusion of cosmopolitan coastal luxury, dramatic ocean mountain ranges, and raw savannah wildlife safaris."
  },
  {
    id: "journey-8",
    title: "Morocco Imperial Medinas",
    subtitle: "Terracotta Alleys & Desert Nights",
    tagline: "Spiced souks, mosaic riads, and sunset camel treks in the dunes",
    days: 7,
    destinationIds: [13],
    destinations: ["Marrakech"],
    route: "Marrakech → Atlas Mountains → Sahara Camp",
    estimatedBudget: 48000,
    currency: "INR",
    travelStyle: "Culture",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1200&auto=format&fit=crop",
    highlights: [
      "Navigating the labyrinthine spice and brass souks",
      "Starlit luxury glamping in the Sahara dunes",
      "Jardin Majorelle cobalt blue villa visit",
      "Sunset mint tea overlooking Jemaa el-Fnaa square"
    ],
    overview: "An exotic odyssey through sensory wonders: terracotta city gates, aromatic spices, intricate mosaic riads, and the profound golden silence of desert dunes."
  }
];
