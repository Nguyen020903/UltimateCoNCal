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
      // Normalize the doctrine name to match directory structure
      const normalizedDoctrine = doctrine.charAt(0).toUpperCase() + doctrine.slice(1).toLowerCase();
      
      // Construct path to the JSON file
      // The path structure is Unit_stats/Doctrine/UnitType/UnitName.json
      const path = `Unit_stats/${normalizedDoctrine}/${unitType}/${unitName}.json`;
      console.log(`Attempting to load unit data from: ${path}`);
      
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
    
    // Clear existing options
    unitSelect.innerHTML = '<option value="">Select Unit</option>';
    
    const selectedDoctrine = doctrineSelect.value.toLowerCase();
    const selectedUnitType = unitTypeSelect.value.toLowerCase();
    
    if (!selectedDoctrine || !selectedUnitType) return;
    
    // Get the units for the selected doctrine and unit type from unitData
    const availableUnits = unitData[selectedDoctrine]?.[selectedUnitType];
    
    if (!availableUnits) return;
    
    // Add units to dropdown
    Object.values(availableUnits).forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.id;
        option.textContent = unit.name;
        unitSelect.appendChild(option);
    });
    
    // Add event listener for unit selection
    unitSelect.addEventListener('change', function() {
        const selectedUnit = units[this.value];
        if (selectedUnit) {
            displayUnitStats(selectedUnit, unitSelectId.replace('Unit', 'Stats'));
        }
    });
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
        // Ensure type is a string and normalize it
        this.type = String(type || 'infantry').toLowerCase();
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
            
            if (terrainKey && this.attackModifiers[terrainKey] !== undefined) {
                return {
                    attack: this.attackModifiers[terrainKey] || 0,
                    defense: this.defenseModifiers[terrainKey] || 0
                };
            }
        }
        
        // No need to call toLowerCase() since we normalized it in constructor
        switch (this.type) {
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
  
  // --- Unified Infantry Level/Tier Logic for All Doctrines ---
  // Map level to tier for infantry units
  function getInfantryTier(level) {
      if (level === 1) return 'basic';
      if (level === 2) return 'basic(1)';
      if (level === 3) return 'advanced';
      if (level === 4) return 'advanced(1)';
      if (level === 5) return 'advanced(2)';
      if (level === 6) return 'modern';
      return 'basic'; // fallback
  }
  
  // --- Expanded unifiedUnitData for all doctrines and infantry types/levels ---
  const unifiedUnitData = {
      western: {
          infantry: {
              motorized: {
                  1: { id: 'w_motorized_1', name: 'Motorized Infantry I', type: 'infantry', attack: 4, defense: 5, hp: 10, speed: 6, range: 1 },
                  2: { id: 'w_motorized_2', name: 'Motorized Infantry II', type: 'infantry', attack: 5, defense: 6, hp: 12, speed: 6, range: 1 },
                  3: { id: 'w_motorized_3', name: 'Motorized Infantry III', type: 'infantry', attack: 6, defense: 7, hp: 14, speed: 7, range: 1 },
                  4: { id: 'w_motorized_4', name: 'Motorized Infantry IV', type: 'infantry', attack: 7, defense: 8, hp: 16, speed: 7, range: 1 },
                  5: { id: 'w_motorized_5', name: 'Motorized Infantry V', type: 'infantry', attack: 8, defense: 9, hp: 18, speed: 8, range: 1 },
                  6: { id: 'w_motorized_6', name: 'Motorized Infantry VI', type: 'infantry', attack: 9, defense: 10, hp: 20, speed: 8, range: 1 }
              },
              marines: {
                  1: { id: 'w_marines_1', name: 'Marines I', type: 'infantry', attack: 5, defense: 4, hp: 10, speed: 3, range: 1 },
                  2: { id: 'w_marines_2', name: 'Marines II', type: 'infantry', attack: 6, defense: 5, hp: 12, speed: 3, range: 1 },
                  3: { id: 'w_marines_3', name: 'Marines III', type: 'infantry', attack: 7, defense: 6, hp: 14, speed: 4, range: 1 },
                  4: { id: 'w_marines_4', name: 'Marines IV', type: 'infantry', attack: 8, defense: 7, hp: 16, speed: 4, range: 1 },
                  5: { id: 'w_marines_5', name: 'Marines V', type: 'infantry', attack: 9, defense: 8, hp: 18, speed: 5, range: 1 },
                  6: { id: 'w_marines_6', name: 'Marines VI', type: 'infantry', attack: 10, defense: 9, hp: 20, speed: 5, range: 1 }
              },
              specialforces: {
                  1: { id: 'w_specialforces_1', name: 'Special Forces I', type: 'infantry', attack: 7, defense: 3, hp: 10, speed: 4, range: 1 },
                  2: { id: 'w_specialforces_2', name: 'Special Forces II', type: 'infantry', attack: 8, defense: 4, hp: 12, speed: 4, range: 1 },
                  3: { id: 'w_specialforces_3', name: 'Special Forces III', type: 'infantry', attack: 9, defense: 5, hp: 14, speed: 5, range: 1 },
                  4: { id: 'w_specialforces_4', name: 'Special Forces IV', type: 'infantry', attack: 10, defense: 6, hp: 16, speed: 5, range: 1 },
                  5: { id: 'w_specialforces_5', name: 'Special Forces V', type: 'infantry', attack: 11, defense: 7, hp: 18, speed: 6, range: 1 },
                  6: { id: 'w_specialforces_6', name: 'Special Forces VI', type: 'infantry', attack: 12, defense: 8, hp: 20, speed: 6, range: 1 }
              }
          },
          // ...other unit types (armored, support, etc.)
      },
      eastern: {
          infantry: {
              motorized: {
                  1: { id: 'e_motorized_1', name: 'Motorized Infantry I', type: 'infantry', attack: 5, defense: 4, hp: 10, speed: 6, range: 1 },
                  2: { id: 'e_motorized_2', name: 'Motorized Infantry II', type: 'infantry', attack: 6, defense: 5, hp: 12, speed: 6, range: 1 },
                  3: { id: 'e_motorized_3', name: 'Motorized Infantry III', type: 'infantry', attack: 7, defense: 6, hp: 14, speed: 7, range: 1 },
                  4: { id: 'e_motorized_4', name: 'Motorized Infantry IV', type: 'infantry', attack: 8, defense: 7, hp: 16, speed: 7, range: 1 },
                  5: { id: 'e_motorized_5', name: 'Motorized Infantry V', type: 'infantry', attack: 9, defense: 8, hp: 18, speed: 8, range: 1 },
                  6: { id: 'e_motorized_6', name: 'Motorized Infantry VI', type: 'infantry', attack: 10, defense: 9, hp: 20, speed: 8, range: 1 }
              },
              marines: {
                  1: { id: 'e_marines_1', name: 'Naval Infantry I', type: 'infantry', attack: 6, defense: 3, hp: 10, speed: 3, range: 1 },
                  2: { id: 'e_marines_2', name: 'Naval Infantry II', type: 'infantry', attack: 7, defense: 4, hp: 12, speed: 3, range: 1 },
                  3: { id: 'e_marines_3', name: 'Naval Infantry III', type: 'infantry', attack: 8, defense: 5, hp: 14, speed: 4, range: 1 },
                  4: { id: 'e_marines_4', name: 'Naval Infantry IV', type: 'infantry', attack: 9, defense: 6, hp: 16, speed: 4, range: 1 },
                  5: { id: 'e_marines_5', name: 'Naval Infantry V', type: 'infantry', attack: 10, defense: 7, hp: 18, speed: 5, range: 1 },
                  6: { id: 'e_marines_6', name: 'Naval Infantry VI', type: 'infantry', attack: 11, defense: 8, hp: 20, speed: 5, range: 1 }
              },
              specialforces: {
                  1: { id: 'e_specialforces_1', name: 'Spetsnaz I', type: 'infantry', attack: 8, defense: 2, hp: 10, speed: 4, range: 1 },
                  2: { id: 'e_specialforces_2', name: 'Spetsnaz II', type: 'infantry', attack: 9, defense: 3, hp: 12, speed: 4, range: 1 },
                  3: { id: 'e_specialforces_3', name: 'Spetsnaz III', type: 'infantry', attack: 10, defense: 4, hp: 14, speed: 5, range: 1 },
                  4: { id: 'e_specialforces_4', name: 'Spetsnaz IV', type: 'infantry', attack: 11, defense: 5, hp: 16, speed: 5, range: 1 },
                  5: { id: 'e_specialforces_5', name: 'Spetsnaz V', type: 'infantry', attack: 12, defense: 6, hp: 18, speed: 6, range: 1 },
                  6: { id: 'e_specialforces_6', name: 'Spetsnaz VI', type: 'infantry', attack: 13, defense: 7, hp: 20, speed: 6, range: 1 }
              }
          },
          // ...other unit types (armored, support, etc.)
      },
      european: {
          infantry: {
              motorized: {
                  1: { id: 'eu_motorized_1', name: 'Motorized Infantry I', type: 'infantry', attack: 4, defense: 6, hp: 10, speed: 6, range: 1 },
                  2: { id: 'eu_motorized_2', name: 'Motorized Infantry II', type: 'infantry', attack: 5, defense: 7, hp: 12, speed: 6, range: 1 },
                  3: { id: 'eu_motorized_3', name: 'Motorized Infantry III', type: 'infantry', attack: 6, defense: 8, hp: 14, speed: 7, range: 1 },
                  4: { id: 'eu_motorized_4', name: 'Motorized Infantry IV', type: 'infantry', attack: 7, defense: 9, hp: 16, speed: 7, range: 1 },
                  5: { id: 'eu_motorized_5', name: 'Motorized Infantry V', type: 'infantry', attack: 8, defense: 10, hp: 18, speed: 8, range: 1 },
                  6: { id: 'eu_motorized_6', name: 'Motorized Infantry VI', type: 'infantry', attack: 9, defense: 11, hp: 20, speed: 8, range: 1 }
              },
              marines: {
                  1: { id: 'eu_marines_1', name: 'Marines I', type: 'infantry', attack: 5, defense: 5, hp: 10, speed: 3, range: 1 },
                  2: { id: 'eu_marines_2', name: 'Marines II', type: 'infantry', attack: 6, defense: 6, hp: 12, speed: 3, range: 1 },
                  3: { id: 'eu_marines_3', name: 'Marines III', type: 'infantry', attack: 7, defense: 7, hp: 14, speed: 4, range: 1 },
                  4: { id: 'eu_marines_4', name: 'Marines IV', type: 'infantry', attack: 8, defense: 8, hp: 16, speed: 4, range: 1 },
                  5: { id: 'eu_marines_5', name: 'Marines V', type: 'infantry', attack: 9, defense: 9, hp: 18, speed: 5, range: 1 },
                  6: { id: 'eu_marines_6', name: 'Marines VI', type: 'infantry', attack: 10, defense: 10, hp: 20, speed: 5, range: 1 }
              },
              specialforces: {
                  1: { id: 'eu_specialforces_1', name: 'Special Forces I', type: 'infantry', attack: 7, defense: 4, hp: 10, speed: 4, range: 1 },
                  2: { id: 'eu_specialforces_2', name: 'Special Forces II', type: 'infantry', attack: 8, defense: 5, hp: 12, speed: 4, range: 1 },
                  3: { id: 'eu_specialforces_3', name: 'Special Forces III', type: 'infantry', attack: 9, defense: 6, hp: 14, speed: 5, range: 1 },
                  4: { id: 'eu_specialforces_4', name: 'Special Forces IV', type: 'infantry', attack: 10, defense: 7, hp: 16, speed: 5, range: 1 },
                  5: { id: 'eu_specialforces_5', name: 'Special Forces V', type: 'infantry', attack: 11, defense: 8, hp: 18, speed: 6, range: 1 },
                  6: { id: 'eu_specialforces_6', name: 'Special Forces VI', type: 'infantry', attack: 12, defense: 9, hp: 20, speed: 6, range: 1 }
              }
          },
          // ...other unit types (armored, support, etc.)
      }
  };
  
  // --- Wire up the new dropdown logic for attacker and defender ---
  document.addEventListener('DOMContentLoaded', function() {
      // ...existing event listeners...
      // Attacker
      document.getElementById('attackerUnitType').addEventListener('change', function() {
          populateUnitsWithLevel('attackerDoctrine', 'attackerUnitType', 'attackerUnit', 'attackerLevel');
      });
      document.getElementById('attackerLevel').addEventListener('change', function() {
          populateUnitsWithLevel('attackerDoctrine', 'attackerUnitType', 'attackerUnit', 'attackerLevel');
      });
      // Defender
      document.getElementById('defenderUnitType').addEventListener('change', function() {
          populateUnitsWithLevel('defenderDoctrine', 'defenderUnitType', 'defenderUnit', 'defenderLevel');
      });
      document.getElementById('defenderLevel').addEventListener('change', function() {
          populateUnitsWithLevel('defenderDoctrine', 'defenderUnitType', 'defenderUnit', 'defenderLevel');
      });
      // Initial population
      populateUnitsWithLevel('attackerDoctrine', 'attackerUnitType', 'attackerUnit', 'attackerLevel');
      populateUnitsWithLevel('defenderDoctrine', 'defenderUnitType', 'defenderUnit', 'defenderLevel');
  });
  // --- End of expansion and wiring ---
  
  // --- Dropdown logic: add level selector for infantry ---
  function populateUnitsWithLevel(doctrineSelectId, unitTypeSelectId, unitSelectId, levelSelectId) {
      const doctrineSelect = document.getElementById(doctrineSelectId);
      const unitTypeSelect = document.getElementById(unitTypeSelectId);
      const unitSelect = document.getElementById(unitSelectId);
      const levelSelect = document.getElementById(levelSelectId);
      
      // Clear existing options
      unitSelect.innerHTML = '<option value="">Select Unit</option>';
      if (levelSelect) levelSelect.innerHTML = '';
      
      const selectedDoctrine = doctrineSelect.value.toLowerCase();
      const selectedUnitType = unitTypeSelect.value.toLowerCase();
      
      if (!selectedDoctrine || !selectedUnitType) return;
      
      // If infantry, show level selector
      if (selectedUnitType === 'infantry' && levelSelect) {
          // Show levels 1-6 (or as many as available)
          for (let lvl = 1; lvl <= 6; lvl++) {
              const option = document.createElement('option');
              option.value = lvl;
              option.textContent = `Level ${lvl}`;
              levelSelect.appendChild(option);
          }
          levelSelect.style.display = '';
          // Populate units for selected level
          levelSelect.addEventListener('change', function() {
              populateInfantryUnitsByLevel(selectedDoctrine, unitSelect, levelSelect.value);
          });
          // Initial population
          populateInfantryUnitsByLevel(selectedDoctrine, unitSelect, 1);
      } else {
          // Hide level selector for non-infantry
          if (levelSelect) levelSelect.style.display = 'none';
          // Populate as before
          const availableUnits = unifiedUnitData[selectedDoctrine]?.[selectedUnitType];
          if (!availableUnits) return;
          Object.values(availableUnits).forEach(unit => {
              const option = document.createElement('option');
              option.value = unit.id;
              option.textContent = unit.name;
              unitSelect.appendChild(option);
          });
      }
  }
  
  function populateInfantryUnitsByLevel(doctrine, unitSelect, level) {
      unitSelect.innerHTML = '<option value="">Select Unit</option>';
      const infantryTypes = unifiedUnitData[doctrine]?.infantry;
      if (!infantryTypes) return;
      Object.keys(infantryTypes).forEach(type => {
          const unit = infantryTypes[type][level];
          if (unit) {
              const option = document.createElement('option');
              option.value = unit.id;
              option.textContent = unit.name;
              unitSelect.appendChild(option);
          }
      });
  }
  
  // --- Adjust stat calculation: Level bonus, doctrine, terrain ---
  // (Assume 10% per level is correct unless specified)
  // Already handled in Unit.getEffectiveStats, but ensure it uses the new structure
  // --- Stack logic: limit is 10 ---
  class Composition {
      constructor(doctrine) {
          this.units = []; // { unit: Unit, count: number }
          this.doctrine = doctrine;
      }
      addUnit(unit, count = 1) {
          this.units.push({ unit, count });
      }
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
      calculateTotalPower(terrain, isAttacker) {
          let totalPower = 0;
          this.units.forEach(({ unit, count }) => {
              const stats = unit.getEffectiveStats(terrain);
              if (unit.isRanged && isAttacker) {
                  totalPower += stats.attack * count;
              } else {
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
      // Stack limit is 10 for ground units
      isOverstacked() {
          const groundUnits = this.units.filter(item =>
              ['infantry', 'armored', 'support'].includes(item.unit.type)
          ).reduce((total, item) => total + item.count, 0);
          const airNavalUnits = this.units.filter(item =>
              ['fighter', 'heavy', 'naval', 'submarine', 'helicopter', 'air'].includes(item.unit.type)
          ).reduce((total, item) => total + item.count, 0);
          return (groundUnits > 10) || (airNavalUnits > 10);
      }
  }
  // --- End of refactor ---
  
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

  // Define the available unit types for each doctrine
  const doctrineUnitTypes = {
      'western': [
          'infantry',
          'armored',
          'support',
          'helicopters',
          'fighters',
          'heavies',
          'naval',
          'submarine'
      ],
      'eastern': [
          'infantry',
          'armored',
          'support',
          'helicopters',
          'fighters',
          'heavies',
          'naval',
          'submarine'
      ],
      'european': [
          'infantry',
          'armored',
          'support',
          'helicopters',
          'fighters',
          'heavies',
          'naval',
          'submarine'
      ]
  };

  const availableUnits = {
      'western': {
          'infantry': [
              { name: 'Mechanized Infantry', type: 'Infantry' },
              { name: 'Special Forces', type: 'Infantry' },
              { name: 'Marines', type: 'Infantry' }
          ],
          'armored': [
              { name: 'M1 Abrams', type: 'MBT' },
              { name: 'Stryker', type: 'AFV' },
              { name: 'Bradley', type: 'IFV' }
          ]
      },
      'eastern': {
          'infantry': [
              { name: 'Motorized Infantry', type: 'Infantry' },
              { name: 'Naval Infantry', type: 'Infantry' },
              { name: 'Spetsnaz', type: 'Infantry' }
          ],
          'armored': [
              { name: 'T-72', type: 'MBT' },
              { name: 'BTR-80', type: 'AFV' },
              { name: 'BMP-2', type: 'IFV' }
          ]
      },
      'european': {
          'infantry': [
              { name: 'Mechanized Infantry', type: 'Infantry' },
              { name: 'Mountain Infantry', type: 'Infantry' },
              { name: 'Paratroopers', type: 'Infantry' }
          ],
          'armored': [
              { name: 'Leopard 2', type: 'MBT' },
              { name: 'Boxer', type: 'AFV' },
              { name: 'Puma', type: 'IFV' }
          ]
      }
  };

  // Initialize variables to store compositions
  let attackerComp = { units: [] };
  let defenderComp = { units: [] };

  // Helper function to populate unit type options based on selected doctrine
  function populateUnitTypes(doctrineSelectId, unitTypeSelectId) {
      const doctrineSelect = document.getElementById(doctrineSelectId);
      const unitTypeSelect = document.getElementById(unitTypeSelectId);
      const doctrine = doctrineSelect.value.toLowerCase();

      // Clear existing options
      unitTypeSelect.innerHTML = '<option value="">Select Unit Type</option>';

      // Add unit type options
      if (doctrineUnitTypes[doctrine]) {
          doctrineUnitTypes[doctrine].forEach(unitType => {
              const option = document.createElement('option');
              option.value = unitType;
              option.textContent = unitType;
              unitTypeSelect.appendChild(option);
          });
      }

      // Clear the unit select dropdown since unit type has changed
      const unitSelectId = unitTypeSelectId.replace('UnitType', 'Unit');
      const unitSelect = document.getElementById(unitSelectId);
      if (unitSelect) {
          unitSelect.innerHTML = '<option value="">Select Unit</option>';
      }
  }

  // Function to update terrain modifiers
  function updateTerrainModifiers() {
      // Get the terrain modifier elements first
      const terrainModifierEl = document.getElementById('terrain-modifier');
      const attackerTerrainMod = document.getElementById('attacker-terrain-mod');
      const defenderTerrainMod = document.getElementById('defender-terrain-mod');
      
      // Get selected terrain values
      const attackerTerrain = document.querySelector('input[name="attacker-terrain"]:checked')?.value || 'open';
      const defenderTerrain = document.querySelector('input[name="defender-terrain"]:checked')?.value || 'open';
      
      // Initialize counters
      let totalAttackerMod = 0;
      let totalDefenderMod = 0;
      let attackerUnitCount = 0;
      let defenderUnitCount = 0;
      
      // Calculate attacker modifiers if we have units
      if (attackerComp?.units) {
          attackerComp.units.forEach(item => {
              if (item.unit?.getStatModifier) {
                  const mod = item.unit.getStatModifier(attackerTerrain);
                  totalAttackerMod += mod.attack * item.quantity;
                  attackerUnitCount += item.quantity;
              }
          });
      }
      
      // Calculate defender modifiers if we have units
      if (defenderComp?.units) {
          defenderComp.units.forEach(item => {
              if (item.unit?.getStatModifier) {
                  const mod = item.unit.getStatModifier(defenderTerrain);
                  totalDefenderMod += mod.defense * item.quantity;
                  defenderUnitCount += item.quantity;
              }
          });
      }
      
      // Calculate averages
      const avgAttackerMod = (attackerUnitCount > 0) ? (totalAttackerMod / attackerUnitCount).toFixed(2) : "1.00";
      const avgDefenderMod = (defenderUnitCount > 0) ? (totalDefenderMod / defenderUnitCount).toFixed(2) : "1.00";
      
      // Update the displays if elements exist
      if (terrainModifierEl) {
          terrainModifierEl.textContent = `A: ${avgAttackerMod} / D: ${avgDefenderMod}`;
      }
      
      if (attackerTerrainMod) {
          attackerTerrainMod.textContent = `x${avgAttackerMod}`;
      }
      
      if (defenderTerrainMod) {
          defenderTerrainMod.textContent = `x${avgDefenderMod}`;
      }
  }

  // Add event listeners when the page loads
  document.addEventListener('DOMContentLoaded', function() {
      // Add event listeners for terrain radio buttons
      document.querySelectorAll('input[name="attacker-terrain"], input[name="defender-terrain"]').forEach(radio => {
          radio.addEventListener('change', updateTerrainModifiers);
      });
      
      // Initialize terrain modifiers
      updateTerrainModifiers();

      // Add event listeners for doctrine changes
      document.getElementById('attackerDoctrine').addEventListener('change', function() {
          populateUnitTypes('attackerDoctrine', 'attackerUnitType');
      });

      document.getElementById('defenderDoctrine').addEventListener('change', function() {
          populateUnitTypes('defenderDoctrine', 'defenderUnitType');
      });

      // Add event listeners for unit type changes
      document.getElementById('attackerUnitType').addEventListener('change', function() {
          populateUnits('attackerDoctrine', 'attackerUnitType', 'attackerUnit');
      });

      document.getElementById('defenderUnitType').addEventListener('change', function() {
          populateUnits('defenderDoctrine', 'defenderUnitType', 'defenderUnit');
      });

      // Initial population of unit types
      populateUnitTypes('attackerDoctrine', 'attackerUnitType');
      populateUnitTypes('defenderDoctrine', 'defenderUnitType');
  });

  // Function to display unit stats
  function displayUnitStats(elementId, unit) {
    const statsElement = document.getElementById(elementId);
    if (!statsElement) return;
    
    // Get the effective stats for the current terrain
    const terrain = document.querySelector(`input[name="${elementId.includes('attacker') ? 'attacker' : 'defender'}-terrain"]:checked`).value;
    const stats = unit.getEffectiveStats(terrain);
    
    // Create the stats display
    let statsHTML = `
      <div class="unit-stat-row">
        <span class="stat-label">Name:</span>
        <span class="stat-value">${unit.name}</span>
      </div>
      <div class="unit-stat-row">
        <span class="stat-label">Type:</span>
        <span class="stat-value">${unit.type}</span>
      </div>
      <div class="unit-stat-row">
        <span class="stat-label">Level:</span>
        <span class="stat-value">${unit.level}</span>
      </div>
      <div class="unit-stat-row">
        <span class="stat-label">Attack:</span>
        <span class="stat-value">${stats.attack.toFixed(1)}</span>
      </div>
      <div class="unit-stat-row">
        <span class="stat-label">Defense:</span>
        <span class="stat-value">${stats.defense.toFixed(1)}</span>
      </div>
      <div class="unit-stat-row">
        <span class="stat-label">HP:</span>
        <span class="stat-value">${stats.hp.toFixed(1)}</span>
      </div>
      <div class="unit-stat-row">
        <span class="stat-label">Speed:</span>
        <span class="stat-value">${stats.speed.toFixed(1)}</span>
      </div>
    `;
    
    // Add attack type information if available
    if (unit.attackValues && Object.keys(unit.attackValues).length > 0) {
      statsHTML += '<div class="unit-stat-row"><span class="stat-label">Attack Types:</span></div>';
      for (const type in unit.attackValues) {
        statsHTML += `
          <div class="unit-stat-row sub-stat">
            <span class="stat-label">${type}:</span>
            <span class="stat-value">${unit.attackValues[type].toFixed(1)}</span>
          </div>
        `;
      }
    }
    
    // Add defense type information if available
    if (unit.defenseValues && Object.keys(unit.defenseValues).length > 0) {
      statsHTML += '<div class="unit-stat-row"><span class="stat-label">Defense Types:</span></div>';
      for (const type in unit.defenseValues) {
        statsHTML += `
          <div class="unit-stat-row sub-stat">
            <span class="stat-label">${type}:</span>
            <span class="stat-value">${unit.defenseValues[type].toFixed(1)}</span>
          </div>
        `;
      }
    }
    
    // Add terrain modifiers if available
    if (unit.attackModifiers && Object.keys(unit.attackModifiers).length > 0) {
      statsHTML += '<div class="unit-stat-row"><span class="stat-label">Terrain Modifiers:</span></div>';
      for (const terrainType in unit.attackModifiers) {
        const terrainName = terrainMapping[terrainType] || terrainType;
        const attackMod = unit.attackModifiers[terrainType];
        const defenseMod = unit.defenseModifiers[terrainType] || 0;
        
        statsHTML += `
          <div class="unit-stat-row sub-stat">
            <span class="stat-label">${terrainName}:</span>
            <span class="stat-value">Atk: ${(attackMod * 100).toFixed(0)}% / Def: ${(defenseMod * 100).toFixed(0)}%</span>
          </div>
        `;
      }
    }
    
    statsElement.innerHTML = statsHTML;
  }

  // ... rest of your existing code ...
