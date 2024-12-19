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
  
