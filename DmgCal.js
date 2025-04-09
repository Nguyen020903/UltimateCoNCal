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
  
  // Unit Class Definition
  class Unit {
    constructor(name, type, baseStats, terrainModifiers) {
      this.name = name; // Unit name
      this.type = type; // infantry, tank, aircraft, etc.
      this.baseStats = { ...baseStats }; // { atk, def, speed, hp, sight }
      this.terrainModifiers = { ...terrainModifiers }; // { plains, forest, mountains, etc. }
      this.upgradeLevel = 0; // Tracks upgrades
    }
  
    // Apply an upgrade to boost stats
    upgrade() {
      this.upgradeLevel++;
      for (const stat in this.baseStats) {
        this.baseStats[stat] *= 1.1; // 10% improvement per upgrade
      }
    }
  
    // Calculate effective stats based on terrain and doctrine
    getEffectiveStats(terrain, doctrine) {
      const terrainModifier = this.terrainModifiers[terrain] || 0;
      const doctrineEffects = doctrines[doctrine]?.[this.name] || { flat: {}, percent: {} };
      const effectiveStats = {};
  
      for (const stat in this.baseStats) {
        const baseStat = this.baseStats[stat];
        const flatModifier = doctrineEffects.flat[stat] || 0;
        const percentModifier = (doctrineEffects.percent[stat] || 0) / 100;
        const terrainEffect = baseStat * (terrainModifier / 100);
  
        // Final stat = baseStat + terrain effect + flat modifier + percentage-based modifier
        effectiveStats[stat] =
          baseStat + terrainEffect + flatModifier + baseStat * percentModifier;
      }
  
      return effectiveStats;
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
    addUnit(unit, count) {
      this.units.push({ unit, count });
    }
  
    // Calculate total stats for the composition
    calculateTotalStats(terrain) {
      const totalStats = { atk: 0, def: 0, speed: 0, hp: 0, sight: 0 };
      this.units.forEach(({ unit, count }) => {
        const effectiveStats = unit.getEffectiveStats(terrain, this.doctrine);
        for (const stat in effectiveStats) {
          totalStats[stat] += effectiveStats[stat] * count;
        }
      });
      return totalStats;
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
      urban: { attackMod: 0.75, defenseMod: 1.5 },
      plains: { attackMod: 1.0, defenseMod: 1.0 },
      forest: { attackMod: 0.8, defenseMod: 1.3 },
      desert: { attackMod: 1.1, defenseMod: 0.9 },
      mountains: { attackMod: 0.7, defenseMod: 1.8 },
      jungle: { attackMod: 0.6, defenseMod: 1.6 },
      water: { attackMod: 1.0, defenseMod: 1.0 }
  };
  
  // Weather modifiers
  const weatherModifiers = {
      clear: { attackMod: 1.0, defenseMod: 1.0 },
      rain: { attackMod: 0.9, defenseMod: 1.1 },
      snow: { attackMod: 0.8, defenseMod: 1.2 },
      sandstorm: { attackMod: 0.7, defenseMod: 1.3 }
  };
  
  // Time of day modifiers
  const timeModifiers = {
      day: { attackMod: 1.0, defenseMod: 1.0 },
      night: { attackMod: 0.8, defenseMod: 1.1 }
  };
  
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
      
      const doctrine = doctrineSelect.value;
      const unitType = unitTypeSelect.value;
      const unitId = unitSelect.value;

      // Clear existing stats
      unitStats.innerHTML = '';

      // Display unit stats
      if (doctrine && unitType && unitId) {
          const unit = unitData[doctrine][unitType].find(u => u.id === unitId);
          
          if (unit) {
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
  }

  // Function to calculate unit power based on quantity and stats
  function calculateUnitPower(doctrineId, unitTypeId, unitId, quantityId, isAttacker) {
      const doctrineSelect = document.getElementById(doctrineId);
      const unitTypeSelect = document.getElementById(unitTypeId);
      const unitSelect = document.getElementById(unitId);
      const quantityInput = document.getElementById(quantityId);
      
      const doctrine = doctrineSelect.value;
      const unitType = unitTypeSelect.value;
      const unitId = unitSelect.value;
      const quantity = parseInt(quantityInput.value) || 0;
      
      let power = 0;
      
      if (doctrine && unitType && unitId && quantity > 0) {
          const unit = unitData[doctrine][unitType].find(u => u.id === unitId);
          
          if (unit) {
              // Use attack value for attacker, defense for defender
              const statValue = isAttacker ? unit.attack : unit.defense;
              power = statValue * quantity;
          }
      }
      
      return power;
  }

  // Function to calculate total power with modifiers
  function calculateTotalPower(basePower, terrain, weather, timeOfDay, isAttacker) {
      const terrainMod = isAttacker ? terrainModifiers[terrain].attackMod : terrainModifiers[terrain].defenseMod;
      const weatherMod = isAttacker ? weatherModifiers[weather].attackMod : weatherModifiers[weather].defenseMod;
      const timeMod = isAttacker ? timeModifiers[timeOfDay].attackMod : timeModifiers[timeOfDay].defenseMod;
      
      return basePower * terrainMod * weatherMod * timeMod;
  }

  // Function to update unit options based on doctrine
  function updateUnitOptions(side) {
      // Get the doctrine value
      const doctrine = document.getElementById(`${side}Doctrine`).value;
      
      // Get the unit type select element
      const unitTypeSelect = document.getElementById(`${side}UnitType`);
      
      // Clear existing options
      unitTypeSelect.innerHTML = '<option value="">Select Unit Type</option>';
      
      // Add unit type options from the unitData structure
      Object.keys(unitData[doctrine]).forEach(unitType => {
          const option = document.createElement('option');
          option.value = unitType;
          // Capitalize the first letter of each unit type
          option.textContent = unitType.charAt(0).toUpperCase() + unitType.slice(1);
          unitTypeSelect.appendChild(option);
      });
      
      // Clear unit selection since unit type has changed
      document.getElementById(`${side}Unit`).innerHTML = '<option value="">Select Unit</option>';
      
      // Clear unit stats
      document.getElementById(`${side}UnitStats`).innerHTML = '';
  }
  
  // Function to handle unit type selection and update units
  function updateUnits(side) {
      // Get the selected doctrine and unit type
      const doctrine = document.getElementById(`${side}Doctrine`).value;
      const unitType = document.getElementById(`${side}UnitType`).value;
      
      // Get the unit select element
      const unitSelect = document.getElementById(`${side}Unit`);
      
      // Clear existing options
      unitSelect.innerHTML = '<option value="">Select Unit</option>';
      
      // If a unit type is selected, add the corresponding units
      if (unitType && unitData[doctrine] && unitData[doctrine][unitType]) {
          // Get the unit object for this doctrine and unit type
          const unitTypeObj = unitData[doctrine][unitType];
          
          // Iterate through each unit and add as an option
          Object.keys(unitTypeObj).forEach(key => {
              const unit = unitTypeObj[key];
              const option = document.createElement('option');
              option.value = unit.id;
              option.textContent = unit.name;
              unitSelect.appendChild(option);
          });
      }
      
      // Clear unit stats
      document.getElementById(`${side}UnitStats`).innerHTML = '';
  }

  // Helper functions to get modifiers based on conditions
  function getTerrainModifier(terrain, attackerType, defenderType) {
      // Default to the standard attack modifier if no specific type modifiers
      return terrainModifiers[terrain].attackMod;
  }
  
  function getWeatherModifier(weather, attackerType, defenderType) {
      // Default to the standard weather modifier if no specific type modifiers
      return weatherModifiers[weather].attackMod;
  }
  
  function getTimeModifier(timeOfDay, attackerType, defenderType) {
      // Default to the standard time modifier if no specific type modifiers
      return timeModifiers[timeOfDay].attackMod;
  }

  // Function to update battle outcome
  function updateBattleOutcome() {
      // Get selected terrain, weather, and time of day
      const terrain = document.querySelector('input[name="terrain"]:checked').value;
      const weather = document.querySelector('input[name="weather"]:checked').value;
      const timeOfDay = document.querySelector('input[name="time"]:checked').value;
      
      // Calculate base power for attacker and defender
      const attackerBasePower = calculateUnitPower('attackerDoctrine', 'attackerUnitType', 'attackerUnit', 'attackerQuantity', true);
      const defenderBasePower = calculateUnitPower('defenderDoctrine', 'defenderUnitType', 'defenderUnit', 'defenderQuantity', false);
      
      // Apply modifiers
      const totalAttackerPower = calculateTotalPower(attackerBasePower, terrain, weather, timeOfDay, true);
      const totalDefenderPower = calculateTotalPower(defenderBasePower, terrain, weather, timeOfDay, false);
      
      // Update power values in the UI
      document.getElementById('attacker-power').textContent = totalAttackerPower.toFixed(1);
      document.getElementById('defender-power').textContent = totalDefenderPower.toFixed(1);
      
      // Update modifiers in the UI
      document.getElementById('terrain-modifier').textContent = 
          `A: ${terrainModifiers[terrain].attackMod.toFixed(2)} / D: ${terrainModifiers[terrain].defenseMod.toFixed(2)}`;
      
      document.getElementById('weather-modifier').textContent = 
          `A: ${weatherModifiers[weather].attackMod.toFixed(2)} / D: ${weatherModifiers[weather].defenseMod.toFixed(2)}`;
      
      document.getElementById('time-modifier').textContent = 
          `A: ${timeModifiers[timeOfDay].attackMod.toFixed(2)} / D: ${timeModifiers[timeOfDay].defenseMod.toFixed(2)}`;
      
      // Determine outcome
      const outcomeHeader = document.getElementById('outcomeHeader');
      const outcomeText = document.getElementById('outcomeText');
      
      if (totalAttackerPower > totalDefenderPower) {
          outcomeHeader.textContent = 'Victory for Attacker';
          outcomeHeader.className = 'outcome-header victory';
          outcomeText.textContent = `The attacker has a ${((totalAttackerPower / totalDefenderPower) * 100 - 100).toFixed(1)}% power advantage.`;
      } else if (totalDefenderPower > totalAttackerPower) {
          outcomeHeader.textContent = 'Victory for Defender';
          outcomeHeader.className = 'outcome-header defeat';
          outcomeText.textContent = `The defender has a ${((totalDefenderPower / totalAttackerPower) * 100 - 100).toFixed(1)}% power advantage.`;
      } else {
          outcomeHeader.textContent = 'Stalemate';
          outcomeHeader.className = 'outcome-header stalemate';
          outcomeText.textContent = 'The forces are evenly matched.';
      }
  }

  // Function to initialize event listeners
  function initializeCalculator() {
      // Doctrine change events
      document.getElementById('attackerDoctrine').addEventListener('change', function() {
          updateUnitOptions('attacker');
      });
      
      document.getElementById('defenderDoctrine').addEventListener('change', function() {
          updateUnitOptions('defender');
      });
      
      // Unit type change events
      document.getElementById('attackerUnitType').addEventListener('change', function() {
          updateUnits('attacker');
      });
      
      document.getElementById('defenderUnitType').addEventListener('change', function() {
          updateUnits('defender');
      });
      
      // Unit selection change events
      document.getElementById('attackerUnit').addEventListener('change', function() {
          updateUnitStats('attackerDoctrine', 'attackerUnitType', 'attackerUnit', 'attackerUnitStats');
      });
      
      document.getElementById('defenderUnit').addEventListener('change', function() {
          updateUnitStats('defenderDoctrine', 'defenderUnitType', 'defenderUnit', 'defenderUnitStats');
      });
      
      // Quantity change events
      document.getElementById('attackerQuantity').addEventListener('input', updateBattleOutcome);
      document.getElementById('defenderQuantity').addEventListener('input', updateBattleOutcome);
      
      // Battle condition change events
      document.querySelectorAll('input[name="terrain"], input[name="weather"], input[name="time"]').forEach(input => {
          input.addEventListener('change', updateBattleOutcome);
      });
      
      // Add calculate button event listener if it exists
      const calculateButton = document.getElementById('calculate-button');
      if (calculateButton) {
          calculateButton.addEventListener('click', calculateBattle);
      }
      
      // Initialize unit options for both sides
      updateUnitOptions('attacker');
      updateUnitOptions('defender');
  }

  // Initialize the calculator when the DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
      initializeCalculator();
  });

  // Function to calculate battle outcome when button is clicked
  function calculateBattle() {
      // Just call updateBattleOutcome which already has all the logic
      updateBattleOutcome();
      
      // Show a more detailed view in the battle-outcome div
      const battleOutcomeElement = document.getElementById('battle-outcome');
      if (battleOutcomeElement) {
          const attackerUnit = document.getElementById('attackerUnit').options[document.getElementById('attackerUnit').selectedIndex].text;
          const defenderUnit = document.getElementById('defenderUnit').options[document.getElementById('defenderUnit').selectedIndex].text;
          const attackerPower = document.getElementById('attacker-power').textContent;
          const defenderPower = document.getElementById('defender-power').textContent;
          
          battleOutcomeElement.innerHTML = `
              <h3>Battle Analysis</h3>
              <p>${attackerUnit} (Power: ${attackerPower}) vs ${defenderUnit} (Power: ${defenderPower})</p>
              <p>For a more detailed analysis, please check the power comparison above.</p>
          `;
      }
  }
