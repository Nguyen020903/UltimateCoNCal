// Unit data structure for Conflict of Nations
// Original unit data structure, used as fallback if JSON loading fails
const unitData = {
    western: {
        infantry: [
            {
                id: 'motorized_infantry',
                name: 'Motorized Infantry',
                productionTime: 1,
                resources: {
                    manpower: 180,
                    supplies: 120,
                    fuel: 40,
                    components: 20,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 15,
                    supplies: 10,
                    fuel: 3,
                    components: 1,
                    rareMaterials: 0
                }
            },
            {
                id: 'mechanized_infantry',
                name: 'Mechanized Infantry',
                productionTime: 2,
                resources: {
                    manpower: 220,
                    supplies: 150,
                    fuel: 60,
                    components: 40,
                    rareMaterials: 5
                },
                upkeep: {
                    manpower: 18,
                    supplies: 12,
                    fuel: 5,
                    components: 3,
                    rareMaterials: 0
                }
            },
            {
                id: 'airborne_infantry',
                name: 'Airborne Infantry',
                productionTime: 2,
                resources: {
                    manpower: 250,
                    supplies: 180,
                    fuel: 80,
                    components: 50,
                    rareMaterials: 10
                },
                upkeep: {
                    manpower: 20,
                    supplies: 15,
                    fuel: 7,
                    components: 4,
                    rareMaterials: 1
                }
            },
            {
                id: 'marine_infantry',
                name: 'Marine Infantry',
                productionTime: 2,
                resources: {
                    manpower: 260,
                    supplies: 190,
                    fuel: 70,
                    components: 45,
                    rareMaterials: 8
                },
                upkeep: {
                    manpower: 22,
                    supplies: 16,
                    fuel: 6,
                    components: 3,
                    rareMaterials: 0
                }
            },
            {
                id: 'special_forces',
                name: 'Special Forces',
                productionTime: 3,
                resources: {
                    manpower: 300,
                    supplies: 230,
                    fuel: 100,
                    components: 80,
                    rareMaterials: 20
                },
                upkeep: {
                    manpower: 25,
                    supplies: 20,
                    fuel: 8,
                    components: 6,
                    rareMaterials: 1
                }
            },
            {
                id: 'national_guard',
                name: 'National Guard',
                productionTime: 1,
                resources: {
                    manpower: 150,
                    supplies: 100,
                    fuel: 30,
                    components: 15,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 12,
                    supplies: 8,
                    fuel: 2,
                    components: 1,
                    rareMaterials: 0
                }
            }
        ],
        armored: [
            {
                id: 'armored_fighting_vehicle',
                name: 'Armored Fighting Vehicle',
                productionTime: 2,
                resources: {
                    manpower: 200,
                    supplies: 150,
                    fuel: 80,
                    components: 60,
                    rareMaterials: 15
                },
                upkeep: {
                    manpower: 16,
                    supplies: 12,
                    fuel: 7,
                    components: 5,
                    rareMaterials: 1
                }
            },
            {
                id: 'main_battle_tank',
                name: 'Main Battle Tank',
                productionTime: 3,
                resources: {
                    manpower: 250,
                    supplies: 180,
                    fuel: 100,
                    components: 80,
                    rareMaterials: 25
                },
                upkeep: {
                    manpower: 20,
                    supplies: 15,
                    fuel: 9,
                    components: 7,
                    rareMaterials: 2
                }
            },
            {
                id: 'amphibious_combat_vehicle',
                name: 'Amphibious Combat Vehicle',
                productionTime: 3,
                resources: {
                    manpower: 230,
                    supplies: 170,
                    fuel: 90,
                    components: 70,
                    rareMaterials: 20
                },
                upkeep: {
                    manpower: 18,
                    supplies: 14,
                    fuel: 8,
                    components: 6,
                    rareMaterials: 1
                }
            },
            {
                id: 'tank_destroyer',
                name: 'Tank Destroyer',
                productionTime: 3,
                resources: {
                    manpower: 220,
                    supplies: 160,
                    fuel: 85,
                    components: 65,
                    rareMaterials: 18
                },
                upkeep: {
                    manpower: 17,
                    supplies: 13,
                    fuel: 7,
                    components: 5,
                    rareMaterials: 1
                }
            }
        ],
        support: [
            {
                id: 'towed_artillery',
                name: 'Towed Artillery',
                productionTime: 2,
                resources: {
                    manpower: 160,
                    supplies: 120,
                    fuel: 40,
                    components: 50,
                    rareMaterials: 10
                },
                upkeep: {
                    manpower: 15,
                    supplies: 10,
                    fuel: 3,
                    components: 4,
                    rareMaterials: 0
                }
            },
            {
                id: 'self_propelled_artillery',
                name: 'Self-Propelled Artillery',
                productionTime: 3,
                resources: {
                    manpower: 190,
                    supplies: 140,
                    fuel: 70,
                    components: 60,
                    rareMaterials: 15
                },
                upkeep: {
                    manpower: 16,
                    supplies: 12,
                    fuel: 6,
                    components: 5,
                    rareMaterials: 1
                }
            },
            {
                id: 'multiple_rocket_launcher',
                name: 'Multiple Rocket Launcher',
                productionTime: 3,
                resources: {
                    manpower: 180,
                    supplies: 130,
                    fuel: 60,
                    components: 65,
                    rareMaterials: 20
                },
                upkeep: {
                    manpower: 15,
                    supplies: 11,
                    fuel: 5,
                    components: 6,
                    rareMaterials: 1
                }
            },
            {
                id: 'mobile_anti_air_vehicle',
                name: 'Mobile Anti-Air Vehicle',
                productionTime: 2,
                resources: {
                    manpower: 170,
                    supplies: 125,
                    fuel: 55,
                    components: 55,
                    rareMaterials: 12
                },
                upkeep: {
                    manpower: 14,
                    supplies: 10,
                    fuel: 4,
                    components: 4,
                    rareMaterials: 1
                }
            },
            {
                id: 'mobile_sam_launcher',
                name: 'Mobile SAM Launcher',
                productionTime: 3,
                resources: {
                    manpower: 200,
                    supplies: 150,
                    fuel: 65,
                    components: 70,
                    rareMaterials: 25
                },
                upkeep: {
                    manpower: 17,
                    supplies: 13,
                    fuel: 5,
                    components: 6,
                    rareMaterials: 2
                }
            },
            {
                id: 'theater_defense_system',
                name: 'Theater Defense System',
                productionTime: 4,
                resources: {
                    manpower: 250,
                    supplies: 200,
                    fuel: 80,
                    components: 100,
                    rareMaterials: 35
                },
                upkeep: {
                    manpower: 20,
                    supplies: 17,
                    fuel: 7,
                    components: 9,
                    rareMaterials: 3
                }
            },
            {
                id: 'mobile_radar',
                name: 'Mobile Radar',
                productionTime: 2,
                resources: {
                    manpower: 150,
                    supplies: 110,
                    fuel: 50,
                    components: 65,
                    rareMaterials: 15
                },
                upkeep: {
                    manpower: 12,
                    supplies: 9,
                    fuel: 4,
                    components: 5,
                    rareMaterials: 1
                }
            }
        ],
        helicopters: [
            {
                id: 'helicopter_gunship',
                name: 'Helicopter Gunship',
                productionTime: 3,
                resources: {
                    manpower: 200,
                    supplies: 150,
                    fuel: 90,
                    components: 85,
                    rareMaterials: 25
                },
                upkeep: {
                    manpower: 18,
                    supplies: 13,
                    fuel: 8,
                    components: 7,
                    rareMaterials: 2
                }
            },
            {
                id: 'attack_helicopter',
                name: 'Attack Helicopter',
                productionTime: 3,
                resources: {
                    manpower: 230,
                    supplies: 180,
                    fuel: 110,
                    components: 100,
                    rareMaterials: 30
                },
                upkeep: {
                    manpower: 20,
                    supplies: 15,
                    fuel: 10,
                    components: 9,
                    rareMaterials: 2
                }
            },
            {
                id: 'asw_helicopter',
                name: 'ASW Helicopter',
                productionTime: 3,
                resources: {
                    manpower: 210,
                    supplies: 160,
                    fuel: 100,
                    components: 90,
                    rareMaterials: 28
                },
                upkeep: {
                    manpower: 19,
                    supplies: 14,
                    fuel: 9,
                    components: 8,
                    rareMaterials: 2
                }
            }
        ],
        fighters: [
            {
                id: 'air_superiority_fighter',
                name: 'Air Superiority Fighter',
                productionTime: 4,
                resources: {
                    manpower: 260,
                    supplies: 200,
                    fuel: 120,
                    components: 110,
                    rareMaterials: 35
                },
                upkeep: {
                    manpower: 22,
                    supplies: 17,
                    fuel: 11,
                    components: 10,
                    rareMaterials: 3
                }
            },
            {
                id: 'naval_air_superiority_fighter',
                name: 'Naval Air Superiority Fighter',
                productionTime: 4,
                resources: {
                    manpower: 270,
                    supplies: 210,
                    fuel: 130,
                    components: 120,
                    rareMaterials: 38
                },
                upkeep: {
                    manpower: 23,
                    supplies: 18,
                    fuel: 12,
                    components: 11,
                    rareMaterials: 3
                }
            },
            {
                id: 'stealth_air_superiority_fighter',
                name: 'Stealth Air Superiority Fighter',
                productionTime: 5,
                resources: {
                    manpower: 300,
                    supplies: 240,
                    fuel: 150,
                    components: 140,
                    rareMaterials: 45
                },
                upkeep: {
                    manpower: 25,
                    supplies: 20,
                    fuel: 14,
                    components: 13,
                    rareMaterials: 4
                }
            },
            {
                id: 'strike_fighter',
                name: 'Strike Fighter',
                productionTime: 4,
                resources: {
                    manpower: 280,
                    supplies: 220,
                    fuel: 140,
                    components: 130,
                    rareMaterials: 40
                },
                upkeep: {
                    manpower: 24,
                    supplies: 19,
                    fuel: 13,
                    components: 12,
                    rareMaterials: 3
                }
            },
            {
                id: 'naval_strike_fighter',
                name: 'Naval Strike Fighter',
                productionTime: 4,
                resources: {
                    manpower: 290,
                    supplies: 230,
                    fuel: 145,
                    components: 135,
                    rareMaterials: 42
                },
                upkeep: {
                    manpower: 25,
                    supplies: 20,
                    fuel: 13,
                    components: 12,
                    rareMaterials: 4
                }
            },
            {
                id: 'stealth_strike_fighter',
                name: 'Stealth Strike Fighter',
                productionTime: 5,
                resources: {
                    manpower: 320,
                    supplies: 260,
                    fuel: 160,
                    components: 150,
                    rareMaterials: 48
                },
                upkeep: {
                    manpower: 27,
                    supplies: 22,
                    fuel: 15,
                    components: 14,
                    rareMaterials: 4
                }
            },
            {
                id: 'uav',
                name: 'UAV',
                productionTime: 3,
                resources: {
                    manpower: 180,
                    supplies: 150,
                    fuel: 100,
                    components: 120,
                    rareMaterials: 30
                },
                upkeep: {
                    manpower: 15,
                    supplies: 12,
                    fuel: 9,
                    components: 10,
                    rareMaterials: 2
                }
            }
        ],
        heavies: [
            {
                id: 'naval_patrol_aircraft',
                name: 'Naval Patrol Aircraft',
                productionTime: 4,
                resources: {
                    manpower: 270,
                    supplies: 210,
                    fuel: 130,
                    components: 150,
                    rareMaterials: 40
                },
                upkeep: {
                    manpower: 23,
                    supplies: 18,
                    fuel: 12,
                    components: 14,
                    rareMaterials: 3
                }
            },
            {
                id: 'awacs',
                name: 'AWACS',
                productionTime: 5,
                resources: {
                    manpower: 300,
                    supplies: 240,
                    fuel: 160,
                    components: 180,
                    rareMaterials: 50
                },
                upkeep: {
                    manpower: 25,
                    supplies: 20,
                    fuel: 15,
                    components: 16,
                    rareMaterials: 4
                }
            },
            {
                id: 'naval_awacs',
                name: 'Naval AWACS',
                productionTime: 5,
                resources: {
                    manpower: 310,
                    supplies: 250,
                    fuel: 170,
                    components: 190,
                    rareMaterials: 55
                },
                upkeep: {
                    manpower: 26,
                    supplies: 21,
                    fuel: 16,
                    components: 17,
                    rareMaterials: 5
                }
            },
            {
                id: 'heavy_bomber',
                name: 'Heavy Bomber',
                productionTime: 5,
                resources: {
                    manpower: 350,
                    supplies: 280,
                    fuel: 200,
                    components: 210,
                    rareMaterials: 60
                },
                upkeep: {
                    manpower: 30,
                    supplies: 24,
                    fuel: 18,
                    components: 19,
                    rareMaterials: 5
                }
            },
            {
                id: 'stealth_bomber',
                name: 'Stealth Bomber',
                productionTime: 6,
                resources: {
                    manpower: 400,
                    supplies: 320,
                    fuel: 230,
                    components: 240,
                    rareMaterials: 70
                },
                upkeep: {
                    manpower: 34,
                    supplies: 27,
                    fuel: 20,
                    components: 22,
                    rareMaterials: 6
                }
            }
        ],
        naval: [
            {
                id: 'corvette',
                name: 'Corvette',
                productionTime: 4,
                resources: {
                    manpower: 300,
                    supplies: 240,
                    fuel: 180,
                    components: 200,
                    rareMaterials: 50
                },
                upkeep: {
                    manpower: 25,
                    supplies: 20,
                    fuel: 15,
                    components: 17,
                    rareMaterials: 4
                }
            },
            {
                id: 'frigate',
                name: 'Frigate',
                productionTime: 5,
                resources: {
                    manpower: 350,
                    supplies: 280,
                    fuel: 210,
                    components: 230,
                    rareMaterials: 60
                },
                upkeep: {
                    manpower: 30,
                    supplies: 24,
                    fuel: 18,
                    components: 20,
                    rareMaterials: 5
                }
            },
            {
                id: 'destroyer',
                name: 'Destroyer',
                productionTime: 6,
                resources: {
                    manpower: 400,
                    supplies: 320,
                    fuel: 240,
                    components: 260,
                    rareMaterials: 70
                },
                upkeep: {
                    manpower: 34,
                    supplies: 27,
                    fuel: 20,
                    components: 22,
                    rareMaterials: 6
                }
            },
            {
                id: 'cruiser',
                name: 'Cruiser',
                productionTime: 7,
                resources: {
                    manpower: 500,
                    supplies: 400,
                    fuel: 300,
                    components: 320,
                    rareMaterials: 85
                },
                upkeep: {
                    manpower: 42,
                    supplies: 34,
                    fuel: 25,
                    components: 27,
                    rareMaterials: 7
                }
            },
            {
                id: 'aircraft_carrier',
                name: 'Aircraft Carrier',
                productionTime: 8,
                resources: {
                    manpower: 600,
                    supplies: 480,
                    fuel: 360,
                    components: 400,
                    rareMaterials: 100
                },
                upkeep: {
                    manpower: 50,
                    supplies: 40,
                    fuel: 30,
                    components: 34,
                    rareMaterials: 8
                }
            }
        ],
        submarine: [
            {
                id: 'attack_submarine',
                name: 'Attack Submarine',
                productionTime: 6,
                resources: {
                    manpower: 380,
                    supplies: 300,
                    fuel: 220,
                    components: 240,
                    rareMaterials: 65
                },
                upkeep: {
                    manpower: 32,
                    supplies: 25,
                    fuel: 18,
                    components: 20,
                    rareMaterials: 5
                }
            },
            {
                id: 'ballistic_missile_submarine',
                name: 'Ballistic Missile Submarine',
                productionTime: 7,
                resources: {
                    manpower: 450,
                    supplies: 360,
                    fuel: 270,
                    components: 290,
                    rareMaterials: 80
                },
                upkeep: {
                    manpower: 38,
                    supplies: 30,
                    fuel: 22,
                    components: 24,
                    rareMaterials: 7
                }
            }
        ],
        missiles: [
            {
                id: 'conventional_warhead',
                name: 'Conventional Warhead',
                productionTime: 2,
                resources: {
                    manpower: 100,
                    supplies: 120,
                    fuel: 60,
                    components: 80,
                    rareMaterials: 20
                },
                upkeep: {
                    manpower: 8,
                    supplies: 10,
                    fuel: 5,
                    components: 7,
                    rareMaterials: 1
                }
            },
            {
                id: 'chemical_warhead',
                name: 'Chemical Warhead',
                productionTime: 3,
                resources: {
                    manpower: 120,
                    supplies: 150,
                    fuel: 70,
                    components: 100,
                    rareMaterials: 30
                },
                upkeep: {
                    manpower: 10,
                    supplies: 12,
                    fuel: 6,
                    components: 8,
                    rareMaterials: 2
                }
            },
            {
                id: 'nuclear_warhead',
                name: 'Nuclear Warhead',
                productionTime: 5,
                resources: {
                    manpower: 150,
                    supplies: 200,
                    fuel: 100,
                    components: 150,
                    rareMaterials: 50
                },
                upkeep: {
                    manpower: 12,
                    supplies: 16,
                    fuel: 8,
                    components: 12,
                    rareMaterials: 4
                }
            },
            {
                id: 'cruise_missile',
                name: 'Cruise Missile',
                productionTime: 3,
                resources: {
                    manpower: 110,
                    supplies: 130,
                    fuel: 65,
                    components: 90,
                    rareMaterials: 25
                },
                upkeep: {
                    manpower: 9,
                    supplies: 11,
                    fuel: 5,
                    components: 7,
                    rareMaterials: 2
                }
            },
            {
                id: 'ballistic_missile',
                name: 'Ballistic Missile',
                productionTime: 4,
                resources: {
                    manpower: 130,
                    supplies: 160,
                    fuel: 80,
                    components: 110,
                    rareMaterials: 35
                },
                upkeep: {
                    manpower: 11,
                    supplies: 13,
                    fuel: 7,
                    components: 9,
                    rareMaterials: 3
                }
            },
            {
                id: 'icbm',
                name: 'ICBM',
                productionTime: 6,
                resources: {
                    manpower: 180,
                    supplies: 220,
                    fuel: 110,
                    components: 170,
                    rareMaterials: 60
                },
                upkeep: {
                    manpower: 15,
                    supplies: 18,
                    fuel: 9,
                    components: 14,
                    rareMaterials: 5
                }
            },
            {
                id: 'cruise_missile_launcher',
                name: 'Cruise Missile Launcher',
                productionTime: 4,
                resources: {
                    manpower: 200,
                    supplies: 180,
                    fuel: 90,
                    components: 150,
                    rareMaterials: 40
                },
                upkeep: {
                    manpower: 17,
                    supplies: 15,
                    fuel: 7,
                    components: 13,
                    rareMaterials: 3
                }
            },
            {
                id: 'ballistic_missile_launcher',
                name: 'Ballistic Missile Launcher',
                productionTime: 5,
                resources: {
                    manpower: 240,
                    supplies: 210,
                    fuel: 110,
                    components: 180,
                    rareMaterials: 50
                },
                upkeep: {
                    manpower: 20,
                    supplies: 18,
                    fuel: 9,
                    components: 15,
                    rareMaterials: 4
                }
            },
            {
                id: 'icbm_launcher',
                name: 'ICBM Launcher',
                productionTime: 7,
                resources: {
                    manpower: 300,
                    supplies: 260,
                    fuel: 130,
                    components: 220,
                    rareMaterials: 70
                },
                upkeep: {
                    manpower: 25,
                    supplies: 22,
                    fuel: 11,
                    components: 18,
                    rareMaterials: 6
                }
            }
        ]
    },
    eastern: {
        // Eastern doctrine units with similar structure but slightly different values
        // These could be filled with more accurate values from the game
        infantry: [
            {
                id: 'eastern_motorized_infantry',
                name: 'Motorized Infantry',
                productionTime: 1,
                resources: {
                    manpower: 200,
                    supplies: 110,
                    fuel: 35,
                    components: 15,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 16,
                    supplies: 9,
                    fuel: 3,
                    components: 1,
                    rareMaterials: 0
                }
            },
            // Add other eastern infantry units...
        ],
        // Add other eastern categories...
    },
    european: {
        // European doctrine units with similar structure but slightly different values
        // These could be filled with more accurate values from the game
        infantry: [
            {
                id: 'european_motorized_infantry',
                name: 'Motorized Infantry',
                productionTime: 1,
                resources: {
                    manpower: 190,
                    supplies: 130,
                    fuel: 45,
                    components: 25,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 16,
                    supplies: 11,
                    fuel: 4,
                    components: 2,
                    rareMaterials: 0
                }
            },
            // Add other european infantry units...
        ],
        // Add other european categories...
    }
};

// Resource type mapping from Rules.txt
const resourceMapping = {
    resource_1: "supply",
    resource_2: "component", 
    resource_3: "manpower",
    resource_4: "rareMaterial",
    resource_5: "fuel",
    resource_6: "electronic",
    resource_20: "money"
};

// Unit data cache to avoid repeated loading
let unitDataCache = {
    Eastern: {},
    Western: {},
    European: {}
};

// Function to load unit data from JSON files
async function loadUnitData(doctrine, unitType, unitName) {
    // Check if already in cache
    if (unitDataCache[doctrine] && 
        unitDataCache[doctrine][unitType] && 
        unitDataCache[doctrine][unitType][unitName]) {
        return unitDataCache[doctrine][unitType][unitName];
    }
    
    try {
        // Construct path to the JSON file
        const path = `Unit_stats/${doctrine}/${unitType}/${unitName}.json`;
        const response = await fetch(path);
        
        if (!response.ok) {
            console.error(`Failed to load unit data from ${path}`);
            return null;
        }
        
        const unitData = await response.json();
        
        // Cache the loaded data
        if (!unitDataCache[doctrine]) unitDataCache[doctrine] = {};
        if (!unitDataCache[doctrine][unitType]) unitDataCache[doctrine][unitType] = {};
        unitDataCache[doctrine][unitType][unitName] = unitData;
        
        return unitData;
    } catch (error) {
        console.error(`Error loading unit data: ${error}`);
        return null;
    }
}

// Function to convert mobilization time string to hours
function mobilizationTimeToHours(mobilizationTime) {
    // Example: "1 day, 2 hours" -> 26 hours
    const regex = /(\d+)\s*day[s]?,\s*(\d+)\s*hour[s]?/i;
    const match = mobilizationTime.match(regex);
    
    if (match) {
        const days = parseInt(match[1]) || 0;
        const hours = parseInt(match[2]) || 0;
        return days * 24 + hours;
    }
    
    return 24; // Default to 24 hours if parsing fails
}

// Function to map resource costs from JSON to our standard format
function mapResourceCosts(jsonCosts) {
    const resources = {
        supply: 0,
        component: 0,
        manpower: 0,
        fuel: 0,
        rareMaterial: 0,
        electronic: 0,
        money: 0
    };
    
    // Map each resource from the JSON to our format
    for (const [key, value] of Object.entries(jsonCosts)) {
        const mappedKey = resourceMapping[key];
        if (mappedKey) {
            resources[mappedKey] = value;
        }
    }
    
    return resources;
}

// Function to calculate unit resources from JSON data
function calculateUnitResourcesFromJSON(unitData, quantity = 1) {
    if (!unitData || !unitData.costs) {
        return {
            supply: 0,
            component: 0,
            manpower: 0,
            fuel: 0,
            rareMaterial: 0,
            electronic: 0,
            money: 0
        };
    }
    
    const resources = mapResourceCosts(unitData.costs);
    
    // Multiply by quantity
    for (const key in resources) {
        resources[key] *= quantity;
    }
    
    return resources;
}

// Function to calculate unit upkeep from JSON data
function calculateUnitUpkeepFromJSON(unitData, quantity = 1) {
    if (!unitData || !unitData.upkeep) {
        return {
            supply: 0,
            component: 0,
            manpower: 0,
            fuel: 0,
            rareMaterial: 0,
            electronic: 0,
            money: 0
        };
    }
    
    const resources = mapResourceCosts(unitData.upkeep);
    
    // Multiply by quantity
    for (const key in resources) {
        resources[key] *= quantity;
    }
    
    return resources;
}

// Function to create a unit object from JSON data
function createUnitFromJSON(unitData, level = 1) {
    if (!unitData || !unitData.basic) {
        return null;
    }
    
    // Extract unit ID from the name
    const unitId = unitData.basic.name
        .toLowerCase()
        .replace(/\(.*?\)/g, '')  // Remove anything in parentheses
        .trim()
        .replace(/\s+/g, '_');    // Replace spaces with underscores
    
    const unit = {
        id: unitId,
        name: unitData.basic.name,
        productionTime: mobilizationTimeToHours(unitData.basic.mobilizationTime) / 24, // Convert to days
        resources: mapResourceCosts(unitData.costs),
        upkeep: mapResourceCosts(unitData.upkeep),
        level: level,
        rawData: unitData
    };
    
    return unit;
}

// Update the populateUnitBank function to use JSON data
async function populateUnitBank(doctrine) {
    const unitBank = document.getElementById('unitBank');
    unitBank.innerHTML = '';
    
    try {
        // Try to load units from the JSON files
        await loadUnitsForDoctrine(doctrine, unitBank);
    } catch (error) {
        console.error(`Error loading units from JSON: ${error}`);
        // Fall back to hardcoded units
        populateFromHardcodedData(doctrine, unitBank);
    }
}

// Function to load units for a specific doctrine from JSON files
async function loadUnitsForDoctrine(doctrine, unitBankElement) {
    // List of unit types to load
    const unitTypes = [
        'Infantry', 'Armored', 'Support', 'Helicopter', 
        'Fighter', 'Heavies', 'Naval', 'Submarine'
    ];
    
    // For each unit type, try to load the units
    for (const unitType of unitTypes) {
        try {
            // Create a section for this unit type
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'unit-type-section';
            
            const sectionTitle = document.createElement('h3');
            sectionTitle.textContent = unitType;
            sectionDiv.appendChild(sectionTitle);
            
            // Try to get the directory listing
            const response = await fetch(`Unit_stats/${doctrine}/${unitType}/`);
            
            if (!response.ok) {
                console.warn(`Could not load directory listing for ${doctrine}/${unitType}`);
                continue;
            }
            
            // This assumes your server returns a JSON array of filenames
            const files = await response.json();
            
            // Load each unit JSON file and create a unit card
            for (const file of files) {
                if (!file.endsWith('.json')) continue;
                
                const unitName = file.replace('.json', '');
                const unitData = await loadUnitData(doctrine, unitType, unitName);
                
                if (unitData) {
                    // Create a unit card and add it to the section
                    const unitCard = createUnitCard(createUnitFromJSON(unitData));
                    sectionDiv.appendChild(unitCard);
                }
            }
            
            // Add the section to the unit bank if it has any units
            if (sectionDiv.children.length > 1) { // > 1 because it already has the title
                unitBankElement.appendChild(sectionDiv);
            }
        } catch (error) {
            console.warn(`Error loading ${unitType} units for ${doctrine}: ${error}`);
        }
    }
    
    // If no units were loaded, fall back to hardcoded data
    if (unitBankElement.children.length === 0) {
        populateFromHardcodedData(doctrine, unitBankElement);
    }
}

// Function to create a unit card for the unit bank
function createUnitCard(unit) {
    // Create a div to represent the unit
    const unitDiv = document.createElement('div');
    unitDiv.className = 'unit-card';
    unitDiv.dataset.unitId = unit.id;
    unitDiv.dataset.unitName = unit.name;
    unitDiv.dataset.productionTime = unit.productionTime;
    
    // Store resources and upkeep as JSON in the dataset
    unitDiv.dataset.resources = JSON.stringify(unit.resources);
    unitDiv.dataset.upkeep = JSON.stringify(unit.upkeep);
    
    // Store the raw data if available
    if (unit.rawData) {
        unitDiv.dataset.rawData = JSON.stringify(unit.rawData);
    }
    
    // Add the unit name
    const nameEl = document.createElement('div');
    nameEl.className = 'unit-name';
    nameEl.textContent = unit.name;
    unitDiv.appendChild(nameEl);
    
    // Add production time
    const timeEl = document.createElement('div');
    timeEl.className = 'unit-production-time';
    timeEl.textContent = `${unit.productionTime.toFixed(1)} days`;
    unitDiv.appendChild(timeEl);
    
    // Make the unit draggable
    unitDiv.draggable = true;
    unitDiv.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', unit.id);
        event.dataTransfer.effectAllowed = 'copy';
    });
    
    // Add click handler to show level selection dialog
    unitDiv.addEventListener('click', function() {
        showQuantityDialog(unit);
    });
    
    return unitDiv;
}

// Fallback to use hardcoded data if JSON loading fails
function populateFromHardcodedData(doctrine, unitBankElement) {
    console.log(`Using hardcoded data for ${doctrine}`);
    
    // Create sections for each unit type
    const unitTypes = ['infantry', 'armored', 'support', 'helicopter', 'fighter', 'heavies', 'naval', 'submarine'];
    
    // For each unit type, add the hardcoded units
    unitTypes.forEach(type => {
        if (unitData[doctrine.toLowerCase()] && unitData[doctrine.toLowerCase()][type]) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'unit-type-section';
            
            const sectionTitle = document.createElement('h3');
            sectionTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            sectionDiv.appendChild(sectionTitle);
            
            // Add each unit in this type
            unitData[doctrine.toLowerCase()][type].forEach(unit => {
                const unitCard = createUnitCard(unit);
                sectionDiv.appendChild(unitCard);
            });
            
            // Add the section to the unit bank
            unitBankElement.appendChild(sectionDiv);
        }
    });
}

// Production planning functions
function calculateUnitResources(unit, quantity = 1) {
    // If using JSON data, use calculateUnitResourcesFromJSON
    if (unit.rawData) {
        return calculateUnitResourcesFromJSON(unit.rawData, quantity);
    }
    
    // Otherwise use the original calculation
    return {
        manpower: unit.resources.manpower * quantity,
        supplies: unit.resources.supplies * quantity,
        fuel: unit.resources.fuel * quantity,
        components: unit.resources.components * quantity,
        rareMaterials: unit.resources.rareMaterials * quantity
    };
}

function calculateUnitUpkeep(unit, quantity = 1) {
    // If using JSON data, use calculateUnitUpkeepFromJSON
    if (unit.rawData) {
        return calculateUnitUpkeepFromJSON(unit.rawData, quantity);
    }
    
    // Otherwise use the original calculation
    return {
        manpower: unit.upkeep.manpower * quantity,
        supplies: unit.upkeep.supplies * quantity,
        fuel: unit.upkeep.fuel * quantity,
        components: unit.upkeep.components * quantity,
        rareMaterials: unit.upkeep.rareMaterials * quantity
    };
}

function calculateTotalResources(productionPlan) {
    let totals = {
        production: {
            manpower: 0,
            supplies: 0,
            fuel: 0,
            components: 0,
            rareMaterials: 0
        },
        upkeep: {
            manpower: 0,
            supplies: 0,
            fuel: 0,
            components: 0,
            rareMaterials: 0
        }
    };

    productionPlan.forEach(day => {
        day.units.forEach(unit => {
            const productionResources = calculateUnitResources(unit.unitData, unit.quantity);
            const upkeepResources = calculateUnitUpkeep(unit.unitData, unit.quantity);
            
            Object.keys(totals.production).forEach(resource => {
                totals.production[resource] += productionResources[resource];
            });
            
            Object.keys(totals.upkeep).forEach(resource => {
                totals.upkeep[resource] += upkeepResources[resource];
            });
        });
    });

    return totals;
}

function generateProductionTimeline(productionPlan) {
    let timeline = [];
    
    productionPlan.forEach(day => {
        day.units.forEach(unit => {
            const startDay = day.day;
            const endDay = startDay + unit.unitData.productionTime - 1;
            
            timeline.push({
                unit: unit.unitData.name,
                startDay,
                endDay,
                quantity: unit.quantity
            });
        });
    });

    return timeline.sort((a, b) => a.startDay - b.startDay);
}

// UI Helper functions
function populateUnitBank(doctrine) {
    const unitBank = document.querySelector('.unit-bank');
    unitBank.innerHTML = '<h2>Available Units</h2>';

    Object.entries(unitData[doctrine]).forEach(([category, units]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'unit-category';
        categoryDiv.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`;

        units.forEach(unit => {
            const unitElement = document.createElement('div');
            unitElement.className = 'unit-bank-item';
            unitElement.draggable = true;
            unitElement.setAttribute('data-unit', JSON.stringify(unit));
            unitElement.innerHTML = `
                <div class="unit-name">${unit.name}</div>
                <div class="unit-details">
                    <div>Production Time: ${unit.productionTime} days</div>
                    <div class="unit-resources">
                        <div class="resource-header">Production Resources:</div>
                        <div>Manpower: ${unit.resources.manpower}</div>
                        <div>Supplies: ${unit.resources.supplies}</div>
                        <div>Fuel: ${unit.resources.fuel}</div>
                        <div>Components: ${unit.resources.components}</div>
                        <div>Rare Materials: ${unit.resources.rareMaterials}</div>
                        <div class="resource-header">Daily Upkeep:</div>
                        <div>Manpower: ${unit.upkeep.manpower}</div>
                        <div>Supplies: ${unit.upkeep.supplies}</div>
                        <div>Fuel: ${unit.upkeep.fuel}</div>
                        <div>Components: ${unit.upkeep.components}</div>
                        <div>Rare Materials: ${unit.upkeep.rareMaterials}</div>
                    </div>
                </div>
            `;

            unitElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(unit));
                e.target.classList.add('dragging');
            });

            unitElement.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });

            categoryDiv.appendChild(unitElement);
        });

        unitBank.appendChild(categoryDiv);
    });
}

function formatResources(resources) {
    return `
        <div class="resource-list">
            <div class="resource-section">
                <h4>Production Resources</h4>
                <div class="resource-item">
                    <span class="resource-label">Manpower:</span>
                    <span class="resource-value">${resources.production.manpower.toLocaleString()}</span>
                </div>
                <div class="resource-item">
                    <span class="resource-label">Supplies:</span>
                    <span class="resource-value">${resources.production.supplies.toLocaleString()}</span>
                </div>
                <div class="resource-item">
                    <span class="resource-label">Fuel:</span>
                    <span class="resource-value">${resources.production.fuel.toLocaleString()}</span>
                </div>
                <div class="resource-item">
                    <span class="resource-label">Components:</span>
                    <span class="resource-value">${resources.production.components.toLocaleString()}</span>
                </div>
                <div class="resource-item">
                    <span class="resource-label">Rare Materials:</span>
                    <span class="resource-value">${resources.production.rareMaterials.toLocaleString()}</span>
                </div>
            </div>
            <div class="resource-section">
                <h4>Daily Upkeep</h4>
                <div class="resource-item">
                    <span class="resource-label">Manpower:</span>
                    <span class="resource-value">${resources.upkeep.manpower.toLocaleString()}</span>
                </div>
                <div class="resource-item">
                    <span class="resource-label">Supplies:</span>
                    <span class="resource-value">${resources.upkeep.supplies.toLocaleString()}</span>
                </div>
                <div class="resource-item">
                    <span class="resource-label">Fuel:</span>
                    <span class="resource-value">${resources.upkeep.fuel.toLocaleString()}</span>
                </div>
                <div class="resource-item">
                    <span class="resource-label">Components:</span>
                    <span class="resource-value">${resources.upkeep.components.toLocaleString()}</span>
                </div>
                <div class="resource-item">
                    <span class="resource-label">Rare Materials:</span>
                    <span class="resource-value">${resources.upkeep.rareMaterials.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

// Export functions for use in HTML
window.unitData = unitData;
window.calculateUnitResources = calculateUnitResources;
window.calculateUnitUpkeep = calculateUnitUpkeep;
window.calculateTotalResources = calculateTotalResources;
window.generateProductionTimeline = generateProductionTimeline;
window.populateUnitBank = populateUnitBank;
window.formatResources = formatResources;
window.searchUnits = searchUnits;
window.sortUnits = sortUnits;
window.showTab = showTab;
window.calculateEfficiency = calculateEfficiency;
window.getCategoryForUnit = getCategoryForUnit;
window.calculateCombatValue = calculateCombatValue;
window.exportProductionPlan = exportProductionPlan;

// Helper function for unit data access
function getUnitLevelData(unitData, level) {
    if (!unitData || !unitData.levels || !unitData.levels.length) return null;
    
    // Default to level 1 if no level specified or level is out of range
    if (!level || level < 1 || level > unitData.levels.length) {
        level = 1;
    }
    
    return unitData.levels[level - 1];
}

// Helper functions for the new features
function searchUnits() {
    const searchTerm = document.getElementById('unitSearch').value.toLowerCase();
    const unitItems = document.querySelectorAll('.unit-bank-item');
    
    unitItems.forEach(item => {
        const unitName = item.querySelector('.unit-name').textContent.toLowerCase();
        if (searchTerm === '' || unitName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function sortUnits() {
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;
    const unitBank = document.getElementById('unitBank');
    const categories = Array.from(unitBank.children);
    
    categories.forEach(category => {
        const unitItems = Array.from(category.querySelectorAll('.unit-bank-item'));
        
        unitItems.sort((a, b) => {
            const unitDataA = JSON.parse(a.getAttribute('data-unit'));
            const unitDataB = JSON.parse(b.getAttribute('data-unit'));
            
            let valueA, valueB;
            
            if (sortBy === 'name') {
                valueA = unitDataA.name;
                valueB = unitDataB.name;
            } else if (sortBy === 'productionTime') {
                valueA = unitDataA.productionTime;
                valueB = unitDataB.productionTime;
            } else if (sortBy.startsWith('resources-')) {
                const resource = sortBy.split('-')[1];
                valueA = unitDataA.resources[resource];
                valueB = unitDataB.resources[resource];
            }
            
            if (sortOrder === 'ascending') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
        
        // Re-append sorted items
        unitItems.forEach(item => {
            category.appendChild(item);
        });
    });
}

function getCategoryForUnit(unitData, doctrine) {
    const categories = ['infantry', 'armored', 'support', 'helicopters', 'fighters', 'heavies', 'naval', 'submarine'];
    for (const category of categories) {
        if (window.unitData[doctrine][category]) {
            const found = window.unitData[doctrine][category].find(unit => unit.id === unitData.id);
            if (found) return category;
        }
    }
    return 'unknown';
}

function calculateCombatValue(unit) {
    // This is a simplified example - in a real implementation, 
    // this would use actual unit stats relevant to the game mechanics
    
    // Base value scaled by production time (more expensive units usually have higher combat value)
    const baseValue = 
        unit.resources.manpower * 0.01 + 
        unit.resources.supplies * 0.02 + 
        unit.resources.fuel * 0.03 + 
        unit.resources.components * 0.05 + 
        unit.resources.rareMaterials * 0.1;
    
    // Scale by production time (assuming longer production = stronger unit)
    return baseValue * Math.sqrt(unit.productionTime);
}

function exportProductionPlan() {
    if (typeof html2canvas === 'undefined') {
        alert('Export library not loaded yet. Please try again in a moment.');
        return;
    }
    
    html2canvas(document.querySelector('.production-planner')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'production-plan.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
} 