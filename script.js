var q = {};
q.population = 109;
q.food = 357;
q.health = 70;
q.happy = 20;
q.arousal = 25;
q.forage = 1;
q.exploration = 0;
q.equality = 0;
q.tribe = 0;
q.familyTies = 3;
q.law = 0;
q.tradition = 2;
q.shaping = 0;
q.effectiveness = 100;
q.weapons = 0;
q.defenses = 0;
q.valuables = 0;
q.tools = 0;
q.songs = 0;
q.jenetHappy = 0;
q.pawlHappy = 0;
q.eshlingHappy = 0;
q.gureHappy = 0;
q.aphalHappy = 0;
q.animalAttacks = 0;
q.fights = 0;
q.turn = 0;
q.bimaneStrength = 100;
q.bimaneRelations = 0;
q.robedOneStrength = 100;
q.robedOneRelations = 0;
q.medicine = 0;
q.bimaneAttackPrep = 0;
q.robedOnesKnowledge = 0;
q.bimanesKnowledge = 0;
q.bones = 0;
q.despairSaves = 0;
q.bimaneAttacks = 0;
q.robedOneAttacks = 0;
q.blademouths = 0;
q.codgers = 0;
q.woolmouths = 0;
q.spindrakes = 0;
q.showStats = false;
q.animals = 0;
q.blademouthScouts = 0;
q.blademouthFighters = 0;
q.blademouthPets = 0;
q.codgerDiggers = 0;
q.codgerFighters = 0;
q.codgerWorkers = 0;
q.woolmouthStrongWool = 0;
q.woolmouthMeat = 0;
q.woolmouthSong = 0;
q.spindrakeFire = 0;
q.spindrakeRiders = 0;
q.houses = false;
q.hall = false;
q.temple = false;
q.watchtower = false;
q.walls = false;
q.reinforcedWalls = false;
q.humanShaping = 0;
q.difficulty = -15;

var nextPickEvent = false;
var nextDoTurn = false;
var evt = null;
var outcome = null;
var finished = false;

var statNames = {population: "Population", "valuables": "Valuables", "food": "Food", "medicine": "Medicine", "tools": "Tools", "weapons": "Weapons", "blademouths": "Blademouths", "codgers": "Codgers", "woolmouths": "Woolmouths", "spindrakes": "Spindrakes"};

var prev = {};

function updatePrevs() {
	["population", "valuables", "food", "medicine", "weapons", "tools", "blademouths", "codgers", "woolmouths", "spindrakes"].forEach(x => prev[x] = q[x]);
	["jenet", "pawl", "aphal", "gure", "eshling"].forEach(x => prev[x + "Happy"] = q[x + "Happy"]);
}

updatePrevs();

var t = {};
function start() {
	["stats", "actions", "event", "outcome"].forEach(n => {
		t[n] = Handlebars.compile(document.getElementById("_" + n).innerHTML);
	});
	evt = startEvent;
	render();
}

function render() {
	if (finished) {
		var content = "<h1>Isle of Beasts</h1>" + rOutcome() + '<div class="darkBlock"><span class="restart" onClick="window.location.reload();">Restart</span></div>';
		$("body").html(content);
	} else {
		var content = "<h1>Isle of Beasts</h1>" + rStats() + rFamilies() + rAnimals();
		if (!evt) {
			content += rActions();
		}
		content += rOutcome();
		content += rEvent();
		$("body").html(content);
		wireEvent();
		updatePrevs();
	}
}

function health() {
	if (q.health < 10) { return "Dying"; }
	if (q.health < 30) { return "Very Low"; }
	if (q.health < 50) { return "Low"; }
	if (q.health < 70) { return "Fine"; }
	if (q.health < 90) { return "Good"; }
	return "Great";
}

function mood() {
	if (q.happy < 10) { return "Desperate"; }
	if (q.happy > 90) { return "Jubilant"; }
	if (q.happy < 30) {
		if (q.arousal < 30) { return "Afraid"; }
		if (q.arousal < 70) { return "Unhappy"; }
		return "Angry";
	}
	if (q.happy < 70) {
		if (q.arousal < 30) { return "Tired"; }
		if (q.arousal < 70) { return "OK"; }
		return "Ready";
	}
	if (q.arousal < 30) { return "Content"; }
	if (q.arousal < 70) { return "Happy"; }
	return "Enthusiastic";
}

function chanceText(c) {
	if (c <= 0) { return "Impossible"; }
	if (c < 20) { return "Very Hard"; }
	if (c < 40) { return "Hard"; }
	if (c < 60) { return "Chancy"; }
	if (c < 80) { return "Possible"; }
	if (c < 100) { return "Likely"; }
	return "Certain";
}

function dangerText(c) {
	if (c <= 0) { return "Safe"; }
	if (c <= 25) { return "Slightly Risky"; }
	if (c <= 50) { return "Risky"; }
	if (c <= 75) { return "Dangerous"; }
	return "Extremely Dangerous";
}

function familyMood(v) {
	if (v <= -2) { return "Very Unhappy"; }
	if (v <= -1) { return "Unhappy"; }
	if (v <= 0) { return "Fine"; }
	if (v == 1) { return "Pleased"; }
	return "Happy";
}

function quantityDesc(type, q) {
	if (type == "tools" || type == "weapons") {
		if (q >= 5) { return "Excellent"; }
		return ["Very Basic", "Simple", "Decent", "Good", "Advanced", "Excellent"][q];
	}
	if (q >= 3) { return "Excellent"; }
	return ["None", "Basic", "Good", "Excellent"][q];
}

function rStats() {
	if (!q.showStats) { return ""; }
	var stats = ["population", "valuables", "food"].filter(n  => {
		return !!q[n];
	}).map(n => {
		var o = {t: statNames[n], v: q[n]};
		o.delta = q[n] - prev[n];
		if (q[n] > prev[n]) {
			o.flavor = "up";
		} else if (q[n] < prev[n]) {
			o.flavor = "down";
		} else {
			o.flavor = "same";
		}
		return o;
	});
	stats.push({t: "per Turn", v: foodDelta(), delta: "", flavor: "same"});
	stats.push({t: "Mood", v: mood(), delta: "", flavor: "same"});
	stats.push({t: "Health", v: health(), delta: "", flavor: "same"});
	stats = stats.concat(["medicine", "tools", "weapons"].filter(n  => {
		return !!q[n];
	}).map(n => {
		var o = {t: statNames[n], v: quantityDesc(n, q[n])};
		o.delta = q[n] - prev[n];
		if (q[n] > prev[n]) {
			o.flavor = "up";
		} else if (q[n] < prev[n]) {
			o.flavor = "down";
		} else {
			o.flavor = "same";
		}
		return o;
	}));
	return t.stats({stats: stats});
}

function herdSize(n) {
	if (n > 5) { return "Vast Herds"; }
	if (n < 0) { return "None"; }
	return ["None", "Few", "Some", "Many", "Large Herds", "Vast Herds"][n];
}

function rAnimals() {
	var stats = ["blademouths", "codgers", "woolmouths", "spindrakes"].filter(n  => { return q[n] });
	if (stats.length == 0) { return ""; }
	stats = stats.map(n => {
		var o = {t: n[0].toUpperCase() + n.substring(1).toLowerCase(), v: herdSize(q[n])};
		o.delta = q[n] - prev[n];
		if (q[n] > prev[n]) {
			o.flavor = "up";
		} else if (q[n] < prev[n]) {
			o.flavor = "down";
		} else {
			o.flavor = "same";
		}
		return o;
	});
	return t.stats({stats: stats});
}

function rFamilies() {
	var stats = ["jenet", "pawl", "aphal", "gure", "eshling"].filter(n  => {
		return q[n + "Shown"] && !q[n + "Gone"];
	});
	if (stats.length == 0) { return ""; }
	stats = stats.map(n => {
		var o = {t: n[0].toUpperCase() + n.substring(1).toLowerCase(), v: familyMood(q[n + "Happy"])};
		o.delta = q[n + "Happy"] - prev[n + "Happy"];
		if (q[n] > prev[n]) {
			o.flavor = "up";
		} else if (q[n] < prev[n]) {
			o.flavor = "down";
		} else {
			o.flavor = "same";
		}
		return o;
	});
	return t.stats({stats: stats});
}

function rActions() {
	var as = [];
	as.push({t: "Explore", f: "doExplore"});
	if (q.forage > 0) {
		as.push({t: "Forage", f: "doForage"});
	}
	if (q.exploration > 0 || q.turn > 4) {
		as.push({t: "Hunt", f: "doHunt"});
	}
	if (!q.houses) {
		as.push({t: "Build Village", f: "doHouses"});
	} else if (!q.hall) {
		as.push({t: "Build Hall", f: "doHall"});
	} else if (!q.temple) {
		as.push({t: "Build Temple", f: "doTemple"});
	}
	if (q.houses) {
		if (!q.watchtower) {
			as.push({t: "Build Watchtower", f: "doWatchtower"});
		} else if (!q.walls) {
			as.push({t: "Build Walls", f: "doWalls"});
		} else if (!q.reinforcedWalls) {
			as.push({t: "Reinforce Walls", f: "doReinforcedWalls"});
		}
	}
	if (q.hall && q.food >= Math.ceil(q.population / 2)) {
		as.push({t: "Hold Feast", f: "doFeast"});
	}
	if (q.temple) {
		as.push({t: "Pray", f: "doPray"});
	}
	if (q.houses && q.health < 70 && q.food >= q.population) {
		as.push({t: "Rest", f: "doRest"});
	}
	if (q.blademouths || q.codgers || q.woolmouths || q.spindrakes) {
		as.push({t: "Care for Animals", f: "doCareForAnimals"});
	}
	if (q.shaping && (q.blademouths || q.codgers || q.woolmouths || q.spindrakes)) {
		as.push({t: "Reshape Animals", f: "doShaping"});
	}
	if (q.bimaneVillage) {
		as.push({t: "Visit Bimanes", f: "doVisitBimanes"});
		as.push({t: "Raid Bimanes", f: "doRaidBimanes"});
	}
	if (q.robedOneVillage) {
		as.push({t: "Visit Robed Ones", f: "doVisitRobedOnes"});
		as.push({t: "Raid Robed Ones", f: "doRaidRobedOnes"});
	}
	return t.actions({actions: as});
}

function rEvent() {
	if (!evt) { return ""; }
	var options = evt.options.filter(o => o.check ? o.check() : true);
	for (var i = 0; i < options.length; i++) {
		options[i].id = i;
		options[i].chanceText = options[i].success ? chanceText(options[i].success() - q.difficulty) : "";
		options[i].dangerText = options[i].danger ? dangerText(options[i].danger() + q.difficulty) : "";
		options[i].chanceStyle = options[i].success ? "challengeChance" : "";
		options[i].dangerStyle = options[i].danger ? "challengeDanger" : "";
	}
	return t.event({text: evt.text + (evt.extraText ? evt.extraText() : ""), options: options});
}

function wireEvent() {
	if (!evt) { return; }
	var options = evt.options.filter(o => o.check ? o.check() : true);
	var i = 0;
	options.forEach(o => {
		$("#o" + i).click(() => pickOption(o));
		i++;
	});
}

function rOutcome() {
	if (!outcome) { return ""; }
	return t.outcome({text: outcome});
}

function foodDelta() {
	var d = -15;
	d += Math.ceil(strength() / 8);
	d += q.forage * 10;
	d += q.woolmouths * (q.woolmouthMeat ? 20 : 10);
	d += q.codgers * 5;
	d += q.blademouths * 5;
	d += q.spindrakes * (q.spindrakeRiders ? 10 : 5);
	d -= q.population / 2;
	d -= q.food / 20; // Spoilage.
	return Math.ceil(d);
}

function turn() {
	q.turn++;
	q.food += foodDelta();
	q.health += q.medicine + 1;
	if (!q.houses) {
		q.health -= 1;
	}
	if (q.population < 12) {
		lose("Only a few people remain in the village. They despair and scatter. Some try to return to the old country, others walk away into the forest in search of something they cannot quite explain. The Isle of Beasts has destroyed your people.");
		return;
	} else if (q.happy <= 0) {
		ev(despair);
	} else {
		if (q.happy < 30 && q.woolmouthSong) {
			q.happy++;
		}
		if (q.arousal < 30 && q.woolmouthSong) {
			q.arousal++;
		}
		if (q.happy < 40 && q.blademouthPets) {
			q.happy++;
			if (q.arousal > 80) {
				q.arousal--;
			}
		}
		if (q.food < 0) {
			q.health -= 8;
			if (q.health < 30) {
				q.population = Math.ceil(q.population * 3 / 4);
				addOut("Your food stores have run out, and your people are dying.");
			} else {
				q.population = Math.ceil(q.population * 9 / 10);
				addOut("Your food stores have run out, and your people are starving.");
			}
		} else if (q.health < 10) {
			q.population = Math.ceil(q.population * 5 / 6);
			addOut("Ill health claims the lives of many villagers.")
		} else if (q.health < 30) {
			q.population = Math.ceil(q.population * 9 / 10);
			addOut("Ill health claims the lives of several villagers.");
		}
		if (q.food > 0 && q.food < q.population / 2) {
			addOut("Your food stores are low.");
		}
	}
	if (q.food < 0) { q.food = 0; }
	if (q.happy < 0) { q.happy = 0; }
	if (q.happy > 100) { q.happy = 100; }
	if (q.arousal < 0) { q.arousal = 0; }
	if (q.arousal > 100) { q.arousal = 100; }
	render();
}

function ev(e) {
	outcome = null;
	evt = e;
	render();
}

function win(o) {
	finished = true;
	outcome = o;
	evt = null
	render();
}

function lose(o) {
	finished = true;
	outcome = o;
	evt = null;
	render();
}

function addOut(o) {
	if (outcome) {
		outcome += "<br><br>" + o;
	} else {
		outcome = o;
	}
}

function out(o, show) {
	outcome = o;
	evt = null;
	if (show) {
		q[show + "Shown"] = true;
	}
	next();
}

function done() {
	outcome = null;
	evt = null;
	next();
}

function cancel() {
	nextPickEvent = false;
	nextDoTurn = false;
	outcome = null;
	evt = null;
	render();
}

function pickOption(o) {
	if (o.success) {
		console.log("success " + o.success());
	}
	if (o.danger) {
		console.log("danger " + o.danger());
	}
	o.run(Math.random() * 100 + q.difficulty < (o.success ? o.success() : 100), Math.random() * 100 - q.difficulty < (o.danger ? o.danger() : 0));
}

function sum(a) {
	return a.reduce((a, b) => a + b, 0);
}

function strength() {
	return Math.ceil((q.effectiveness / 2 + q.arousal / 4 + q.health / 2 + sum(["jenet", "pawl", "aphal", "gure", "eshling"].map(f => { return q[f + "Happy"] * 5; }))) * q.population / 120);
}

function next() {
	if (nextPickEvent) {
		nextPickEvent = false;
		evt = Math.random() < 0.75 ? pickEvent(events, "time: ") : null;
		if (evt) {
			if (evt.run) { evt.run(); }
			if (evt.show) {
				evt.show.forEach(s => {
					q[s + "Shown"] = true;
				});
			}
			q["time: " + evt.name] = true;
			render();
			return;
		}
	}
	
	if (nextDoTurn) {
		nextDoTurn = false;
		turn();
	} else {
		render();
	}
}

function afterAction() {
	nextPickEvent = true;
	nextDoTurn = true;
}

function pickEvent(l, prefix) {
	var imp = l.filter(e => { return e.check() && e.important && e.important() && !q[prefix + e.name] && (!e.show || !e.show.some(s => { return q[s + "Gone"]; })); });
	if (imp.length > 0) {
		return imp[0];
	}
	var evts = l.filter(e => { return e.check() && !q[prefix + e.name] && (!e.show || !e.show.some(s => { return q[s + "Gone"]; })); });
	if (evts.length > 0) {
		return evts[Math.floor(Math.random() * evts.length)];
	}
	return null;
}

/*events.forEach(e => {
	console.log(e.name + " " + e.check());
	e.options.forEach(o => {
		console.log("  " + o.text);
		if (o.success) {
			console.log("    success: " + o.success());
		}
		if (o.danger) {
			console.log("    danger: " + o.danger());
		}
	});
});*/
