var q = {};
q.population = 131;
q.food = 307;
q.happy = 20;
q.arousal = 25;
q.items = [{name: "Try"}];

var statNames = {population: "Population", "food": "Food"};

var prev = {};

function updatePrevs() {
	["population", "food"].forEach(x => prev[x] = q[x]);
}

updatePrevs();

var t = {};
function start() {
	["stats", "actions", "event", "challenge", "outcome"].forEach(n => {
		t[n] = Handlebars.compile(document.getElementById("_" + n).innerHTML);
	});
	render();
	
	doEvent({
		text: "Test event",
		options: [
			{
				text: "Gain food",
				run: () => {
					q.food += 100;
					doOutcome("You get some food.");
				}
			},
			{
				text: "Gamble",
				run: () => {
					doChallenge({
						text: "Gamble for food!",
						chance: (o) => {
							return 50;
						},
						outcome: (o, success, dmg) => {
							if (success) {
								q.food += 200;
								return "You gained extra food!";
							} else {
								q.food -= 100;
								return "You lost food!";
							}
						}
					})
				}
			}
		]
	});
}

function render() {
	var content = "<h1>Isle of Beasts</h1>" + rStats();
	if (!q.challenge && !q.evt) {
		content += rActions();
	}
	content += rOutcome();
	content += rEvent();
	content += rChallenge();
	$("body").html(content);
	wireEvent();
	wireChallenge();
	updatePrevs();
}

function mood() {
	if (q.happy < 10) { return "Desparate"; }
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
	if (c <= 20) { return "Very Hard"; }
	if (c <= 40) { return "Hard"; }
	if (c <= 60) { return "Chancy"; }
	if (c <= 80) { return "Possible"; }
	if (c < 100) { return "Likely"; }
	return "Certain";
}

function dangerText(c) {
	if (c <= 0) { return ""; }
	if (c <= 25) { return "Slightly Risky"; }
	if (c <= 50) { return "Risky"; }
	if (c <= 75) { return "Dangerous"; }
	return "Extremely Dangerous";
}

function rStats() {
	var stats = ["population", "food"].map(n => {
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
	stats.push({t: "Mood", v: mood(), delta: "", flavor: "same"})
	return t.stats({stats: stats});
}

function rActions() {
	var actions = [{t: "Wait", f: "turn"}];
	return t.actions({actions: actions});
}

function rEvent() {
	if (!q.evt || q.challenge) { return ""; }
	var options = q.evt.options.filter(o => o.check ? o.check() : true);
	for (var i = 0; i < options.length; i++) {
		options[i].id = i;
	}
	return t.event({text: q.evt.text, options: options});
}

function wireEvent() {
	if (!q.evt || q.challenge) { return; }
	var options = q.evt.options.filter(o => o.check ? o.check() : true);
	var i = 0;
	options.forEach(o => {
		$("#o" + i).click(() => { o.run(); render(); });
		i++;
	});
}

function rChallenge() {
	if (!q.challenge) { return ""; }
	var options = q.items.filter(o => q.challenge.check ? q.challenge.check(o) : true);
	for (var i = 0; i < options.length; i++) {
		options[i].id = i;
		options[i].chance = chanceText(q.challenge.chance(options[i]));
		options[i].danger = dangerText(q.challenge.danger ? q.challenge.danger(options[i]) : 0);
	}
	return t.challenge({text: q.challenge.text, options: options, evt: q.evt});
}

function wireChallenge() {
	if (!q.challenge) { return; }
	var options = q.items.filter(o => q.challenge.check ? q.challenge.check(o) : true);
	var i = 0;
	options.forEach(o => {
		$("#o" + i).click(() => challengeResponse(o));
		i++;
	});
}

function rOutcome() {
	if (!q.outcome) { return ""; }
	return t.outcome({text: q.outcome});
}

function turn() {
	q.food += q.population;
	render();
}

function doEvent(e) {
	q.challenge = null;
	q.evt = e;
	render();
}

function backOut() {
	q.challenge = null;
	render();
}

function doChallenge(c) {
	q.challenge = c;
	render();
}

function doOutcome(o) {
	q.outcome = o;
	q.challenge = null;
	q.evt = null;
	render();
}

function challengeResponse(o) {
	var ch = q.challenge;
	q.challenge = null;
	q.outcome = ch.outcome(o, Math.random() * 100 <= ch.chance(o), Math.random() * 100 <= ch.danger ? ch.danger(o) : 0);
	render();
}
