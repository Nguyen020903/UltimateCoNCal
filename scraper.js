// Function to extract unit data from the current page
function extractUnitData() {
    // Initialize the data object
    const unitData = {
      basic: {},
      costs: {},
      upkeep: {},
      features: [],
      combatProperties: {
        attack: {},
        defense: {},
        attackRange: {},
        radarRange: {}
      },
      terrain: {
        attackModifiers: {},
        defenseModifiers: {},
        speedValues: {},
        hitPoints: {},
        sightRange: {}
      }
    };
    
    // Helper function to find cells by text content
    function findCellByText(text) {
      let result = null;
      document.querySelectorAll('td').forEach(cell => {
        if (cell.textContent.trim() === text) {
          result = cell;
        }
      });
      return result;
    }
    
    // Extract basic unit information
    unitData.basic.name = document.querySelector(".units_details_header h2")?.textContent.trim() || "";
    unitData.basic.description = document.querySelector(".unit_description")?.textContent.trim() || "";
    
    // Find mobilization time
    const mobilizationCell = findCellByText("Mobilization Time");
    if (mobilizationCell && mobilizationCell.nextElementSibling) {
      unitData.basic.mobilizationTime = mobilizationCell.nextElementSibling.textContent.trim();
    }
    
    // Extract requirements
    const requirements = [];
    document.querySelectorAll(".construction-tooltip-requirements div").forEach(req => {
      const text = req.textContent.trim();
      if (text) requirements.push(text);
    });
    unitData.basic.requirements = requirements;
    
    // Extract costs
    const costsCell = findCellByText("Costs");
    if (costsCell && costsCell.nextElementSibling) {
      costsCell.nextElementSibling.querySelectorAll(".cost_item").forEach(costItem => {
        const resourceClass = costItem.querySelector(".costs_resource").className;
        const resourceType = resourceClass.match(/icons-resource_(\d+)/)?.[1] || "";
        const amount = costItem.querySelector(".costs_amount").textContent.trim().replace(/,/g, '');
        if (resourceType) {
          unitData.costs[`resource_${resourceType}`] = parseInt(amount, 10);
        }
      });
    }
    
    // Extract daily upkeep
    const upkeepCell = findCellByText("Daily Upkeep");
    if (upkeepCell && upkeepCell.nextElementSibling) {
      upkeepCell.nextElementSibling.querySelectorAll(".cost_item").forEach(upkeepItem => {
        const resourceClass = upkeepItem.querySelector(".costs_resource").className;
        const resourceType = resourceClass.match(/icons-resource_(\d+)/)?.[1] || "";
        const amount = upkeepItem.querySelector(".costs_amount").textContent.trim();
        if (resourceType) {
          unitData.upkeep[`resource_${resourceType}`] = parseInt(amount, 10);
        }
      });
    }
    
    // Extract features
    document.querySelectorAll(".unit_specials_container .upgrade_value").forEach(feature => {
      const tooltipText = feature.querySelector(".func_simple_tooltip")?.getAttribute("data-simple-tooltip-text") || "";
      const featureMatch = tooltipText.match(/<p class="title">\s*(.*?)\s*<\/p>/);
      if (featureMatch) {
        unitData.features.push(featureMatch[1].trim());
      }
    });
    
    // Extract combat properties
    // Get attackTypes first
    const attackTypes = [];
    document.querySelectorAll("#strength_table tr:first-child td:not(:first-child) .inline_icon").forEach(icon => {
      const attackTypeClass = icon.className;
      const attackTypeMatch = attackTypeClass.match(/icons-unit_info_damage_(\d+)/);
      if (attackTypeMatch) {
        attackTypes.push(attackTypeMatch[1]);
      }
    });
    
    // ATK Rating
    let atkCells = [];
    document.querySelectorAll(".atk_rating td").forEach((cell, idx) => {
      if (idx > 0) atkCells.push(cell);  // Skip the label cell
    });
    
    atkCells.forEach((cell, index) => {
      const value = cell.textContent.trim();
      if (value && attackTypes[index]) {
        unitData.combatProperties.attack[`type_${attackTypes[index]}`] = parseFloat(value);
      }
    });
    
    // DEF Rating
    let defCells = [];
    document.querySelectorAll(".def_rating td").forEach((cell, idx) => {
      if (idx > 0) defCells.push(cell);  // Skip the label cell
    });
    
    defCells.forEach((cell, index) => {
      const value = cell.textContent.trim();
      if (value && attackTypes[index]) {
        unitData.combatProperties.defense[`type_${attackTypes[index]}`] = parseFloat(value);
      }
    });
    
    // Extract terrain information
    // Get terrain types
    const terrainTypes = [];
    document.querySelectorAll(".terrain_effects tbody tr:first-child td:not(:first-child) .func_terrain_tooltip").forEach(terrain => {
      const terrainId = terrain.getAttribute("data-terrain-type-id");
      if (terrainId) {
        terrainTypes.push(terrainId);
      }
    });
    
    // Helper function to find a row by text in first cell
    function findRowByFirstCellText(table, text) {
      let result = null;
      table.querySelectorAll("tr").forEach(row => {
        const firstCell = row.querySelector("td");
        if (firstCell && firstCell.textContent.trim() === text) {
          result = row;
        }
      });
      return result;
    }
    
    const terrainTable = document.querySelector(".terrain_effects");
    
    // Attack modifiers
    const attackModRow = findRowByFirstCellText(terrainTable, "Attack Mod.");
    if (attackModRow) {
      const cells = attackModRow.querySelectorAll("td:not(:first-child)");
      cells.forEach((cell, index) => {
        const value = cell.textContent.trim();
        if (value && terrainTypes[index]) {
          unitData.terrain.attackModifiers[`terrain_${terrainTypes[index]}`] = value;
        }
      });
    }
    
    // Defense modifiers
    const defenseModRow = findRowByFirstCellText(terrainTable, "Defense Mod.");
    if (defenseModRow) {
      const cells = defenseModRow.querySelectorAll("td:not(:first-child)");
      cells.forEach((cell, index) => {
        const value = cell.textContent.trim();
        if (value && terrainTypes[index]) {
          unitData.terrain.defenseModifiers[`terrain_${terrainTypes[index]}`] = value;
        }
      });
    }
    
    // Speed values
    const speedRow = findRowByFirstCellText(terrainTable, "Speed Val.");
    if (speedRow) {
      const cells = speedRow.querySelectorAll("td:not(:first-child)");
      cells.forEach((cell, index) => {
        const value = cell.textContent.trim();
        if (value && terrainTypes[index]) {
          unitData.terrain.speedValues[`terrain_${terrainTypes[index]}`] = parseFloat(value);
        }
      });
    }
    
    // Hit points
    const hitPointsRow = findRowByFirstCellText(terrainTable, "Hit Points");
    if (hitPointsRow) {
      const cells = hitPointsRow.querySelectorAll("td:not(:first-child)");
      cells.forEach((cell, index) => {
        const value = cell.textContent.trim();
        if (value && terrainTypes[index]) {
          unitData.terrain.hitPoints[`terrain_${terrainTypes[index]}`] = parseInt(value, 10);
        }
      });
    }
    
    // Sight range
    const sightRangeRow = findRowByFirstCellText(terrainTable, "Sight Range");
    if (sightRangeRow) {
      const cells = sightRangeRow.querySelectorAll("td:not(:first-child)");
      cells.forEach((cell, index) => {
        const value = cell.textContent.trim();
        if (value && terrainTypes[index]) {
          unitData.terrain.sightRange[`terrain_${terrainTypes[index]}`] = parseInt(value, 10);
        }
      });
    }
    
    return unitData;
  }
  
  // Function to download JSON data
  function downloadJSON(data, filename = "unit_data.json") {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
  
  // Extract and download the unit data
  const unitData = extractUnitData();
  const unitName = unitData.basic.name.replace(/[\s()]/g, '_').toLowerCase();
  downloadJSON(unitData, `${unitName}.json`);
  
  // Also display the data in console for inspection
  console.log("Unit data extracted:", unitData);