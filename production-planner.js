// Unit data structure
const unitData = {
    western: {
        infantry: [
            {
                id: 'motorized_infantry',
                name: 'Motorized Infantry',
                productionTime: 1,
                resources: {
                    manpower: 100,
                    supplies: 50,
                    fuel: 25,
                    components: 10,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 10,
                    supplies: 5,
                    fuel: 2,
                    components: 0,
                    rareMaterials: 0
                }
            },
            {
                id: 'mechanized_infantry',
                name: 'Mechanized Infantry',
                productionTime: 2,
                resources: {
                    manpower: 150,
                    supplies: 75,
                    fuel: 50,
                    components: 25,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 15,
                    supplies: 7,
                    fuel: 5,
                    components: 2,
                    rareMaterials: 0
                }
            },
            {
                id: 'airborne_infantry',
                name: 'Airborne Infantry',
                productionTime: 2,
                resources: {
                    manpower: 200,
                    supplies: 100,
                    fuel: 75,
                    components: 50,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 20,
                    supplies: 10,
                    fuel: 7,
                    components: 5,
                    rareMaterials: 0
                }
            },
            {
                id: 'marines',
                name: 'Marines',
                productionTime: 2,
                resources: {
                    manpower: 180,
                    supplies: 90,
                    fuel: 60,
                    components: 40,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 18,
                    supplies: 9,
                    fuel: 6,
                    components: 4,
                    rareMaterials: 0
                }
            }
        ],
        armored: [
            {
                id: 'main_battle_tank',
                name: 'Main Battle Tank',
                productionTime: 3,
                resources: {
                    manpower: 200,
                    supplies: 150,
                    fuel: 100,
                    components: 75,
                    rareMaterials: 25
                },
                upkeep: {
                    manpower: 20,
                    supplies: 15,
                    fuel: 10,
                    components: 7,
                    rareMaterials: 2
                }
            },
            {
                id: 'armored_fighting_vehicle',
                name: 'Armored Fighting Vehicle',
                productionTime: 2,
                resources: {
                    manpower: 150,
                    supplies: 100,
                    fuel: 75,
                    components: 50,
                    rareMaterials: 15
                },
                upkeep: {
                    manpower: 15,
                    supplies: 10,
                    fuel: 7,
                    components: 5,
                    rareMaterials: 1
                }
            },
            {
                id: 'light_tank',
                name: 'Light Tank',
                productionTime: 2,
                resources: {
                    manpower: 175,
                    supplies: 125,
                    fuel: 85,
                    components: 60,
                    rareMaterials: 20
                },
                upkeep: {
                    manpower: 17,
                    supplies: 12,
                    fuel: 8,
                    components: 6,
                    rareMaterials: 1
                }
            }
        ],
        support: [
            {
                id: 'self_propelled_artillery',
                name: 'Self-Propelled Artillery',
                productionTime: 3,
                resources: {
                    manpower: 175,
                    supplies: 125,
                    fuel: 90,
                    components: 65,
                    rareMaterials: 20
                },
                upkeep: {
                    manpower: 17,
                    supplies: 12,
                    fuel: 9,
                    components: 6,
                    rareMaterials: 1
                }
            },
            {
                id: 'multiple_rocket_launcher',
                name: 'Multiple Rocket Launcher',
                productionTime: 3,
                resources: {
                    manpower: 200,
                    supplies: 150,
                    fuel: 100,
                    components: 75,
                    rareMaterials: 25
                },
                upkeep: {
                    manpower: 20,
                    supplies: 15,
                    fuel: 10,
                    components: 7,
                    rareMaterials: 2
                }
            },
            {
                id: 'anti_aircraft_vehicle',
                name: 'Anti-Aircraft Vehicle',
                productionTime: 2,
                resources: {
                    manpower: 150,
                    supplies: 100,
                    fuel: 75,
                    components: 50,
                    rareMaterials: 15
                },
                upkeep: {
                    manpower: 15,
                    supplies: 10,
                    fuel: 7,
                    components: 5,
                    rareMaterials: 1
                }
            }
        ],
        helicopters: [
            {
                id: 'attack_helicopter',
                name: 'Attack Helicopter',
                productionTime: 3,
                resources: {
                    manpower: 250,
                    supplies: 175,
                    fuel: 125,
                    components: 100,
                    rareMaterials: 30
                },
                upkeep: {
                    manpower: 25,
                    supplies: 17,
                    fuel: 12,
                    components: 10,
                    rareMaterials: 3
                }
            },
            {
                id: 'transport_helicopter',
                name: 'Transport Helicopter',
                productionTime: 3,
                resources: {
                    manpower: 225,
                    supplies: 150,
                    fuel: 110,
                    components: 85,
                    rareMaterials: 25
                },
                upkeep: {
                    manpower: 22,
                    supplies: 15,
                    fuel: 11,
                    components: 8,
                    rareMaterials: 2
                }
            }
        ],
        fighters: [
            {
                id: 'fighter_jet',
                name: 'Fighter Jet',
                productionTime: 4,
                resources: {
                    manpower: 300,
                    supplies: 200,
                    fuel: 150,
                    components: 125,
                    rareMaterials: 40
                },
                upkeep: {
                    manpower: 30,
                    supplies: 20,
                    fuel: 15,
                    components: 12,
                    rareMaterials: 4
                }
            },
            {
                id: 'strike_fighter',
                name: 'Strike Fighter',
                productionTime: 4,
                resources: {
                    manpower: 325,
                    supplies: 225,
                    fuel: 175,
                    components: 150,
                    rareMaterials: 45
                },
                upkeep: {
                    manpower: 32,
                    supplies: 22,
                    fuel: 17,
                    components: 15,
                    rareMaterials: 4
                }
            }
        ],
        heavies: [
            {
                id: 'strategic_bomber',
                name: 'Strategic Bomber',
                productionTime: 5,
                resources: {
                    manpower: 400,
                    supplies: 300,
                    fuel: 250,
                    components: 200,
                    rareMaterials: 60
                },
                upkeep: {
                    manpower: 40,
                    supplies: 30,
                    fuel: 25,
                    components: 20,
                    rareMaterials: 6
                }
            },
            {
                id: 'tactical_bomber',
                name: 'Tactical Bomber',
                productionTime: 4,
                resources: {
                    manpower: 350,
                    supplies: 250,
                    fuel: 200,
                    components: 175,
                    rareMaterials: 50
                },
                upkeep: {
                    manpower: 35,
                    supplies: 25,
                    fuel: 20,
                    components: 17,
                    rareMaterials: 5
                }
            }
        ],
        naval: [
            {
                id: 'destroyer',
                name: 'Destroyer',
                productionTime: 5,
                resources: {
                    manpower: 450,
                    supplies: 350,
                    fuel: 300,
                    components: 250,
                    rareMaterials: 75
                },
                upkeep: {
                    manpower: 45,
                    supplies: 35,
                    fuel: 30,
                    components: 25,
                    rareMaterials: 7
                }
            },
            {
                id: 'frigate',
                name: 'Frigate',
                productionTime: 4,
                resources: {
                    manpower: 375,
                    supplies: 275,
                    fuel: 225,
                    components: 200,
                    rareMaterials: 60
                },
                upkeep: {
                    manpower: 37,
                    supplies: 27,
                    fuel: 22,
                    components: 20,
                    rareMaterials: 6
                }
            },
            {
                id: 'cruiser',
                name: 'Cruiser',
                productionTime: 6,
                resources: {
                    manpower: 500,
                    supplies: 400,
                    fuel: 350,
                    components: 300,
                    rareMaterials: 90
                },
                upkeep: {
                    manpower: 50,
                    supplies: 40,
                    fuel: 35,
                    components: 30,
                    rareMaterials: 9
                }
            }
        ],
        submarine: [
            {
                id: 'attack_submarine',
                name: 'Attack Submarine',
                productionTime: 5,
                resources: {
                    manpower: 425,
                    supplies: 325,
                    fuel: 275,
                    components: 225,
                    rareMaterials: 70
                },
                upkeep: {
                    manpower: 42,
                    supplies: 32,
                    fuel: 27,
                    components: 22,
                    rareMaterials: 7
                }
            },
            {
                id: 'ballistic_missile_submarine',
                name: 'Ballistic Missile Submarine',
                productionTime: 6,
                resources: {
                    manpower: 475,
                    supplies: 375,
                    fuel: 325,
                    components: 275,
                    rareMaterials: 85
                },
                upkeep: {
                    manpower: 47,
                    supplies: 37,
                    fuel: 32,
                    components: 27,
                    rareMaterials: 8
                }
            }
        ]
    },
    eastern: {
        infantry: [
            {
                id: 'motorized_infantry_eastern',
                name: 'Motorized Infantry',
                productionTime: 1,
                resources: {
                    manpower: 90,
                    supplies: 45,
                    fuel: 20,
                    components: 8,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 9,
                    supplies: 4,
                    fuel: 2,
                    components: 0,
                    rareMaterials: 0
                }
            },
            {
                id: 'mechanized_infantry_eastern',
                name: 'Mechanized Infantry',
                productionTime: 2,
                resources: {
                    manpower: 140,
                    supplies: 70,
                    fuel: 45,
                    components: 20,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 14,
                    supplies: 7,
                    fuel: 4,
                    components: 2,
                    rareMaterials: 0
                }
            },
            {
                id: 'airborne_infantry_eastern',
                name: 'Airborne Infantry',
                productionTime: 2,
                resources: {
                    manpower: 180,
                    supplies: 90,
                    fuel: 65,
                    components: 45,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 18,
                    supplies: 9,
                    fuel: 6,
                    components: 4,
                    rareMaterials: 0
                }
            }
        ],
        armored: [
            {
                id: 'main_battle_tank_eastern',
                name: 'Main Battle Tank',
                productionTime: 3,
                resources: {
                    manpower: 180,
                    supplies: 140,
                    fuel: 90,
                    components: 70,
                    rareMaterials: 20
                },
                upkeep: {
                    manpower: 18,
                    supplies: 14,
                    fuel: 9,
                    components: 7,
                    rareMaterials: 2
                }
            },
            {
                id: 'armored_fighting_vehicle_eastern',
                name: 'Armored Fighting Vehicle',
                productionTime: 2,
                resources: {
                    manpower: 140,
                    supplies: 90,
                    fuel: 65,
                    components: 45,
                    rareMaterials: 12
                },
                upkeep: {
                    manpower: 14,
                    supplies: 9,
                    fuel: 6,
                    components: 4,
                    rareMaterials: 1
                }
            }
        ],
        support: [
            {
                id: 'self_propelled_artillery_eastern',
                name: 'Self-Propelled Artillery',
                productionTime: 3,
                resources: {
                    manpower: 160,
                    supplies: 120,
                    fuel: 85,
                    components: 60,
                    rareMaterials: 15
                },
                upkeep: {
                    manpower: 16,
                    supplies: 12,
                    fuel: 8,
                    components: 6,
                    rareMaterials: 1
                }
            },
            {
                id: 'multiple_rocket_launcher_eastern',
                name: 'Multiple Rocket Launcher',
                productionTime: 3,
                resources: {
                    manpower: 180,
                    supplies: 140,
                    fuel: 90,
                    components: 70,
                    rareMaterials: 20
                },
                upkeep: {
                    manpower: 18,
                    supplies: 14,
                    fuel: 9,
                    components: 7,
                    rareMaterials: 2
                }
            }
        ],
        helicopters: [
            {
                id: 'attack_helicopter_eastern',
                name: 'Attack Helicopter',
                productionTime: 3,
                resources: {
                    manpower: 230,
                    supplies: 165,
                    fuel: 115,
                    components: 90,
                    rareMaterials: 25
                },
                upkeep: {
                    manpower: 23,
                    supplies: 16,
                    fuel: 11,
                    components: 9,
                    rareMaterials: 2
                }
            }
        ],
        fighters: [
            {
                id: 'fighter_jet_eastern',
                name: 'Fighter Jet',
                productionTime: 4,
                resources: {
                    manpower: 280,
                    supplies: 190,
                    fuel: 140,
                    components: 115,
                    rareMaterials: 35
                },
                upkeep: {
                    manpower: 28,
                    supplies: 19,
                    fuel: 14,
                    components: 11,
                    rareMaterials: 3
                }
            }
        ],
        heavies: [
            {
                id: 'strategic_bomber_eastern',
                name: 'Strategic Bomber',
                productionTime: 5,
                resources: {
                    manpower: 380,
                    supplies: 290,
                    fuel: 240,
                    components: 190,
                    rareMaterials: 55
                },
                upkeep: {
                    manpower: 38,
                    supplies: 29,
                    fuel: 24,
                    components: 19,
                    rareMaterials: 5
                }
            }
        ],
        naval: [
            {
                id: 'destroyer_eastern',
                name: 'Destroyer',
                productionTime: 5,
                resources: {
                    manpower: 430,
                    supplies: 330,
                    fuel: 280,
                    components: 230,
                    rareMaterials: 70
                },
                upkeep: {
                    manpower: 43,
                    supplies: 33,
                    fuel: 28,
                    components: 23,
                    rareMaterials: 7
                }
            }
        ],
        submarine: [
            {
                id: 'attack_submarine_eastern',
                name: 'Attack Submarine',
                productionTime: 5,
                resources: {
                    manpower: 405,
                    supplies: 305,
                    fuel: 255,
                    components: 205,
                    rareMaterials: 65
                },
                upkeep: {
                    manpower: 40,
                    supplies: 30,
                    fuel: 25,
                    components: 20,
                    rareMaterials: 6
                }
            }
        ]
    },
    european: {
        infantry: [
            {
                id: 'motorized_infantry_european',
                name: 'Motorized Infantry',
                productionTime: 1,
                resources: {
                    manpower: 95,
                    supplies: 48,
                    fuel: 22,
                    components: 9,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 9,
                    supplies: 4,
                    fuel: 2,
                    components: 0,
                    rareMaterials: 0
                }
            },
            {
                id: 'mechanized_infantry_european',
                name: 'Mechanized Infantry',
                productionTime: 2,
                resources: {
                    manpower: 145,
                    supplies: 72,
                    fuel: 48,
                    components: 22,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 14,
                    supplies: 7,
                    fuel: 4,
                    components: 2,
                    rareMaterials: 0
                }
            },
            {
                id: 'airborne_infantry_european',
                name: 'Airborne Infantry',
                productionTime: 2,
                resources: {
                    manpower: 190,
                    supplies: 95,
                    fuel: 70,
                    components: 47,
                    rareMaterials: 0
                },
                upkeep: {
                    manpower: 19,
                    supplies: 9,
                    fuel: 7,
                    components: 4,
                    rareMaterials: 0
                }
            }
        ],
        armored: [
            {
                id: 'main_battle_tank_european',
                name: 'Main Battle Tank',
                productionTime: 3,
                resources: {
                    manpower: 190,
                    supplies: 145,
                    fuel: 95,
                    components: 72,
                    rareMaterials: 22
                },
                upkeep: {
                    manpower: 19,
                    supplies: 14,
                    fuel: 9,
                    components: 7,
                    rareMaterials: 2
                }
            },
            {
                id: 'armored_fighting_vehicle_european',
                name: 'Armored Fighting Vehicle',
                productionTime: 2,
                resources: {
                    manpower: 145,
                    supplies: 95,
                    fuel: 70,
                    components: 47,
                    rareMaterials: 13
                },
                upkeep: {
                    manpower: 14,
                    supplies: 9,
                    fuel: 7,
                    components: 4,
                    rareMaterials: 1
                }
            }
        ],
        support: [
            {
                id: 'self_propelled_artillery_european',
                name: 'Self-Propelled Artillery',
                productionTime: 3,
                resources: {
                    manpower: 170,
                    supplies: 130,
                    fuel: 88,
                    components: 63,
                    rareMaterials: 18
                },
                upkeep: {
                    manpower: 17,
                    supplies: 13,
                    fuel: 8,
                    components: 6,
                    rareMaterials: 1
                }
            },
            {
                id: 'multiple_rocket_launcher_european',
                name: 'Multiple Rocket Launcher',
                productionTime: 3,
                resources: {
                    manpower: 190,
                    supplies: 145,
                    fuel: 95,
                    components: 72,
                    rareMaterials: 22
                },
                upkeep: {
                    manpower: 19,
                    supplies: 14,
                    fuel: 9,
                    components: 7,
                    rareMaterials: 2
                }
            }
        ],
        helicopters: [
            {
                id: 'attack_helicopter_european',
                name: 'Attack Helicopter',
                productionTime: 3,
                resources: {
                    manpower: 240,
                    supplies: 170,
                    fuel: 120,
                    components: 95,
                    rareMaterials: 28
                },
                upkeep: {
                    manpower: 24,
                    supplies: 17,
                    fuel: 12,
                    components: 9,
                    rareMaterials: 2
                }
            }
        ],
        fighters: [
            {
                id: 'fighter_jet_european',
                name: 'Fighter Jet',
                productionTime: 4,
                resources: {
                    manpower: 290,
                    supplies: 195,
                    fuel: 145,
                    components: 120,
                    rareMaterials: 38
                },
                upkeep: {
                    manpower: 29,
                    supplies: 19,
                    fuel: 14,
                    components: 12,
                    rareMaterials: 3
                }
            }
        ],
        heavies: [
            {
                id: 'strategic_bomber_european',
                name: 'Strategic Bomber',
                productionTime: 5,
                resources: {
                    manpower: 390,
                    supplies: 295,
                    fuel: 245,
                    components: 195,
                    rareMaterials: 58
                },
                upkeep: {
                    manpower: 39,
                    supplies: 29,
                    fuel: 24,
                    components: 19,
                    rareMaterials: 5
                }
            }
        ],
        naval: [
            {
                id: 'destroyer_european',
                name: 'Destroyer',
                productionTime: 5,
                resources: {
                    manpower: 440,
                    supplies: 340,
                    fuel: 290,
                    components: 240,
                    rareMaterials: 73
                },
                upkeep: {
                    manpower: 44,
                    supplies: 34,
                    fuel: 29,
                    components: 24,
                    rareMaterials: 7
                }
            }
        ],
        submarine: [
            {
                id: 'attack_submarine_european',
                name: 'Attack Submarine',
                productionTime: 5,
                resources: {
                    manpower: 415,
                    supplies: 315,
                    fuel: 265,
                    components: 215,
                    rareMaterials: 68
                },
                upkeep: {
                    manpower: 41,
                    supplies: 31,
                    fuel: 26,
                    components: 21,
                    rareMaterials: 6
                }
            }
        ]
    }
};

// Production planning functions
function calculateUnitResources(unit, quantity = 1) {
    return {
        manpower: unit.resources.manpower * quantity,
        supplies: unit.resources.supplies * quantity,
        fuel: unit.resources.fuel * quantity,
        components: unit.resources.components * quantity,
        rareMaterials: unit.resources.rareMaterials * quantity
    };
}

function calculateUnitUpkeep(unit, quantity = 1) {
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