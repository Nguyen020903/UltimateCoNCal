/**
 * Unit Weight and Damage Distribution Calculator
 * 
 * Manages unit weights and provides damage distribution calculations
 * Last Updated: May 13, 2024
 */
class UnitWeightManager {
    constructor() {
        // Ground Units
        this.groundUnits = {
            infantry: {
                'Mot Infantry': 3,
                'Mechanized Infantry': 7,
                'Marine Infantry': 5,
                'Airborne Infantry': 5,
                'Special Forces': 1,
                'National Guard': 4
            },
            armored: {
                'Combat Recon Vehicle': 2,
                'Armor Fighting Vehicle': 7,
                'Amphibious Combat Vehicle': 6,
                'Main Battle Tank': 9,
                'Tank Destroyer': 8
            },
            support: {
                'Towed Artillery': 2,
                'Mobile Artillery': 6,
                'Multiple Rocket Launcher': 6,
                'Mobile AA': 4,
                'SAM': 3
            },
            officers: {
                'Infantry Officer': 2,
                'Airborne Officer': 1,
                'Tank Officer': 5
            },
            seasons: {
                'Elite MBT': 7,
                'Elite Railgun': 7,
                'Elite UGV': 1.5,
                'Elite Special Forces': 2,
                'Mobile Radar': 1
            },
            missiles: {
                'ICBM Launcher': 1,
                'BM Launcher': 1,
                'CM Launcher': 1
            }
        };

        // Air Units
        this.airUnits = {
            fixedWing: {
                'Air Superiority Fighter': 10,
                'Naval Air Superiority Fighter': 9,
                'Stealth Air Superiority Fighter': 5,
                'Strike Fighter': 5,
                'Naval Strike Fighter': 5,
                'Stealth Strike Fighter': 3,
                'UAV': 2
            },
            rotaryWing: {
                'Helicopter Gunship': 8,
                'Attack Helicopter': 7,
                'ASW Helicopter': 6
            },
            officers: {
                'Fixed Wing Officer': 2,
                'Rotary Wing Officer': 3
            },
            heavy: {
                'AWACS': 1,
                'Naval AWACS': 1,
                'Heavy Bomber': 4,
                'Stealth Bomber': 1,
                'Naval Patrol Aircraft': 3
            },
            seasons: {
                'Elite Attack Helicopter': 6,
                'Elite Bomber': 3,
                'Elite Attack Aircraft': 7
            }
        };

        // Naval Units
        this.navalUnits = {
            surfaceVessels: {
                'Corvette': 5,
                'Frigate': 4,
                'Destroyer': 8,
                'Cruiser': 5,
                'Aircraft Carrier': 2
            },
            submarine: {
                'Attack Submarine': 4,
                'Missiles Submarine': 1
            },
            officers: {
                'Naval Officer': 2,
                'Submarine Commander': 1
            },
            seasons: {
                'Elite AIP Submarine': 2,
                'Elite Frigate': 3
            },
            misc: {
                'Transport Ship': 3
            }
        };
    }

    /**
     * Get the weight of a specific unit
     * @param {string} unitName - Name of the unit
     * @returns {number} Weight of the unit, or throws an error if not found
     */
    getUnitWeight(unitName) {
        const searchInCategory = (category) => {
            for (let subCategory in category) {
                if (category[subCategory][unitName] !== undefined) {
                    return category[subCategory][unitName];
                }
            }
            return null;
        };

        let weight = searchInCategory(this.groundUnits) ||
                     searchInCategory(this.airUnits) ||
                     searchInCategory(this.navalUnits);

        if (weight === null) {
            throw new Error(`Unit "${unitName}" not found in any category`);
        }

        return weight;
    }

    /**
     * Calculate damage distribution for a stack of units
     * @param {Object} unitStack - Object with unit names as keys and their counts as values
     * @returns {Object} Damage distribution percentages for each unit type
     */
    calculateDamageDistribution(unitStack) {
        // Calculate total weight of the stack
        let totalWeight = 0;
        const unitWeights = {};

        // Calculate individual unit weights and total stack weight
        for (let [unitName, count] of Object.entries(unitStack)) {
            const unitWeight = this.getUnitWeight(unitName);
            unitWeights[unitName] = unitWeight * count;
            totalWeight += unitWeight * count;
        }

        // Calculate damage distribution percentages
        const damageDistribution = {};
        for (let [unitName, totalUnitWeight] of Object.entries(unitWeights)) {
            damageDistribution[unitName] = {
                weight: totalUnitWeight,
                damagePercentage: (totalUnitWeight / totalWeight) * 100
            };
        }

        return damageDistribution;
    }

    /**
     * Simulate damage distribution to units
     * @param {Object} unitStack - Object with unit names as keys and their counts as values
     * @param {number} totalDamage - Total incoming damage
     * @returns {Object} Damage taken by each unit type
     */
    distributeDamage(unitStack, totalDamage) {
        const distribution = this.calculateDamageDistribution(unitStack);
        const damageTaken = {};

        for (let [unitName, details] of Object.entries(distribution)) {
            damageTaken[unitName] = {
                count: unitStack[unitName],
                damagePercentage: details.damagePercentage,
                damageAmount: (details.damagePercentage / 100) * totalDamage
            };
        }

        return damageTaken;
    }
}

// Export the class for use in other modules
export default UnitWeightManager;

// Example usage
const unitManager = new UnitWeightManager();

// Example 1: ASF and Strike Fighter stack
const exampleStack1 = {
    'Air Superiority Fighter': 1,
    'Strike Fighter': 4
};
console.log('Example Stack 1 Distribution:', 
    unitManager.calculateDamageDistribution(exampleStack1)
);

// Example 2: Distributing 100 damage to a mixed unit stack
const exampleDamageDistribution = unitManager.distributeDamage(exampleStack1, 100);
console.log('Example Damage Distribution:', exampleDamageDistribution);