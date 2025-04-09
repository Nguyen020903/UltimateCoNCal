// Doctrine Modifiers: Flat and Percentage-Based
const doctrines = {
    Eastern: {
      "Motorized Infantry": {
        flat: { atk: 1, def: 0, speed: -0.1, hp: 2 },
        percent: { atk: 10, def: 5, speed: -5, hp: 5 }, // Percent modifiers
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
        return clonedUnit;
    }

    getStatModifier(terrain) {
        // Default modifiers
        let attackMod = 1.0;
        let defenseMod = 1.0;

        // Terrain modifiers
        if (terrain) {
            // Apply terrain modifiers based on unit type
            switch (terrain) {
                case 'forest':
                    if (this.type === 'infantry') {
                        attackMod *= 1.15;
                        defenseMod *= 1.25;
                    } else if (this.type === 'armored') {
                        attackMod *= 0.85;
                        defenseMod *= 0.85;
                    }
                    break;
                case 'mountains':
                    if (this.type === 'infantry') {
                        attackMod *= 1.1;
                        defenseMod *= 1.2;
                    } else if (this.type === 'armored') {
                        attackMod *= 0.7;
                        defenseMod *= 0.75;
                    } else if (this.type === 'support') {
                        attackMod *= 0.85;
                        defenseMod *= 0.9;
                    }
                    break;
                case 'urban':
                    if (this.type === 'infantry') {
                        attackMod *= 1.2;
                        defenseMod *= 1.3;
                    } else if (this.type === 'armored') {
                        attackMod *= 0.9;
                        defenseMod *= 0.85;
                    }
                    break;
                case 'desert':
                    // Desert has minimal effect
                    break;
                case 'jungle':
                    if (this.type === 'infantry') {
                        attackMod *= 1.1;
                        defenseMod *= 1.2;
                    } else if (this.type === 'armored') {
                        attackMod *= 0.8;
                        defenseMod *= 0.75;
                    } else if (this.type === 'support') {
                        attackMod *= 0.9;
                        defenseMod *= 0.85;
                    }
                    break;
                case 'water':
                    if (this.type === 'naval' || this.type === 'submarine') {
                        // Naval units operate normally on water
                    } else {
                        // Non-naval units can't fight on water
                        attackMod *= 0;
                        defenseMod *= 0;
                    }
                    break;
                case 'plains':
                default:
                    // Plains is the base terrain
                    break;
            }
        }

        // Apply doctrine modifiers if applicable
        if (this.doctrine) {
            const doctrineModifiers = doctrines[this.doctrine];
            if (doctrineModifiers) {
                // Flat modifiers
                const flatMods = doctrineModifiers.flatModifiers[this.type] || {};
                if (flatMods.attack) attackMod += flatMods.attack;
                if (flatMods.defense) defenseMod += flatMods.defense;

                // Percentage modifiers
                const percentMods = doctrineModifiers.percentageModifiers[this.type] || {};
                if (percentMods.attack) attackMod *= (1 + percentMods.attack);
                if (percentMods.defense) defenseMod *= (1 + percentMods.defense);
            }
        }

        return {
            attack: attackMod,
            defense: defenseMod
        };
    }

    getEffectiveStats(terrain) {
        const modifiers = this.getStatModifier(terrain);
        const levelMultiplier = 1 + (this.level - 1) * 0.05; // 5% increase per level
        const hpScaling = this.currentHP / this.maxHP; // HP-based damage scaling

        return {
            attack: this.attack * modifiers.attack * levelMultiplier * hpScaling,
            defense: this.defense * modifiers.defense * levelMultiplier,
            hp: this.currentHP,
            speed: this.speed,
            range: this.baseRange,
            weight: this.weight,
            classification: this.classification,
            isRanged: this.isRanged
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
              naval_fighter: { id: "w_naval_fighter", name: "Naval Fighter", type: "air", attack: 17, defense: 13, hp: 20, speed: 85, range: 3 },
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
              carrier: { id: "e_carrier", name: "Aircraft Carrier", type: "naval", attack: 6, defense: 14, hp: 80, speed: 20, range: 5 }
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

  // Helper function to create a unit from selection
  function createUnitFromSelection(side) {
      const doctrine = document.getElementById(`${side}Doctrine`).value;
      const unitType = document.getElementById(`${side}UnitType`).value;
      const unitId = document.getElementById(`${side}Unit`).value;
      const level = parseInt(document.getElementById(`${side}Level`).value);
      const quantity = parseInt(document.getElementById(`${side}Quantity`).value) || 1;
      
      if (!unitType || !unitId) {
          alert(`Please select a unit type and unit for the ${side}`);
          return null;
      }
      
      // Get the unit data from the unitData object
      if (unitData[doctrine] && unitData[doctrine][unitType] && unitData[doctrine][unitType][unitId]) {
          const unitInfo = unitData[doctrine][unitType][unitId];
          
          // Create a Unit object
          const unit = new Unit(
              unitInfo.id,
              unitInfo.name,
              unitInfo.type,
              unitInfo.attack,
              unitInfo.defense,
              unitInfo.hp,
              unitInfo.speed,
              unitInfo.range || 1
          );
          
          // Set doctrine and level
          unit.setDoctrine(doctrine);
          unit.upgrade(level);
          
          return {
              unit: unit,
              quantity: quantity
          };
      } else {
          console.error(`Unit data not found for ${doctrine} ${unitType} ${unitId}`);
          return null;
      }
  }

  // Add unit to stack
  function addUnitToStack(side) {
      const unitSelection = createUnitFromSelection(side);
      if (!unitSelection) return;
      
      const stack = side === 'attacker' ? attackerStack : defenderStack;
      const stackContainer = document.getElementById(`${side}Stack`);
      
      // Add to stack array
      stack.push(unitSelection);
      
      // Add to UI
      const unitCard = document.createElement('div');
      unitCard.className = 'unit-card';
      unitCard.dataset.index = stack.length - 1;
      
      unitCard.innerHTML = `
          <div class="unit-card-header">
              <span class="unit-name">${unitSelection.unit.name}</span>
              <span class="unit-level">Lvl ${unitSelection.unit.level}</span>
          </div>
          <div class="unit-card-body">
              <span class="unit-quantity">x${unitSelection.quantity}</span>
              <span class="unit-type">${unitSelection.unit.type}</span>
          </div>
          <button class="remove-unit-btn" data-side="${side}" data-index="${stack.length - 1}">X</button>
      `;
      
      stackContainer.appendChild(unitCard);
      
      // Add event listener to remove button
      unitCard.querySelector('.remove-unit-btn').addEventListener('click', function() {
          removeUnitFromStack(side, parseInt(this.dataset.index));
      });
      
      // Update the stack details if the battle outcome is visible
      if (document.getElementById('battle-outcome').style.display === 'block') {
          updateBattleOutcome();
      }
  }

  // Remove unit from stack
  function removeUnitFromStack(side, index) {
      const stack = side === 'attacker' ? attackerStack : defenderStack;
      const stackContainer = document.getElementById(`${side}Stack`);
      
      // Remove from array
      stack.splice(index, 1);
      
      // Update UI
      stackContainer.innerHTML = '';
      
      // Rebuild stack UI
      stack.forEach((unitSelection, idx) => {
          const unitCard = document.createElement('div');
          unitCard.className = 'unit-card';
          unitCard.dataset.index = idx;
          
          unitCard.innerHTML = `
              <div class="unit-card-header">
                  <span class="unit-name">${unitSelection.unit.name}</span>
                  <span class="unit-level">Lvl ${unitSelection.unit.level}</span>
              </div>
              <div class="unit-card-body">
                  <span class="unit-quantity">x${unitSelection.quantity}</span>
                  <span class="unit-type">${unitSelection.unit.type}</span>
              </div>
              <button class="remove-unit-btn" data-side="${side}" data-index="${idx}">X</button>
          `;
          
          stackContainer.appendChild(unitCard);
          
          // Add event listener to remove button
          unitCard.querySelector('.remove-unit-btn').addEventListener('click', function() {
              removeUnitFromStack(side, parseInt(this.dataset.index));
          });
      });
      
      // Update the stack details if the battle outcome is visible
      if (document.getElementById('battle-outcome').style.display === 'block') {
          updateBattleOutcome();
      }
  }

  // Clear stack
  function clearStack(side) {
      const stack = side === 'attacker' ? attackerStack : defenderStack;
      const stackContainer = document.getElementById(`${side}Stack`);
      
      // Clear array
      stack.length = 0;
      
      // Clear UI
      stackContainer.innerHTML = '';
      
      // Update the stack details if the battle outcome is visible
      if (document.getElementById('battle-outcome').style.display === 'block') {
          updateBattleOutcome();
      }
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
      // Check if there are units in both stacks
      if (attackerStack.length === 0 || defenderStack.length === 0) {
          alert('Please add units to both attacker and defender stacks');
          return;
      }
      
      const terrain = document.querySelector('input[name="terrain"]:checked').value;
      const entrenchment = document.getElementById('entrenchment').checked;
      const officerBoost = document.getElementById('officerBoost').checked;
      
      // Create compositions for attacker and defender
      const attackerComp = new Composition();
      const defenderComp = new Composition();
      
      // Add units to compositions
      attackerStack.forEach(item => {
          attackerComp.addUnit(item.unit, item.quantity);
      });
      
      defenderStack.forEach(item => {
          defenderComp.addUnit(item.unit, item.quantity);
      });
      
      // Calculate total power for attacker and defender
      const attackerPower = attackerComp.calculateTotalPower(terrain, true);
      const defenderPower = defenderComp.calculateTotalPower(terrain, false);
      
      // Apply special modifiers
      let entrenchmentMod = 1.0;
      let officerMod = 1.0;
      
      if (entrenchment) {
          entrenchmentMod = 0.75; // -25% damage received
      }
      
      if (officerBoost) {
          officerMod = 1.2; // +20% combat effectiveness
      }
      
      const modifiedAttackerPower = attackerPower * officerMod;
      const modifiedDefenderPower = defenderPower * officerMod * (1/entrenchmentMod); // Inverse of damage reduction
      
      // Update the power display
      document.getElementById('attacker-power').textContent = modifiedAttackerPower.toFixed(2);
      document.getElementById('defender-power').textContent = modifiedDefenderPower.toFixed(2);
      
      // Update terrain modifiers
      updateTerrainModifiers();
      
      // Update special modifiers display
      const specialModifiersEl = document.getElementById('special-modifier-value');
      let specialModText = '';
      
      if (entrenchment) {
          specialModText += 'Entrenchment: -25% damage received by defender';
      }
      
      if (officerBoost) {
          if (specialModText) specialModText += '<br>';
          specialModText += 'Officer Boost: +20% combat effectiveness';
      }
      
      if (!specialModText) specialModText = 'None';
      specialModifiersEl.innerHTML = specialModText;
      
      // Calculate outcome
      const powerRatio = modifiedAttackerPower / modifiedDefenderPower;
      const outcomeHeader = document.getElementById('outcomeHeader');
      const outcomeText = document.getElementById('outcomeText');
      
      // Clear previous classes
      outcomeHeader.className = 'outcome-header';
      
      // Update stack details
      updateStackDetails('attacker');
      updateStackDetails('defender');
      
      // Determine battle outcome
      if (powerRatio > 1.5) {
          // Attacker has significant advantage
          outcomeHeader.classList.add('attacker-advantage');
          outcomeHeader.textContent = 'Attacker Victory';
          
          // Simulate battle to calculate casualties
          simulateBattle(attackerComp, defenderComp, 'attacker-advantage');
          
      } else if (powerRatio < 0.67) {
          // Defender has significant advantage
          outcomeHeader.classList.add('defender-advantage');
          outcomeHeader.textContent = 'Defender Victory';
          
          // Simulate battle to calculate casualties
          simulateBattle(attackerComp, defenderComp, 'defender-advantage');
          
      } else {
          // Balanced battle
          outcomeHeader.classList.add('balanced');
          outcomeHeader.textContent = 'Balanced Battle';
          
          // Simulate battle to calculate casualties
          simulateBattle(attackerComp, defenderComp, 'balanced');
      }
      
      // Display the outcome section
      document.getElementById('battle-outcome').style.display = 'block';
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
  function simulateBattle(attackerComp, defenderComp, outcome) {
      const attackerUnitCount = attackerComp.units.length;
      const defenderUnitCount = defenderComp.units.length;
      
      let attackerLosses = 0;
      let defenderLosses = 0;
      
      if (outcome === 'attacker-advantage') {
          // Attacker wins - defender suffers heavy losses
          const casualtyRate = Math.min(0.9, Math.max(0.2, 1 - (defenderComp.calculateTotalPower(document.querySelector('input[name="terrain"]:checked').value, false) / attackerComp.calculateTotalPower(document.querySelector('input[name="terrain"]:checked').value, true))));
          defenderLosses = Math.ceil(defenderUnitCount * casualtyRate);
          attackerLosses = Math.ceil(attackerUnitCount * (casualtyRate / 3));
      } else if (outcome === 'defender-advantage') {
          // Defender wins - attacker suffers heavy losses
          const casualtyRate = Math.min(0.9, Math.max(0.2, 1 - (attackerComp.calculateTotalPower(document.querySelector('input[name="terrain"]:checked').value, true) / defenderComp.calculateTotalPower(document.querySelector('input[name="terrain"]:checked').value, false))));
          attackerLosses = Math.ceil(attackerUnitCount * casualtyRate);
          defenderLosses = Math.ceil(defenderUnitCount * (casualtyRate / 3));
      } else {
          // Balanced battle - both sides suffer moderate losses
          const casualtyRate = Math.min(0.6, Math.max(0.3, 0.45));
          attackerLosses = Math.ceil(attackerUnitCount * casualtyRate);
          defenderLosses = Math.ceil(defenderUnitCount * casualtyRate);
      }
      
      // Total up units from stack quantities
      let totalAttackerUnits = attackerStack.reduce((sum, item) => sum + item.quantity, 0);
      let totalDefenderUnits = defenderStack.reduce((sum, item) => sum + item.quantity, 0);
      
      // Adjust casualties based on stack quantities
      const attackerCasualties = Math.min(totalAttackerUnits, Math.ceil((attackerLosses / attackerUnitCount) * totalAttackerUnits));
      const defenderCasualties = Math.min(totalDefenderUnits, Math.ceil((defenderLosses / defenderUnitCount) * totalDefenderUnits));
      
      // Update the outcome text
      const outcomeText = document.getElementById('outcomeText');
      outcomeText.innerHTML = `
          <div class="casualties">
              <p>Estimated casualties:</p>
              <p>Attacker: ${attackerCasualties} unit(s) (${Math.round(attackerCasualties/totalAttackerUnits*100)}%)</p>
              <p>Defender: ${defenderCasualties} unit(s) (${Math.round(defenderCasualties/totalDefenderUnits*100)}%)</p>
          </div>
      `;
  }

  // Function to update terrain modifiers display
  function updateTerrainModifiers() {
      const terrain = document.querySelector('input[name="terrain"]:checked').value;
      const terrainModifierEl = document.getElementById('terrain-modifier');
      
      if (!terrainModifierEl) return;
      
      // If both stacks are empty, show default terrain modifiers
      if (attackerStack.length === 0 || defenderStack.length === 0) {
          // Use the terrain modifiers object directly
          const attackMod = terrainModifiers[terrain].attackMod.toFixed(2);
          const defenseMod = terrainModifiers[terrain].defenseMod.toFixed(2);
          terrainModifierEl.textContent = `A: ${attackMod} / D: ${defenseMod}`;
          return;
      }
      
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
  }

  // Initialize page when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
      // Initialize terrain radio buttons
      const defaultTerrain = document.querySelector('input[name="terrain"][value="plains"]');
      if (defaultTerrain) {
          defaultTerrain.checked = true;
      }
      
      // Set up event listeners for attacker side
      const attackerDoctrine = document.getElementById('attackerDoctrine');
      if (attackerDoctrine) {
          attackerDoctrine.addEventListener('change', function() {
              updateUnitOptions('attacker');
          });
      }
      
      const attackerUnitType = document.getElementById('attackerUnitType');
      if (attackerUnitType) {
          attackerUnitType.addEventListener('change', function() {
              updateUnits('attacker');
          });
      }
      
      const attackerUnit = document.getElementById('attackerUnit');
      if (attackerUnit) {
          attackerUnit.addEventListener('change', function() {
              updateUnitStats('attackerDoctrine', 'attackerUnitType', 'attackerUnit', 'attackerUnitStats');
          });
      }
      
      // Set up event listeners for defender side
      const defenderDoctrine = document.getElementById('defenderDoctrine');
      if (defenderDoctrine) {
          defenderDoctrine.addEventListener('change', function() {
              updateUnitOptions('defender');
          });
      }
      
      const defenderUnitType = document.getElementById('defenderUnitType');
      if (defenderUnitType) {
          defenderUnitType.addEventListener('change', function() {
              updateUnits('defender');
          });
      }
      
      const defenderUnit = document.getElementById('defenderUnit');
      if (defenderUnit) {
          defenderUnit.addEventListener('change', function() {
              updateUnitStats('defenderDoctrine', 'defenderUnitType', 'defenderUnit', 'defenderUnitStats');
          });
      }
      
      // Set up add unit buttons
      const addAttackerUnitBtn = document.getElementById('addAttackerUnit');
      if (addAttackerUnitBtn) {
          addAttackerUnitBtn.addEventListener('click', function() {
              addUnitToStack('attacker');
          });
      }
      
      const addDefenderUnitBtn = document.getElementById('addDefenderUnit');
      if (addDefenderUnitBtn) {
          addDefenderUnitBtn.addEventListener('click', function() {
              addUnitToStack('defender');
          });
      }
      
      // Set up clear stack buttons
      const clearAttackerStackBtn = document.getElementById('clearAttackerStack');
      if (clearAttackerStackBtn) {
          clearAttackerStackBtn.addEventListener('click', function() {
              clearStack('attacker');
          });
      }
      
      const clearDefenderStackBtn = document.getElementById('clearDefenderStack');
      if (clearDefenderStackBtn) {
          clearDefenderStackBtn.addEventListener('click', function() {
              clearStack('defender');
          });
      }
      
      // Set up Calculate button
      const calculateBtn = document.getElementById('calculateBtn');
      if (calculateBtn) {
          calculateBtn.addEventListener('click', function() {
              // Check if there are units in both stacks
              if (attackerStack.length === 0 || defenderStack.length === 0) {
                  alert('Please add units to both attacker and defender stacks');
                  return;
              }
              
              // Calculate battle outcome
              calculateBattleOutcome();
              
              // Scroll to battle outcome
              document.getElementById('battle-outcome').scrollIntoView({ behavior: 'smooth' });
          });
      }
      
      // Set up terrain radio buttons
      const terrainRadios = document.querySelectorAll('input[name="terrain"]');
      terrainRadios.forEach(radio => {
          radio.addEventListener('change', function() {
              if (document.getElementById('battle-outcome').style.display === 'block') {
                  calculateBattleOutcome();
              }
          });
      });
      
      // Set up special conditions checkboxes
      const specialConditions = document.querySelectorAll('#entrenchment, #officerBoost');
      specialConditions.forEach(checkbox => {
          checkbox.addEventListener('change', function() {
              if (document.getElementById('battle-outcome').style.display === 'block') {
                  calculateBattleOutcome();
              }
          });
      });
      
      // Hide battle outcome initially
      const battleOutcome = document.getElementById('battle-outcome');
      if (battleOutcome) {
          battleOutcome.style.display = 'none';
      }
      
      // Initialize unit options
      updateUnitOptions('attacker');
      updateUnitOptions('defender');
  });
