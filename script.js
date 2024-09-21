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

// Function For calculating city resources
function ResCalCity() {
    //morale
    var a = parseFloat(document.getElementById("a").value);
    //pop                
    var b = parseFloat(document.getElementById("b").value);
    //state
    var c = parseFloat(document.getElementById("c").value);
    //arm
    var d = parseFloat(document.getElementById("d").value);
    //air base
    var e = parseFloat(document.getElementById("e").value);
    //naval base
    var f = parseFloat(document.getElementById("f").value);
    //custom multiplier
    var g = parseFloat(document.getElementById("g").value);
    var n = parseFloat(document.getElementById("n").value);
    // city number
    var sc = parseFloat(document.getElementById("sc").value);
    var cc = parseFloat(document.getElementById("cc").value);
    var fc = parseFloat(document.getElementById("fc").value);
    var ec = parseFloat(document.getElementById("ec").value);
    var rc = parseFloat(document.getElementById("rc").value);
    //turn Morale to Mulitplier
    var h = ((a / 100) * 0.8) + 0.25
    //turn Arm & Air base & Naval base to Mulitplier
    var i = 1 + (((d * 10) + (e * 5) + ((f - 1) * 5)) * 0.01)
    //turn Population to Multiplier
    if (b >= 5) {
        var j = 1 + ((b - 5) * 0.05)
    } else {
        var j = 1 - ((5 - b) * 0.2)
    }
    //sum of all multiplier
    var k = j * h * i * g * c
    //output display for resources
    document.getElementById("rsoutput-supply").innerText = Math.round(sc * k * 2100);
    document.getElementById("rsoutput-component").innerText = Math.round(cc * k * 1800);
    document.getElementById("rsoutput-fuel").innerText = Math.round(fc * k * 2100);
    document.getElementById("rsoutput-electronic").innerText = Math.round(ec * k * 1500);
    document.getElementById("rsoutput-rare_material").innerText = Math.round(rc * k * 1200);
    //This section is for money production calculation
    //turn arm to flat money rate
    var l = Math.floor(d);
    var valueMap = {
        5: 200,
        4: 185,
        3: 165,
        2: 135,
        1: 100,
        0: 0
    };
    var m = valueMap[l];
    //output display for money & do math for money
    document.getElementById("rsoutput-money").innerText = Math.round(k * 1500) + m;
}

// Function For calculating province resources
function ResCalProvince() {
    //morale
    var o = parseFloat(document.getElementById("o").value);
    //custom multiplier
    var p = parseFloat(document.getElementById("p").value);
    var q = parseFloat(document.getElementById("q").value);
    //turn Morale to Mulitplier
    var r = ((o / 100) * 0.8) + 0.25
    //sum of all multiplier
    var s = p * q * r
    //output display for resources
    ////No local industry
    document.getElementById("rsoutput-supply-p-0").innerText = Math.round(s * 210);
    document.getElementById("rsoutput-component-p-0").innerText = Math.round(s * 180);
    document.getElementById("rsoutput-fuel-p-0").innerText = Math.round(s * 210);
    document.getElementById("rsoutput-electronic-p-0").innerText = Math.round(s * 150);
    document.getElementById("rsoutput-rare_material-p-0").innerText = Math.round(s * 120);
    document.getElementById("rsoutput-money-p").innerText = Math.round(s * 112);
    //// local industry Lv1
    document.getElementById("rsoutput-supply-p-1").innerText = Math.round(s * 210 * 2);
    document.getElementById("rsoutput-component-p-1").innerText = Math.round(s * 180 * 2);
    document.getElementById("rsoutput-fuel-p-1").innerText = Math.round(s * 210 * 2);
    document.getElementById("rsoutput-electronic-p-1").innerText = Math.round(s * 150 * 2);
    document.getElementById("rsoutput-rare_material-p-1").innerText = Math.round(s * 120 * 2);
    //// local industry Lv2
    document.getElementById("rsoutput-supply-p-2").innerText = Math.round(s * 210 * 2.5);
    document.getElementById("rsoutput-component-p-2").innerText = Math.round(s * 180 * 2.5);
    document.getElementById("rsoutput-fuel-p-2").innerText = Math.round(s * 210 * 2.5);
    document.getElementById("rsoutput-electronic-p-2").innerText = Math.round(s * 150 * 2.5);
    document.getElementById("rsoutput-rare_material-p-2").innerText = Math.round(s * 120 * 2.5);
    //// local industry Lv3
    document.getElementById("rsoutput-supply-p-3").innerText = Math.round(s * 210 * 3);
    document.getElementById("rsoutput-component-p-3").innerText = Math.round(s * 180 * 3);
    document.getElementById("rsoutput-fuel-p-3").innerText = Math.round(s * 210 * 3);
    document.getElementById("rsoutput-electronic-p-3").innerText = Math.round(s * 150 * 3);
    document.getElementById("rsoutput-rare_material-p-3").innerText = Math.round(s * 120 * 3);
    //This section is for money production calculation
}