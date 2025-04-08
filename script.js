// Attach event listeners to inputs For calculating city resources
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("a").addEventListener("input", ResCalCity);
    document.getElementById("b").addEventListener("input", ResCalCity);
    document.getElementById("c").addEventListener("input", ResCalCity);
    document.getElementById("d").addEventListener("input", ResCalCity);
    document.getElementById("e").addEventListener("input", ResCalCity);
    document.getElementById("f").addEventListener("input", ResCalCity);
    document.getElementById("g").addEventListener("input", ResCalCity);
    document.getElementById("n").addEventListener("input", ResCalCity);
    document.getElementById("sc").addEventListener("input", ResCalCity); // Supply city
    document.getElementById("cc").addEventListener("input", ResCalCity); // Component city
    document.getElementById("fc").addEventListener("input", ResCalCity); // Fuel city
    document.getElementById("ec").addEventListener("input", ResCalCity); // Electronic city
    document.getElementById("rc").addEventListener("input", ResCalCity); // Rare material city

    //for province cal
    document.getElementById("o").addEventListener("input", ResCalProvince);
    document.getElementById("p").addEventListener("input", ResCalProvince);
    document.getElementById("q").addEventListener("input", ResCalProvince);
});

// Resource Calculator Functions

/**
 * Calculate city resources based on input parameters
 */
function ResCalCity() {
    // Get input values
    const gameMode = parseFloat(document.getElementById("g").value);
    const morale = parseFloat(document.getElementById("a").value) / 100;
    const population = parseFloat(document.getElementById("b").value);
    const cityState = parseFloat(document.getElementById("c").value);
    const armsIndustry = parseFloat(document.getElementById("d").value);
    const airBase = parseFloat(document.getElementById("e").value);
    const navalBase = parseFloat(document.getElementById("f").value);
    
    // Get city counts
    const supplyCount = parseInt(document.getElementById("sc").value);
    const componentCount = parseInt(document.getElementById("cc").value);
    const fuelCount = parseInt(document.getElementById("fc").value);
    const electronicCount = parseInt(document.getElementById("ec").value);
    const rareMaterialCount = parseInt(document.getElementById("rc").value);

    // Base resource values per city
    let baseResources = {
        supply: 243,
        component: 208,
        fuel: 243,
        electronic: 173,
        rareMaterial: 139,
        money: 173
    };

    // Calculate city multiplier based on morale, population and city state
    let cityMultiplier = morale * population * cityState;
    
    // Calculate industry multipliers
    let industryMultipliers = {
        // Arms industry affects supply and components
        supply: 1 + (armsIndustry * 0.2),
        component: 1 + (armsIndustry * 0.2),
        // Air base affects fuel and electronics
        fuel: 1 + (airBase * 0.2),
        electronic: 1 + (airBase * 0.2),
        // Naval base affects rare materials
        rareMaterial: 1 + (navalBase * 0.2),
        // Money is not affected by bases
        money: 1
    };
    
    // Calculate total resource production (apply game mode, multipliers, and city count)
    let totalResources = {
        supply: Math.round(baseResources.supply * cityMultiplier * industryMultipliers.supply * supplyCount * gameMode),
        component: Math.round(baseResources.component * cityMultiplier * industryMultipliers.component * componentCount * gameMode),
        fuel: Math.round(baseResources.fuel * cityMultiplier * industryMultipliers.fuel * fuelCount * gameMode),
        electronic: Math.round(baseResources.electronic * cityMultiplier * industryMultipliers.electronic * electronicCount * gameMode),
        rareMaterial: Math.round(baseResources.rareMaterial * cityMultiplier * industryMultipliers.rareMaterial * rareMaterialCount * gameMode),
        money: Math.round(baseResources.money * cityMultiplier * gameMode)
    };
    
    // Update output display
    document.getElementById("rsoutput-supply").textContent = totalResources.supply;
    document.getElementById("rsoutput-component").textContent = totalResources.component;
    document.getElementById("rsoutput-fuel").textContent = totalResources.fuel;
    document.getElementById("rsoutput-electronic").textContent = totalResources.electronic;
    document.getElementById("rsoutput-rare_material").textContent = totalResources.rareMaterial;
    document.getElementById("rsoutput-money").textContent = totalResources.money;
}

/**
 * Calculate province resources based on input parameters
 */
function ResCalProvince() {
    // Get input values
    const morale = parseFloat(document.getElementById("o").value) / 100;
    const gameMode = parseFloat(document.getElementById("p").value);
    const provinceCount = parseFloat(document.getElementById("q").value);
    
    // Base resource values per province for different industry levels
    const baseResourcesPerIndustryLevel = [
        // No local industry
        {
            supply: 24.5,
            component: 21,
            fuel: 24.5,
            electronic: 17.5,
            rareMaterial: 14,
            money: 13
        },
        // Local industry Lv.1
        {
            supply: 49,
            component: 42,
            fuel: 49,
            electronic: 35,
            rareMaterial: 28,
            money: 13
        },
        // Local industry Lv.2
        {
            supply: 61,
            component: 52,
            fuel: 61,
            electronic: 43.5,
            rareMaterial: 34.5,
            money: 13
        }
    ];

    // Calculate and update for each industry level
    for (let level = 0; level < 3; level++) {
        const resources = baseResourcesPerIndustryLevel[level];
        
        // Apply morale, game mode multiplier and province count
        document.getElementById(`rsoutput-supply-p-${level}`).textContent = 
            Math.round(resources.supply * morale * gameMode * provinceCount);
            
        document.getElementById(`rsoutput-component-p-${level}`).textContent = 
            Math.round(resources.component * morale * gameMode * provinceCount);
            
        document.getElementById(`rsoutput-fuel-p-${level}`).textContent = 
            Math.round(resources.fuel * morale * gameMode * provinceCount);
            
        document.getElementById(`rsoutput-electronic-p-${level}`).textContent = 
            Math.round(resources.electronic * morale * gameMode * provinceCount);
            
        document.getElementById(`rsoutput-rare_material-p-${level}`).textContent = 
            Math.round(resources.rareMaterial * morale * gameMode * provinceCount);
    }
    
    // Money is the same across all tabs
    document.getElementById("rsoutput-money-p").textContent = 
        Math.round(baseResourcesPerIndustryLevel[0].money * morale * gameMode * provinceCount);
}

// Tab handling
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Hide all elements with class="tabcontent"
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Default tab open
window.onload = function () {
    document.getElementById("defaultOpen").click();
};