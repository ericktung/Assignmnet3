
let game_state = {}
  game_state.soldiers = 23000;
  game_state.dead = 0;
  game_state.reports = ["No battles have occured"];
  game_state.allignment = 256;

function render_game_state(gs){
  document.getElementById("soldiercount").innerHTML = gs.soldiers
  document.getElementById("deadcount").innerHTML = gs.dead
  gs.allignment = Math.round((gs.soldiers - gs.dead) / (gs.soldiers + gs.dead) * 256);
  if (gs.allignment < 0) gs.allignment = 0;
  let av = gs.allignment.toString(16);
  if (av.length == 1)
    av = "0" + av;
  
  //console.log(av)
  //document.getElementById("mouth_display").style.backgroundColor = "#ff" + gs.allignment.toString(16) + gs.allignment.toString(16);
  document.getElementsByTagName("body")[0].style.backgroundColor = "#ff" + av + av;
  
  //console.log( "#ff" + gs.allignment.toString(16) + gs.allignment.toString(16) ) 
  document.getElementById("battle_report").innerHTML = gs.reports[gs.reports.length-1]
}

function trigger_eclipse(){
  document.getElementById("eclipse").style.visibility = "visible";
}

function next_round(gs){
  gs.soldiers += 2300;
  render_game_state(game_state)
}

function run_battle_sim (gs){
  if (gs.dead > gs.soldiers){
      trigger_eclipse()
  }
  else {
    battle_object = {
      a_skill: Number(document.getElementById("a_skill").value),
      d_skill: Number(document.getElementById("d_skill").value),
      a_agg: Number(document.getElementById("a_agg").value),
      d_agg: Number(document.getElementById("d_agg").value),
      a_sold: Number(document.getElementById("a_sold").value),
      d_sold: Number(document.getElementById("d_sold").value),
      river: document.getElementById("river").checked,
      forts: Number(document.getElementById("forts").value)
    }
    //console.log(battle_object);
    let river = 0
    if (battle_object.river === true)
      river = 2;
    
    let skill_check = Math.ceil(Math.random()*7) - 4 + battle_object.a_skill - battle_object.d_skill - battle_object.forts - river;
    //console.log(Math.ceil(Math.random()*7) - 4 , battle_object.a_skill , battle_object.d_skill , battle_object.forts , river);
    let death_toll_multiplier = 1 + (battle_object.a_agg/100) + (battle_object.d_agg/100);
    
    let fallen_a = 0;
    let fallen_d = 0;
    let smaller_force = Math.min(battle_object.a_sold, battle_object.d_sold);
    //console.log(battle_object.a_sold, battle_object.d_sold, smaller_force)
    if (skill_check == 0)
    {
    fallen_a = Math.floor((smaller_force*0.33) * death_toll_multiplier)  
    fallen_d = Math.floor((smaller_force*0.33) * death_toll_multiplier);
    }
    if (skill_check > 0)
    {
    fallen_a = Math.floor((smaller_force*0.15) * death_toll_multiplier)  
    fallen_d = Math.floor((smaller_force*0.40) * death_toll_multiplier);
    }
    if (skill_check > 3)
    {
      fallen_a = Math.floor((smaller_force*0.15) * death_toll_multiplier)  
      fallen_d = Math.floor((smaller_force*0.40) * death_toll_multiplier);
    }
    if (skill_check > 5)
    {
      fallen_a = Math.floor((smaller_force*0.05) * death_toll_multiplier)  
      fallen_d = Math.floor((smaller_force*0.60) * death_toll_multiplier);
    }
    if (skill_check < 0)
    {
    fallen_a = Math.floor((smaller_force*0.40) * death_toll_multiplier)  
    fallen_d = Math.floor((smaller_force*0.15) * death_toll_multiplier);
    }
    if (skill_check < -3)
    {
      fallen_a = Math.floor((smaller_force*0.40) * death_toll_multiplier)  
      fallen_d = Math.floor((smaller_force*0.15) * death_toll_multiplier);
    }
    if (skill_check < -5)
    {
      fallen_a = Math.floor((smaller_force*0.60) * death_toll_multiplier)  
      fallen_d = Math.floor((smaller_force*0.05) * death_toll_multiplier);
    }
    if (fallen_a > battle_object.a_sold)  fallen_a = battle_object.a_sold;
    if (fallen_d > battle_object.d_sold)  fallen_d = battle_object.d_sold;
    
    //console.log(fallen_a, fallen_d, skill_check, death_toll_multiplier, smaller_force)
    
    gs.soldiers -= (fallen_a + fallen_d);
    gs.dead += (fallen_a + fallen_d);
    
    let report = generate_battle_report(skill_check, (fallen_a / battle_object.a_sold), (fallen_d / battle_object.d_sold), forts, river, gs.allignment)
   
    report += "<br> Attackers lost " + fallen_a + " Dragons." + "<br> Defenders lost " + fallen_d + " Dragons." 
    
    gs.reports.push(report)
   
    render_game_state(game_state)
  }
}

function generate_battle_report(skill_check, a_loss_percent, d_loss_percent, forts, river, allignment){
  console.log(allignment)
  result = ""
  
  // commander skill contribution   river and fort conditionals


  //console.log(allignment)
  skill_check_data = {
    "attacker_learn": ["","#caught# by the dragon's #acumen#, the attacking commander learns to act with more wisdom and #increase# their skill. +1 Shame"],
    "defender_learn":["", "#caught# by the dragon's #acumen#, the defending commander learns to act with more wisdom and #increase# their skill. +1 Shame"],
    "increase": ["+1", "+2"],
    "caught" : ["Caught off guard", "Shocked", "Baffled", "Horrified"],
    "acumen": ["fire-breathing", "flight", "claws", "strategy", "tactics", "ferocity"],
    "attackers" : ["intruders", "trespassers", "invaders", "plunderers", "hunters"],
    "defenders" : ["protectors", "guardians", "sentinels", "watchers", "keepers"],
    "battle" : ["clash", "skirmish", "struggle", "fight", "confrontation"],
    "origin" : ""
}

if (skill_check > 5) skill_check_data.origin += "The attacking commander demonstrates extreme skill in slaying the dragon. They gain 1 Glory."
if (skill_check < -5) skill_check_data.origin += "The Dragon demonstrates extreme skill in defending against the attacking commander. They gain 1 evil."
if (skill_check > 0) skill_check_data.origin += "The #battle# goes to the #attackers#. The #defenders# must flee to a nearby forest to rest."
if (skill_check < 0) skill_check_data.origin += "The #battle# goes to the #defenders#. The #attackers# must retreat to the outskirts of the dragon's territory with their commander to avoid further casualties."

if (skill_check > 3) skill_check_data.origin += " #defender_learn#"
if (skill_check < -3) skill_check_data.origin += " #attacker_learn#"

  
  
  result += "<br>" + grammars.GenerationSimple(skill_check_data)
  
// how bloody the fighting is it is
// how fierce the fighting is
bloody_data = {
  "destroyed"                   : ["are scorched beyond recognition", ". . . none of them. None of them survive the dragon's wrath.", ". . .not even one escapes the dragon's fiery breath"],
  "commander_tragedy"           : ["is engulfed by the dragon's flames", "gains 2 shame but is kept alive by their troops", "is exiled for their failure and forced to wander the land as an outcast", "escapes with a charred #body_part#", "escapes with a missing #body_part# after the dragon's attack", "gains 2 shame and a burning hatred for the attacking commander. This means they will stop at nothing to seek revenge."],
  "body_part"                   : ["leg", "wing", "claw", "tail", "scale", "horn"],
  
  "attacking_suffer_few"        : ["", "For the #attackers#, this is a futile effort against the dragon's might.", "The dragon laughs at their feeble attempts."],
  "attacking_suffer_moderate"   : ["", "It cost a #body_part# and a #body_part#, but the attackers are undeterred."],
  "attacking_suffer_many"       : ["", "No soldier came out today without losing a comrade to the dragon's flames.", "So much death, and the dragon is still not satisfied."],
  "attacking_destroyed"         : ["", "The #attackers# #destroyed# by the dragon's wrath. The attacking commander #commander_tragedy#. The defending commander gains 1 glory."],
  "attackers"                   : ["adventurers", "knights", "soldiers", "raiders", "warriors"],
  
  "river_clean"                 : ["", "Despite the disadvantage of attacking over a river, few bodies end up in the water.", "The dragon doesn't care much for the river, and neither do its victims.", "The invaders enjoy a refreshing bath in the river after the battle. "],
  "river_red"                   : ["", "The river runs red with blood and dragonfire.", "Fish flee from the dragon's flames as they roast on the water's surface.", "Peasants downstream will never forget the stench of burnt flesh in the river."],

  "defending_suffer_few"        : ["", "The #attackers# are no match for the dragon's defenders." ],
  "defending_suffer_moderate"   : ["", "Battered and scorched, the #defenders# hold their ground."],
  "defending_suffer_many"       : ["", "The majority of #defenders# are wounded and struggle to recover from the dragon's assault."],
  "defending_destroyed"         : ["", "The #defenders# #destroyed# by the attacking commander. The dragon commander #commander_tragedy#. The attacking commander gains one glory. #bonus#"],
  "bonus"                       : ["","", "The attacking commander may make another action after casualties are resolved."],
  "defenders"                   : ["protectors", "guardians", "defenders", "shielding force", "keepers"],
  
  "fort_strong"                 : ["", "The castle walls hold strong against the dragon's flames.", "The defenders' fortifications effectively protect them from the dragon's onslaught.", ""],
  "fort_fail"                   : ["", "The fortress is reduced to ash by the dragon's fury.",""],
  "origin"                      : ""
  }
  
  
  //console.log(allignment)
  if (0.3 > a_loss_percent)
    bloody_data.origin+=(["#attacking_suffer_few#"])
  else if (0.6 > a_loss_percent)
    bloody_data.origin+=(["#attacking_suffer_moderate#"])
  else if (1 > a_loss_percent)
    bloody_data.origin+=(["#attacking_suffer_many#"])
  else
    bloody_data.origin+=(["#attacking_destroyed#"])
  
  if (0.6 > a_loss_percent && river)
    bloody_data.origin+=([" #river_clean#"])
  else if (0.6 > a_loss_percent && river)
    bloody_data.origin+=([" #river_red#"])
  
  if (0.3 > d_loss_percent)
    bloody_data.origin+=([" #defending_suffer_few#"])
  else if (0.6 > d_loss_percent)
    bloody_data.origin+=([" #defending_suffer_moderate#"])
  else if (1 > d_loss_percent)
    bloody_data.origin+=([" #defending_suffer_many#"])
  else
    bloody_data.origin+=([" #defending_destroyed#"])
  
  if (0.6 > a_loss_percent && forts)
    bloody_data.origin+=([" #fort_strong#"])
  else if (0.6 > a_loss_percent && forts)
    bloody_data.origin+=([" #fort_fail#"])
  
  
  
  result += "<br>" + grammars.GenerationSimple(bloody_data)
  
// doom sneaks
doom_data = {
  "bad_omen"      : ["Many #dragon_gear# seem to have gone missing overnight.", "An unusual number of #dragon_pests# are making the area around the battlefield unsettled.",  "The skies are filled with dark clouds and loud roars of #dragon_type# dragons."],
  "worse_omen"    : ["Dragon #dragon_pests# have infested the area where the attacking dragons were planning to have their feast.", "Dragon #dragon_gear# is covered in the blood of their enemies, and it seems impossible to clean.", "The howling of #dragon_type# dragons echoes through the battlefield, making the dragons uneasy."],
  "terrible_omen" : ["The dead are being consumed by #dragon_pests# in the middle of the night.", "The ground shakes with the sound of #dragon_type# dragons rising from the earth, their eyes glowing with fury.", "The smell of death and decay attracts hordes of #dragon_type# dragons to the battlefield."],
  "dragon_type"   : ["fire-breathing", "ice-breathing", "poisonous", "thunderous", "water-spitting"],
  "dragon_gear"   : ["claws", "scales", "teeth", "wings", "tails"],
  "dragon_pests"  : ["fireflies", "gnats", "mosquitoes", "sandflies", "wasps"],
  "origin"        : [""]
}

if (allignment < 200)
  doom_data.origin=["#bad_omen#"]
if (allignment < 150)
  doom_data.origin=["#worse_omen#","#worse_omen#","#bad_omen#",]
if (allignment < 100)
  doom_data.origin=["#terrible_omen#", "#terrible_omen#", "#worse_omen#"]
  
result += "<br>" + grammars.GenerationSimple(doom_data)


  //console.log(doom_data, grammars.GenerationSimple(doom_data))
  //console.log(result)
  
  return result

}
   
