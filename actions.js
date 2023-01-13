function doForage() {
	afterAction();
	q.food += 10 + Math.ceil(strength() / 3) + q.forage * 15;
	out("You send out additional foragers in search of food.");
}

function doRest() {
	afterAction();
	q.health += 6 + q.medicine * 4;
	out("The villagers rest and care for the sick and wounded.");
}

function doFeast() {
	afterAction();
	q.food -= Math.ceil(q.population / 2);
	if (Math.random() * 100 + q.difficulty < 40 + q.familyTies * 15) {
		// Good outcome
		if (Math.random() * 100 + q.difficulty < 20 * q.tradition) {
			q.happy += 10;
			q.arousal -= 5;
			out("The people get together in the great hall to eat and drink and sing. The priests tell tales of the ancestors, and you remember the old country, and the circumstances of your exile.");
			return;
		}
		if (q.fights > 2 && Math.random() * 100 < 30) {
			q.happy += 10;
			q.arousal += 10;
			q.songs++;
			out("The people get together in the great hall to eat and drink and sing. Your warriors boast and sing songs of their victories.");
			return;
		}
		if (q.shaping > 3 && Math.random() * 100 < 30) {
			q.happy += 8;
			q.arousal += 5;
			q.shaping++;
			out("The people get together in the great hall to eat and drink and sing. A lively debate about shaping ensues.");
			return;
		}
		if (q.mealGroups) {
			q.happy += 9;
			q.arousal += 5;
			out("The people get together in the great hall to eat and drink and sing. Each hearth seeks to outdo the other in their contributions.");
			return;
		}
		if (q.familyTies > 1) {
			q.happy += 13;
			out("The people get together in the great hall to eat and drink and sing. Each family seeks to outdo the other in their contributions.");
			return;
		}
		q.happy += 8;
		q.arousal += 3;
		out("The people get together in the great hall to eat and drink and sing.");
		return;
	}
	if (Math.random() * 100 + q.difficulty < 20 + q.equality * 20 + q.law * 20) {
		// OK outcome
		q.happy += 5;
		q.arousal += 2;
		out("The people get together in the great hall to eat and drink and sing.");
	}
	// Bad outcome
	if (q.arousal > 50) {
		q.arousal += 10;
		q.health -= 9;
		q.happy += 2;
		out("The feast starts well enough, but a brawl soon breaks out.");
	} else {
		q.arousal -= 5;
		q.happy += 3;
		out("The people get together in the great hall to eat and drink and sing, but their spirits are dampened. Many question the waste of food and effort.");
	}
}

function doPray() {
	afterAction();
	if (Math.random() * 100 + q.difficulty < 40 + Math.max(0, q.tradition) * 20 + (q.bones ? 30 : 0)) {
		if (q.tradition > 0) {
			q.happy += 9;
			q.arousal -= 3;
			out("The people come together into the temple and sing the old songs, and remember the old country, and take heart.");
		} else {
			q.happy += 7;
			q.songs++;
			out("The people come together into the temple. They make up new songs to old tunes, to tell the story of their exile and new home.");
		}
	} else {
		q.happy += 3;
		q.arousal -= 5;
		out("The people shuffle into the temple and listen to the droning of the priests.");
	}
}

var watchtower = {
	text: "The council wants to build a watchtower to protect the village. Spotting dangerous monsters earlier will help organising a stout defense.",
	options: [
		{
			text: "Build a wooden watchtower.",
			danger: () => { return 70 - q.tools * 25; },
			run: (success, harm) => {
				q.watchtower = true;
				q.defenses++;
				if (harm) {
					q.population--;
					q.health -= 8;
					q.happy -= 3;
					out("Accidents plague the construction of the tower, injuring several villagers and killing one.");
				} else {
					out("The tower is soon assembled.");
				}
			}
		},
		{
			text: "Build a tower from wood and woolmouth fabric.",
			check: () => { return q.woolmouths && q.woolmouthStrongWool; },
			danger: () => { return 30 - q.tools * 10 - q.woolmouths * 5; },
			run: (success, harm) => {
				q.watchtower = true;
				q.defenses++;
				if (harm) {
					q.population--;
					q.health -= 8;
					q.happy -= 3;
					out("Accidents plague the construction of the tower, injuring several villagers and killing one.");
				} else {
					q.happy += 4;
					out("The tower, a clever combination of wood and tensioned tough fabric, soon rises into the sky.");
				}
			}
		},
		{
			text: "Cancel",
			run: () => { cancel(); }
		}
	]
};

var walls = {
	text: "The council has decided to build a wall around the settlement to protect it from predators and unknown dangers.",
	options: [
		{
			text: "Build a wooden palisade.",
			danger: () => { return 80 - q.tools * 25; },
			run: (success, harm) => {
				q.walls = true;
				q.defenses++;
				if (harm) {
					q.health -= 21;
					q.happy -= 4;
					out("Building the palisade is slow and exhausting work. Several people are badly injured during construction.");
				} else {
					q.health -= 7;
					out("Building the palisade is slow work, and your people are exhausted when it's finally complete.");
				}
			}
		},
		{
			text: "Weave a durable wall from woolmouth fabric.",
			check: () => { return q.woolmouths && q.woolmouthStrongWool; },
			danger: () => { return 50 - q.tools * 10 - q.woolmouths * 10; },
			run: (success, harm) => {
				q.walls = true;
				q.defenses++;
				if (harm) {
					q.health -= 9;
					out("The woolmouths have been shaped to grow a very tough kind of wool suitable for construction. Still, building a village wall from it requires a significant effort.");
				} else {
					q.happy += 4;
					out("The woolmouths have been shaped to grow a very tough kind of wool suitable for construction. Using this material, the villagers are able to easily build a lightweight, durable wall.");
				}
			}
		},
		{
			text: "Use codgers to build earthwork walls.",
			check: () => { return q.codgers; },
			danger: () => { return (q.codgerWorkers ? 30 : 60) - q.tools * 10 - q.codgers * 10; },
			run: (success, harm) => {
				q.walls = true;
				q.earthworks = true;
				q.defenses++;
				if (harm) {
					if (q.codgers > 1) {
						q.codgers--;
					}
					out("You direct the codgers to heap up earthworks to protect the village. While the creatures manage to do so, the sheer amount of earth that needs moving is too much for them, and several perish. Still, the walls now stand.");
				} else {
					q.happy += 4;
					out("You direct the codgers to heap up earthworks to protect the village, a task to which they are uniquely suited. With most of the heavy labour done by the creatures, your people only have to build the new village gate.");
				}
			}
		},
		{
			text: "Cancel",
			run: () => { cancel(); }
		}
	]
};

var reinforceWall = {
	text: "In order to better protect the village, the council has decided that its walls must be stronger.",
	options: [
		{
			text: "Strengthen the walls with additional cross-bracing.",
			check: () => { return !q.earthworks; },
			danger: () => { return 100 - q.tools * 25; },
			run: (success, harm) => {
				q.reinforcedWalls = true;
				q.defenses++;
				if (harm) {
					q.health -= 21;
					q.happy -= 4;
					out("Reinforcing the walls turns out to be back-breaking work, leaving many people injured.");
				} else {
					q.health -= 7;
					out("It's hard work, but eventually, the walls are reinforced.");
				}
			}
		},
		{
			text: "Strengthen the walls with woolmouth weave.",
			check: () => { return q.woolmouths && q.woolmouthStrongWool && !q.earthworks; },
			danger: () => { return 70 - q.tools * 15 - q.woolmouths * 10; },
			run: (success, harm) => {
				q.walls = true;
				q.defenses++;
				if (harm) {
					q.health -= 16;
					q.happy -= 4;
					out("Adding layers of woolmouth fiber turns out to be tricky. Some sections of wall collapse and have to be rebuilt. Several people are badly injured.");
				} else {
					q.happy += 4;
					out("By adding layers of tough woolmouth fiber, the villagers reinforce the walls to the point of being nigh on indestructible.");
				}
			}
		},
		{
			text: "Add a wooden palisade on top of the earthwork walls.",
			check: () => { return q.earthworks; },
			danger: () => { return 60 - q.tools * 20; },
			run: (success, harm) => {
				q.reinforcedWalls = true;
				q.defenses++;
				if (harm) {
					q.health -= 17;
					q.happy -= 4;
					out("Building a palisade on top of the earthworks turns out to be fraught, as the walls crumble in places, injuring several people. After a lot of work, the reinforced defences are complete.");
				} else {
					out("The villagers add a modest palisade on top of the walls built by the codgers.");
				}
			}
		},
		{
			text: "Cancel",
			run: () => { cancel(); }
		}
	]
};

var houses = {
	text: "The people set about building a village in this new land. But what form should it take?",
	options: [
		{
			text: "A cozy group of houses much like back in the old country.",
			run: () => {
				q.happy += 10;
				q.houses = true;
				done();
			}
		},
		{
			text: "A tight, easily defensible cluster of dwellings.",
			run: () => {
				q.arousal -= 5;
				q.happy += 5;
				q.defenses++;
				q.houses = true;
				done();
			}
		},
		{
			text: "A carefully laid-out group of workshops and living quarters.",
			run: () => {
				q.happy += 5;
				q.effectiveness += 7;
				q.houses = true;
				done();
			}
		},
	]
};

var hall = {
	text: "Now that the people have dwellings, they want a village hall where they can come together. What shape should it take?",
	options: [
		{
			text: "A magnificent grand hall to lift the spirits.",
			success: () => { return strength() - 70 + q.tools * 25; },
			run: (success, harm) => {
				q.hall = true;
				q.effectiveness += 5;
				if (success) {
					q.happy += 11;
					q.arousal += 4;
					out("The people work hard on the grand hall, and when it is complete, it is indeed magnificent.");
				} else {
					q.arousal -= 3;
					out("The people do their best to build an inspiring hall, but they lack tools, materials, and energy. The final result is acceptable but falls short of your intent.");
				}
			}
		},
		{
			text: "A fall-back defensive position.",
			success: () => { return 10 + q.tools * 25; },
			run: (success, harm) => {
				q.hall = true;
				q.effectiveness += 5;
				q.happy += 2;
				if (success) {
					q.defenses++;
					out("The hall is built so that in case of attack, the whole village can hide inside it. The walls and doors are reinforced, and the layout is such that a few determined defenders can stand against a much larger number of attackers.");
				} else {
					out("Since the people lack proper tools and materials, the final result is not as sturdy or defensible as they had hoped, but it will serve.");
				}
			}
		},
		{
			text: "A simple, well-built meeting hall.",
			run: () => {
				q.hall = true;
				q.happy += 5;
				q.houses = true;
				q.effectiveness += 5;
				out("The people easily construct a small but functional hall, which will serve as the centre of the village social life.");
			}
		},
		{
			text: "Cancel",
			run: () => { cancel(); }
		}
	]
};

var temple = {
	text: "Finally, with the houses and halls in place, the people want a temple where they can worship their ancestors. What should it look like?",
	options: [
		{
			text: "Ornate and magnificent",
			success: () => { return strength() - 125 + q.tools * 25; },
			run: (success, harm) => {
				q.temple = true;
				if (q.bones) {
					q.happy += 5;
					q.arousal += 5;
				}
				if (success) {
					q.happy += 8;
					q.arousal += 12;
					out("The people get to it, felling large trees to build a large vaulted ceiling, experimenting with local plants for paints, carving limestone and wood into decorations. The end result is a temple as magnificent as any in the old country, created through the will and cleverness of your people." + (q.bones ? "<br><br>The people deposit the bones of the ancestors that they took with them in the temple, adorning its walls and altars. They can feel the ancestors' approval and protection." : ""));
				} else {
					q.arousal -= 3;
					out("Try as they might, with the few tools and materials available to them, the villagers cannot build anything very sophisticated. The temple ends up with a lower ceiling than originally intended, and with rather crude carvings and paintings. Still, it will serve." + (q.bones ? "<br><br>The people deposit the bones of the ancestors that they took with them in the temple, adorning its walls and altars. They can feel the ancestors' approval and protection." : ""));
				}
			}
		},
		{
			text: "As much as possible as a temple back in the old country",
			success: () => { return 40 + q.tools * 20 + q.tradition * 10; },
			run: (success, harm) => {
				q.temple = true;
				if (q.bones) {
					q.happy += 5;
					q.arousal += 5;
				}
				if (success) {
					q.tradition++;
					q.happy += 8;
					out("It takes a fair amount of ingenuity to figure out how to do this. The available materials on the isle are quite different - the wood, the stone, the plants. In the end, the effect is stunning - when you enter the temple, you feel that you are back in the old country. It even smells like it should." + (q.bones ? "<br><br>The people deposit the bones of the ancestors that they took with them in the temple, adorning its walls and altars. They can feel the ancestors' approval and protection." : ""));
				} else {
					q.happy -= 3;
					out("The villagers try to build a temple like back home, but it's simply not possible. They lack the tools and materials to do so: the wood is the wrong color, and splits too easily to be carved. They cannot find pigments for the interior paintings amongst the strange plants of the isle. The end result is reminiscent of a temple back home, but it is clearly not the same thing." + (q.bones ? "<br><br>The people deposit the bones of the ancestors that they took with them in the temple, adorning its walls and altars. They can feel the ancestors' approval and protection." : ""));
				}
			}
		},
		{
			text: "Like a plain and simple frontier temple",
			run: () => {
				if (q.bones) {
					q.happy += 5;
					q.arousal += 5;
				}
				q.happy += 3;
				q.temple = true;
				out("The people build a plain and rustic temple - perhaps not the most sophisticated construction, but one that suits this frontier environment." + (q.bones ? "<br><br>The people deposit the bones of the ancestors that they took with them in the temple, adorning its walls and altars. They can feel the ancestors' approval and protection." : ""));
			}
		},
		{
			text: "Cancel",
			run: () => { cancel(); }
		}
	]
};

var shaping = {
	text: "The creatures you domesticated are amenable to being re-shaped into new forms, making them more suitable for certain tasks.",
	options: [
		{
			text: "Practice shaping",
			run: () => {
				q.shaping++;
				out("The village's shapers practice their arts, gently coaxing animals into new shapes before allowing them to return to their common form. They report more confidence in being able to permanently reshape your animal stocks now.");
			}
		},
		{
			text: "Reshape blademouths.",
			check: () => { return q.blademouths; },
			run: () => {
				ev({
					text: "",
					extraText: () => {
						if (q.blademouthScouts) {
							return "The blademouths have more nimble bodies suitable for scouting.";
						} else if (q.blademouthFighters) {
							return "The blademouths have larger bodies suitable for combat.";
						} else if (q.blademouthPets) {
							return "The blademouths have a sweet temperament, making them suitable as pets.";
						} else {
							return "The blademouths have not been reshaped yet.";
						}
					},
					options: [
						{
							text: "Reshape them to have more nimble bodies suitable for scouting.",
							check: () => { return !q.blademouthScouts; },
							danger: () => { return 45 - q.shaping * 20 + (q.blademouthScouts || q.blademouthFighters || q.blademouthPets) ? 35 : 0; },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.blademouths > 1) {
										q.blademouths--;
									}
									out("The shapers are unable to control the process, leading to several blademouths dying. Perhaps they will do better next time, they say.");
								} else {
									q.blademouthScouts = true;
									q.blademouthFighters = false;
									q.blademouthPets = false;
									out("The shapers successfully change the blademouth to have more nimble bodies.");
								}
							}
						},
						{
							text: "Reshape them to have larger bodies suitable for combat.",
							check: () => { return !q.blademouthFighters; },
							danger: () => { return 65 - q.shaping * 20 + (q.blademouthScouts || q.blademouthFighters || q.blademouthPets) ? 35 : 0; },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.blademouths > 1) {
										q.blademouths--;
									}
									out("The shapers are unable to control the process, leading to several blademouths dying. Perhaps they will do better next time, they say.");
								} else {
									q.blademouthScouts = false;
									q.blademouthFighters = true;
									q.blademouthPets = false;
									out("The shapers successfully change the blademouth to have larger bodies.");
								}
							}
						},
						{
							text: "Reshape them to have a sweet temperament, making them suitable as pets.",
							check: () => { return !q.blademouthPets; },
							danger: () => { return 85 - q.shaping * 20 + (q.blademouthScouts || q.blademouthFighters || q.blademouthPets) ? 35 : 0; },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.blademouths > 1) {
										q.blademouths--;
									}
									out("The shapers are unable to control the process, leading to several blademouths dying. Perhaps they will do better next time, they say.");
								} else {
									q.blademouthScouts = false;
									q.blademouthFighters = false;
									q.blademouthPets = true;
									out("The shapers successfully change the blademouth to have a sweet temperament.");
								}
							}
						},
						{
							text: "Cancel",
							run: () => { cancel(); }
						}
					]
				});
			}
		},
		{
			text: "Reshape codgers.",
			check: () => { return q.codgers; },
			run: () => {
				ev({
					text: "",
					extraText: () => {
						if (q.codgerDiggers) {
							return "The codgers have hardened claws for digging into rock and metal.";
						} else if (q.codgerFighters) {
							return "The codgers have long, sharp claws for fighting.";
						} else if (q.codgerWorkers) {
							return "The codgers have more dextrous claws for all kinds of work.";
						} else {
							return "The codgers have not been reshaped yet.";
						}
					},
					options: [
						{
							text: "Reshape them to have hardened claws for digging into rock and metal.",
							check: () => { return !q.codgerDiggers; },
							danger: () => { return 50 - q.shaping * 20 + (q.codgerDiggers || q.codgerFighters || q.codgerWorkers) ? 35 : 0; },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.codgers > 1) {
										q.codgers--;
									}
									out("The shapers are unable to control the process, leading to several codgers dying. Perhaps they will do better next time, they say.");
								} else {
									if (q.codgerWorkers) {
										q.tools--;
									}
									q.codgerDiggers = true;
									q.codgerFighters = false;
									q.codgerWorkers = false;
									out("The shapers successfully change the codgers to have hardened claws.");
								}
							}
						},
						{
							text: "Reshape them to have long, sharp claws for fighting.",
							check: () => { return !q.codgerFighters; },
							danger: () => { return 70 - q.shaping * 20 + (q.codgerDiggers || q.codgerFighters || q.codgerWorkers) ? 35 : 0; },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.codgers > 1) {
										q.codgers--;
									}
									out("The shapers are unable to control the process, leading to several codgers dying. Perhaps they will do better next time, they say.");
								} else {
									if (q.codgerWorkers) {
										q.tools--;
									}
									q.codgerDiggers = false;
									q.codgerFighters = true;
									q.codgerWorkers = false;
									out("The shapers successfully change the codgers to have long, sharp claws.");
								}
							}
						},
						{
							text: "Reshape them to have more dextrous claws for all kinds of work.",
							check: () => { return !q.codgerWorkers; },
							danger: () => { return 90 - q.shaping * 20 + (q.codgerDiggers || q.codgerFighters || q.codgerWorkers) ? 35 : 0; },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.codgers > 1) {
										q.codgers--;
									}
									out("The shapers are unable to control the process, leading to several codgers dying. Perhaps they will do better next time, they say.");
								} else {
									q.codgerDiggers = false;
									q.codgerFighters = false;
									q.codgerWorkers = true;
									q.tools++;
									out("The shapers successfully change the codgers to have more dextrous claws.");
								}
							}
						},
						{
							text: "Cancel",
							run: () => { cancel(); }
						}
					]
				});
			}
		},
		{
			text: "Reshape woolmouths.",
			check: () => { return q.woolmouths; },
			run: () => {
				ev({
					text: "",
					extraText: () => {
						if (q.woolmouthStrongWool) {
							return "The woolmouths exude tough wool that can be used as building material.";
						} else if (q.woolmouthMeat) {
							return "The woolmouths are large and meaty and delicious.";
						} else if (q.woolmouthSong) {
							return "The woolmouths produce calming songs that allay fear.";
						} else {
							return "The woolmouths have not been reshaped yet.";
						}
					},
					options: [
						{
							text: "Reshape them to exude tough wool that can be used as building material.",
							check: () => { return !q.woolmouthStrongWool; },
							danger: () => { return 60 - q.shaping * 20 + (q.woolmouthStrongWool || q.woolmouthMeat || q.woolmouthSong) ? 35 : 0; },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.woolmouths > 1) {
										q.woolmouths--;
									}
									out("The shapers are unable to control the process, leading to several woolmouths dying. Perhaps they will do better next time, they say.");
								} else {
									q.woolmouthStrongWool = true;
									q.woolmouthMeat = false;
									q.woolmouthSong = false;
									out("The shapers successfully change the woolmouths to exude tough wool that can be used as building material.");
								}
							}
						},
						{
							text: "Reshape them to be large and meaty and delicious.",
							check: () => { return !q.woolmouthMeat; },
							danger: () => { return 80 - q.shaping * 20 + (q.woolmouthStrongWool || q.woolmouthMeat || q.woolmouthSong) ? 35 : 0; },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.woolmouths > 1) {
										q.woolmouths--;
									}
									out("The shapers are unable to control the process, leading to several woolmouths dying. Perhaps they will do better next time, they say.");
								} else {
									q.woolmouthStrongWool = false;
									q.woolmouthMeat = true;
									q.woolmouthSong = false;
									out("The shapers successfully change the woolmouths to be meatier.");
								}
							}
						},
						{
							text: "Reshape them to produce calming songs that allay fear.",
							check: () => { return !q.woolmouthSong; },
							danger: () => { return 100 - q.shaping * 20 + (q.woolmouthStrongWool || q.woolmouthMeat || q.woolmouthSong) ? 35 : 0; },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.woolmouths > 1) {
										q.woolmouths--;
									}
									out("The shapers are unable to control the process, leading to several woolmouths dying. Perhaps they will do better next time, they say.");
								} else {
									q.woolmouthStrongWool = false;
									q.woolmouthMeat = false;
									q.woolmouthSong = true;
									out("The shapers successfully change the woolmouths to produce calming songs.");
								}
							}
						},
						{
							text: "Cancel",
							run: () => { cancel(); }
						}
					]
				});
			},
		},
		{
			text: "Reshape spindrakes.",
			check: () => { return q.spindrakes; },
			run: () => {
				ev({
					text: "",
					extraText: () => {
						if (q.spindrakeFire) {
							return "The spindrakes exude large quantities of flammable milk.";
						} else if (q.spindrakeRiders) {
							return "The spindrakes have larger bodies for riding.";
						} else {
							return "The spindrakes have not been reshaped yet.";
						}
					},
					options: [
						{
							text: "Reshape them to exude large quantities of flammable milk.",
							check: () => { return !q.spindrakeFire; },
							danger: () => { return 80 - q.shaping * 20 + (q.spindrakeRiders ? 30 : 0); },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.spindrakes > 1) {
										q.spindrakes--;
									}
									out("The shapers are unable to control the process, leading to several spindrakes dying. Perhaps they will do better next time, they say.");
								} else {
									q.spindrakeFire = true;
									q.spindrakeRiders = false;
									out("The shapers successfully change the spindrake to exude flammable milk.");
								}
							}
						},
						{
							text: "Reshape them to be large enough to ride.",
							check: () => { return !q.spindrakeRiders; },
							danger: () => { return 120 - q.shaping * 20 + (q.spindrakeFire ? 30 : 0); },
							run: (success, harm) => {
								q.shaping++;
								if (harm) {
									if (q.spindrakes > 1) {
										q.spindrakes--;
									}
									out("The shapers are unable to control the process, leading to several spindrakes dying. Perhaps they will do better next time, they say.");
								} else {
									q.spindrakeFire = true;
									q.spindrakeRiders = false;
									q.happy += 5;
									q.arousal += 5;
									out("The shapers successfully change the spindrake to be large enough to ride. A triumph of shaping");
								}
							}
						},
						{
							text: "Cancel",
							run: () => { cancel(); }
						}
					]
				});
			}
		},
		{
			text: "Cancel",
			run: () => { cancel(); }
		}
	]
};

function doCareForAnimals() {
	afterAction();
	if (q.woolmouths && q.woolmouths < 5 && Math.random() * 100 + q.difficulty < 60 + q.animals * 20 - q.woolmouths * 30) {
		q.woolmouths++;
		out("The villagers take care of the woolmouth herds, increasing them in size.");
		return;
	}
	if (q.blademouths && q.blademouths < 5 && Math.random() * 100 + q.difficulty < 50 + q.animals * 20 - q.blademouths * 30) {
		q.blademouths++;
		out("The villagers take care of the blademouths. Soon, there are plenty of new blademouth kittens.");
		return;
	}
	if (q.codgers && q.codgers < 5 && Math.random() * 100 + q.difficulty < 40 + q.animals * 20 - q.codgers * 30) {
		q.codgers++;
		out("The villagers take care of the codgers. Soon, there are plenty of new codger cubs.");
		return;
	}
	if (q.spindrakes && q.spindrakes < 5 && Math.random() * 100 + q.difficulty < 30 + q.animals * 20 - q.spindrakes * 40) {
		q.spindrakes++;
		q.happy += 3;
		q.arousal += 3;
		out("The villagers take care of the spindrakes. Soon, there are plenty of new, beautiful hatchlings.");
		return;
	}
	q.animals++;
	out("The villagers take care of their strange new domestic animals, learning some new things about them in the process.");
}

function doExplore() {
	afterAction();
	var ee = pickEvent(explore, "explore: ");
	if (ee == null) {
		q.animals++;
		q.exploration++;
		q.food += 30;
		out("The explorers spend their time observing the strange beasts of the isle and collecting food.");
	} else {
		q["explore: " + ee.name] = true;
		ev(ee);
	}
}

function doHunt() {
	afterAction();
	ev(hunt);
}

function doHouses() {
	afterAction();
	ev(houses);
}

function doHall() {
	afterAction();
	ev(hall);
}

function doTemple() {
	afterAction();
	ev(temple);
}

function doWatchtower() {
	afterAction();
	ev(watchtower);
}

function doWalls() {
	afterAction();
	ev(walls);
}

function doReinforcedWalls() {
	afterAction();
	ev(reinforceWall);
}

function doShaping() {
	afterAction();
	ev(shaping);
}

function doVisitBimanes() {
	afterAction();
	ev(bimaneDelegation);
}

function doRaidBimanes() {
	afterAction();
	ev(bimaneRaid);
}

function doVisitRobedOnes() {
	afterAction();
	ev(robedOneDelegation);
}

function doRaidRobedOnes() {
	afterAction();
	ev(robedOneRaid);
}
