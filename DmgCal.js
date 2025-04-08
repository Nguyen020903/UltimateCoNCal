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
  
  // Unit data structure
  const unitData = {
      western: {
          infantry: {
              basic: {
                  name: "Basic Infantry",
                  attack: 10,
                  defense: 8,
                  hp: 100,
                  speed: 5,
                  cost: 100
              },
              advanced: {
                  name: "Advanced Infantry",
                  attack: 15,
                  defense: 12,
                  hp: 120,
                  speed: 6,
                  cost: 150
              }
          },
          armored: {
              basic: {
                  name: "Basic Tank",
                  attack: 20,
                  defense: 15,
                  hp: 150,
                  speed: 8,
                  cost: 200
              },
              advanced: {
                  name: "Advanced Tank",
                  attack: 25,
                  defense: 20,
                  hp: 180,
                  speed: 9,
                  cost: 250
              }
          }
      },
      eastern: {
          infantry: {
              basic: {
                  name: "Basic Infantry",
                  attack: 12,
                  defense: 6,
                  hp: 90,
                  speed: 6,
                  cost: 90
              },
              advanced: {
                  name: "Advanced Infantry",
                  attack: 18,
                  defense: 10,
                  hp: 110,
                  speed: 7,
                  cost: 140
              }
          },
          armored: {
              basic: {
                  name: "Basic Tank",
                  attack: 22,
                  defense: 13,
                  hp: 140,
                  speed: 9,
                  cost: 190
              },
              advanced: {
                  name: "Advanced Tank",
                  attack: 28,
                  defense: 18,
                  hp: 170,
                  speed: 10,
                  cost: 240
              }
          }
      }
  };
  
  // Terrain modifiers
  const terrainModifiers = {
      plains: {
          attack: 1.0,
          defense: 1.0,
          speed: 1.0
      },
      forest: {
          attack: 0.8,
          defense: 1.2,
          speed: 0.7
      },
      mountains: {
          attack: 0.7,
          defense: 1.3,
          speed: 0.5
      },
      urban: {
          attack: 0.9,
          defense: 1.4,
          speed: 0.8
      }
  };
  
  // Weather modifiers
  const weatherModifiers = {
      clear: {
          attack: 1.0,
          defense: 1.0,
          speed: 1.0
      },
      rain: {
          attack: 0.9,
          defense: 1.0,
          speed: 0.8
      },
      snow: {
          attack: 0.8,
          defense: 1.0,
          speed: 0.6
      },
      storm: {
          attack: 0.7,
          defense: 0.9,
          speed: 0.5
      }
  };
  
  // Time of day modifiers
  const timeModifiers = {
      day: {
          attack: 1.0,
          defense: 1.0,
          speed: 1.0
      },
      night: {
          attack: 0.8,
          defense: 1.2,
          speed: 0.9
      }
  };
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', () => {
      // Populate doctrine selectors
      const doctrines = Object.keys(unitData);
      const attackerDoctrine = document.getElementById('attacker-doctrine');
      const defenderDoctrine = document.getElementById('defender-doctrine');
      
      doctrines.forEach(doctrine => {
          attackerDoctrine.add(new Option(doctrine.charAt(0).toUpperCase() + doctrine.slice(1), doctrine));
          defenderDoctrine.add(new Option(doctrine.charAt(0).toUpperCase() + doctrine.slice(1), doctrine));
      });
  
      // Add event listeners
      attackerDoctrine.addEventListener('change', () => updateUnitOptions('attacker'));
      defenderDoctrine.addEventListener('change', () => updateUnitOptions('defender'));
      
      document.getElementById('attacker-unit').addEventListener('change', () => updateUnitStats('attacker'));
      document.getElementById('defender-unit').addEventListener('change', () => updateUnitStats('defender'));
      
      document.getElementById('attacker-quantity').addEventListener('input', calculateBattleOutcome);
      document.getElementById('defender-quantity').addEventListener('input', calculateBattleOutcome);
      
      document.querySelectorAll('input[name="terrain"]').forEach(input => {
          input.addEventListener('change', calculateBattleOutcome);
      });
      
      document.querySelectorAll('input[name="weather"]').forEach(input => {
          input.addEventListener('change', calculateBattleOutcome);
      });
      
      document.querySelectorAll('input[name="time"]').forEach(input => {
          input.addEventListener('change', calculateBattleOutcome);
      });
  
      // Initialize unit options
      updateUnitOptions('attacker');
      updateUnitOptions('defender');
  });
  
  // Update unit options based on selected doctrine
  function updateUnitOptions(side) {
      const doctrine = document.getElementById(`${side}-doctrine`).value;
      const unitSelect = document.getElementById(`${side}-unit`);
      unitSelect.innerHTML = '';
      
      Object.keys(unitData[doctrine]).forEach(type => {
          const group = document.createElement('optgroup');
          group.label = type.charAt(0).toUpperCase() + type.slice(1);
          
          Object.keys(unitData[doctrine][type]).forEach(level => {
              const unit = unitData[doctrine][type][level];
              const option = new Option(unit.name, `${type}-${level}`);
              group.appendChild(option);
          });
          
          unitSelect.appendChild(group);
      });
      
      updateUnitStats(side);
  }
  
  // Update unit stats display
  function updateUnitStats(side) {
      const doctrine = document.getElementById(`${side}-doctrine`).value;
      const unitType = document.getElementById(`${side}-unit`).value;
      const [type, level] = unitType.split('-');
      const unit = unitData[doctrine][type][level];
      
      const statsContainer = document.getElementById(`${side}-stats`);
      statsContainer.innerHTML = `
          <div class="stat-row">
              <span class="stat-label">Attack:</span>
              <span class="stat-value">${unit.attack}</span>
          </div>
          <div class="stat-row">
              <span class="stat-label">Defense:</span>
              <span class="stat-value">${unit.defense}</span>
          </div>
          <div class="stat-row">
              <span class="stat-label">HP:</span>
              <span class="stat-value">${unit.hp}</span>
          </div>
          <div class="stat-row">
              <span class="stat-label">Speed:</span>
              <span class="stat-value">${unit.speed}</span>
          </div>
      `;
      
      calculateBattleOutcome();
  }
  
  // Calculate battle outcome
  function calculateBattleOutcome() {
      const attacker = getUnitData('attacker');
      const defender = getUnitData('defender');
      
      const terrain = document.querySelector('input[name="terrain"]:checked').value;
      const weather = document.querySelector('input[name="weather"]:checked').value;
      const time = document.querySelector('input[name="time"]:checked').value;
      
      // Apply modifiers
      const attackerModifiers = {
          attack: terrainModifiers[terrain].attack * weatherModifiers[weather].attack * timeModifiers[time].attack,
          defense: terrainModifiers[terrain].defense * weatherModifiers[weather].defense * timeModifiers[time].defense,
          speed: terrainModifiers[terrain].speed * weatherModifiers[weather].speed * timeModifiers[time].speed
      };
      
      const defenderModifiers = {
          attack: terrainModifiers[terrain].attack * weatherModifiers[weather].attack * timeModifiers[time].attack,
          defense: terrainModifiers[terrain].defense * weatherModifiers[weather].defense * timeModifiers[time].defense,
          speed: terrainModifiers[terrain].speed * weatherModifiers[weather].speed * timeModifiers[time].speed
      };
      
      // Calculate effective stats
      const attackerEffective = {
          attack: attacker.attack * attackerModifiers.attack,
          defense: attacker.defense * attackerModifiers.defense,
          hp: attacker.hp,
          speed: attacker.speed * attackerModifiers.speed
      };
      
      const defenderEffective = {
          attack: defender.attack * defenderModifiers.attack,
          defense: defender.defense * defenderModifiers.defense,
          hp: defender.hp,
          speed: defender.speed * defenderModifiers.speed
      };
      
      // Calculate battle outcome
      const attackerPower = (attackerEffective.attack + attackerEffective.defense) * attackerEffective.speed;
      const defenderPower = (defenderEffective.attack + defenderEffective.defense) * defenderEffective.speed;
      
      const attackerQuantity = parseInt(document.getElementById('attacker-quantity').value);
      const defenderQuantity = parseInt(document.getElementById('defender-quantity').value);
      
      const totalAttackerPower = attackerPower * attackerQuantity;
      const totalDefenderPower = defenderPower * defenderQuantity;
      
      // Determine outcome
      let outcome;
      let outcomeClass;
      
      if (totalAttackerPower > totalDefenderPower * 1.2) {
          outcome = "Victory";
          outcomeClass = "victory";
      } else if (totalDefenderPower > totalAttackerPower * 1.2) {
          outcome = "Defeat";
          outcomeClass = "defeat";
      } else {
          outcome = "Stalemate";
          outcomeClass = "stalemate";
      }
      
      // Update outcome display
      const outcomeHeader = document.querySelector('.outcome-header');
      outcomeHeader.className = `outcome-header ${outcomeClass}`;
      outcomeHeader.innerHTML = `<h3>${outcome}</h3>`;
      
      // Update outcome details
      document.getElementById('attacker-power').textContent = Math.round(totalAttackerPower);
      document.getElementById('defender-power').textContent = Math.round(totalDefenderPower);
      
      // Update modifiers display
      document.getElementById('terrain-modifier').textContent = `${(terrainModifiers[terrain].attack * 100).toFixed(0)}%`;
      document.getElementById('weather-modifier').textContent = `${(weatherModifiers[weather].attack * 100).toFixed(0)}%`;
      document.getElementById('time-modifier').textContent = `${(timeModifiers[time].attack * 100).toFixed(0)}%`;
  }
  
  // Get unit data for calculations
  function getUnitData(side) {
      const doctrine = document.getElementById(`${side}-doctrine`).value;
      const unitType = document.getElementById(`${side}-unit`).value;
      const [type, level] = unitType.split('-');
      return unitData[doctrine][type][level];
  }
