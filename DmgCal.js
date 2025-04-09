// Doctrine Modifiers: Flat and Percentage-Based
const doctrines = {
    Eastern: {
      "Motorized Infantry": {
        flat: { atk: 1, def: 0, speed: -0.1, hp: 2 },
        percent: { atk: 10, def: 5, speed: -5, hp: 5 }, // Percent modifiers
      },
      "Mechanized Infantry": {
        flat: { atk: 1, def: 1, speed: -0.1, hp: 3 },
        percent: { atk: 10, def: 10, speed: -5, hp: 10 },
      },
      "Naval Infantry": {
        flat: { atk: 1.5, def: 0.5, speed: -0.1, hp: 2 },
        percent: { atk: 12, def: 8, speed: -5, hp: 5 },
      },
      "Airmobile Infantry": {
        flat: { atk: 1.5, def: 0, speed: 0, hp: 1 },
        percent: { atk: 15, def: 5, speed: 0, hp: 0 },
      },
      "Special Forces": {
        flat: { atk: 2, def: 1, speed: 0.1, hp: 2 },
        percent: { atk: 15, def: 10, speed: 5, hp: 5 },
      },
      "National Guard": {
        flat: { atk: 0, def: 1, speed: -0.2, hp: 3 },
        percent: { atk: 0, def: 10, speed: -10, hp: 10 },
      },
      Tank: {
        flat: { atk: 2, def: 1, speed: -0.2, hp: 3 },
        percent: { atk: 15, def: 5, speed: -10, hp: 10 },
      },
    },
    Western: {
      "Motorized Infantry": {
        flat: { atk: 0.5, def: 2, speed: 0.1, hp: -1 },
        percent: { atk: 5, def: 10, speed: 10, hp: -5 },
      },
      Tank: {
        flat: { atk: 1, def: 2, speed: 0.2, hp: -1 },
        percent: { atk: 5, def: 15, speed: 15, hp: -5 },
      },
    },
    European: {
      "Motorized Infantry": {
        flat: { atk: 0, def: 1, speed: 0, hp: 3 },
        percent: { atk: 0, def: 5, speed: 0, hp: 15 },
      },
      Tank: {
        flat: { atk: 1, def: 2, speed: 0, hp: 2 },
        percent: { atk: 10, def: 5, speed: 0, hp: 10 },
      },
    },
  };
  
  // Resource type mapping
  const resourceMapping = {
    resource_1: "supply",
    resource_2: "component",
    resource_3: "manpower",
    resource_4: "rare", 
    resource_5: "fuel",
    resource_6: "electronic",
    resource_20: "money"
  };
  
  // Attack/Defense type mapping based on Rules.txt
  const combatTypeMapping = {
    type_0: "soft",      // soft target (infantry, support vehicles)
    type_4: "hard",      // hard target (armored vehicles, bunkers)
    type_1: "fixedWing", // fixed wing target (aircraft, planes)
    type_8: "rotaryWing", // rotary wing target (helicopters)
    type_1004: "drone",  // drones (UAVs)
    type_1003: "missile", // missiles (cruise missiles, ballistic missiles)
    type_2: "naval",     // surface vessel (naval ships)
    type_5: "submarine", // submarine
    type_3: "building",  // building (structures, facilities)
    type_7: "population" // population (civilians)
  };
  
  // Terrain mapping based on Rules.txt
  const terrainMapping = {
    terrain_1: "inFlight",    // in flight (air unit only)
    terrain_0: "onGround",    // on the ground (Air unit only)
    terrain_10: "openGround", // open ground
    terrain_12: "mountains",  // mountains
    terrain_13: "forest",     // forest
    terrain_14: "urban",      // urban
    terrain_21: "suburban",   // suburban
    terrain_15: "jungle",     // jungle
    terrain_16: "tundra",     // tundra
    terrain_17: "desert",     // desert
    terrain_19: "highSea",    // high sea
    terrain_20: "coastalWater" // coastal water
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
  
  // Function to get attack and defense values from JSON data
  function getAttackDefenseValues(unitData) {
    const attackValues = {};
    const defenseValues = {};
    
    if (unitData.combatProperties && unitData.combatProperties.attack) {
      const attack = unitData.combatProperties.attack;
      Object.keys(attack).forEach(key => {
        const combatType = combatTypeMapping[key] || key;
        attackValues[combatType] = attack[key];
      });
    }
    
    if (unitData.combatProperties && unitData.combatProperties.defense) {
      const defense = unitData.combatProperties.defense;
      Object.keys(defense).forEach(key => {
        const combatType = combatTypeMapping[key] || key;
        defenseValues[combatType] = defense[key];
      });
    }
    
    return { attackValues, defenseValues };
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
  
  // Function to get unit HP, speed, and sight range from JSON data
  function getUnitProperties(unitData) {
    const hp = {};
    const speed = {};
    const sightRange = {};
    
    if (unitData.terrain) {
      if (unitData.terrain.hitPoints) {
        Object.keys(unitData.terrain.hitPoints).forEach(key => {
          const terrainType = terrainMapping[key] || key;
          hp[terrainType] = unitData.terrain.hitPoints[key];
        });
      }
      
      if (unitData.terrain.speedValues) {
        Object.keys(unitData.terrain.speedValues).forEach(key => {
          const terrainType = terrainMapping[key] || key;
          speed[terrainType] = unitData.terrain.speedValues[key];
        });
      }
      
      if (unitData.terrain.sightRange) {
        Object.keys(unitData.terrain.sightRange).forEach(key => {
          const terrainType = terrainMapping[key] || key;
          sightRange[terrainType] = unitData.terrain.sightRange[key];
        });
      }
    }
    
    return { hp, speed, sightRange };
  }
  
  // Function to convert terrain modifiers from strings to numbers
  function parseTerrainModifier(modifierStr) {
    if (!modifierStr) return 0;
    
    // Convert "+25%" or "-50%" to numeric values (0.25 or -0.5)
    const match = modifierStr.match(/([+-])(\d+)%/);
    if (match) {
      const sign = match[1] === '+' ? 1 : -1;
      const value = parseInt(match[2]) / 100;
      return sign * value;
    }
    
    return 0;
  }
  
  // Function to get terrain modifiers from JSON data
  function getTerrainModifiers(unitData) {
    const attackModifiers = {};
    const defenseModifiers = {};
    
    if (unitData.terrain) {
      if (unitData.terrain.attackModifiers) {
        Object.keys(unitData.terrain.attackModifiers).forEach(key => {
          const terrainType = terrainMapping[key] || key;
          attackModifiers[terrainType] = parseTerrainModifier(unitData.terrain.attackModifiers[key]);
        });
      }
      
      if (unitData.terrain.defenseModifiers) {
        Object.keys(unitData.terrain.defenseModifiers).forEach(key => {
          const terrainType = terrainMapping[key] || key;
          defenseModifiers[terrainType] = parseTerrainModifier(unitData.terrain.defenseModifiers[key]);
        });
      }
    }
    
    return { attackModifiers, defenseModifiers };
  }
  
  // Function to create a Unit instance from JSON data
  async function createUnitFromJSON(doctrine, unitType, unitName) {
    const unitData = await loadUnitData(doctrine, unitType, unitName);
    if (!unitData) return null;
    
    const { attackValues, defenseValues } = getAttackDefenseValues(unitData);
    const { hp, speed, sightRange } = getUnitProperties(unitData);
    const { attackModifiers, defenseModifiers } = getTerrainModifiers(unitData);
    
    // Determine average attack and defense values
    let avgAttack = 0;
    let attackCount = 0;
    Object.values(attackValues).forEach(value => {
      avgAttack += value;
      attackCount++;
    });
    avgAttack = attackCount > 0 ? avgAttack / attackCount : 0;
    
    let avgDefense = 0;
    let defenseCount = 0;
    Object.values(defenseValues).forEach(value => {
      avgDefense += value;
      defenseCount++;
    });
    avgDefense = defenseCount > 0 ? avgDefense / defenseCount : 0;
    
    // Get average HP for open ground or first available terrain
    const baseHP = hp.openGround || Object.values(hp)[0] || 10;
    
    // Get average speed for open ground or first available terrain
    const baseSpeed = speed.openGround || Object.values(speed)[0] || 1;
    
    // Create the unit with base values
    const unit = new Unit(
      unitName.toLowerCase().replace(/\s+/g, '_'),
      unitData.basic.name,
      unitType,
      avgAttack,
      avgDefense,
      baseHP,
      baseSpeed,
      0 // Base range - can be updated if available in JSON
    );
    
    // Add detailed properties
    unit.rawData = unitData;
    unit.attackValues = attackValues;
    unit.defenseValues = defenseValues;
    unit.hp = hp;
    unit.speed = speed;
    unit.sightRange = sightRange;
    unit.attackModifiers = attackModifiers;
    unit.defenseModifiers = defenseModifiers;
    unit.productionTime = mobilizationTimeToHours(unitData.basic.mobilizationTime);
    
    // Set doctrine
    unit.setDoctrine(doctrine);
    
    return unit;
  }
  
  // Override populateUnits to use JSON data
  async function populateUnits(doctrineSelectId, unitTypeSelectId, unitSelectId) {
    const doctrineSelect = document.getElementById(doctrineSelectId);
    const unitTypeSelect = document.getElementById(unitTypeSelectId);
    const unitSelect = document.getElementById(unitSelectId);
    
    const doctrine = doctrineSelect.value;
    const unitType = unitTypeSelect.value;
    
    // Clear existing options
    unitSelect.innerHTML = '<option value="">Select Unit</option>';
    
    try {
      // Fetch the directory listing for the selected doctrine and unit type
      const response = await fetch(`Unit_stats/${doctrine}/${unitType}/`);
      const files = await response.json(); // This assumes your server returns a JSON list of files
      
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const unitName = file.replace('.json', '');
          const option = document.createElement('option');
          option.value = unitName;
          option.textContent = unitName.replace(/_/g, ' ');
          unitSelect.appendChild(option);
        }
      });
    } catch (error) {
      console.error(`Error loading units: ${error}`);
      // Fallback to hardcoded units if API fails
      if (doctrine === 'Eastern') {
        if (unitType === 'Infantry') {
          addOption(unitSelect, 'motorized_infantry', 'Motorized Infantry');
          addOption(unitSelect, 'mechanized_infantry', 'Mechanized Infantry');
          // Add more units as needed
        } else if (unitType === 'Armored') {
          addOption(unitSelect, 't-80', 'T-80 Main Battle Tank');
          addOption(unitSelect, 't-90', 'T-90 Main Battle Tank');
          // Add more units as needed
        }
      }
      // Add similar fallbacks for other doctrines
    }
  }
  
  function addOption(select, value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  }
  
  // Update the createUnitFromSelection function to use JSON data
  async function createUnitFromSelection(side) {
    const doctrineSelectId = `${side}Doctrine`;
    const unitTypeSelectId = `${side}UnitType`;
    const unitSelectId = `${side}Unit`;
    const levelSelectId = `${side}Level`;
    
    const doctrine = document.getElementById(doctrineSelectId).value;
    const unitType = document.getElementById(unitTypeSelectId).value;
    const unitName = document.getElementById(unitSelectId).value;
    const level = parseInt(document.getElementById(levelSelectId).value) || 1;
    
    if (!doctrine || !unitType || !unitName) {
      console.error(`Missing selection for ${side}`);
      return null;
    }
    
    try {
      // Create unit from JSON data
      const unit = await createUnitFromJSON(doctrine, unitType, unitName);
      if (!unit) {
        throw new Error(`Failed to create unit from JSON data`);
      }
      
      // Apply level upgrades
      unit.upgrade(level);
      
      return unit;
    } catch (error) {
      console.error(`Error creating unit: ${error}`);
      
      // Fallback to existing code if JSON loading fails
      if (doctrine === 'Eastern') {
        // Use existing functions as fallback
        let unit;
        if (unitType === 'Infantry') {
          unit = getEasternInfantryUnit(unitName, level);
        } else if (unitType === 'Armored') {
          unit = getEasternArmoredUnit(unitName, level);
        }
        // Add other unit types as needed
        
        if (unit) {
          unit.setDoctrine(doctrine);
          return unit;
        }
      }
      // Add fallbacks for other doctrines
      
      return null;
    }
  }
  
  // Unit weights for damage distribution
  const unitWeights = {
      // Infantry
      motorizedInfantry: 3,
      mechanizedInfantry: 7,
      marineInfantry: 5,
      airborneInfantry: 5,
      specialForces: 1,
      nationalGuard: 4,
      
      // Armor
      combatReconVehicle: 2,
      armoredFightingVehicle: 7,
      amphibiousCombatVehicle: 6,
      mainBattleTank: 9,
      tankDestroyer: 8,
      
      // Support
      towedArtillery: 2,
      mobileArtillery: 6,
      multipleRocketLauncher: 6,
      mobileAA: 4,
      sam: 3,
      tds: 1,
      mobileRadar: 1,
      
      // Air Units
      airSuperiorityFighter: 10,
      strikeFighter: 5,
      stealthStrikeFighter: 3,
      uav: 2,
      awacs: 1,
      heavyBomber: 4,
      stealthBomber: 1,
      
      // Naval Units
      corvette: 5,
      frigate: 4,
      destroyer: 8,
      cruiser: 5,
      aircraftCarrier: 2,
      attackSubmarine: 4,
      missileSubmarine: 1
  };
  
  // Unit classification (soft vs hard)
  const unitClassification = {
      // Soft units (infantry)
      motorizedInfantry: 'soft',
      mechanizedInfantry: 'soft',
      marineInfantry: 'soft',
      airborneInfantry: 'soft',
      specialForces: 'soft',
      nationalGuard: 'soft',
      
      // Hard units (vehicles, armor, etc.)
      combatReconVehicle: 'hard',
      armoredFightingVehicle: 'hard',
      amphibiousCombatVehicle: 'hard',
      mainBattleTank: 'hard',
      tankDestroyer: 'hard',
      towedArtillery: 'hard',
      mobileArtillery: 'hard',
      multipleRocketLauncher: 'hard',
      mobileAA: 'hard',
      sam: 'hard',
      tds: 'hard',
      mobileRadar: 'hard',
      
      // Air units (treated as hard)
      airSuperiorityFighter: 'hard',
      strikeFighter: 'hard',
      stealthStrikeFighter: 'hard',
      uav: 'hard',
      awacs: 'hard',
      heavyBomber: 'hard',
      stealthBomber: 'hard',
      
      // Naval units (all hard)
      corvette: 'hard',
      frigate: 'hard',
      destroyer: 'hard',
      cruiser: 'hard',
      aircraftCarrier: 'hard',
      attackSubmarine: 'hard',
      missileSubmarine: 'hard'
  };
  
  // Ranged units list
  const rangedUnits = [
      'towedArtillery',
      'mobileArtillery',
      'multipleRocketLauncher',
      'corvette',
      'frigate',
      'destroyer',
      'cruiser',
      'aircraftCarrier',
      'missileSubmarine'
  ];
  
  // Unit Class Definition
  class Unit {
    constructor(id, name, type, attack, defense, hp, speed, baseRange) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.attack = attack;
        this.defense = defense;
        this.hp = hp;
        this.speed = speed;
        this.baseRange = baseRange;
        this.level = 1;
        this.doctrine = null;
        
        // Added properties for damage calculation
        this.weight = unitWeights[id] || 5; // Default weight 5 if not defined
        this.classification = unitClassification[id] || 'hard'; // Default hard if not defined
        this.isRanged = rangedUnits.includes(id);
        this.currentHP = hp;
        this.maxHP = hp;
        
        // New fields for JSON data
        this.rawData = null;
        this.attackValues = {};
        this.defenseValues = {};
        this.attackModifiers = {};
        this.defenseModifiers = {};
    }

    setDoctrine(doctrine) {
        this.doctrine = doctrine;
        return this;
    }

    upgrade(level) {
        this.level = level;
        return this;
    }

    clone() {
        const clonedUnit = new Unit(
            this.id,
            this.name,
            this.type,
            this.attack,
            this.defense,
            this.hp,
            this.speed,
            this.baseRange
        );
        clonedUnit.level = this.level;
        clonedUnit.doctrine = this.doctrine;
        clonedUnit.weight = this.weight;
        clonedUnit.classification = this.classification;
        clonedUnit.isRanged = this.isRanged;
        clonedUnit.currentHP = this.currentHP;
        clonedUnit.maxHP = this.maxHP;
        
        // Clone JSON data if available
        if (this.rawData) clonedUnit.rawData = this.rawData;
        if (this.attackValues) clonedUnit.attackValues = {...this.attackValues};
        if (this.defenseValues) clonedUnit.defenseValues = {...this.defenseValues};
        if (this.attackModifiers) clonedUnit.attackModifiers = {...this.attackModifiers};
        if (this.defenseModifiers) clonedUnit.defenseModifiers = {...this.defenseModifiers};
        
        return clonedUnit;
    }

    getStatModifier(terrain) {
        // If we have JSON terrain data, use that first
        if (this.attackModifiers && this.defenseModifiers) {
            const terrainKey = Object.keys(terrainMapping).find(key => 
                terrainMapping[key] === terrain);
            
            // Try to get the mapped terrain value from JSON data
            const mappedTerrain = terrain in this.attackModifiers ? terrain : 
                (terrainKey && terrainMapping[terrainKey] in this.attackModifiers ? terrainMapping[terrainKey] : null);
            
            if (mappedTerrain) {
                return {
                    attack: this.attackModifiers[mappedTerrain] || 0,
                    defense: this.defenseModifiers[mappedTerrain] || 0
                };
            }
        }
        
        // Fallback to hardcoded terrain modifiers
        switch (this.type.toLowerCase()) {
            case 'infantry':
                switch (terrain) {
                    case 'forest':
                        return {attack: 0.1, defense: 0.2};
                    case 'urban':
                        return {attack: 0.15, defense: 0.25};
                    case 'mountain':
                        return {attack: -0.1, defense: 0.15};
                    case 'desert':
                        return {attack: 0, defense: -0.1};
                    case 'jungle':
                        return {attack: -0.05, defense: 0.1};
                    default:
                        return {attack: 0, defense: 0};
                }
            case 'armored':
                switch (terrain) {
                    case 'forest':
                        return {attack: -0.15, defense: 0};
                    case 'urban':
                        return {attack: -0.2, defense: -0.1};
                    case 'mountain':
                        return {attack: -0.25, defense: -0.15};
                    case 'desert':
                        return {attack: 0.15, defense: 0.1};
                    case 'jungle':
                        return {attack: -0.3, defense: -0.2};
                    default:
                        return {attack: 0, defense: 0};
                }
            case 'support':
                switch (terrain) {
                    case 'forest':
                        return {attack: -0.1, defense: 0.1};
                    case 'urban':
                        return {attack: -0.15, defense: 0.15};
                    case 'mountain':
                        return {attack: -0.2, defense: 0.05};
                    case 'desert':
                        return {attack: 0.1, defense: -0.05};
                    case 'jungle':
                        return {attack: -0.25, defense: 0};
                    default:
                        return {attack: 0, defense: 0};
                }
            case 'helicopter':
                switch (terrain) {
                    case 'forest':
                        return {attack: 0, defense: -0.1};
                    case 'urban':
                        return {attack: -0.05, defense: -0.15};
                    case 'mountain':
                        return {attack: 0.05, defense: -0.05};
                    case 'desert':
                        return {attack: 0.1, defense: 0};
                    case 'jungle':
                        return {attack: -0.1, defense: -0.2};
                    default:
                        return {attack: 0, defense: 0};
                }
            case 'fighter':
                // Minimal terrain influence for aircraft
                return {attack: 0, defense: 0};
            case 'naval':
                // Only relevant in sea terrains
                switch (terrain) {
                    case 'high_sea':
                        return {attack: 0.1, defense: 0.05};
                    case 'coastal':
                        return {attack: -0.05, defense: -0.1};
                    default:
                        return {attack: 0, defense: 0};
                }
            default:
                return {attack: 0, defense: 0};
        }
    }
    
    getEffectiveStats(terrain) {
        // Get terrain modifier
        const terrainMod = this.getStatModifier(terrain);
        
        // Level modifier calculation: each level adds 10% to base stats
        const levelMod = (this.level - 1) * 0.1;
        
        // Get doctrine modifiers if available
        let doctrineModFlat = {atk: 0, def: 0, speed: 0, hp: 0};
        let doctrineModPercent = {atk: 0, def: 0, speed: 0, hp: 0};
        
        if (this.doctrine && doctrines[this.doctrine] && doctrines[this.doctrine][this.type]) {
            doctrineModFlat = doctrines[this.doctrine][this.type].flat;
            doctrineModPercent = doctrines[this.doctrine][this.type].percent;
        }
        
        // Calculate effective attack and defense
        let effectiveAttack = 0;
        let effectiveDefense = 0;
        
        // If we have JSON combat data, use typed attack and defense values
        if (this.attackValues && Object.keys(this.attackValues).length > 0) {
            // Calculate average attack value from all attack types
            let totalAttack = 0;
            let attackTypes = 0;
            for (const type in this.attackValues) {
                totalAttack += this.attackValues[type];
                attackTypes++;
            }
            
            if (attackTypes > 0) {
                effectiveAttack = totalAttack / attackTypes;
            }
        } else {
            effectiveAttack = this.attack;
        }
        
        if (this.defenseValues && Object.keys(this.defenseValues).length > 0) {
            // Calculate average defense value from all defense types
            let totalDefense = 0;
            let defenseTypes = 0;
            for (const type in this.defenseValues) {
                totalDefense += this.defenseValues[type];
                defenseTypes++;
            }
            
            if (defenseTypes > 0) {
                effectiveDefense = totalDefense / defenseTypes;
            }
        } else {
            effectiveDefense = this.defense;
        }
        
        // Apply level and terrain modifiers
        effectiveAttack = effectiveAttack * (1 + levelMod + terrainMod.attack);
        effectiveDefense = effectiveDefense * (1 + levelMod + terrainMod.defense);
        
        // Apply doctrine flat modifiers
        effectiveAttack += doctrineModFlat.atk;
        effectiveDefense += doctrineModFlat.def;
        
        // Apply doctrine percentage modifiers
        effectiveAttack *= (1 + (doctrineModPercent.atk / 100));
        effectiveDefense *= (1 + (doctrineModPercent.def / 100));
        
        // Get HP and speed from JSON data if available, otherwise use base values
        let effectiveHP = this.hp;
        let effectiveSpeed = this.speed;
        
        if (this.rawData && this.rawData.terrain && this.rawData.terrain.hitPoints) {
            // Try to get HP for the specific terrain
            const terrainKey = Object.keys(terrainMapping).find(key => terrainMapping[key] === terrain);
            if (terrainKey && this.rawData.terrain.hitPoints[terrainKey]) {
                effectiveHP = this.rawData.terrain.hitPoints[terrainKey];
            } else if (this.rawData.terrain.hitPoints.terrain_10) { // Default to open ground
                effectiveHP = this.rawData.terrain.hitPoints.terrain_10;
            }
        }
        
        if (this.rawData && this.rawData.terrain && this.rawData.terrain.speedValues) {
            // Try to get speed for the specific terrain
            const terrainKey = Object.keys(terrainMapping).find(key => terrainMapping[key] === terrain);
            if (terrainKey && this.rawData.terrain.speedValues[terrainKey]) {
                effectiveSpeed = this.rawData.terrain.speedValues[terrainKey];
            } else if (this.rawData.terrain.speedValues.terrain_10) { // Default to open ground
                effectiveSpeed = this.rawData.terrain.speedValues.terrain_10;
            }
        }
        
        // Apply level and doctrine modifiers to HP and speed
        effectiveHP = effectiveHP * (1 + levelMod) + doctrineModFlat.hp;
        effectiveHP *= (1 + (doctrineModPercent.hp / 100));
        
        effectiveSpeed = effectiveSpeed * (1 + levelMod) + doctrineModFlat.speed;
        effectiveSpeed *= (1 + (doctrineModPercent.speed / 100));
        
        // Return the effective stats
        return {
            attack: Math.max(0, effectiveAttack),
            defense: Math.max(0, effectiveDefense),
            hp: Math.max(1, effectiveHP),
            speed: Math.max(0.1, effectiveSpeed)
        };
    }
  }
  
  // Example Units
  const units = [
    new Unit(
      "Motorized Infantry",
      "infantry",
      { atk: 3.0, def: 3.8, speed: 1.0, hp: 15, sight: 25 },
      { plains: -25, forest: 25, mountains: 25, snow: -25 }
    ),
    new Unit(
      "Tank",
      "armor",
      { atk: 8.0, def: 7.5, speed: 1.5, hp: 30, sight: 15 },
      { plains: 10, forest: -10, mountains: -25, snow: -10 }
    ),
    // Add more units as needed
  ];
  
  // Composition Class
  class Composition {
    constructor(doctrine) {
      this.units = []; // { unit: Unit, count: number }
      this.doctrine = doctrine; // Doctrine for this composition
    }
  
    // Add units to the composition
    addUnit(unit, count = 1) {
      this.units.push({ unit, count });
    }
  
    // Calculate total stats for the composition
    calculateTotalStats(terrain) {
      const totalStats = { atk: 0, def: 0, speed: 0, hp: 0, sight: 0 };
      this.units.forEach(({ unit, count }) => {
        const effectiveStats = unit.getEffectiveStats(terrain);
        for (const stat in effectiveStats) {
          totalStats[stat] += effectiveStats[stat] * count;
        }
      });
      return totalStats;
    }
    
    // Calculate total power for the composition (for battle calculation)
    calculateTotalPower(terrain, isAttacker) {
      let totalPower = 0;
      
      this.units.forEach(({ unit, count }) => {
        const stats = unit.getEffectiveStats(terrain);
        
        // For ranged units attacking, only consider attack stat
        if (unit.isRanged && isAttacker) {
          totalPower += stats.attack * count;
        } else {
          // For non-ranged units or defending units, consider both stats
          if (isAttacker) {
            totalPower += stats.attack * count;
          } else {
            totalPower += stats.defense * count;
          }
        }
      });
      
      // Apply overstacking penalty if applicable
      if (this.isOverstacked()) {
        totalPower *= 0.7; // 30% reduction
      }
      
      return totalPower;
    }
    
    // Check if the stack is overloaded
    isOverstacked() {
      const groundUnits = this.units.filter(item => 
        ['infantry', 'armored', 'support'].includes(item.unit.type)
      ).reduce((total, item) => total + item.count, 0);
      
      const airNavalUnits = this.units.filter(item => 
        ['fighter', 'heavy', 'naval', 'submarine', 'helicopter', 'air'].includes(item.unit.type)
      ).reduce((total, item) => total + item.count, 0);
      
      return (groundUnits > 10) || (airNavalUnits > 5);
    }
  }
  
  // Example Usage
  const composition = new Composition("Eastern"); // Choose doctrine
  composition.addUnit(units[0], 10); // Add 10 Motorized Infantry
  composition.addUnit(units[1], 5);  // Add 5 Tanks
  
  console.log("Total Stats in Forest:", composition.calculateTotalStats("forest"));

  let selectedDoctrine = 'western'; // Default doctrine

  function updateDoctrine() {
      selectedDoctrine = document.getElementById('doctrine').value;
      updateTabs();
  }
  
  function showUnitTab(tabId) {
      const allTabs = document.querySelectorAll('.unit-tab');
      allTabs.forEach(tab => {
          tab.style.display = 'none'; // Hide all tabs
      });
  
      // Construct the ID based on doctrine and tabId
      const activeTabId = `${tabId}-${selectedDoctrine}`;
      const activeTab = document.getElementById(activeTabId);
  
      if (activeTab) {
          activeTab.style.display = 'flex'; // Show the matching tab
      }
  }
  
  function updateTabs() {
      const allTabs = document.querySelectorAll('.unit-tab');
      allTabs.forEach(tab => {
          tab.style.display = 'none'; // Hide all tabs
      });
  }
  
  // Unit data structure organized by doctrine
  const unitData = {
      western: {
          infantry: {
              infantry: { id: "w_infantry", name: "Infantry", type: "infantry", attack: 3, defense: 6, hp: 10, speed: 3, range: 1 },
              motorized: { id: "w_motorized", name: "Motorized Infantry", type: "infantry", attack: 4, defense: 5, hp: 10, speed: 6, range: 1 },
              marines: { id: "w_marines", name: "Marines", type: "infantry", attack: 5, defense: 4, hp: 10, speed: 3, range: 1 },
              specialforces: { id: "w_specialforces", name: "Special Forces", type: "infantry", attack: 7, defense: 3, hp: 10, speed: 4, range: 1 },
              paratroopers: { id: "w_paratroopers", name: "Paratroopers", type: "infantry", attack: 6, defense: 3, hp: 8, speed: 2, range: 1 },
              national_guard: { id: "w_national_guard", name: "National Guard", type: "infantry", attack: 2, defense: 4, hp: 8, speed: 3, range: 1 }
          },
          armored: {
              afv: { id: "w_afv", name: "AFV", type: "armored", attack: 6, defense: 6, hp: 15, speed: 8, range: 1 },
              tank: { id: "w_tank", name: "Tank", type: "armored", attack: 10, defense: 8, hp: 25, speed: 7, range: 1 },
              heavy_tank: { id: "w_heavy_tank", name: "Heavy Tank", type: "armored", attack: 14, defense: 12, hp: 35, speed: 5, range: 1 },
              awacs: { id: "w_awacs", name: "AWACS", type: "armored", attack: 0, defense: 2, hp: 10, speed: 7, range: 5 }
          },
          support: {
              artillery: { id: "w_artillery", name: "Artillery", type: "support", attack: 12, defense: 2, hp: 15, speed: 5, range: 2 },
              sam: { id: "w_sam", name: "SAM Launcher", type: "support", attack: 14, defense: 2, hp: 15, speed: 5, range: 2 },
              mlrs: { id: "w_mlrs", name: "MLRS", type: "support", attack: 15, defense: 2, hp: 15, speed: 6, range: 3 },
              theater_defense: { id: "w_theater_defense", name: "Theater Defense", type: "support", attack: 8, defense: 3, hp: 20, speed: 0, range: 1 },
              anti_tank: { id: "w_anti_tank", name: "Anti-Tank", type: "support", attack: 15, defense: 3, hp: 15, speed: 5, range: 2 },
              mobile_artillery: { id: "w_mobile_artillery", name: "Mobile Artillery", type: "support", attack: 13, defense: 3, hp: 15, speed: 7, range: 2 }
          },
          helicopters: {
              attack_helicopter: { id: "w_attack_helicopter", name: "Attack Helicopter", type: "air", attack: 14, defense: 4, hp: 15, speed: 40, range: 2 },
              asw_helicopter: { id: "w_asw_helicopter", name: "ASW Helicopter", type: "air", attack: 14, defense: 4, hp: 15, speed: 40, range: 2 }
          },
          fighters: {
              air_superiority: { id: "w_air_superiority", name: "Air Superiority Fighter", type: "air", attack: 18, defense: 14, hp: 20, speed: 85, range: 3 },
              strike_fighter: { id: "w_strike_fighter", name: "Strike Fighter", type: "air", attack: 16, defense: 12, hp: 20, speed: 80, range: 3 },
              stealth_fighter: { id: "w_stealth_fighter", name: "Stealth Fighter", type: "air", attack: 20, defense: 16, hp: 20, speed: 85, range: 4 }
          },
          heavies: {
              strategic_bomber: { id: "w_strategic_bomber", name: "Strategic Bomber", type: "air", attack: 25, defense: 5, hp: 25, speed: 75, range: 5 },
              asw_plane: { id: "w_asw_plane", name: "ASW Plane", type: "air", attack: 16, defense: 8, hp: 20, speed: 70, range: 4 },
              awacs_plane: { id: "w_awacs_plane", name: "AWACS Plane", type: "air", attack: 0, defense: 8, hp: 20, speed: 70, range: 6 }
          },
          naval: {
              patrol_boat: { id: "w_patrol_boat", name: "Patrol Boat", type: "naval", attack: 6, defense: 4, hp: 15, speed: 30, range: 1 },
              corvette: { id: "w_corvette", name: "Corvette", type: "naval", attack: 8, defense: 8, hp: 25, speed: 30, range: 2 },
              frigate: { id: "w_frigate", name: "Frigate", type: "naval", attack: 12, defense: 10, hp: 35, speed: 25, range: 2 },
              destroyer: { id: "w_destroyer", name: "Destroyer", type: "naval", attack: 15, defense: 12, hp: 45, speed: 25, range: 3 },
              cruiser: { id: "w_cruiser", name: "Cruiser", type: "naval", attack: 18, defense: 15, hp: 55, speed: 25, range: 3 },
              battleship: { id: "w_battleship", name: "Battleship", type: "naval", attack: 25, defense: 20, hp: 75, speed: 20, range: 4 },
              carrier: { id: "w_carrier", name: "Aircraft Carrier", type: "naval", attack: 5, defense: 15, hp: 80, speed: 20, range: 5 }
          },
          submarine: {
              attack_submarine: { id: "w_attack_submarine", name: "Attack Submarine", type: "submarine", attack: 18, defense: 12, hp: 35, speed: 15, range: 2 },
              ballistic_submarine: { id: "w_ballistic_submarine", name: "Ballistic Missile Submarine", type: "submarine", attack: 30, defense: 8, hp: 40, speed: 15, range: 5 }
          }
      },
      eastern: {
          infantry: {
              infantry: { id: "e_infantry", name: "Infantry", type: "infantry", attack: 4, defense: 5, hp: 10, speed: 3, range: 1 },
              motorized: { id: "e_motorized", name: "Motorized Infantry", type: "infantry", attack: 5, defense: 4, hp: 10, speed: 6, range: 1 },
              marines: { id: "e_marines", name: "Naval Infantry", type: "infantry", attack: 6, defense: 3, hp: 10, speed: 3, range: 1 },
              specialforces: { id: "e_specialforces", name: "Spetsnaz", type: "infantry", attack: 8, defense: 2, hp: 10, speed: 4, range: 1 },
              paratroopers: { id: "e_paratroopers", name: "Airborne Troops", type: "infantry", attack: 7, defense: 2, hp: 8, speed: 2, range: 1 },
              militia: { id: "e_militia", name: "Militia", type: "infantry", attack: 3, defense: 3, hp: 8, speed: 3, range: 1 }
          },
          armored: {
              afv: { id: "e_afv", name: "AFV", type: "armored", attack: 7, defense: 5, hp: 15, speed: 8, range: 1 },
              tank: { id: "e_tank", name: "Tank", type: "armored", attack: 11, defense: 7, hp: 25, speed: 7, range: 1 },
              heavy_tank: { id: "e_heavy_tank", name: "Heavy Tank", type: "armored", attack: 15, defense: 11, hp: 35, speed: 5, range: 1 },
              recon: { id: "e_recon", name: "Reconnaissance", type: "armored", attack: 2, defense: 3, hp: 10, speed: 10, range: 3 }
          },
          support: {
              artillery: { id: "e_artillery", name: "Artillery", type: "support", attack: 13, defense: 1, hp: 15, speed: 5, range: 2 },
              sam: { id: "e_sam", name: "SAM Launcher", type: "support", attack: 15, defense: 1, hp: 15, speed: 5, range: 2 },
              mlrs: { id: "e_mlrs", name: "MLRS", type: "support", attack: 16, defense: 1, hp: 15, speed: 6, range: 3 },
              theater_defense: { id: "e_theater_defense", name: "Theater Defense", type: "support", attack: 9, defense: 2, hp: 20, speed: 0, range: 1 },
              anti_tank: { id: "e_anti_tank", name: "Anti-Tank", type: "support", attack: 16, defense: 2, hp: 15, speed: 5, range: 2 },
              mobile_artillery: { id: "e_mobile_artillery", name: "Mobile Artillery", type: "support", attack: 14, defense: 2, hp: 15, speed: 7, range: 2 }
          },
          helicopters: {
              attack_helicopter: { id: "e_attack_helicopter", name: "Attack Helicopter", type: "air", attack: 15, defense: 3, hp: 15, speed: 40, range: 2 },
              transport_helicopter: { id: "e_transport_helicopter", name: "Transport Helicopter", type: "air", attack: 2, defense: 5, hp: 15, speed: 40, range: 1 }
          },
          fighters: {
              air_superiority: { id: "e_air_superiority", name: "Air Superiority Fighter", type: "air", attack: 19, defense: 13, hp: 20, speed: 85, range: 3 },
              strike_fighter: { id: "e_strike_fighter", name: "Strike Fighter", type: "air", attack: 17, defense: 11, hp: 20, speed: 80, range: 3 },
              interceptor: { id: "e_interceptor", name: "Interceptor", type: "air", attack: 18, defense: 14, hp: 18, speed: 90, range: 2 },
              stealth_fighter: { id: "e_stealth_fighter", name: "Stealth Fighter", type: "air", attack: 21, defense: 15, hp: 20, speed: 85, range: 4 }
          },
          heavies: {
              strategic_bomber: { id: "e_strategic_bomber", name: "Strategic Bomber", type: "air", attack: 26, defense: 4, hp: 25, speed: 75, range: 5 },
              maritime_patrol: { id: "e_maritime_patrol", name: "Maritime Patrol Aircraft", type: "air", attack: 15, defense: 9, hp: 20, speed: 70, range: 4 },
              electronic_warfare: { id: "e_electronic_warfare", name: "Electronic Warfare Aircraft", type: "air", attack: 2, defense: 10, hp: 20, speed: 70, range: 5 }
          },
          naval: {
              patrol_boat: { id: "e_patrol_boat", name: "Patrol Boat", type: "naval", attack: 7, defense: 3, hp: 15, speed: 30, range: 1 },
              corvette: { id: "e_corvette", name: "Corvette", type: "naval", attack: 9, defense: 7, hp: 25, speed: 30, range: 2 },
              frigate: { id: "e_frigate", name: "Frigate", type: "naval", attack: 13, defense: 9, hp: 35, speed: 25, range: 2 },
              destroyer: { id: "e_destroyer", name: "Destroyer", type: "naval", attack: 16, defense: 11, hp: 45, speed: 25, range: 3 },
              cruiser: { id: "e_cruiser", name: "Cruiser", type: "naval", attack: 19, defense: 14, hp: 55, speed: 25, range: 3 },
              battleship: { id: "e_battleship", name: "Battleship", type: "naval", attack: 26, defense: 19, hp: 75, speed: 20, range: 4 },
              carrier: { id: "e_carrier", name: "Aircraft Carrier", type: "naval", attack: 5, defense: 16, hp: 80, speed: 20, range: 5 }
          },
          submarine: {
              attack_submarine: { id: "e_attack_submarine", name: "Attack Submarine", type: "submarine", attack: 19, defense: 11, hp: 35, speed: 15, range: 2 },
              ballistic_submarine: { id: "e_ballistic_submarine", name: "Ballistic Missile Submarine", type: "submarine", attack: 31, defense: 7, hp: 40, speed: 15, range: 5 }
          }
      },
      european: {
          infantry: {
              infantry: { id: "eu_infantry", name: "Infantry", type: "infantry", attack: 3, defense: 7, hp: 10, speed: 3, range: 1 },
              motorized: { id: "eu_motorized", name: "Motorized Infantry", type: "infantry", attack: 4, defense: 6, hp: 10, speed: 6, range: 1 },
              marines: { id: "eu_marines", name: "Marines", type: "infantry", attack: 5, defense: 5, hp: 10, speed: 3, range: 1 },
              specialforces: { id: "eu_specialforces", name: "Special Forces", type: "infantry", attack: 7, defense: 4, hp: 10, speed: 4, range: 1 },
              paratroopers: { id: "eu_paratroopers", name: "Paratroopers", type: "infantry", attack: 6, defense: 4, hp: 8, speed: 2, range: 1 },
              peacekeepers: { id: "eu_peacekeepers", name: "Peacekeepers", type: "infantry", attack: 2, defense: 8, hp: 12, speed: 4, range: 1 }
          },
          armored: {
              afv: { id: "eu_afv", name: "AFV", type: "armored", attack: 6, defense: 7, hp: 15, speed: 8, range: 1 },
              tank: { id: "eu_tank", name: "Tank", type: "armored", attack: 10, defense: 9, hp: 25, speed: 7, range: 1 },
              heavy_tank: { id: "eu_heavy_tank", name: "Heavy Tank", type: "armored", attack: 14, defense: 13, hp: 35, speed: 5, range: 1 },
              mobile_radar: { id: "eu_mobile_radar", name: "Mobile Radar", type: "armored", attack: 0, defense: 4, hp: 10, speed: 7, range: 4 }
          },
          support: {
              artillery: { id: "eu_artillery", name: "Artillery", type: "support", attack: 12, defense: 3, hp: 15, speed: 5, range: 2 },
              sam: { id: "eu_sam", name: "SAM Launcher", type: "support", attack: 14, defense: 3, hp: 15, speed: 5, range: 2 },
              mlrs: { id: "eu_mlrs", name: "MLRS", type: "support", attack: 15, defense: 3, hp: 15, speed: 6, range: 3 },
              theater_defense: { id: "eu_theater_defense", name: "Theater Defense", type: "support", attack: 8, defense: 4, hp: 20, speed: 0, range: 1 },
              anti_tank: { id: "eu_anti_tank", name: "Anti-Tank", type: "support", attack: 15, defense: 4, hp: 15, speed: 5, range: 2 },
              mobile_artillery: { id: "eu_mobile_artillery", name: "Mobile Artillery", type: "support", attack: 13, defense: 4, hp: 15, speed: 7, range: 2 }
          },
          helicopters: {
              attack_helicopter: { id: "eu_attack_helicopter", name: "Attack Helicopter", type: "air", attack: 14, defense: 5, hp: 15, speed: 40, range: 2 },
              multi_role_helicopter: { id: "eu_multi_role_helicopter", name: "Multi-Role Helicopter", type: "air", attack: 10, defense: 7, hp: 15, speed: 40, range: 2 }
          },
          fighters: {
              air_superiority: { id: "eu_air_superiority", name: "Air Superiority Fighter", type: "air", attack: 18, defense: 15, hp: 20, speed: 85, range: 3 },
              strike_fighter: { id: "eu_strike_fighter", name: "Strike Fighter", type: "air", attack: 16, defense: 13, hp: 20, speed: 80, range: 3 },
              multi_role: { id: "eu_multi_role", name: "Multi-Role Fighter", type: "air", attack: 17, defense: 14, hp: 20, speed: 85, range: 3 },
              stealth_fighter: { id: "eu_stealth_fighter", name: "Stealth Fighter", type: "air", attack: 20, defense: 17, hp: 20, speed: 85, range: 4 }
          },
          heavies: {
              strategic_bomber: { id: "eu_strategic_bomber", name: "Strategic Bomber", type: "air", attack: 25, defense: 6, hp: 25, speed: 75, range: 5 },
              transport: { id: "eu_transport", name: "Transport Aircraft", type: "air", attack: 0, defense: 10, hp: 25, speed: 65, range: 6 },
              tanker: { id: "eu_tanker", name: "Air Refueling Tanker", type: "air", attack: 0, defense: 8, hp: 20, speed: 65, range: 7 }
          },
          naval: {
              patrol_boat: { id: "eu_patrol_boat", name: "Patrol Boat", type: "naval", attack: 6, defense: 5, hp: 15, speed: 30, range: 1 },
              corvette: { id: "eu_corvette", name: "Corvette", type: "naval", attack: 8, defense: 9, hp: 25, speed: 30, range: 2 },
              frigate: { id: "eu_frigate", name: "Frigate", type: "naval", attack: 12, defense: 11, hp: 35, speed: 25, range: 2 },
              destroyer: { id: "eu_destroyer", name: "Destroyer", type: "naval", attack: 15, defense: 13, hp: 45, speed: 25, range: 3 },
              cruiser: { id: "eu_cruiser", name: "Cruiser", type: "naval", attack: 18, defense: 16, hp: 55, speed: 25, range: 3 },
              battleship: { id: "eu_battleship", name: "Battleship", type: "naval", attack: 25, defense: 21, hp: 75, speed: 20, range: 4 },
              carrier: { id: "eu_carrier", name: "Aircraft Carrier", type: "naval", attack: 5, defense: 16, hp: 80, speed: 20, range: 5 }
          },
          submarine: {
              attack_submarine: { id: "eu_attack_submarine", name: "Attack Submarine", type: "submarine", attack: 18, defense: 13, hp: 35, speed: 15, range: 2 },
              ballistic_submarine: { id: "eu_ballistic_submarine", name: "Ballistic Missile Submarine", type: "submarine", attack: 30, defense: 9, hp: 40, speed: 15, range: 5 }
          }
      }
  };
  
  // Terrain modifiers
  const terrainModifiers = {
      plains: { attackMod: 1.0, defenseMod: 1.0 },
      forest: { attackMod: 0.8, defenseMod: 1.3 },
      mountains: { attackMod: 0.7, defenseMod: 1.8 },
      urban: { attackMod: 0.75, defenseMod: 1.5 },
      desert: { attackMod: 1.1, defenseMod: 0.9 },
      jungle: { attackMod: 0.6, defenseMod: 1.6 },
      water: { attackMod: 1.0, defenseMod: 1.0 }
  };
  
  // Global variables to track unit stacks
  const attackerStack = [];
  const defenderStack = [];

  // Eastern Infantry Units Database - extracted from JSON files
  const easternInfantryUnits = {
    // Motorized Infantry
    "motorizedInfantry": {
      "basic": {
        name: "Basic Infantry (Motorized Infantry)",
        attack: { soft: 3, hard: 2, building: 0.1, population: 2 },
        defense: { soft: 3.8, hard: 2.5, air: 0.3, helicopter: 0.6 },
        hp: 15,
        speed: 1,
        terrainModifiers: {
          attack: { mountains: -0.25, jungle: -0.25, tundra: -0.25 },
          defense: { forest: 0.25, urban: 0.25, suburban: 0.25, tundra: -0.25 }
        }
      },
      "advanced": {
        name: "Advanced Infantry (Motorized Infantry)",
        attack: { soft: 4.5, hard: 3.5, building: 0.15, population: 2 },
        defense: { soft: 5.6, hard: 4.1, air: 0.9, helicopter: 1.2 },
        hp: 18,
        speed: 1.25,
        terrainModifiers: {
          attack: { mountains: -0.25, jungle: -0.25, tundra: -0.25 },
          defense: { forest: 0.25, urban: 0.25, suburban: 0.25, tundra: -0.25 }
        }
      },
      "modern": {
        name: "Modern Infantry (Motorized Infantry)",
        attack: { soft: 6, hard: 4.5, building: 0.2, population: 2 },
        defense: { soft: 7.5, hard: 5.6, air: 1.6, helicopter: 1.9 },
        hp: 22,
        speed: 1.5,
        terrainModifiers: {
          attack: { mountains: -0.25, jungle: -0.25, tundra: -0.25 },
          defense: { forest: 0.25, urban: 0.25, suburban: 0.25, tundra: -0.25 }
        }
      }
    },
    
    // Mechanized Infantry
    "mechanizedInfantry": {
      "basic": {
        name: "Basic Mechanized Infantry",
        attack: { soft: 5, hard: 5.5, building: 0.2, population: 2 },
        defense: { soft: 4.5, hard: 5.8, air: 0.7, helicopter: 1.1 },
        hp: 25,
        speed: 0.8,
        terrainModifiers: {
          attack: { mountains: -0.5, jungle: -0.4, tundra: -0.25 },
          defense: { forest: 0.1, urban: 0.2, suburban: 0.2, tundra: -0.25 }
        }
      },
      "advanced": {
        name: "Advanced Mechanized Infantry",
        attack: { soft: 6.5, hard: 7.2, building: 0.3, population: 2 },
        defense: { soft: 6.2, hard: 7.5, air: 1.3, helicopter: 1.8 },
        hp: 30,
        speed: 1,
        terrainModifiers: {
          attack: { mountains: -0.5, jungle: -0.4, tundra: -0.25 },
          defense: { forest: 0.1, urban: 0.2, suburban: 0.2, tundra: -0.25 }
        }
      },
      "modern": {
        name: "Modern Mechanized Infantry",
        attack: { soft: 8, hard: 9, building: 0.4, population: 2 },
        defense: { soft: 8, hard: 9.5, air: 2, helicopter: 2.5 },
        hp: 35,
        speed: 1.2,
        terrainModifiers: {
          attack: { mountains: -0.5, jungle: -0.4, tundra: -0.25 },
          defense: { forest: 0.1, urban: 0.2, suburban: 0.2, tundra: -0.25 }
        }
      }
    },
    
    // Naval Infantry (Marines)
    "marineInfantry": {
      "basic": {
        name: "Basic Marines (Naval Infantry)",
        attack: { soft: 4.5, hard: 3.5, building: 0.2, population: 2 },
        defense: { soft: 5, hard: 3, air: 0.5, helicopter: 0.8 },
        hp: 18,
        speed: 0.8,
        terrainModifiers: {
          attack: { mountains: -0.25, jungle: -0.15, tundra: -0.25 },
          defense: { forest: 0.2, urban: 0.2, suburban: 0.2, tundra: -0.25, water: 0.1 }
        }
      },
      "advanced": {
        name: "Advanced Marines (Naval Infantry)",
        attack: { soft: 6, hard: 5, building: 0.3, population: 2 },
        defense: { soft: 6.5, hard: 4.5, air: 1, helicopter: 1.5 },
        hp: 22,
        speed: 1,
        terrainModifiers: {
          attack: { mountains: -0.25, jungle: -0.15, tundra: -0.25 },
          defense: { forest: 0.2, urban: 0.2, suburban: 0.2, tundra: -0.25, water: 0.15 }
        }
      },
      "modern": {
        name: "Modern Marines (Naval Infantry)",
        attack: { soft: 7.5, hard: 6.5, building: 0.4, population: 2 },
        defense: { soft: 8, hard: 6, air: 1.5, helicopter: 2.2 },
        hp: 26,
        speed: 1.2,
        terrainModifiers: {
          attack: { mountains: -0.25, jungle: -0.15, tundra: -0.25 },
          defense: { forest: 0.2, urban: 0.2, suburban: 0.2, tundra: -0.25, water: 0.2 }
        }
      }
    },
    
    // Airborne Infantry
    "airborneInfantry": {
      "basic": {
        name: "Basic Airborne (Airmobile Infantry)",
        attack: { soft: 5, hard: 3, building: 0.15, population: 2 },
        defense: { soft: 4, hard: 2.5, air: 0.4, helicopter: 0.7 },
        hp: 15,
        speed: 1.2,
        terrainModifiers: {
          attack: { mountains: 0, jungle: -0.2, tundra: -0.2 },
          defense: { forest: 0.2, urban: 0.15, suburban: 0.15, tundra: -0.2 }
        }
      },
      "advanced": {
        name: "Advanced Airborne (Airmobile Infantry)",
        attack: { soft: 6.5, hard: 4.5, building: 0.25, population: 2 },
        defense: { soft: 5.5, hard: 3.8, air: 0.8, helicopter: 1.3 },
        hp: 18,
        speed: 1.5,
        terrainModifiers: {
          attack: { mountains: 0, jungle: -0.2, tundra: -0.2 },
          defense: { forest: 0.2, urban: 0.15, suburban: 0.15, tundra: -0.2 }
        }
      },
      "modern": {
        name: "Modern Airborne (Airmobile Infantry)",
        attack: { soft: 8, hard: 6, building: 0.35, population: 2 },
        defense: { soft: 7, hard: 5, air: 1.2, helicopter: 1.9 },
        hp: 21,
        speed: 1.8,
        terrainModifiers: {
          attack: { mountains: 0, jungle: -0.2, tundra: -0.2 },
          defense: { forest: 0.2, urban: 0.15, suburban: 0.15, tundra: -0.2 }
        }
      }
    },
    
    // Special Forces
    "specialForces": {
      "basic": {
        name: "Basic Spetsnaz (Special Forces)",
        attack: { soft: 8, hard: 6, building: 0.5, population: 2 },
        defense: { soft: 6, hard: 4, air: 0.5, helicopter: 1 },
        hp: 12,
        speed: 1.5,
        terrainModifiers: {
          attack: { mountains: 0.1, jungle: 0, tundra: 0 },
          defense: { forest: 0.3, urban: 0.3, suburban: 0.25, tundra: 0 }
        }
      },
      "advanced": {
        name: "Advanced Spetsnaz (Special Forces)",
        attack: { soft: 10, hard: 8, building: 0.7, population: 2 },
        defense: { soft: 8, hard: 6, air: 1, helicopter: 1.5 },
        hp: 15,
        speed: 1.8,
        terrainModifiers: {
          attack: { mountains: 0.15, jungle: 0.05, tundra: 0.05 },
          defense: { forest: 0.35, urban: 0.35, suburban: 0.3, tundra: 0.05 }
        }
      },
      "modern": {
        name: "Modern Spetsnaz (Special Forces)",
        attack: { soft: 12, hard: 10, building: 0.9, population: 2 },
        defense: { soft: 10, hard: 8, air: 1.5, helicopter: 2 },
        hp: 18,
        speed: 2,
        terrainModifiers: {
          attack: { mountains: 0.2, jungle: 0.1, tundra: 0.1 },
          defense: { forest: 0.4, urban: 0.4, suburban: 0.35, tundra: 0.1 }
        }
      }
    },
    
    // National Guard
    "nationalGuard": {
      "basic": {
        name: "Basic National Guard",
        attack: { soft: 2, hard: 1.5, building: 0.1, population: 2 },
        defense: { soft: 4, hard: 2, air: 0.3, helicopter: 0.5 },
        hp: 16,
        speed: 0.8,
        terrainModifiers: {
          attack: { mountains: -0.3, jungle: -0.3, tundra: -0.3 },
          defense: { forest: 0.3, urban: 0.35, suburban: 0.35, tundra: -0.2 }
        }
      },
      "advanced": {
        name: "Advanced National Guard",
        attack: { soft: 3, hard: 2.5, building: 0.15, population: 2 },
        defense: { soft: 5.5, hard: 3, air: 0.6, helicopter: 0.9 },
        hp: 19,
        speed: 1,
        terrainModifiers: {
          attack: { mountains: -0.3, jungle: -0.3, tundra: -0.3 },
          defense: { forest: 0.3, urban: 0.35, suburban: 0.35, tundra: -0.2 }
        }
      },
      "modern": {
        name: "Modern National Guard",
        attack: { soft: 4, hard: 3.5, building: 0.2, population: 2 },
        defense: { soft: 7, hard: 4, air: 0.9, helicopter: 1.3 },
        hp: 22,
        speed: 1.2,
        terrainModifiers: {
          attack: { mountains: -0.3, jungle: -0.3, tundra: -0.3 },
          defense: { forest: 0.3, urban: 0.35, suburban: 0.35, tundra: -0.2 }
        }
      }
    }
  };

  // Function to get Eastern infantry unit by type, level and tier
  function getEasternInfantryUnit(unitType, level) {
    // Determine the tier based on unit type and level
    // Each unit type has a different number of levels:
    // motorizedInfantry: 7 levels (1-3: basic, 4-5: advanced, 6-7: modern)
    // mechanizedInfantry: 6 levels (1-2: basic, 3-5: advanced, 6: modern)
    // marineInfantry: 6 levels (1-3: basic, 4-5: advanced, 6: modern)
    // airborneInfantry: 7 levels (1-3: basic, 4-6: advanced, 7: modern)
    // specialForces: 5 levels (1-2: basic, 3-4: advanced, 5: modern)
    // nationalGuard: 7 levels (1-3: basic, 4-5: advanced, 6-7: modern)
    
    let tier = "basic"; // Default
    
    switch(unitType) {
      case "motorizedInfantry":
        if (level <= 3) tier = "basic";
        else if (level <= 5) tier = "advanced";
        else tier = "modern";
        break;
      
      case "mechanizedInfantry":
        if (level <= 2) tier = "basic";
        else if (level <= 5) tier = "advanced";
        else tier = "modern";
        break;
      
      case "marineInfantry":
        if (level <= 3) tier = "basic";
        else if (level <= 5) tier = "advanced";
        else tier = "modern";
        break;
      
      case "airborneInfantry":
        if (level <= 3) tier = "basic";
        else if (level <= 6) tier = "advanced";
        else tier = "modern";
        break;
      
      case "specialForces":
        if (level <= 2) tier = "basic";
        else if (level <= 4) tier = "advanced";
        else tier = "modern";
        break;
      
      case "nationalGuard":
        if (level <= 3) tier = "basic";
        else if (level <= 5) tier = "advanced";
        else tier = "modern";
        break;
        
      default:
        // Default logic (fall back to level-based tiers if unit type not recognized)
        if (level <= 2) tier = "basic";
        else if (level <= 5) tier = "advanced";
        else tier = "modern";
    }
    
    // Return the unit data if found
    if (easternInfantryUnits[unitType] && easternInfantryUnits[unitType][tier]) {
      return easternInfantryUnits[unitType][tier];
    }
    
    // Default fallback
    return null;
  }

  // Update the createUnitFromSelection function to use Eastern infantry unit stats
  function createUnitFromSelection(side) {
    const doctrineId = document.getElementById(`${side}Doctrine`).value;
    const unitTypeId = document.getElementById(`${side}UnitType`).value;
    const unitId = document.getElementById(`${side}Unit`).value;
    const levelId = parseInt(document.getElementById(`${side}Level`).value);
    
    // Base unit stats
    let unitStats = {
      attack: 5,
      defense: 5,
      hp: 20,
      speed: 1,
      range: 0
    };
    
    // For Eastern doctrine infantry units, use our extracted data
    if (doctrineId === "eastern" && unitTypeId === "infantry") {
      // Map the unit IDs to our data structure
      const unitTypeMap = {
        "motorized": "motorizedInfantry",
        "mechanized": "mechanizedInfantry",
        "marines": "marineInfantry",
        "airborne": "airborneInfantry",
        "spetsnaz": "specialForces",
        "national_guard": "nationalGuard"
      };
      
      const mappedUnitType = unitTypeMap[unitId];
      if (mappedUnitType) {
        const unitData = getEasternInfantryUnit(mappedUnitType, levelId);
        if (unitData) {
          // Set up basic stats (for soft targets as default)
          unitStats.attack = unitData.attack.soft;
          unitStats.defense = unitData.defense.soft;
          unitStats.hp = unitData.hp;
          unitStats.speed = unitData.speed;
        }
      }
    }
    
    // Create the unit with our base stats
    const unit = new Unit(
      unitId,
      document.getElementById(`${side}Unit`).options[document.getElementById(`${side}Unit`).selectedIndex].text,
      unitTypeId,
      unitStats.attack,
      unitStats.defense,
      unitStats.hp,
      unitStats.speed,
      unitStats.range
    );
    
    // Set doctrine and level
    unit.setDoctrine(doctrineId);
    unit.upgrade(levelId);
    
    return unit;
  }

  // Helper function to populate unit type options based on selected doctrine
  function populateUnitTypes(doctrineSelectId, unitTypeSelectId) {
      const doctrineSelect = document.getElementById(doctrineSelectId);
      const unitTypeSelect = document.getElementById(unitTypeSelectId);
      const doctrine = doctrineSelect.value;

      // Clear existing options
      unitTypeSelect.innerHTML = '<option value="">Select Unit Type</option>';

      // Add unit type options
      Object.keys(unitData[doctrine]).forEach(unitType => {
          const option = document.createElement('option');
          option.value = unitType;
          option.textContent = unitType.charAt(0).toUpperCase() + unitType.slice(1);
          unitTypeSelect.appendChild(option);
      });
  }

  // Helper function to populate unit options based on selected doctrine and unit type
  function populateUnits(doctrineSelectId, unitTypeSelectId, unitSelectId) {
      const doctrineSelect = document.getElementById(doctrineSelectId);
      const unitTypeSelect = document.getElementById(unitTypeSelectId);
      const unitSelect = document.getElementById(unitSelectId);
      
      const doctrine = doctrineSelect.value;
      const unitType = unitTypeSelect.value;

      // Clear existing options
      unitSelect.innerHTML = '<option value="">Select Unit</option>';

      // Add unit options
      if (doctrine && unitType) {
          unitData[doctrine][unitType].forEach(unit => {
              const option = document.createElement('option');
              option.value = unit.id;
              option.textContent = unit.name;
              unitSelect.appendChild(option);
          });
      }
  }

  // Function to update unit stats display
  function updateUnitStats(doctrineSelectId, unitTypeSelectId, unitSelectId, unitStatsId) {
      const doctrineSelect = document.getElementById(doctrineSelectId);
      const unitTypeSelect = document.getElementById(unitTypeSelectId);
      const unitSelect = document.getElementById(unitSelectId);
      const unitStats = document.getElementById(unitStatsId);
      
      if (!doctrineSelect || !unitTypeSelect || !unitSelect || !unitStats) {
          console.error("Missing DOM elements in updateUnitStats");
          return;
      }
      
      const doctrine = doctrineSelect.value;
      const unitType = unitTypeSelect.value;
      const unitKey = unitSelect.value;

      // Clear existing stats
      unitStats.innerHTML = '';

      // Display unit stats
      if (doctrine && unitType && unitKey && 
          unitData[doctrine] && 
          unitData[doctrine][unitType] && 
          unitData[doctrine][unitType][unitKey]) {
          
          const unit = unitData[doctrine][unitType][unitKey];
          
          // Create stats rows for each attribute
          const attributes = [
              { label: 'Type', value: unitType.charAt(0).toUpperCase() + unitType.slice(1) },
              { label: 'Attack', value: unit.attack },
              { label: 'Defense', value: unit.defense },
              { label: 'HP', value: unit.hp },
              { label: 'Speed', value: unit.speed + ' km/h' },
              { label: 'Range', value: unit.range + ' tiles' }
          ];

          // Add special attack values if they exist
          if (unit.air_attack) attributes.push({ label: 'Air Attack', value: unit.air_attack });
          if (unit.armor_attack) attributes.push({ label: 'Armor Attack', value: unit.armor_attack });
          if (unit.naval_attack) attributes.push({ label: 'Naval Attack', value: unit.naval_attack });

          // Create HTML for each stat row
          attributes.forEach(attr => {
              const statRow = document.createElement('div');
              statRow.className = 'stat-row';
              
              const statLabel = document.createElement('span');
              statLabel.className = 'stat-label';
              statLabel.textContent = attr.label + ':';
              
              const statValue = document.createElement('span');
              statValue.className = 'stat-value';
              statValue.textContent = attr.value;
              
              statRow.appendChild(statLabel);
              statRow.appendChild(statValue);
              unitStats.appendChild(statRow);
          });
      }
  }

  // Function to calculate unit power based on quantity and stats
  function calculateUnitPower(doctrineId, unitTypeId, unitId, quantityId, isAttacker) {
      const doctrineSelect = document.getElementById(doctrineId);
      const unitTypeSelect = document.getElementById(unitTypeId);
      const unitSelect = document.getElementById(unitId);
      const quantityInput = document.getElementById(quantityId);
      
      if (!doctrineSelect || !unitTypeSelect || !unitSelect || !quantityInput) {
          console.error("Missing DOM elements in calculateUnitPower");
          return 0;
      }
      
      const doctrine = doctrineSelect.value;
      const unitType = unitTypeSelect.value;
      const selectedUnitId = unitSelect.value;
      const quantity = parseInt(quantityInput.value) || 0;
      
      let power = 0;
      
      if (doctrine && unitType && selectedUnitId && quantity > 0) {
          if (unitData[doctrine] && unitData[doctrine][unitType]) {
              const unit = unitData[doctrine][unitType][selectedUnitId];
              if (unit) {
                  // Use attack value for attacker, defense for defender
                  const statValue = isAttacker ? unit.attack : unit.defense;
                  power = statValue * quantity;
              }
          }
      }
      
      return power;
  }
  
  // Function to calculate total power with modifiers
  function calculateTotalPower(basePower, terrain, isAttacker) {
      const terrainMod = isAttacker ? terrainModifiers[terrain].attackMod : terrainModifiers[terrain].defenseMod;
      return basePower * terrainMod;
  }

  // Function to update unit options based on doctrine
  function updateUnitOptions(side) {
      // Get the doctrine value
      const doctrine = document.getElementById(`${side}Doctrine`);
      
      if (!doctrine) {
          console.error(`Missing doctrine element for side: ${side}`);
          return;
      }
      
      // Get the unit type select element
      const unitTypeSelect = document.getElementById(`${side}UnitType`);
      
      if (!unitTypeSelect) {
          console.error(`Missing unitTypeSelect element for side: ${side}`);
          return;
      }
      
      // Clear existing options
      unitTypeSelect.innerHTML = '<option value="">Select Unit Type</option>';
      
      // Add unit type options from the unitData structure
      Object.keys(unitData[doctrine.value]).forEach(unitType => {
          const option = document.createElement('option');
          option.value = unitType;
          // Capitalize the first letter of each unit type
          option.textContent = unitType.charAt(0).toUpperCase() + unitType.slice(1);
          unitTypeSelect.appendChild(option);
      });
      
      // Clear unit selection since unit type has changed
      const unitSelect = document.getElementById(`${side}Unit`);
      if (unitSelect) {
          unitSelect.innerHTML = '<option value="">Select Unit</option>';
      }
      
      // Clear unit stats
      const unitStats = document.getElementById(`${side}UnitStats`);
      if (unitStats) {
          unitStats.innerHTML = '';
      }
  }
  
  // Function to handle unit type selection and update units
  function updateUnits(side) {
      // Get the selected doctrine and unit type
      const doctrine = document.getElementById(`${side}Doctrine`);
      const unitType = document.getElementById(`${side}UnitType`);
      const unitSelect = document.getElementById(`${side}Unit`);
      
      if (!doctrine || !unitType || !unitSelect) {
          console.error(`Missing DOM elements in updateUnits for side: ${side}`);
          return;
      }
      
      const doctrineValue = doctrine.value;
      const unitTypeValue = unitType.value;
      
      // Clear existing options
      unitSelect.innerHTML = '<option value="">Select Unit</option>';
      
      // If a unit type is selected, add the corresponding units
      if (doctrineValue && unitTypeValue && unitData[doctrineValue] && unitData[doctrineValue][unitTypeValue]) {
          // Get the unit object for this doctrine and unit type
          const unitTypeObj = unitData[doctrineValue][unitTypeValue];
          
          // Iterate through each unit and add as an option
          for (const key in unitTypeObj) {
              if (unitTypeObj.hasOwnProperty(key)) {
                  const unit = unitTypeObj[key];
                  const option = document.createElement('option');
                  option.value = key; // Using the key as the value
                  option.textContent = unit.name;
                  unitSelect.appendChild(option);
              }
          }
      }
      
      // Clear unit stats
      const unitStats = document.getElementById(`${side}UnitStats`);
      if (unitStats) {
          unitStats.innerHTML = '';
      }
  }

  // Helper functions to get modifiers based on conditions
  function getTerrainModifier(terrain, attackerType, defenderType) {
      // Default to the standard attack modifier if no specific type modifiers
      return terrainModifiers[terrain].attackMod;
  }

  // Function to calculate battle outcome with stacks
  function calculateBattleOutcome() {
    // Get form values
    const attackerTerrain = document.getElementById('attackerTerrain').value;
    const defenderTerrain = document.getElementById('defenderTerrain').value;
    
    // Create unit compositions
    const attackerComposition = new Composition('attacker');
    const defenderComposition = new Composition('defender');
    
    // Get attacker and defender units and quantities
    const attackerUnit = createUnitFromSelection('attacker');
    const attackerQuantity = parseInt(document.getElementById('attackerQuantity').value) || 1;
    
    const defenderUnit = createUnitFromSelection('defender');
    const defenderQuantity = parseInt(document.getElementById('defenderQuantity').value) || 1;
    
    if (!attackerUnit || !defenderUnit) {
        document.getElementById('battleOutcome').innerHTML = "Please select valid units for both sides.";
        return;
    }
    
    // Add units to compositions
    attackerComposition.addUnit(attackerUnit, attackerQuantity);
    defenderComposition.addUnit(defenderUnit, defenderQuantity);
    
    // Calculate total stats - use appropriate terrain for each side
    const attackerStats = attackerComposition.calculateTotalStats(attackerTerrain);
    const defenderStats = defenderComposition.calculateTotalStats(defenderTerrain);
    
    // Calculate total power
    const attackerPower = attackerComposition.calculateTotalPower(attackerTerrain, true);
    const defenderPower = defenderComposition.calculateTotalPower(defenderTerrain, false);
    
    // Calculate power ratio
    const powerRatio = (attackerPower / defenderPower).toFixed(2);
    
    // Calculate strength advantage
    let advantage = "None";
    if (powerRatio > 1.5) {
        advantage = "Strong Attacker Advantage";
    } else if (powerRatio > 1.1) {
        advantage = "Slight Attacker Advantage";
    } else if (powerRatio < 0.67) {
        advantage = "Strong Defender Advantage";
    } else if (powerRatio < 0.9) {
        advantage = "Slight Defender Advantage";
    } else {
        advantage = "Even Match";
    }
    
    // Calculate armor-type matching bonuses
    let attackerTypeBonus = 1.0;
    let defenderTypeBonus = 1.0;
    
    // Use attack type data from JSON if available
    if (attackerUnit.attackValues && defenderUnit.defenseValues) {
        // Calculate type-specific attack power
        // Soft targets (type_0)
        if (defenderUnit.defenseValues.soft && attackerUnit.attackValues.soft) {
            attackerTypeBonus *= 1.25; // 25% bonus against appropriate target
        }
        
        // Hard targets (type_4)
        if (defenderUnit.defenseValues.hard && attackerUnit.attackValues.hard) {
            attackerTypeBonus *= 1.25;
        }
        
        // Fixed wing targets (type_1)
        if (defenderUnit.defenseValues.fixedWing && attackerUnit.attackValues.fixedWing) {
            attackerTypeBonus *= 1.5;
        }
        
        // Rotary wing targets (type_8)
        if (defenderUnit.defenseValues.rotaryWing && attackerUnit.attackValues.rotaryWing) {
            attackerTypeBonus *= 1.5;
        }
        
        // Building targets (type_3)
        if (defenderUnit.defenseValues.building && attackerUnit.attackValues.building) {
            attackerTypeBonus *= 1.3;
        }
    } else {
        // Fallback to simplified logic
        if (attackerUnit.classification === 'hard' && defenderUnit.classification === 'soft') {
            attackerTypeBonus = 1.5; // Hard units good vs soft targets
        } else if (attackerUnit.classification === 'soft' && defenderUnit.classification === 'hard') {
            attackerTypeBonus = 0.7; // Soft units weak vs hard targets
        }
        
        if (defenderUnit.classification === 'hard' && attackerUnit.classification === 'soft') {
            defenderTypeBonus = 1.5;
        } else if (defenderUnit.classification === 'soft' && attackerUnit.classification === 'hard') {
            defenderTypeBonus = 0.7;
        }
    }
    
    // Apply armor-type matching bonuses
    const effectiveAttackerPower = attackerPower * attackerTypeBonus;
    const effectiveDefenderPower = defenderPower * defenderTypeBonus;
    const effectivePowerRatio = (effectiveAttackerPower / effectiveDefenderPower).toFixed(2);
    
    // Calculate RNG factor (+-20%)
    const rngMin = 0.8;
    const rngMax = 1.2;
    const rngFactor = (Math.random() * (rngMax - rngMin) + rngMin).toFixed(2);
    
    // Calculate final battle power
    const finalAttackerPower = (effectiveAttackerPower * rngFactor).toFixed(2);
    
    // Calculate overkill rules (diminishing returns)
    let overkillFactor = 1.0;
    if (effectivePowerRatio > 3.0) {
        overkillFactor = 0.8; // 20% reduction for extreme overkill
    } else if (effectivePowerRatio > 2.0) {
        overkillFactor = 0.9; // 10% reduction for significant overkill
    }
    
    const finalAdjustedAttackerPower = (finalAttackerPower * overkillFactor).toFixed(2);
    
    // Update outcome display
    let outcomeHTML = `
        <h3>Battle Analysis</h3>
        <div class="outcome-section">
            <div class="power-comparison">
                <div class="power-item">
                    <span class="label">Attacker Power:</span>
                    <span class="value">${attackerPower.toFixed(2)}</span>
                </div>
                <div class="power-item">
                    <span class="label">vs</span>
                </div>
                <div class="power-item">
                    <span class="label">Defender Power:</span>
                    <span class="value">${defenderPower.toFixed(2)}</span>
                </div>
                <div class="power-item">
                    <span class="label">Power Ratio:</span>
                    <span class="value">${powerRatio}</span>
                </div>
                <div class="power-item">
                    <span class="label">Advantage:</span>
                    <span class="value">${advantage}</span>
                </div>
            </div>
            
            <div class="modifiers">
                <h4>Modifiers</h4>
                <div class="modifier-item">
                    <span class="label">Attacker Terrain:</span>
                    <span class="value">${attackerTerrain.replace(/_/g, ' ')}</span>
                </div>
                <div class="modifier-item">
                    <span class="label">Defender Terrain:</span>
                    <span class="value">${defenderTerrain.replace(/_/g, ' ')}</span>
                </div>
                <div class="modifier-item">
                    <span class="label">Attacker Type Bonus:</span>
                    <span class="value">x${attackerTypeBonus.toFixed(2)}</span>
                </div>
                <div class="modifier-item">
                    <span class="label">Defender Type Bonus:</span>
                    <span class="value">x${defenderTypeBonus.toFixed(2)}</span>
                </div>
                <div class="modifier-item">
                    <span class="label">Effective Power Ratio:</span>
                    <span class="value">${effectivePowerRatio}</span>
                </div>
                <div class="modifier-item">
                    <span class="label">RNG Factor:</span>
                    <span class="value">x${rngFactor}</span>
                </div>
                <div class="modifier-item">
                    <span class="label">Overkill Factor:</span>
                    <span class="value">x${overkillFactor.toFixed(2)}</span>
                </div>
                <div class="modifier-item">
                    <span class="label">Final Attacker Power:</span>
                    <span class="value">${finalAdjustedAttackerPower}</span>
                </div>
            </div>
        </div>
    `;
    
    // Simulate battle and calculate casualties
    const outcome = {
        attackerCasualties: 0,
        defenderCasualties: 0,
        attackerSurvivors: attackerQuantity,
        defenderSurvivors: defenderQuantity,
        victor: "undecided"
    };
    
    simulateBattle(attackerComposition, defenderComposition, outcome, attackerTerrain, defenderTerrain);
    
    outcomeHTML += `
        <div class="battle-outcome">
            <h4>Battle Outcome</h4>
            <div class="casualties">
                <div class="casualty-item">
                    <span class="label">Attacker Casualties:</span>
                    <span class="value">${outcome.attackerCasualties} of ${attackerQuantity} (${Math.round(outcome.attackerCasualties / attackerQuantity * 100)}%)</span>
                </div>
                <div class="casualty-item">
                    <span class="label">Defender Casualties:</span>
                    <span class="value">${outcome.defenderCasualties} of ${defenderQuantity} (${Math.round(outcome.defenderCasualties / defenderQuantity * 100)}%)</span>
                </div>
                <div class="casualty-item victory">
                    <span class="label">Victor:</span>
                    <span class="value">${outcome.victor}</span>
                </div>
            </div>
        </div>
        
        <div class="unit-stats">
            <h4>Effective Unit Stats</h4>
            <div class="unit-stats-columns">
                <div class="unit-stats-column">
                    <h5>Attacker: ${attackerUnit.name}</h5>
                    <div class="stat-item">
                        <span class="label">Attack:</span>
                        <span class="value">${attackerStats.attack.toFixed(2)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Defense:</span>
                        <span class="value">${attackerStats.defense.toFixed(2)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">HP:</span>
                        <span class="value">${attackerStats.hp.toFixed(2)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Speed:</span>
                        <span class="value">${attackerStats.speed.toFixed(2)}</span>
                    </div>
                </div>
                <div class="unit-stats-column">
                    <h5>Defender: ${defenderUnit.name}</h5>
                    <div class="stat-item">
                        <span class="label">Attack:</span>
                        <span class="value">${defenderStats.attack.toFixed(2)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Defense:</span>
                        <span class="value">${defenderStats.defense.toFixed(2)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">HP:</span>
                        <span class="value">${defenderStats.hp.toFixed(2)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Speed:</span>
                        <span class="value">${defenderStats.speed.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('battleOutcome').innerHTML = outcomeHTML;
    
    // Update terrain modifiers display
    updateTerrainModifiers();
}

  // Function to update stack details in the battle outcome section
  function updateStackDetails(side) {
      const stack = side === 'attacker' ? attackerStack : defenderStack;
      const stackDetailsEl = document.getElementById(`${side}StackDetails`);
      
      stackDetailsEl.innerHTML = '';
      
      stack.forEach((item, index) => {
          const unitEl = document.createElement('div');
          unitEl.className = 'stack-unit';
          
          const terrain = document.querySelector('input[name="terrain"]:checked').value;
          const stats = item.unit.getEffectiveStats(terrain);
          
          unitEl.innerHTML = `
              <div class="stack-unit-header">
                  <span class="stack-unit-name">${item.unit.name}</span>
                  <span class="stack-unit-level">Lvl ${item.unit.level}</span>
                  <span class="stack-unit-qty">x${item.quantity}</span>
              </div>
              <div class="stack-unit-stats">
                  <span class="stack-unit-stat">ATK: ${stats.attack.toFixed(1)}</span>
                  <span class="stack-unit-stat">DEF: ${stats.defense.toFixed(1)}</span>
                  <span class="stack-unit-stat">HP: ${stats.hp.toFixed(0)}</span>
                  <span class="stack-unit-stat">Type: ${item.unit.classification}</span>
              </div>
          `;
          
          stackDetailsEl.appendChild(unitEl);
      });
  }

  // Function to simulate battle and calculate casualties
  function simulateBattle(attackerComp, defenderComp, outcome, attackerTerrain, defenderTerrain) {
    // Calculate total power for both sides
    const attackerPower = attackerComp.calculateTotalPower(attackerTerrain, true);
    const defenderPower = defenderComp.calculateTotalPower(defenderTerrain, false);
    
    // Power ratio determines the outcome
    const powerRatio = attackerPower / defenderPower;
    
    // Calculate casualties based on power ratio
    let attackerLossRate = 0;
    let defenderLossRate = 0;
    
    if (powerRatio > 3.0) {
        // Overwhelming attacker victory
        attackerLossRate = 0.1; // 10% attacker casualties
        defenderLossRate = 0.9; // 90% defender casualties
        outcome.victor = "Decisive Attacker Victory";
    } else if (powerRatio > 1.5) {
        // Clear attacker victory
        attackerLossRate = 0.2; // 20% attacker casualties
        defenderLossRate = 0.7; // 70% defender casualties
        outcome.victor = "Attacker Victory";
    } else if (powerRatio > 1.1) {
        // Marginal attacker victory
        attackerLossRate = 0.35; // 35% attacker casualties
        defenderLossRate = 0.5; // 50% defender casualties
        outcome.victor = "Narrow Attacker Victory";
    } else if (powerRatio > 0.9) {
        // Stalemate
        attackerLossRate = 0.4; // 40% attacker casualties
        defenderLossRate = 0.4; // 40% defender casualties
        outcome.victor = "Stalemate";
    } else if (powerRatio > 0.67) {
        // Marginal defender victory
        attackerLossRate = 0.5; // 50% attacker casualties
        defenderLossRate = 0.35; // 35% defender casualties
        outcome.victor = "Narrow Defender Victory";
    } else if (powerRatio > 0.33) {
        // Clear defender victory
        attackerLossRate = 0.7; // 70% attacker casualties
        defenderLossRate = 0.2; // 20% defender casualties
        outcome.victor = "Defender Victory";
    } else {
        // Overwhelming defender victory
        attackerLossRate = 0.9; // 90% attacker casualties
        defenderLossRate = 0.1; // 10% defender casualties
        outcome.victor = "Decisive Defender Victory";
    }
    
    // Add some randomness to casualties (±10%)
    const randomFactor = (min, max) => Math.random() * (max - min) + min;
    attackerLossRate *= randomFactor(0.9, 1.1);
    defenderLossRate *= randomFactor(0.9, 1.1);
    
    // Calculate casualties for each unit in the attacker stack
    let totalAttackerUnits = 0;
    attackerComp.units.forEach(unitInfo => {
        totalAttackerUnits += unitInfo.count;
    });
    
    // Calculate casualties for each unit in the defender stack
    let totalDefenderUnits = 0;
    defenderComp.units.forEach(unitInfo => {
        totalDefenderUnits += unitInfo.count;
    });
    
    // Calculate total casualties
    outcome.attackerCasualties = Math.round(totalAttackerUnits * attackerLossRate);
    outcome.defenderCasualties = Math.round(totalDefenderUnits * defenderLossRate);
    
    // Ensure casualties don't exceed available units
    outcome.attackerCasualties = Math.min(outcome.attackerCasualties, totalAttackerUnits);
    outcome.defenderCasualties = Math.min(outcome.defenderCasualties, totalDefenderUnits);
    
    // Calculate surviving units
    outcome.attackerSurvivors = totalAttackerUnits - outcome.attackerCasualties;
    outcome.defenderSurvivors = totalDefenderUnits - outcome.defenderCasualties;
}

  // Function to update terrain modifiers display
  function updateTerrainModifiers() {
    // Get the selected terrain values
    const attackerTerrain = document.getElementById('attackerTerrain').value;
    const defenderTerrain = document.getElementById('defenderTerrain').value;
    
    // Get the attacker and defender units
    const attackerUnit = createUnitFromSelection('attacker');
    const defenderUnit = createUnitFromSelection('defender');
    
    if (!attackerUnit || !defenderUnit) {
        return; // No valid units selected
    }
    
    // Get the terrain modifier display elements
    const attackerTerrainModifierElem = document.getElementById('attackerTerrainModifier');
    const defenderTerrainModifierElem = document.getElementById('defenderTerrainModifier');
    
    // Calculate terrain modifiers for attacker and defender
    let attackerTerrainModifier = 1.0;
    let defenderTerrainModifier = 1.0;
    
    // Use getStatModifier method if available
    if (typeof attackerUnit.getStatModifier === 'function') {
        attackerTerrainModifier = attackerUnit.getStatModifier(attackerTerrain, 'attack');
    } else {
        // Fallback to lookup table
        attackerTerrainModifier = getTerrainModifier(attackerUnit.type, attackerTerrain, 'attack');
    }
    
    if (typeof defenderUnit.getStatModifier === 'function') {
        defenderTerrainModifier = defenderUnit.getStatModifier(defenderTerrain, 'defense');
    } else {
        // Fallback to lookup table
        defenderTerrainModifier = getTerrainModifier(defenderUnit.type, defenderTerrain, 'defense');
    }
    
    // Update the display
    if (attackerTerrainModifierElem) {
        attackerTerrainModifierElem.textContent = (attackerTerrainModifier >= 1.0 ? '+' : '') + 
            ((attackerTerrainModifier - 1.0) * 100).toFixed(0) + '%';
            
        // Update color based on modifier value
        if (attackerTerrainModifier > 1.0) {
            attackerTerrainModifierElem.classList.add('positive-modifier');
            attackerTerrainModifierElem.classList.remove('negative-modifier');
        } else if (attackerTerrainModifier < 1.0) {
            attackerTerrainModifierElem.classList.add('negative-modifier');
            attackerTerrainModifierElem.classList.remove('positive-modifier');
        } else {
            attackerTerrainModifierElem.classList.remove('positive-modifier');
            attackerTerrainModifierElem.classList.remove('negative-modifier');
        }
    }
    
    if (defenderTerrainModifierElem) {
        defenderTerrainModifierElem.textContent = (defenderTerrainModifier >= 1.0 ? '+' : '') + 
            ((defenderTerrainModifier - 1.0) * 100).toFixed(0) + '%';
            
        // Update color based on modifier value
        if (defenderTerrainModifier > 1.0) {
            defenderTerrainModifierElem.classList.add('positive-modifier');
            defenderTerrainModifierElem.classList.remove('negative-modifier');
        } else if (defenderTerrainModifier < 1.0) {
            defenderTerrainModifierElem.classList.add('negative-modifier');
            defenderTerrainModifierElem.classList.remove('positive-modifier');
        } else {
            defenderTerrainModifierElem.classList.remove('positive-modifier');
            defenderTerrainModifierElem.classList.remove('negative-modifier');
        }
    }
}

  // Initialize page when DOM is loaded
      // Calculate average modifiers for attacker and defender stacks
      let totalAttackerMod = 0;
      let totalDefenderMod = 0;
      let attackerUnitCount = 0;
      let defenderUnitCount = 0;
      
      // Process attacker stack
      attackerStack.forEach(item => {
          const mod = item.unit.getStatModifier(terrain);
          totalAttackerMod += mod.attack * item.quantity;
          attackerUnitCount += item.quantity;
      });
      
      // Process defender stack
      defenderStack.forEach(item => {
          const mod = item.unit.getStatModifier(terrain);
          totalDefenderMod += mod.defense * item.quantity;
          defenderUnitCount += item.quantity;
      });
      
      // Calculate averages
      const avgAttackerMod = (attackerUnitCount > 0) ? (totalAttackerMod / attackerUnitCount).toFixed(2) : "1.00";
      const avgDefenderMod = (defenderUnitCount > 0) ? (totalDefenderMod / defenderUnitCount).toFixed(2) : "1.00";
      
      // Update the display
      terrainModifierEl.textContent = `A: ${avgAttackerMod} / D: ${avgDefenderMod}`;
  

  // Initialize page when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
      // Set up initial event listeners
      updateDoctrine();
      updateTabs();
      
      // Add event listeners for form changes
      document.getElementById('battleTerrain').addEventListener('change', updateTerrainModifiers);
      
      // Add calculate button event listener
      document.getElementById('calculateButton').addEventListener('click', calculateBattleOutcome);
  });

  /**
   * Gets the terrain modifier for a unit based on unit type and terrain
   * @param {Unit} unit - The unit to get the modifier for
   * @param {string} terrain - The terrain type
   * @returns {number} - The terrain modifier
   */
  function getTerrainModifier(unit, terrain) {
      // Naval units can only be in water
      if (unit.category === 'naval' || unit.category === 'submarine') {
          return terrain === 'water' ? 1.0 : 0;
      }
      
      // Air units can be in air or on any terrain
      if (unit.category === 'fighters' || unit.category === 'helicopters' || unit.category === 'heavies') {
          if (terrain === 'air') return 1.0;
          // Air units on ground get penalty
          return 0.75;
      }
      
      // Ground units cannot be in water or air
      if (terrain === 'water' || terrain === 'air') {
          return 0;
      }
      
      // Apply specific terrain modifiers for ground units
      switch (terrain) {
          case 'urban':
              return unit.category === 'infantry' ? 1.2 : 0.8;
          case 'forest':
              return unit.category === 'infantry' ? 1.1 : 0.9;
          case 'mountain':
              return unit.category === 'infantry' ? 1.1 : 0.8;
          case 'desert':
              return unit.category === 'armored' ? 1.1 : 0.9;
          case 'jungle':
              return unit.category === 'infantry' ? 1.15 : 0.75;
          case 'plains':
          default:
              return 1.0;
      }
  }

  /**
   * Updates terrain modifiers display in the battle outcome
   */
  function updateTerrainModifiers() {
      const attackerTerrain = document.querySelector('input[name="attackerTerrain"]:checked').value;
      const defenderTerrain = document.querySelector('input[name="defenderTerrain"]:checked').value;
      
      const attackerTerrainModifier = document.getElementById('attackerTerrainModifier');
      const defenderTerrainModifier = document.getElementById('defenderTerrainModifier');
      
      // Calculate average terrain modifiers for attacker and defender stacks
      let attackerModifier = 0;
      let attackerUnitCount = 0;
      attackerComp.units.forEach(unit => {
          const mod = getTerrainModifier(unit, attackerTerrain);
          if (mod > 0) {
              attackerModifier += mod;
              attackerUnitCount++;
          }
      });
      
      let defenderModifier = 0;
      let defenderUnitCount = 0;
      defenderComp.units.forEach(unit => {
          const mod = getTerrainModifier(unit, defenderTerrain);
          if (mod > 0) {
              defenderModifier += mod;
              defenderUnitCount++;
          }
      });
      
      // Calculate average modifiers
      const avgAttackerMod = attackerUnitCount > 0 ? attackerModifier / attackerUnitCount : 0;
      const avgDefenderMod = defenderUnitCount > 0 ? defenderModifier / defenderUnitCount : 0;
      
      // Format and display the modifiers
      const attackerModText = (avgAttackerMod * 100).toFixed(0) + '%';
      const defenderModText = (avgDefenderMod * 100).toFixed(0) + '%';
      
      attackerTerrainModifier.textContent = attackerModText;
      defenderTerrainModifier.textContent = defenderModText;
      
      // Add color classes
      attackerTerrainModifier.className = avgAttackerMod > 1 ? 'positive-modifier' : 
                                         avgAttackerMod < 1 ? 'negative-modifier' : '';
      defenderTerrainModifier.className = avgDefenderMod > 1 ? 'positive-modifier' : 
                                        avgDefenderMod < 1 ? 'negative-modifier' : '';
  }

  /**
   * Simulates a battle between two compositions and calculates the outcome
   */
  function simulateBattle() {
      if (attackerComp.units.length === 0 || defenderComp.units.length === 0) {
          alert('Please add units to both attacker and defender stacks');
          return;
      }
      
      const attackerTerrain = document.querySelector('input[name="attackerTerrain"]:checked').value;
      const defenderTerrain = document.querySelector('input[name="defenderTerrain"]:checked').value;
      
      // Check if units can fight in their terrain
      let attackerCanFight = false;
      attackerComp.units.forEach(unit => {
          if (getTerrainModifier(unit, attackerTerrain) > 0) {
              attackerCanFight = true;
          }
      });
      
      let defenderCanFight = false;
      defenderComp.units.forEach(unit => {
          if (getTerrainModifier(unit, defenderTerrain) > 0) {
              defenderCanFight = true;
          }
      });
      
      if (!attackerCanFight) {
          alert('Attacker units cannot fight in the selected terrain');
          return;
      }
      
      if (!defenderCanFight) {
          alert('Defender units cannot fight in the selected terrain');
          return;
      }
      
      // Calculate effective power for both sides
      let attackerPower = 0;
      attackerComp.units.forEach(unit => {
          const terrainMod = getTerrainModifier(unit, attackerTerrain);
          if (terrainMod > 0) {
              // For attacking, use attack power
              const effectiveAttack = unit.attack * terrainMod;
              attackerPower += effectiveAttack;
          }
      });
      
      let defenderPower = 0;
      defenderComp.units.forEach(unit => {
          const terrainMod = getTerrainModifier(unit, defenderTerrain);
          if (terrainMod > 0) {
              // For defending, use defense power
              const effectiveDefense = unit.defense * terrainMod;
              defenderPower += effectiveDefense;
          }
      });
      
      // Apply overstack penalties if applicable
      if (attackerComp.isOverstacked()) {
          attackerPower *= 0.75;
      }
      
      if (defenderComp.isOverstacked()) {
          defenderPower *= 0.75;
      }
      
      // Calculate power ratio and casualties
      const powerRatio = attackerPower / defenderPower;
      let attackerCasualties = 0;
      let defenderCasualties = 0;
      
      if (powerRatio > 1.25) {
          // Attacker has significant advantage
          defenderCasualties = Math.min(0.75, (powerRatio - 1) * 0.6);
          attackerCasualties = Math.max(0.1, 0.3 / powerRatio);
      } else if (powerRatio < 0.8) {
          // Defender has significant advantage
          attackerCasualties = Math.min(0.75, (1 / powerRatio - 1) * 0.6);
          defenderCasualties = Math.max(0.1, 0.3 * powerRatio);
      } else {
          // Fairly even battle
          attackerCasualties = 0.3;
          defenderCasualties = 0.3;
      }
      
      // Update the battle outcome display
      document.getElementById('attackerTotalPower').textContent = Math.round(attackerPower);
      document.getElementById('defenderTotalPower').textContent = Math.round(defenderPower);
      document.getElementById('powerRatio').textContent = powerRatio.toFixed(2);
      
      document.getElementById('attackerCasualties').textContent = 
          Math.round(attackerCasualties * 100) + '% (' + 
          Math.round(attackerCasualties * attackerComp.getTotalHP()) + ' HP)';
      
      document.getElementById('defenderCasualties').textContent = 
          Math.round(defenderCasualties * 100) + '% (' + 
          Math.round(defenderCasualties * defenderComp.getTotalHP()) + ' HP)';
      
      // Update terrain modifiers
      updateTerrainModifiers();
      
      // Show the battle outcome
      document.getElementById('battleOutcome').style.display = 'block';
  }

  // Initialize the page
  document.addEventListener('DOMContentLoaded', function() {
      // ... existing code ...
      
      // Set default terrain selections
      document.querySelector('input[name="attackerTerrain"][value="plains"]').checked = true;
      document.querySelector('input[name="defenderTerrain"][value="plains"]').checked = true;
      
      // Add event listener for the calculate button
      document.getElementById('calculateBtn').addEventListener('click', simulateBattle);
      
      // ... existing code ...
  });

  /**
   * Get terrain modifier based on unit category and terrain type
   * @param {string} unitCategory - Category of the unit (naval, air, ground)
   * @param {string} terrain - Selected terrain
   * @returns {number} - Terrain modifier (0.0 to 1.0)
   */
  function getTerrainModifier(unitCategory, terrain) {
      // Default modifier is 1.0 (100%)
      let modifier = 1.0;
      
      // Check terrain compatibility first
      if (unitCategory === 'naval' && terrain !== 'water') {
          return 0; // Naval units can only be in water
      }
      
      if (unitCategory === 'air' && terrain !== 'air' && terrain !== 'plains') {
          // Air units can only be in air or on airfields (simplified as plains)
          return 0;
      }
      
      // Ground units can't be in water or air
      if (unitCategory === 'ground' && (terrain === 'water' || terrain === 'air')) {
          return 0;
      }
      
      // Apply terrain modifiers for ground units
      if (unitCategory === 'ground') {
          switch (terrain) {
              case 'urban':
                  modifier = 0.8; // 80% effectiveness in urban areas
                  break;
              case 'forest':
                  modifier = 0.85; // 85% effectiveness in forests
                  break;
              case 'mountain':
                  modifier = 0.7; // 70% effectiveness in mountains
                  break;
              case 'jungle':
                  modifier = 0.75; // 75% effectiveness in jungle
                  break;
              case 'desert':
                  modifier = 0.9; // 90% effectiveness in desert
                  break;
              case 'plains':
              default:
                  modifier = 1.0; // 100% effectiveness in plains (default)
                  break;
          }
      }
      
      return modifier;
  }

  /**
   * Updates the terrain modifiers display for both attacker and defender
   */
  function updateTerrainModifiers() {
      const attackerTerrain = document.querySelector('input[name="attackerTerrain"]:checked').value;
      const defenderTerrain = document.querySelector('input[name="defenderTerrain"]:checked').value;
      
      // Calculate average terrain modifiers for attacker stack
      let attackerModifier = 0;
      let validAttackerUnits = 0;
      
      attackerComp.units.forEach(unit => {
          let category = 'ground';
          if (unit.name.includes('Naval') || unit.name.includes('Ship') || unit.name.includes('Submarine')) {
              category = 'naval';
          } else if (unit.name.includes('Aircraft') || unit.name.includes('Helicopter')) {
              category = 'air';
          }
          
          const unitTerrainMod = getTerrainModifier(category, attackerTerrain);
          if (unitTerrainMod > 0) {
              attackerModifier += unitTerrainMod;
              validAttackerUnits++;
          }
      });
      
      // Calculate average terrain modifiers for defender stack
      let defenderModifier = 0;
      let validDefenderUnits = 0;
      
      defenderComp.units.forEach(unit => {
          let category = 'ground';
          if (unit.name.includes('Naval') || unit.name.includes('Ship') || unit.name.includes('Submarine')) {
              category = 'naval';
          } else if (unit.name.includes('Aircraft') || unit.name.includes('Helicopter')) {
              category = 'air';
          }
          
          const unitTerrainMod = getTerrainModifier(category, defenderTerrain);
          if (unitTerrainMod > 0) {
              defenderModifier += unitTerrainMod;
              validDefenderUnits++;
          }
      });
      
      // Calculate averages and update UI
      const avgAttackerMod = validAttackerUnits > 0 ? attackerModifier / validAttackerUnits : 0;
      const avgDefenderMod = validDefenderUnits > 0 ? defenderModifier / validDefenderUnits : 0;
      
      document.getElementById('attackerTerrainModifier').textContent = `${Math.round(avgAttackerMod * 100)}%`;
      document.getElementById('defenderTerrainModifier').textContent = `${Math.round(avgDefenderMod * 100)}%`;
      
      return {
          attackerMod: avgAttackerMod,
          defenderMod: avgDefenderMod,
          validAttackerUnits: validAttackerUnits,
          validDefenderUnits: validDefenderUnits
      };
  }

  /**
   * Simulates battle between attacker and defender compositions
   */
  function simulateBattle() {
      // Get terrain modifiers and valid unit counts
      const terrainData = updateTerrainModifiers();
      
      // Check if any units can fight in their terrain
      if (terrainData.validAttackerUnits === 0) {
          document.getElementById('battleOutcome').classList.add('battle-error');
          document.getElementById('battleOutcome').innerHTML = `
              <h2>Battle Outcome</h2>
              <div class="error-message">Error: Attacker units cannot operate in the selected terrain.</div>
          `;
          return;
      }
      
      if (terrainData.validDefenderUnits === 0) {
          document.getElementById('battleOutcome').classList.add('battle-error');
          document.getElementById('battleOutcome').innerHTML = `
              <h2>Battle Outcome</h2>
              <div class="error-message">Error: Defender units cannot operate in the selected terrain.</div>
          `;
          return;
      }
      
      // Calculate effective powers with terrain modifiers
      const attackerEffectivePower = attackerComp.calculateTotalPower(true) * terrainData.attackerMod;
      const defenderEffectivePower = defenderComp.calculateTotalPower(false) * terrainData.defenderMod;
      
      // Calculate power ratio (attacker to defender)
      const powerRatio = attackerEffectivePower / defenderEffectivePower;
      
      // Calculate casualties
      let attackerCasualties = 0;
      let defenderCasualties = 0;
      
      if (powerRatio > 1) {
          // Attacker has advantage
          attackerCasualties = Math.min(0.5, 1 / powerRatio);
          defenderCasualties = Math.min(0.9, powerRatio * 0.5);
      } else {
          // Defender has advantage
          attackerCasualties = Math.min(0.9, (1 / powerRatio) * 0.5);
          defenderCasualties = Math.min(0.5, powerRatio);
      }
      
      // Update battle outcome display
      document.getElementById('battleOutcome').classList.remove('battle-error');
      document.getElementById('attackerTotalPower').textContent = Math.round(attackerEffectivePower);
      document.getElementById('defenderTotalPower').textContent = Math.round(defenderEffectivePower);
      document.getElementById('powerRatio').textContent = powerRatio.toFixed(2);
      document.getElementById('attackerCasualties').textContent = `${Math.round(attackerCasualties * 100)}%`;
      document.getElementById('defenderCasualties').textContent = `${Math.round(defenderCasualties * 100)}%`;
  }

  // Initialize page
  document.addEventListener('DOMContentLoaded', function() {
      // Set default terrain selections
      document.querySelector('input[name="attackerTerrain"][value="plains"]').checked = true;
      document.querySelector('input[name="defenderTerrain"][value="plains"]').checked = true;
      
      // Initialize doctrines and units
      populateDoctrineOptions();
      updateAttackerUnitOptions();
      updateDefenderUnitOptions();
      
      // Add event listener for calculate button
      document.getElementById('calculateBtn').addEventListener('click', simulateBattle);
      
      // Add event listeners for terrain selections
      const terrainRadios = document.querySelectorAll('input[name="attackerTerrain"], input[name="defenderTerrain"]');
      terrainRadios.forEach(radio => {
          radio.addEventListener('change', updateTerrainModifiers);
      });
  });
