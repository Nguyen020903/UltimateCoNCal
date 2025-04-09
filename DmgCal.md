🔧 FULL DAMAGE CALCULATION SYSTEM — Conflict of Nations
🔢 Step-by-Step Damage Calculation
Step 1: Damage Distribution by Weight
Each unit has a weight value which determines how much damage it absorbs when in a stack.

Formula:

text
Copy
Edit
unit_damage_share = (unit_weight / total_stack_weight) × incoming_damage
Example:
Stack: 1 Air Superiority Fighter (ASF), 4 Strike Fighters (SF)

ASF weight = 10

SF weight = 5 × 4 = 20

Total = 30

ASF takes 10/30 = 33.3%, SFs take 66.7% collectively (16.7% each)

🔁 Step 2: Armor-Type Damage Matching
Each unit deals soft or hard damage. Targets receive:

Soft damage if they're "soft" units (infantry, etc.)

Hard damage if they're "hard" units (vehicles, armor, etc.)

Damage value applied is specific to the armor class of the target.

🎲 Step 3: RNG Application
CoN includes a Random Number Generator (RNG) affecting final damage.

RNG range: 80% to 120%

Final damage = damage × RNG_multiplier

The RNG range tightens toward 100% if your damage greatly exceeds enemy HP.

🚫 Step 4: Overkill Rule
Overkill limits damage to prevent one-hit kills.

You can only deal max ~33% of a unit's HP unless conditions are met.

If your Damage / Target HP ≥ 1.75, you're almost guaranteed to kill.

If Damage / Target HP ≤ 1.12, overkill kicks in and damage is heavily reduced.

🛡️ Damage Modifiers
1. Terrain Modifiers
Some units get bonuses/penalties depending on terrain:

Terrain	Example Effect
Urban/Suburban	+25% defense for Motorized Infantry
Forest/Jungle	Penalties for armored vehicles and artillery
Mountains	Buffs for artillery
Modifiers are always active if the unit is within a matching province.

2. Entrenchment
If a unit is near the province center, it gets -25% damage received

Stack defense improves if inside bunker/combat outpost

3. Officers & Army Boost
Officers give nearby stack bonuses (damage/speed).

Elite Units may also apply boosts to stack.

Boosts apply only to units of compatible type (infantry officer boosts infantry, etc.)

4. Overstacking Penalty
If stack size exceeds the following:

Ground units: 10 max

Naval / Air units: 5 max
→ Exceeding this causes:

Lower damage output

Reduced movement speed

5. Unit HP Scaling
Damage output scales with HP:

damage = base_damage × (current_HP / max_HP)

🧠 Unit Weight Table (for Damage Split)
Infantry
Unit	Weight
Motorized Infantry	3
Mechanized Infantry	7
Marine Infantry	5
Airborne Infantry	5
Special Forces	1
National Guard	4
Armor
Unit	Weight
Combat Recon Vehicle	2
Armored Fighting Vehicle	7
Amphibious Combat Vehicle	6
Main Battle Tank	9
Tank Destroyer	8
Support
Unit	Weight
Towed Artillery	2
Mobile Artillery	6
Multiple Rocket Launcher	6
Mobile AA	4
SAM	3
TDS (Theater Defense)	1
Mobile Radar	1
Air Units
Unit	Weight
Air Superiority Fighter	10
Strike Fighter	5
Stealth Strike Fighter	3
UAV	2
AWACS	1
Heavy Bomber	4
Stealth Bomber	1
Naval Units
Unit	Weight
Corvette	5
Frigate	4
Destroyer	8
Cruiser	5
Aircraft Carrier	2
Attack Submarine	4
Missile Submarine	1
🎯 Ranged Combat Mechanics (Artillery/Ships)
What Counts as Ranged?
Artillery (Towed, Mobile, MRL)

Naval units

Motorized Infantry at Level 6

Some elite/support units

Ranged Combat Rules:
Uses only the unit’s attack stat, not defense.

Units fire from distance without receiving damage.

Must be stationary to fire (takes ~1–2 seconds).

Cooldown is shared by the whole stack.

Hit-and-Run Tactic
Fire artillery → Move away before retaliation.

Use terrain penalties (enemy is slower in your territory).

Stack scouts + AA + radar with artillery for best results.

🧠 Final Implementation Notes
Your calculator or simulator should:

Use weighted damage distribution

Adjust for terrain, entrenchment, officers

Apply HP-based damage scaling

Implement RNG & overkill logic

Identify ranged vs melee and apply attack-only logic to ranged

Penalize overstacked stacks