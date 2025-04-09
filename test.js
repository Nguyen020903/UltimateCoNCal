
// Function to scrape all units in the research tree
async function scrapeAllUnits() {
    const allData = {};
    
    // Find all unit elements in the research tree
    const unitElements = document.querySelectorAll(".research_cell_bg deco2-research_cell"); // Adjust selector as needed
    
    for (const unitElement of unitElements) {
      // Click on the unit icon
      unitElement.click();
      
      // Wait for unit selection UI to appear
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find and click the info button
      const infoButton = document.querySelector(".info_button.shared-gui-info_button_small");
      if (infoButton) {
        infoButton.click();
        
        // Wait for details page to load
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Extract data using your existing function
        const unitData = extractUnitData();
        
        // Store in our collection
        if (unitData.basic.name) {
          allData[unitData.basic.name] = unitData;
        }
        
        // Close the details page - find close button and click it
        const closeButton = document.querySelector(".close-button"); // Adjust selector as needed
        if (closeButton) {
          closeButton.click();
        }
        
        // Wait for UI to return to research tree
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Download all unit data as a single JSON file
    downloadJSON(allData, "all_units_data.json");
  }
  
  // Helper function to wait for an element to appear
  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkInterval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(checkInterval);
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }
      }, 100);
    });
  }
  
  // Start scraping all units
  // scrapeAllUnits().catch(err => console.error("Scraping error:", err));