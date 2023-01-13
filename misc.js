var hunt = {
	text: "Your hunters ready their weapons.",
	options: [
		{
			text: "Send the hunters to find prey.",
			success: () => { return 15 + strength() / 4 + q.weapons * 15 + q.exploration * 5 + q.animals * 5; },
			danger: () => { return 70 - strength() / 4 - q.weapons * 10 - q.animals * 10; },
			run: (success, harm) => {
				if (success) {
					q.food += 70;
					q.arousal += 5;
					if (harm) {
						q.health -= 7;
						q.happy -= 2;
						out("The hunters come back battered and bruised, but with plenty of strange corpses, most of them edible.");
					} else {
						out("The hunters bring back an array of strange corpses, most of them edible.");
					}
				} else {
					q.arousal -= 3;
					if (harm) {
						q.health -= 9;
						q.happy -= 2;
						out("The hunters are attacked by monstrous creatures and barely escape with their lives.");
					} else {
						q.food += 10;
						out("The hunters have no luck and only manage to spear a few small animals. Hardly good eating.");
					}
				}
			}
		},
		{
			text: "Send the blademouths to find suitable prey.",
			check: () => { return q.blademouths; },
			success: () => { return 20 + strength() / 4 + q.weapons * 15 + q.blademouths * 10 + (q.blademouthScouts ? 30 : 0); },
			danger: () => { return 60 - strength() / 4 - q.weapons * 10 - (q.blademouthFighters ? 15 : 0); },
			run: (success, harm) => {
				if (success) {
					q.food += 90;
					q.arousal += 5;
					if (harm) {
						if (q.blademouths > 1) {
							q.blademouths--;
						}
						out("The blademouths run off into the forest, and enthusiastically corner a huge animal with feathered tentacles that proceeds to kill and maim many of them before it's brought down.");
					} else {
						out("The blademouths scamper off, your hunters following. Soon they indicate with happy squeaking that they have cornered some harmless lumbering beast. It falls easily.");
					}
				} else {
					q.arousal -= 3;
					q.food += 10;
					if (harm) {
						if (q.blademouths > 1) {
							q.blademouths--;
						}
						out("The blademouths run off into the forest. Your hunters struggle to follow. In the end, they find no prey of note, and not all of the blademouths return.");
					} else {
						out("The blademouths run about but fail to find any suitable prey. The hunters kill a few small animals, but not much.");
					}
				}
			}
		},
		{
			text: "Direct the codgers to ferret out underground prey.",
			check: () => { return q.codgers; },
			success: () => { return 20 + strength() / 4 + q.weapons * 15 + q.codgers * 10 + (q.codgerDiggers ? 30 : 0); },
			danger: () => { return 60 - q.codgers * 15 - (q.codgerFighters ? 10 : 0); },
			run: (success, harm) => {
				if (success) {
					q.food += 110;
					q.arousal += 5;
					if (harm) {
						if (q.codgers > 1) {
							q.codgers--;
						}
						out("The codgers sniff at the ground in a particular spot and start digging. After a while, a horrendous roar can be heard from deep underground. A great underground struggle begins. Eventually, the badly injured codgers drag a monstrous shark-skinned reptile to the surface");
					} else {
						out("The codgers snuffle and paw at the ground, and begin digging. They haul half-dead animals like huge multi-legged squirrels to the surface, where they are dispatched by the hunters.");
					}
				} else {
					q.arousal -= 3;
					if (harm) {
						if (q.codgers > 1) {
							q.codgers--;
						}
						out("The codgers sniff at the ground in a particular spot and start digging. After a while, a horrendous roar can be heard from deep underground. Panicked, injured codgers re-emerge from their tunnels and run back to the village, whining.");
					} else {
						q.food += 10;
						out("The codgers snuffle and paw at the ground, and begin digging. Eventually, they resurface with nothing to show for their efforts. Your hunters manage to kill a few small animals while waiting, but not much.");
					}
				}
			}
		},
		{
			text: "Send the spindrakes to find suitable prey.",
			check: () => { return q.spindrakes && !q.spindrakeRiders; },
			success: () => { return 10 + strength() / 4 + q.weapons * 15 + q.spindrakes * 20 - (q.spindrakeFire ? 10 : 0); },
			danger: () => { return 60 - strength() / 4 - q.weapons * 15; },
			run: (success, harm) => {
				if (success) {
					q.food += 120;
					q.arousal += 5;
					if (harm) {
						if (q.spindrakes > 1) {
							q.spindrakes--;
						}
						out("The spindrakes tense up and zoom away into the air. Not soon after, some of them return, bloodied, with torn wings. They lead the hunters to a great-mawed beast that is busy snapping at the drakes that flit past it. Every once in a while it catches one of them and devours it. The hunters charge with their spears and catch it by surprise, and slaughter it.");
					} else {
						out("The spindrakes flutter off in formation and soon return to direct your hunters to a group of docile scintillating amphibians that are easily slaughtered.");
					}
				} else {
					q.arousal -= 3;
					if (harm) {
						if (q.spindrakes > 1) {
							q.spindrakes--;
						}
						out("The spindrakes tense up and zoom away into the air. Not soon after, some of them return, bloodied, with torn wings. The others cannot be found.");
					} else {
						q.food += 10;
						out("The spindrakes launch themselves into the sky and can be seen darting back and forth for a long time. Eventually, they return, having either forgotten their instructions or failed to find anything. Frustrated, the hunters spear a few small rodents and return home with their meagre prey.");
					}
				}
			}
		},
		{
			text: "Mount the spindrakes for an aerial hunt.",
			check: () => { return q.spindrakes && q.spindrakeRiders; },
			success: () => { return 30 + strength() / 4 + q.weapons * 15 + q.spindrakes * 20; },
			danger: () => { return 50 - q.animals * 5; },
			run: (success, harm) => {
				if (success) {
					q.food += 90;
					q.arousal += 10;
					if (harm) {
						if (q.spindrakes > 1) {
							q.spindrakes--;
						}
						q.health -= 9;
						q.population -= 3;
						out("Your hunters mount their mighty giant drakes and zoom across the sky, easily spotting prey and downing it with arrows and spears from above. In the excitement of the chase, some riders crash.");
					} else {
						out("Your hunters mount their mighty giant drakes and zoom across the sky, easily spotting prey and downing it with arrows and spears from above.");
					}
				} else {
					q.arousal += 5;
					if (harm) {
						if (q.spindrakes > 1) {
							q.spindrakes--;
						}
						q.health -= 13;
						q.population -= 3;
						out("Your hunters mount their spindrakes and launch themselves into the air. The beasts prove difficult to master, leading to several fatal crashes.");
					} else {
						q.food += 10;
						out("Your hunters mount the spindrakes and fly hither and thither, but fail to spot any prey of note. The furious fluttering of the drakes' six wings may be so loud as to disperse any potential prey.");
					}
				}
			}
		},
		{
			text: "Cancel",
			run: () => { cancel(); }
		}
	]
};

var despair = {
	text: "Too many awful things have happened, and the mood of the people is desperate. People walk as if half-asleep, not bothering to talk or wash themselves. Others shut themselves in, weeping. Others simply vanish. It can't go on like this.",
	options: [
		{
			text: "Rouse the spirits of the people with a grand feast.",
			check: () => { return q.food >= q.population / 2; },
			success: () => { return 20 + q.familyTies * 20 - q.despairSaves * 30; },
			run: (success) => {
				q.despairSaves++;
				q.food -= Math.ceil(q.population / 2);
				if (success) {
					q.happy = 12;
					q.arousal += 8;
					q.songs++;
					out("All the best foods and drinks and clothes are brought out. The people rouse themselves to sing old and new songs, and bit by bit, by the light of a roaring fire, they regain some of their will.");
				} else {
					q.population = Math.ceil(q.population / 2);
					q.happy = 1;
					q.arousal -= 10;
					out("The feast, such as it is, is barely attended by anyone. People chew their food in silence and then leave without saying goodbye.<br><br>Soon, more people leave the village.");
				}
			}
		},
		{
			text: "Appeal to the bones of the ancestors.",
			check: () => { return q.bones; },
			success: () => { return 20 + q.tradition * 20 - q.despairSaves * 40; },
			run: (success) => {
				q.despairSaves++;
				if (success) {
					q.happy = 12;
					q.arousal += 5;
					q.tradition++;
					out("The priests put on their most magnificent robes. The ancestors' bones are polished and spoken to. The whole village comes together in prayer, and at the end, they stand up and feel themselves filled with the love and strength of the ancestors, ready to go on for a while longer.");
				} else {
					q.bones = false;
					q.tradition -= 2;
					q.happy = 1;
					q.arousal -= 15;
					out("The people shuffle into the temple and look at the bones. They are just bones, with crude letters carved into them. If the ancestors ever listened, they certainly are not listening now. They go back home, leaving the priests alone to mouth pointless songs and weep.<br><br>Soon, more people leave the village.");
				}
			}
		},
		{
			text: "Commit everyone able to hold a weapon to a raid upon the hated bimanes.",
			check: () => { return q.bimaneVillage && (q.bimaneAttacks > 0 || q.bimaneRelations < -1); },
			danger: () => { return q.bimaneStrength + 70 - q.weapons * 20 - strength() - (q.codgerFighters ? q.codgers * 5 : 0) - (q.blademouthFighters ? 8 + q.blademouths * 8 : 0) - q.tradition * 8; },
			run: (success, harm) => {
				if (harm) {
					lose("Man, woman and child, everyone able to wield something sharp, all crash through the weave-wall of the bimane village. The bimanes are ready for them, having clearly spotted the mob coming from a long way away, and expertly dispatch the actual fighters before herding the frightened children deeper into their village, never to be seen again.");
				} else {
					q.population = 20 + Math.ceil((q.population - 20) * 2 / 3);
					q.health -= 27;
					q.happy = 12;
					q.arousal += 20;
					q.woolmouths = Math.min(5, q.woolmouths + 2);
					q.valuables++;
					q.tools++;
					q.bimanesEncountered = false;
					q.bimaneVillage = false;
					out("Man, woman and child, everyone able to wield something sharp, all crash through the weave-wall of the bimane village and set upon the hated unnatural creatures. The bimanes are massacred and driven from their village, and the victorious people bring back food and tools and beads and a large herd of woolmouths, and then set the village aflame.");
				}
			}
		},
		{
			text: "Commit everyone able to hold a weapon to a raid upon the hated bimanes.",
			check: () => { return q.robedOneVillage && (q.robedOneAttacks > 0 || q.robedOneRelations < -1); },
			danger: () => { return q.robedOneStrength + 90 - q.weapons * 20 - strength() - q.codgers * 10 - (q.blademouthFighters ? 8 + q.blademouths * 8 : 0) - q.tradition * 8; },
			run: (success, harm) => {
				if (harm) {
					lose("Man, woman and child, everyone able to wield something sharp, all pour into the tunnels of the robed ones. The tunnels are strangely empty, though. Suddenly, there is a crash: the tunnel everyone is in collapses behind them. And then in front of them. And then atop them.");
				} else {
					q.population = 20 + Math.ceil((q.population - 20) * 2 / 3);
					q.health -= 27;
					q.happy = 12;
					q.arousal += 20;
					q.valuables += 2;
					q.food += 250;
					q.tools++;
					q.robedOnesEncountered = false;
					q.robedOneVillage = false;
					out("Man, woman and child, everyone able to wield something sharp, all pour into the tunnels of the robed ones, overwhelming them before they can mount any kind of defense. They are slaughtered and driven from their tunnels, and the villagers loot the place, finding vast food stores and copper ingots and tools. Then they carefully collapse all the tunnels behind them as they return to the surface, triumphant.");
				}
			}
		},
		{
			text: "Sink deeper into despair.",
			run: () => {
				q.population = Math.ceil(q.population / 2);
				q.happy = 1;
				q.arousal -= 10;
				out("More people leave, or vanish.");
			}
		}
	]
};
