var startEndText = "The ships they herded us into were old and leaky, but the spring weather was mild and the passage to the Isle was swift, thanks to our ancestors.<br><br>It was only when we arrived at the Isle and were driven out onto shore that we found out that one of the ships had gone off-course and vanished.<br><br>We now find ourselves in a rocky bay surrounded by slopes on all sides, with our meagre belongings on the sand next to us, and the ships sailing away.<br><br>Eventually, some prominent members of the larger families sit together to figure out what to do.";

var startEvent = {
	text: 'We were expelled from the nation where we had lived for generations, supposedly because we worshipped our ancestors instead of participating in the state cult, but really because our neighbours coveted our herds and fields and spread rumours about us.<br><br>We were told that we could re-settle on the Isle of Beasts, a strange land to the north where countless people had gone to die. As we were forced from our homes, we made sure to take:',
	options: [
		{
			text: "The inscribed bones of our ancestors",
			run: () => {
				q.happy += 5;
				q.tradition++;
				q.bones = 1;
				ev(difficultyEvent);
			}
		},
		{
			text: "Our weapons, to defend ourselves",
			run: () => {
				q.arousal += 15;
				q.weapons++;
				ev(difficultyEvent);
			}
		},
		{
			text: "Our best bronze knives, axes, awls, and other tools",
			run: () => {
				q.tools++;
				ev(difficultyEvent);
			}
		},
		{
			text: "Our valuables, sewn into secret pockets in our coats",
			check: () => { return playthroughs > 0; },
			run: () => {
				q.valuables += 3;
				q.happy += 10;
				ev(difficultyEvent);
			}
		},
		{
			text: "As much food as we could possibly carry",
			check: () => { return playthroughs > 1; },
			run: () => {
				q.food += 200;
				q.health += 4;
				q.happy += 3;
				ev(difficultyEvent);
			}
		},
		{
			text: "Medical herbs and their seeds",
			check: () => { return playthroughs > 2; },
			run: () => {
				q.medicine++;
				q.health += 8;
				ev(difficultyEvent);
			}
		},
		{
			text: "Any friends and servants willing to follow us into exile",
			check: () => { return playthroughs > 3; },
			run: () => {
				q.population += 21;
				ev(difficultyEvent);
			}
		},
	]
};

var difficultyEvent = {
	text: "As we were marched towards the ships, we expected our new life to be:",
	options: [
		{
			text: "Tough",
			run: () => {
				q.difficulty = -25;
				q.showStats = true;
				q.healthPerTurn = 2;
				q.moodPerTurn = 1;
				out(startEndText);
			}
		},
		{
			text: "Hard",
			run: () => {
				q.difficulty = -15;
				q.showStats = true;
				q.healthPerTurn = 1;
				q.moodPerTurn = 0;
				out(startEndText);
			}
		},
		{
			text: "Very hard",
			run: () => {
				q.difficulty = -15;
				q.difficultyMult = 0.85;
				q.showStats = true;
				q.healthPerTurn = 0;
				q.moodPerTurn = -1;
				out(startEndText);
			}
		},
		{
			text: "Near-impossible",
			run: () => {
				q.difficulty = -12;
				q.difficultyMult = 0.75;
				q.showStats = true;
				q.healthPerTurn = 0;
				q.moodPerTurn = -1;
				out(startEndText);
			}
		},
	]
};

var events = [
	{
		name: "explore hint",
		check: () => { return q.explores < 2 && q.turn > 6 && q.food > 100; },
		important: () => { return q.explores < 2 && q.turn > 6 && q.food > 100; },
		show: [],
		text: "Some members of the Gure family approach the council and suggest that more scouts should be sent out to explore the isle, to find more sources of food and other resources.",
		options: [
			{
				text: "You take this into consideration.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "meadow conflict",
		check: () => { return q.woolmouths > 1; },
		show: ["pawl", "eshling"],
		text: 'With the domestication of woolmouths, suitable grazing lands have become contested between the families. The Pawl family, who were the first to amass herds, have claimed all the lush nearby spaces, leaving the other families, especially the Eshlings, to graze their animals on far-away rocky meadows.<br><br>The Eshlings have brought this injustice before the council. The Pawls retort that they have worked hard to capture so many woolmouths, and that their large herds need the meadows they claimed.',
		options: [
			{
				text: "Do nothing.",
				run: () => {
					q.eshlingHappy--;
					q.pawlHappy++;
					q.equality--;
					q.law++;
					q.woolmouths++;
					q.happy -= 3;
					out("The Eshlings grumble at this. The Pawls' herds grow ever larger.");
				}
			},
			{
				text: "Redistribute the grazing lands so that all families have some good and some bad.",
				run: () => {
					q.eshlingHappy++;
					q.pawlHappy--;
					q.equality++;
					q.tribe++;
					q.woolmouths--;
					out("The Pawls grumble at this, but the other families all profit. The Pawls' oversized herds suffer from the lack of good grazing lands.")
				}
			},
			{
				text: "Redistribute both the lands and the woolmouths so that all families have the same.",
				run: () => {
					q.eshlingHappy++;
					q.pawlHappy -= 2;
					q.equality += 2;
					q.tribe++;
					q.woolmouths++;
					q.happy -= 3;
					out("Mater Lyssa Pawl walks out of the council, outraged at this interference in her family's affairs. Still, by redistributing the land and the herds, the work of herding is shared and the woolmouths prosper.");
				}
			},
			{
				text: "Punish the Pawls for their selfishness by making them swap herds and grazing spaces with the Eshlings.",
				run: () => {
					q.eshlingHappy += 3;
					q.pawlHappy -= 3;
					q.law--;
					q.equality--;
					q.happy -= 5;
					q.arousal += 5;
					q.woolmouths++;
					out("The council finds it right to punish the Pawls for their haughtiness. Mater Lyssa is outraged but bows to the council's ruling, stating that if the council seeks to punish success, then no one would be willing to work hard. The Eshlings gleefully take control of their possessions, and make sure to grow their herds even larger.");
				}
			},
			{
				text: "Rule that all woolmouths shall be held in common by the people.",
				success: () => {
					return 10 + q.happy * 0.25 + q.equality * 10 + q.tribe * 20 + q.pawlHappy * 10;
				},
				run: (success) => {
					q.eshlingHappy++;
					q.equality += 1;
					q.tribe += 2;
					if (success) {
						q.happy += 3;
						q.woolmouths++;
						out("The council works hard to convince the families that it makes more sense to keep the woolmouths in common for the benefit of the whole tribe. Ultimately, even the Pawls are convinced. The families take care of the woolmouths together, which prosper as a result.")
					} else {
						q.pawlHappy--;
						out("The Pawls are less than convinced by the council's arguments, but ultimately agree to share their herds and lands.")
					}
				},
			},
		]
	},
	{
		name: "shaping discovery woolmouths",
		check: () => { return q.woolmouths > 0 && q.shaping == 0; },
		important: () => { return q.turn >= 12; },
		show: [],
		text: "One of your woolmouth-herders excitedly convenes the council: she was watching over the creatures, thinking about the strange shapes of the animals on the isle. She became fascinated by the coarse wool on one of the creatures, and thought about it becoming stronger and coarser yet - and in front of her eyes, it did!<br><br>Further experimentation confirms that the creatures you domesticated can be re-shaped by concentrated thought. And the animals' shapes appear to be linked: nearby animals change shape in accordance. It should be possible to permanently re-shape your entire stock into perhaps yet more useful configurations.",
		options: [
			{
				text: "A fascinating development.",
				run: () => { q.shaping++; done(); }
			}
		]
	},
	{
		name: "shaping discovery blademouths",
		check: () => { return q.blademouths > 0 && q.shaping == 0; },
		important: () => { return q.turn >= 12; },
		show: [],
		text: "One of your hunters runs into the village hall: she was hunting alongside a blademouth, and they were still in the grass, stalking prey. She was watching the blademouth, thinking about the size and sharpness of its blades. And as she did so, its blades grew and became sharper yet.<br><br>Further experimentation confirms that the creatures you domesticated can be re-shaped by concentrated thought. And the animals' shapes appear to be linked: nearby animals change shape in accordance. It should be possible to permanently re-shape your entire stock into perhaps yet more useful configurations.",
		options: [
			{
				text: "A fascinating development.",
				run: () => { q.shaping++; done(); }
			}
		]
	},
	{
		name: "shaping discovery codgers",
		check: () => { return q.codgers > 0 && q.shaping == 0; },
		important: () => { return q.turn >= 12; },
		show: [],
		text: "A forager urgently convenes the council: he was looking for edible roots alongside a codger. As the creature was digging, he observed its metallic claws, thinking about how large and powerful they were. As he did so, the claws actually grew in size!<br><br>Further experimentation confirms that the creatures you domesticated can be re-shaped by concentrated thought. And the animals' shapes appear to be linked: nearby animals change shape in accordance. It should be possible to permanently re-shape your entire stock into perhaps yet more useful configurations.",
		options: [
			{
				text: "A fascinating development.",
				run: () => { q.shaping++; done(); }
			}
		]
	},
	{
		name: "shaping discovery spindrakes",
		check: () => { return q.spindrakes > 0 && q.shaping == 0; },
		important: () => { return q.turn >= 12; },
		show: [],
		text: "One of your hunters returns excitedly: he was hunting alongside a spindrake, observing its fluttering flight. He was thinking about how strange it was for it to have six wings, and imagining a spindrake with even more wings. And when it landed next to him, it had indeed grown an additional set of wings!<br><br>Further experimentation confirms that the creatures you domesticated can be re-shaped by concentrated thought. And the animals' shapes appear to be linked: nearby animals change shape in accordance. It should be possible to permanently re-shape your entire stock into perhaps yet more useful configurations.",
		options: [
			{
				text: "A fascinating development.",
				run: () => { q.shaping++; done(); }
			}
		]
	},
	{
		name: "child killed by monster",
		check: () => { return (q.houses || q.turn > 3) && !q.watchtower; },
		show: [],
		run: () => { q.population--; q.happy -= 5; q.arousal -= 5; },
		text: "A many-limbed monster stalks out of the night and tears apart one of the children. The villagers are aghast, terrified.",
		options: [
			{
				text: "Build a watchtower to protect the village.",
				check: () => { return q.houses; },
				run: () => { q.defenses++; q.watchtower = true; q.health -= 9; q.arousal += 2; out("With great enthusiasm and a fair few construction accidents, the villagers put up a watchtower."); }
			},
			{
				text: "Ask your explorers and foragers to take careful note of any potentially dangerous beasts",
				run: () => { q.exploration++; q.animals++; q.arousal += 5; out("The young people swear vigilance."); }
			},
			{
				text: "Pray to the ancestors for guidance and protection.",
				run: () => { q.tradition++; q.happy += 3; out("The people join hands and beseech the ancestors."); }
			}
		]
	},
	{
		name: "slitherer attack",
		check: () => { return q.houses; },
		show: [],
		text: "A profusion of feathered slithering animals emerges from between the bushes, attacking the village.",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 85 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.animalAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						out("The villagers attempt to defend against the monsters, but stand little chance. Many are killed.");
					} else {
						q.arousal += 4;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "croc-men attack",
		check: () => { return q.turn > 5 && q.houses; },
		show: [],
		text: "A group of scaly bipeds with crocodile mouths attacks the village!",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 105 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.animalAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						out("The villagers attempt to defend against the monsters, but stand little chance. Many are killed.");
					} else {
						q.arousal += 4;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "triped attack",
		check: () => { return q.turn > 8 && q.houses; },
		show: [],
		text: "Huge many-jawed tripeds erupt from beneath the earth and begin attacking the village.",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 125 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.animalAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						out("The villagers attempt to defend against the monsters, but stand little chance. Many are killed.");
					} else {
						q.arousal += 4;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "insect attack",
		check: () => { return q.turn > 18 && q.houses; },
		show: [],
		text: "Hundreds of large biting insects with leathery wings swarm towards the village.",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 115 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.animalAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						out("The villagers attempt to defend against the monsters, but stand little chance. Many are killed.");
					} else {
						q.arousal += 4;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "monkey attack",
		check: () => { return q.turn > 30 && q.houses; },
		show: [],
		text: "Dozens of creatures that look like large headless monkeys swarm out of the forest and attack the village.",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 110 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.animalAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						out("The villagers attempt to defend against the monsters, but stand little chance. Many are killed.");
					} else {
						q.arousal += 4;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "shipwreck survivors",
		check: () => { return q.turn > 5; },
		show: [],
		text: "A bedraggled group of shipwreck survivors arrives at the gates of the village, asking for aid. They are nobles from the old country, exactly the kind that sent you into exile.",
		options: [
			{
				text: "Suggest they might join your village",
				success: () => { return 20 + q.equality * 30 + q.happy - q.tradition * 20 - q.arousal / 4; },
				run: (success) => {
					if (success) {
						q.population += 11;
						q.equality++;
						q.tradition--;
						out("It takes some convincing both sides, but in the end, the survivors join your village.");
					} else {
						q.arousal += 10;
						out("Your villagers balk at this idea. The survivors are forced to move on.");
					}
				}
			},
			{
				text: "Give them food and shelter for the night",
				run: () => {
					q.food -= 11;
					q.happy += 5;
					q.arousal -= 5;
					q.tradition++;
					out("No matter the crimes that these people committed, your people will still offer them hospitality.");
				}
			},
			{
				text: "Refuse them",
				run: () => {
					q.arousal += 5;
					out("The idea of letting them into your homes is abhorrent. You leave them to wander the isle. Perhaps they will perish, perhaps not.");
				}
			},
			{
				text: "Kill them in retribution",
				run: () => {
					q.arousal += 10;
					q.valuables++;
					q.fights++;
					out("Here they are, the very devils that caused all this misery to your people! The villagers fall upon them with axes and clubs, and kill them, then take their jewels for themselves.");
				}
			}
		]
	},
	{
		name: "war bands",
		check: () => { return q.animalAttacks + q.fights > 3; },
		show: [],
		text: "With all the recent fighting, your villagers have become increasingly proficient at war. Groups of youngsters have started organizing into small war bands that fight and train together. The elders complain that they are neglecting their family ties and duties.",
		options: [
			{
				text: "Approve of these war bands",
				run: () => { q.tribe++; q.weapons++; q.familyTies -= 2; done(); }
			},
			{
				text: "Remind the youngsters of their family ties",
				run: () => { q.tradition++; q.familyTies += 2; done(); }
			}
		]
	},
	{
		name: "meal groups",
		check: () => { return q.turn > 15; },
		show: [],
		text: "With all five families living and working together so closely, the tradition of families eating together is unravelling. Instead, people who work together are setting up their own hearths. They say that this is more efficient. The elders complain that they are neglecting their family ties and duties.",
		options: [
			{
				text: "Approve of these new hearths",
				run: () => { q.tribe++; q.effectiveness += 5; q.familyTies -= 2; q.mealGroups = true; done(); }
			},
			{
				text: "Remind the youngsters of their family ties",
				run: () => { q.tradition++; q.familyTies += 2; done(); }
			}
		]
	},
	{
		name: "fights",
		check: () => { return q.happy < 20 && q.arousal > 30; },
		show: [],
		text: "With the mood in the village so low, fights keep breaking out. Bruises, contusions, broken noses. It's only a matter of time before someone is killed.",
		options: [
			{
				text: "A worrying development.",
				run: () => { q.health -= 10; q.arousal += 10; q.fightsHad = true; done(); }
			}
		]
	},
	{
		name: "more fights",
		check: () => { return q.happy < 20 && q.arousal > 30 && q.fightsHad; },
		show: [],
		text: "Fighting is now a near-daily occurrence, tearing apart the peace in the village.",
		options: [
			{
				text: "Something must be done to lift the people's spirits.",
				run: () => { q.health -= 20; q.arousal += 10; done(); }
			}
		]
	},
	{
		name: "happy marriages",
		check: () => { return q.health >= 90 && q.food >= 200 && q.happy > 60 && q.happy < 90 && q.temple; },
		show: [],
		text: "The villagers have been in good spirits recently. It seems that you might after all not perish on this strange island. And so, many of the young people are getting married.",
		options: [
			{
				text: "A welcome development.",
				run: () => { q.happy += 5; q.arousal += 5; q.happyMarriages = q.turn; done(); }
			}
		]
	},
	{
		name: "rescue woolmouths",
		check: () => { return q.woolmouths > 2; },
		show: [],
		text: "A sinkhole has opened up in the meadows and trapped many of your woolmouths within it. You can hear distressed bleating from below. The hole is very deep and the edges are crumbling.",
		options: [
			{
				text: "Construct a set of pulleys to lift the creatures back out.",
				danger: () => { return 80 - q.tools * 20; },
				run: (success, harm) => {
					if (harm) {
						q.woolmouths -= 2;
						q.population--;
						q.happy -= 5;
						q.arousal -= 5;
						out("The village's artisans build a set of pulleys with which they attempt to rescue the woolmouths. But the machinery breaks under the weight, killing one of its operators.");
					} else {
						q.arousal += 5;
						out("The village's artisans build a clever set of pulleys that allows them to lower a net into the hole and winch up each of the woolmouths in turn.");
					}
				}
			},
			{
				text: "Construct an earthen ramp down into the hole to rescue them.",
				danger: () => { return 120 - q.tools * 10 - strength() / 2; },
				run: (success, harm) => {
					if (harm) {
						q.woolmouths -= 2;
						q.population -= 3;
						q.health -= 10;
						q.happy -= 8;
						out("The villagers attempt to build a ramp, but the soil around the sinkhole is unstable and keeps on collapsing, killing several people before they give up.");
					} else {
						q.health -= 10;
						out("It's hard work, but eventually a pathway is made to rescue the woolmouths.");
					}
				}
			},
			{
				text: "Tell the codgers to make an earthen ramp down into the hole to rescue them.",
				check: () => { return q.codgers; },
				danger: () => { return 80 - q.codgers * 20 - (q.codgerDiggers ? 50 : 0); },
				run: (success, harm) => {
					if (harm) {
						q.codgers = Math.max(1, q.codgers - 1);
						q.happy -= 8;
						q.woolmouths -= 2;
						out("The codgers attempt to shape the loose soil into a ramp, but it keeps on collapsing. In the end, both the woolmouths and several of the codgers are buried and dead.");
					} else {
						out("The codgers easily shape the loose soil into a ramp by which the woolmouths can return to their meadows.");
					}
				}
			},
			{
				text: "Attempt to reshape the trapped woolmouths to have wings.",
				check: () => { return q.shaping > 0; },
				danger: () => { return 100 - q.shaping * 10; },
				run: (success, harm) => {
					if (harm) {
						q.woolmouths -= 2;
						q.happy -= 5;
						q.arousal += 5;
						out("Your shapers theorise that with sufficient skill and concentration, even such radical changes as adding functional wings to a large terrestrial creature would be possible.<br><br>Unfortunately, they cannot muster that skill or concentration, and the woolmouths instead contort into strange and horrible shapes, wing-stubs erupting in random places, before dying noisily.")
					} else {
						q.arousal += 5;
						q.happy += 5;
						q.shaping += 3;
						out("Your shapers theorise that with sufficient skill and concentration, even such radical changes as adding functional wings to a large terrestrial creature would be possible.<br><br>The shapers all come together next to the sinkhole and focus on the woolmouths. Their shapes blur and shrink, and massive wings erupt from their backs. With a massive effort of will, the shapers temporarily stabilise the creatures in this new shape, allowing them to take flight and leave the sinkhole before reverting to their original forms. It's a triumph of the theory and practice of shaping.")
					}
				}
			},
			{
				text: "Abandon the woolmouths to their fate.",
				run: () => {
					q.woolmouths -= 2;
					q.arousal -= 8;
					out("The sinkhole is just too deep, and the risk too great.");
				}
			}
		]
	},
	{
		name: "pop growth",
		check: () => { return q.turn > 5 && q.houses; },
		important: () => { return q.turn > 11; },
		run: () => {
			q.happy += 8;
			q.population += 8;
		},
		show: [],
		text: "The first babies are born on the isle. The mothers and grandmothers and aunts crowd along the newborns swaddled in their hearth rooms.",
		options: [
			{
				text: "Happy news!",
				run: () => {
					done();
				}
			}
		]
	},
	{
		name: "pop growth from happy marriages",
		check: () => { return q.happyMarriages && q.turn > q.happyMarriages + 4; },
		important: () => { return q.turn > q.happyMarriages + 6; },
		show: [],
		run: () => {
			q.happy += 5;
			q.population += 13;
		},
		text: "The many newlyweds in the village have now brought forth many babies. The mothers and grandmothers and aunts crowd along the newborns swaddled in their hearth rooms.",
		options: [
			{
				text: "A happy time for the village.",
				run: () => {
					done();
				}
			}
		]
	},
	{
		name: "jenet vs gure wagon",
		check: () => { return q.houses; },
		show: ["gure", "jenet"],
		text: "Pater Tim of the Jenets appeals to the council for a judgement against the Gures. The Jenets built a sturdy wagon for transporting goods and produce, and allowed the Gures to use it as well. The Gures have over-used it to the point where it is breaking down. Tim rants against what he calls Gure selfishness, and how the Jenets are expected to work for everyone without reward.<br><br>The Gures point out that any wagon will break down eventually, and that most of what they used it for was also to the benefit of the whole village. If the Jenets wanted them to stop using it, they could have said so at any time.",
		options: [
			{
				text: "Have the Gures compensate the Jenets for the value of the wagon.",
				success: () => { return 60 + q.valuables * 10 + q.law * 20 + q.gureHappy * 20; },
				run: (success) => {
					q.law++;
					if (success) {
						out("Both sides accept this with a minimum of grumbling.");
					} else {
						q.gureHappy--;
						out("The Gures complain that they are once again being punished for a made-up infraction. But they pay the compensation.");
					}
				}
			},
			{
				text: "Have the council commission the building of a new wagon that will be held in common.",
				success: () => { return 35 + q.tools * 25 + q.tribe * 20 + q.equality * 10 - q.familyTies * 10; },
				run: (success) => {
					if (success) {
						q.effectiveness += 10;
						q.tribe++;
						out("The new wagon is just as good as the old one. All the families now use it, and the council makes sure it remains in good repair.");
					} else {
						q.gureHappy--;
						q.jenetHappy--;
						q.happy -= 5;
						q.arousal += 10;
						out("The new wagon is unfortunately not nearly as good as the old one, and now everyone blames each other.");
					}
				}
			},
			{
				text: "Have the Gures formally apologise to the Jenets for breaking their wagon.",
				run: () => {
					q.happy -= 2;
					q.arousal += 3;
					q.jenetHappy--;
					out("The apology is clearly half-hearted and received frostily.");
				}
			}
		]
	},
	{
		name: "jenet vs pawl bride price",
		check: () => { return q.temple; },
		show: ["jenet", "pawl"],
		text: "A man from the Jenet family is due to marry a Pawl woman, but the families are bickering over the bride price.<br><br>Mater Lyssa of Pawl insists that the bride price they ask for is fair, and that anything less would be an insult.<br><br>Pater Tim of the Jenet family complains that such a bride price would have been high in the old country, and here in exile, it is downright extortionate.<br><br>Meanwhile, the gossip is that the Pawls do not want this marriage to happen at all, hence the high bride price - but the couple very much want to be married.",
		options: [
			{
				text: "Force the Jenets to pay the bride price",
				run: () => {
					q.jenetHappy--;
					q.pawlHappy--;
					out("Both the Jenets and Pawls are unhappy at this, but the newlyweds are overjoyed, and their families soon soften a bit.");
				}
			},
			{
				text: "Force the Pawls to accept a more appropriate bride price",
				run: () => {
					q.pawlHappy--;
					q.familyTies--;
					out("The Pawls are angry at this interference by the council, but everyone else is happy to see them taken down a peg. And the wedding is lovely.");
				}
			},
			{
				text: "Make up the difference between the price asked for and a normal amount",
				check: () => { return q.valuables >= 1; },
				run: () => {
					q.valuables--;
					out("The councillors use their wealth and call in favours to help the Jenets match the bride price. The wedding goes ahead, and everyone is mollified.");
				}
			},
			{
				text: "Attempt to abolish the practice of bride prices",
				success: () => { return 45 + q.law * 20 + q.equality * 20 - q.familyTies * 20 - q.tradition * 30; },
				run: (success) => {
					if (success) {
						q.equality++;
						q.familyTies -= 2;
						q.tradition--;
						q.effectiveness += 5;
						out("Citing this incident as an example of why the practice is unpleasant and unfair, the council successfully convinces the people to stop asking for bride prices. With this financial barrier out of the way, families no longer hold much sway over who is married to whom. The wedding goes ahead without a bride price, and the couple is overjoyed.");
					} else {
						q.jenetHappy--;
						q.pawlHappy--;
						q.happy -= 5;
						out("The people reject the council's arguments. Yes, perhaps the bride price is large, but it's the prerogative of the Pawls to ask for it, as they would lose a beautiful and industrious member of their household. To save face, the council leans on both the Pawls and the Jenets to come to a compromise. So at least the wedding happens, even if no one except for the couple is very happy about it.");
					}
				}
			},
			{
				text: "Do nothing - if the families can't agree on a bride price, that's their problem",
				run: () => {
					q.pawlHappy--;
					q.happy -= 3;
					out("The two families never do agree on a bride price, and the wedding does not happen. The would-be bride is soon pregnant anyway, to the shame of the Pawls.");
				}
			}
		]
	},
	{
		name: "people demand village hall",
		check: () => { return q.turn > 5 && q.houses && !q.hall; },
		important: () => { return q.turn > 9; },
		show: [],
		text: "The people complain that there is no village hall for gatherings and feasts.",
		options: [
			{
				text: "Promise to build one immediately.",
				run: () => {
					q.hallReminder = q.turn + 3;
					done();
				}
			}
		]
	},
	{
		name: "still no village hall",
		check: () => { return q.hallReminder && q.turn >= q.hallReminder && !q.hall; },
		important: () => { return q.turn >= q.hallReminder + 1; },
		show: [],
		text: "The people are furious that there is still no village hall. Where can they gather? Where can they sing their songs? They withdraw into their houses and hearth-rooms.",
		options: [
			{
				text: "An unfortunate turn of events.",
				run: () => {
					q.happy -= 8;
					q.effectiveness -= 10;
					q.familyTies++;
					q.tribe--;
					q.tradition--;
					done();
				}
			}
		]
	},
	{
		name: "people demand village houses",
		check: () => { return q.turn > 2 && !q.houses; },
		important: () => { return q.turn > 3; },
		show: [],
		text: "The people complain that they are still sleeping outdoors in the cold. Houses need to be built to keep them warm and safe.",
		options: [
			{
				text: "Promise to build them immediately.",
				run: () => {
					q.houseReminder = q.turn + 2;
					done();
				}
			}
		]
	},
	{
		name: "still no houses",
		check: () => { return q.houseReminder && q.turn >= q.houseReminder && !q.houses; },
		important: () => { return q.turn >= q.houseReminder + 1; },
		show: [],
		text: "The people are furious that there are still no houses despite the council's promises, so they take matters into their own hand and build some ramshackle dwellings.",
		options: [
			{
				text: "At least now they will have a dry place to sleep.",
				run: () => {
					q.happy -= 8;
					q.effectiveness -= 10;
					q.familyTies++;
					q.tribe--;
					q.law--;
					done();
				}
			}
		]
	},
	{
		name: "people demand temple",
		check: () => { return q.turn > 8 && q.hall && !q.temple; },
		important: () => { return q.turn > 10; },
		show: [],
		text: "The people complain that there is no temple for them to worship the ancestors and conduct important ceremonies.",
		options: [
			{
				text: "Promise to build one immediately.",
				run: () => {
					q.templeReminder = q.turn + 3;
					done();
				}
			}
		]
	},
	{
		name: "still no temple",
		check: () => { return q.templeReminder && q.turn >= q.templeReminder && !q.temple; },
		important: () => { return q.turn >= q.templeReminder + 1; },
		show: [],
		text: "The people are angry that there is still no temple, so they retreat to their hearth-rooms and perform their ceremonies apart from each other.",
		options: [
			{
				text: "An unfortunate turn of events.",
				run: () => {
					q.happy -= 8;
					q.effectiveness -= 5;
					q.familyTies++;
					q.tradition--;
					done();
				}
			}
		]
	},
	{
		name: "no defenses",
		check: () => { return q.defenses == 0 && q.animalAttacks > 0; },
		important: () => { return q.animalAttacks > 1; },
		show: [],
		text: "The people appeal to the council to build some defenses for the protection of the village.",
		options: [
			{
				text: "OK",
				run: () => { done(); }
			}
		]
	},
	{
		name: "jenet vs eshling ritual precedence",
		check: () => { return q.temple; },
		show: ["jenet", "eshling"],
		text: "When the people assemble in the temple, they enter it in a particular order based on ritual precedence. By tradition, the Jenets go in before the Eshlings do, but now Pater Sara of the Eshlings has lodged a formal suit against the Jenets, accusing them of collaborating with the Eshlings' overlords in the old country and betraying the people as a whole.<br><br>Pater Tim of the Jenets is shocked at this. Should they not leave behind the divisions that existed in the old country? Everyone did what they had to do to survive: the Eshlings were soldiers, the Pawls were sometimes tax collectors, so why single out the Jenets?<br><br>Others murmur that it is true that the Jenets were always very keen to report any crimes or heresies to the authorities, bringing the people into disrepute. And the impoverished Eshlings with their odd rituals most of all.",
		options: [
			{
				text: "The past is the past. We must all be equal in this new world. Abolish ritual precedence and encourage the families to enter the temple all mixed together.",
				success: () => { return 30 + q.happy / 2 - q.tradition * 20 + q.equality * 20; },
				run: (success) => {
					if (success) {
						q.tradition--;
						q.happy += 5;
						q.eshlingHappy++;
						out("The people accept this ruling. Living in the old country was awful for everyone, and now they live on the isle, they need to let go of old grievances and divisions.");
					} else {
						q.eshlingHappy--;
						out("The people accept this ruling, but in practice, there is little difference in the order in which the families enter the temple. Nothing has really changed, and the Eshlings' grievances continue to fester.");
					}
				}
			},
			{
				text: "No matter what happened in the old country, the traditional ritual precedence is clear. Dismiss the complaint.",
				success: () => { return q.tradition * 20 + q.eshlingHappy * 30; },
				run: (success) => {
					q.tradition++;
					if (success) {
						out("The old people in the crowd mutter and nod their heads, approving of this appeal to tradition. Pater Sara bows his head and accepts the ruling.");
					} else {
						q.eshlingHappy -= 2;
						q.effectiveness -= 10;
						out("Pater Sara stands apart from the council and denounces them: It is clear to him that they will always think of the Eshlings as lesser than the other families, as dirt that can be trodden upon, as convenient sacrifices for collaborators. And now the council hides behind an appeal to tradition to deny the Eshlings even the smallest acknowledgement of the hurt inflicted on their family. He stalks off. The next time the families are called to the temple, the Eshlings refuse to come.");
					}
				}
			},
			{
				text: "The Eshlings are attempting to raise old grievances based on old libels. Dismiss the complaint.",
				success: () => { return 30 + q.eshlingHappy * 20 + q.law * 30 - q.tradition * 10; },
				run: (success) => {
					if (success) {
						q.law++;
						out("The Eshlings accept this. Perhaps they simply needed to be heard.");
					} else {
						q.eshlingHappy -= 2;
						q.happy -= 8;
						q.arousal += 10;
						q.health -= 10;
						out("The Eshlings do not accept the ruling. The next time the families enter the temple, a scuffle breaks out between the two families that injures several people.");
					}
				}
			},
			{
				text: "Everyone knows what the Jenets did to the Eshlings. Having them swap ritual precedence acknowledges this guilt, and it doesn't harm them materially.",
				success: () => { return q.tradition * 20 + q.law * 10; },
				run: (success) => {
					if (success) {
						q.tradition++;
						q.law++;
						q.eshlingHappy++;
						q.arousal -= 10;
						out("The Jenets bow their heads and weep. They beg the ancestors for forgiveness for the crimes that they committed in the old country and accept their demotion.");
					} else {
						q.eshlingHappy++;
						q.jenetHappy -= 2;
						q.effectiveness -= 10;
						out("Pater Tim stands apart from the council and denounces them: It is clear to him that the Jenets will never be good enough for the other families, no matter how hard they work. They will always be followed by this libel. He stalks off. The next time the families are called to the temple, the Jenets refuse to come.");
					}
				}
			}
		]
	},
	{
		name: "jenet vs aphal hunters",
		check: () => { return q.turn > 5; },
		show: ["jenet", "aphal"],
		text: "A group of young men from the Aphal family have established themselves as the mightiest hunters of the village. They bring back magnificent prey and naturally take the best cuts for themselves. There is another group of hunters from the Jenet family, perhaps just as good. When they arrive with their catch, the families crowd around them, and they meekly hand out an equal share of the meat.<br><br>Simmering resentment about this turns into a council discussion one day: Pater Tim of Jenet complains that as always, the Jenets are expected to work to the benefit of everyone with no expectation of praise, while the other families are praised and rewarded for their work.",
		options: [
			{
				text: "Rule that returning hunters must openly share their catch with all families",
				success: () => { return 50 + q.law * 15 + q.tribe * 10 - q.familyTies * 10 },
				run: (success) => {
					q.tribe++;
					if (success) {
						out("The people see the justice of this ruling and agree to it.");
					} else {
						q.aphalHappy--;
						out("The Aphal hunters are less than pleased at this ruling - why should they risk life and limb in pursuit of prey if it will be taken away by envious stay-at-homes?");
					}
				}
			},
			{
				text: "Rule that returning hunters are at liberty to divide up their prey however they want",
				success: () => { return 30 + q.law * 20 - q.tribe * 30 - q.equality * 20 + q.familyTies * 10; },
				run: (success) => {
					if (success) {
						q.happy += 3;
						q.jenetHappy++;
						out("The Jenet hunters get the hint and start retaining the best meats for themselves. The people are happy to see them do so, as they deserve it for their courage.");
					} else {
						q.happy -= 3;
						q.arousal += 5;
						out("Based on this ruling, the Jenet hunters attempt to retain the best meat for themselves, but the other families take offense at what they consider Jenet conceitedness.");
					}
				}
			},
			{
				text: "Commend both the Aphal and Jenet hunters for their prowess and ask them to stop their rivalry",
				run: () => {
					q.jenetHappy--;
					out("Exasperated, Pater Tim attempts to explain that this is not the point. The hunters' prowess is not in question, it's a matter of fairness between families. But the rest of the council considers the matter dealt with.");
				}
			}
		]
	},
	{
		name: "gure vs pawl pottery",
		check: () => { return q.houses && q.turn > 10; },
		show: ["pawl", "gure"],
		text: "Making decent pottery in this new place has been difficult. The clay is different, and none of the known materials for glazes are available. Still, the Pawl family has become very proficient at turning out beautiful reddish stoneware. Meanwhile, the Gures, who perhaps lack the patience, struggle making enough pottery for their own use. And the Pawls have noticed this, and taken it upon themselves to try and instruct the Gures, which they do not enjoy at all.<br><br>When a fistfight breaks out between a Pawl and a Gure potter, the matter is brought to the attention of the council.",
		options: [
			{
				text: "The Pawls are clearly the best potters, and should make pottery for all the other families, who will compensate them for their labor.",
				success: () => { return 10 + q.tools * 15 - q.equality * 20 + q.tribe * 20; },
				run: (success) => {
					if (success) {
						q.effectiveness += 10;
						q.tribe++;
						q.pawlHappy++;
						out("The Pawls are overjoyed to have their skills acknowledged by the council. The other families are content to feed the Pawls' pride if it means that they get nice pottery out of it.");
					} else {
						out("At first, the Pawls are pleased to have their skills acknowledged, but making pottery for everyone turns out to be hard work, and the compensation is rather meagre.");
					}
				}
			},
			{
				text: "It is good that the Pawls want to teach their techniques to others, who should listen.",
				success: () => { return 20 + q.tribe * 30 + q.gureHappy * 30; },
				run: (success) => {
					if (success) {
						q.effectiveness = 5;
						q.equality++;
						q.gureHappy++;
						q.pawlHappy++;
						out("The council convinces the Gure potters to sit down with their Pawl counterparts and properly listen to their instructions. Soon, they are turning out pottery nearly as good as the Pawls'.");
					} else {
						q.gureHappy--;
						q.pawlHappy--;
						out("The council tries to convince the Gure potters to listen to the Pawls, but they feel humiliated by the suggestion and refuse. The Pawls, in turn, are just exasperated.");
					}
				}
			},
			{
				text: "Tell the Pawls to stop imposing themselves. If the Gures want to know about pottery, they will ask.",
				success: () => { return 20 + q.law * 10 + q.tools * 30 + q.familyTies * 10; },
				run: (success) => {
					if (success) {
						q.gureHappy++;
						q.effectiveness += 5;
						q.happy += 5;
						out("The Pawls accept this, and away from the constant criticism of others, the Gure pottery improves and turns into a distinct, beautiful style all of its own.");
					} else {
						q.gureHappy--;
						q.pawlHappy++;
						out("Having made the point that they are the more skilled artisans, the Pawls are happy to let the Gures humiliate themselves with their lumpy unglazed barely-functional pottery.");
					}
				}
			}
		]
	},
	{
		name: "gure vs eshling golden bowl",
		check: () => { return q.temple; },
		show: ["gure", "eshling"],
		text: "The Eshlings have some unique rituals within their family not shared by the other families. Many of their strangest rituals involve a golden bowl that they somehow managed to smuggle past the avaricious soldiers that escorted them into exile. The other families, especially the Gures, are wary of these rituals. Eventually the situation comes to a head with the council.<br><br>Mater Alice of Gure voices her suspicions of the Eshlings with their strange rituals. What exactly are they worshipping with this bowl? Why are they doing it in their hearth-room instead of at the temple?<br><br>Pater Sara of the Eshlings retaliates: Their family rituals are no one else's business, and the Gures simply covet their bowl.",
		options: [
			{
				text: "Ask the Eshlings to teach those rituals to everyone, so they can be performed in the temple.",
				success: () => { return 50 + q.tribe * 10 + q.eshlingHappy * 10 + q.equality * 20 - q.tradition * 20; },
				run: (success) => {
					if (success) {
						q.eshlingHappy++;
						q.equality++;
						out("Reluctantly, the Eshlings agree to share their rituals with the other priests. The council leans on the priests to declare them in line with everyone else's beliefs, and so the bowl is transferred to the temple, and everyone joins in.");
					} else {
						q.eshlingHappy -= 2;
						q.tradition++;
						q.tribe++;
						out("Reluctantly, the Eshlings agree to share their rituals with the other priests, but when the priests learn of the particulars, they denounce them as heretical. The Eshlings are forced by the priests to give up their bowl, and their unsavoury religious practices.");
					}
				}
			},
			{
				text: "Demand that the Eshlings cease their heretical rituals, in the interests of unity.",
				success: () => { return 0 + q.tribe * 30 + q.tradition * 10 + q.eshlingHappy * 20; },
				run: (success) => {
					if (success) {
						q.tradition++;
						q.tribe++;
						q.familyTies--;
						out("The Eshlings agree to this, as they do not want to offend their neighbours. Perhaps they carry on in secret, but at least in public, the problem is solved.");
					} else {
						q.eshlingHappy -= 2;
						q.happy -= 5;
						q.arousal += 5;
						out("The Eshlings balk at this, and when it comes to the question of the bowl, they flat out refuse to transfer it to the temple, or even let others touch it. They are shunned by the other families.");
					}
				}
			},
			{
				text: "Remind the people that religious intolerance was the cause of your exile. People ought to be allowed to worship as they please.",
				success: () => { return 30 + q.tribe * 20 + q.law * 20 + q.familyTies * 10 - q.tradition * 20; },
				run: (success) => {
					if (success) {
						q.eshlingHappy++;
						q.familyTies++;
						q.arousal -= 5;
						out("The people recall their painful exile, and the hate that preceded it. The Eshlings are left in peace from there on.");
					} else {
						q.eshlingHappy--;
						out("The Gures refuse to let the topic go, and continue to speak viciously about the Eshlings and their strange dirty rituals.");
					}
				}
			}
		]
	},
	{
		name: "gure vs aphal on shaping",
		check: () => { return q.shaping > 3; },
		show: ["gure", "aphal"],
		text: "The council is called to adjudicate a conflict between an Aphal and a Gure shaper. They have been arguing for hours about the merits of their approaches to shaping. The Aphal shaper has constructed elaborate theories on the nature of shaping, whereas the Gure one simply tries things out. Both consider the other's approach misguided and potentially dangerous.",
		options: [
			{
				text: "Command the Aphal shaper to spend more time with actual animals instead of her diagrams.",
				run: () => {
					q.animals += 2;
					out("She rolls her eyes at this but complies.");
				}
			},
			{
				text: "Command the Gure shaper to be more methodical in his experimentation.",
				run: () => {
					q.shaping++;
					out("He balks at this but complies.");
				}
			},
			{
				text: "Encourage them to keep learning more about shaping in their own way.",
				run: () => {
					q.happy--;
					q.arousal += 3;
					out("Upon hearing this ruling, both of them denounce the council for idiots.");
				}
			}
		]
	},
	{
		name: "pawl vs aphal land dispute",
		check: () => { return q.hall; },
		show: ["pawl", "aphal"],
		text: "The Pawl and Aphal families have brought to the council a series of ever-escalating over-complicated adjudications over water usage, late-night singing, the proper disposal of trash, indecently large ear-rings, and the proper way to hold a knife. It turns out that all of this is really about a dispute in the old country, where the Aphals tricked the Pawls into renting them a piece of land for free. The land is now across the sea and in the hands of your enemies, but apparently the resentment still simmers.",
		options: [
			{
				text: "Allow them to re-litigate their original grievances so that they might perhaps put it to rest.",
				success: () => { return q.law * 30 + q.happy / 4; },
				run: (success) => {
					if (success) {
						q.law++;
						out("After many many hours of complex legal arguments, the litigants and the council come to the crux of the matter, an ambiguity in a contract made two centuries ago. Having arrived there, the Aphals are convinced to apologise to the Pawls, who are convinced to forgive them.");
					} else {
						q.law--;
						out("The longer the legal arguments drag on, the more complex the dispute becomes, until it is a tangled mess of claims and counter-claims. The moon would fall out of the sky before a verdict could be reached, and so the parties are sent home and told to never ever come back.");
					}
				}
			},
			{
				text: "Ask the priests to do a bone-carving ceremony with the litigants from the two families to reconcile them.",
				success: () => { return 10 + q.tradition * 25; },
				check: () => { return q.temple; },
				run: (success) => {
					if (success) {
						q.tradition++;
						q.happy += 5;
						out("In a bone-carving ceremony, two groups of people work together to inscribe the bone of an ancestor with a new symbol. The ritual takes a long time and requires careful coordination. In the end, the ancestors are honoured and smile upon the participants. It's popularly used to reconcile fighting spouses, rivals, and families at odds with each other.<br><br>And indeed, when the two sides have completed the ceremony, they hug and vow to forget the old disputes of the old country.");
					} else {
						q.aphalHappy--;
						q.pawlHappy--;
						q.arousal += 10;
						q.happy -= 5;
						out("In a bone-carving ceremony, two groups of people work together to inscribe the bone of an ancestor with a new symbol. The ritual takes a long time and requires careful coordination. In the end, the ancestors are honoured and smile upon the participants. It's popularly used to reconcile fighting spouses, rivals, and families at odds with each other.<br><br>Unfortunately, if the two sides are in too much discord, the ceremony can go wrong - as it does here, with a botched symbol and recriminations.");
					}
				}
			},
			{
				text: "Condemn both of them for bothering the council with their ancient disputes.",
				run: () => {
					q.happy += 3;
					q.aphalHappy--;
					q.pawlHappy--;
					out("They take offense at this, but everyone else is relieved.");
				}
			},
		]
	},
	{
		name: "eshling vs aphal mural",
		check: () => { return q.houses; },
		show: ["eshling", "aphal"],
		text: "The Aphal family have painted a mural of the old country in their hearth room. It shows all the families. The Aphals are, understandably, front and center, but the Eshlings are drawn very small and ugly, in the very corner of the mural.<br><br>One day, Pater Sara of the Eshling visits the Aphal hearth room and sees the mural. He goes straight to the council and denounces the Aphals for the way that they shame his family.<br><br>Pater Zeno, the Aphal patriarch, is called in. He points out that this is a mural in the Aphals' hearth room, which it is a privilege for an outsider to even enter, and private to his family.<br><br>Sara counters that even so, he would prefer it if his family were not represented as ugly little homunculi in their neighbours' house.",
		options: [
			{
				text: "Demand that the Aphals repaint that part of the mural to show the Eshlings in a more favourable light.",
				run: () => {
					q.aphalHappy--;
					q.eshlingHappy++;
					q.equality++;
					q.familyTies--;
					out("The Aphals complain about the council's interference in their family affairs, but comply. The artist of the mural complains to anyone who will listen that its visual composition has been ruined.");
				}
			},
			{
				text: "Let the Aphals do whatever they want in their hearth room.",
				run: () => {
					q.aphalHappy++;
					q.eshlingHappy--;
					q.familyTies++;
					out("The Aphals are pleased at this, while the Eshlings just look sad and retreat a little bit more from village life.");
				}
			},
			{
				text: "Commission a large mural in the village hall that shows people of all the families standing together.",
				success: () => { return -10 + q.tools * 20 + strength() / 2 + q.forage * 10; },
				run: (success) => {
					if (success) {
						q.equality++;
						q.tribe++;
						q.eshlingHappy++;
						q.familyTies -= 2;
						out("The mural is a huge, beautiful thing celebrating all the people of the village, making it clear that it does not matter which family you belong to.");
					} else {
						q.happy -= 5;
						q.familyTies--;
						out("The public mural ends up being an ugly thing, its colors fading quickly in the rain and the sun.");
					}
				}
			}
		]
	},
	{
		name: "aphal vs gure trade deal",
		check: () => { return q.houses && q.valuables > 1; },
		show: ["aphal", "gure"],
		text: "Mater Alice of the Gure family and Pater Zeno of the Aphals come before the council. They have no quarrel with each other, but rather a quarrel with their families. They agreed to a deal between their families, trading tools for pottery and clothes. But now others in their family complain that they do not want to make this trade at all. They ask the council to tell their family members to comply.",
		options: [
			{
				text: "Remind Alice and Zeno that even as family heads, they must still work with the consent of the others.",
				run: () => {
					q.equality++;
					done();
				}
			},
			{
				text: "Ask the Gures and Aphals to respect the decisions of their elders.",
				run: () => {
					q.familyTies++;
					q.happy -= 5;
					q.effectiveness += 5;
					done();
				}
			}
		]
	},
	{
		name: "eshling vs pawl no wedding",
		check: () => { return q.temple; },
		show: ["eshling", "pawl"],
		text: "A Pawl man comes before the council and accuses an Eshling woman of refusing to marry him. It turns out that they lay with each other, and that he expected that they would be married as a result. The woman is brought in and explains that she made no promise of marriage - and now, having sampled his skills in the bedroom, she has no interest in marrying him at all.<br><br>The heads of the families are brought in as well.<br><br>Pater Sara professes himself innocent of his relative's dealings. If she doesn't want to marry the man, he will not force her, but perhaps it would be for the best if she did.<br><br>Mater Lyssa is quietly furious at the humiliation brought upon her family. She condemns the woman's behaviour and demands that she marries her man.",
		options: [
			{
				text: "Force the two to wed.",
				run: () => { q.familyTies++; q.eshlingHappy--; q.pawlHappy++; done("The wedding soon goes ahead. Mater Lyssa attends with an expression of grim satisfaction."); }
			},
			{
				text: "Censure the Eshling woman for leading on her lover, but require nothing of her.",
				run: () => { q.pawlHappy--; out("The Pawls complain to anyone who will listen that more should have been done, but no one else cares."); }
			},
			{
				text: "Punish the woman by indenturing her to the Pawls for a month.",
				check: () => { return q.indenture; },
				run: () => { q.pawlHappy++; q.indenture++; out("The woman takes this in stride. A month's indenture is nothing compared to a lifetime of boredom."); }
			},
			{
				text: "Remind the Pawls that since there was no formal betrothal, they have nothing to complain about.",
				run: () => { q.pawlHappy--; q.law++; q.familyTies--; out("The Pawls complain to anyone who will listen, but the council's judgement is technically sound."); }
			},
		]
	},
	{
		name: "pawl trauma",
		check: () => { return q.temple && q.pawlHappy < 0 && q.tradition > 0; },
		show: ["pawl", "eshling"],
		text: "During regular temple ceremonies, the priests have taken to talking about the circumstances of the people's exile, of the way that they were oppressed and impoverished in the old country, and of the possibility of flourishing in this new land. Every time the topic comes up in a sermon, the Pawls look deeply unhappy, and some of them have taken to leaving the temple when it happens.<br><br>Eventually, this comes up in council.<br><br>Mater Lyssa of Pawl sighs. How can she explain this? The Pawls were rich in the old country. They were doing perfectly well right until they were herded onto leaky ships and abandoned on this awful island. Perhaps the other families are able to put on a brave face, but the Pawls remember their beautiful houses, their herds, their clothes, their pleasant lives. And they know the other families did not have that. They don't want to appear ungrateful. But it still hurts.<br><br>Pater Sara of the Eshlings cuts in - how does Lyssa dare complain about her lot in life? Yes, the Pawls had a pleasant time, because Eshlings worked their fields, cooked for them, cleaned for them, did everything for them.<br><br>Lyssa replies: They know it's not fair which is why they don't want to complain, which is why they try to keep their grief to themselves. They wish they didn't have that grief. They're sorry for how they treated the Eshlings, and she wishes it hadn't taken exile for them to understand the way they had mistreated their own people. She only wishes to put the past behind her now.",
		options: [
			{
				text: "Pater Sara's face contorts with a series of emotions, and he leaves the council chamber.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "sparring",
		check: () => { return q.animalAttacks + q.fights > 1; },
		show: [],
		text: "With the dangers of the isle in everyone's mind, the younger stronger villagers have been sparring and training for hunting and war. In fact, this training has become so enthusiastic that it has led to any number of injuries.",
		options: [
			{
				text: "Tell the fighters to stay safe",
				run: () => { done(); }
			},
			{
				text: "Encourage the fighters to train as hard as possible",
				run: () => { q.health -= 10; q.weapons++; q.familyTies--; done(); }
			}
		]
	},
	{
		name: "first theft",
		check: () => { return q.hall && q.happy < 60 && q.turn > 6; },
		show: ["aphal", "pawl", "eshling", "jenet"],
		text: "As was perhaps inevitable, the first theft in your new village is brought before the council. An Aphal youth has stolen an axe from an older Pawl woman. The youth claims that she is not using it anymore, and that he can make better use of it.<br><br>Pater Zeno, the Aphal patriarch, pleads that the young fool be spared any punishment this once, and that his family will keep an eye on him from now on.<br><br>Mater Lyssa, the Pawl matriarch, points out that in the old country, the punishment for such a theft would be for the thief's hand to be cut off.<br><br>Zeno replies that the village can hardly afford to mutilate one of their young men like that.<br><br>Pater Sara of the Eshlings suggests a third way: let the youth be indentured to the Pawls for four years to pay off his crime. This was how it was done in the very old days, even before your people moved to the old country.<br><br>Finally, the Jenet patriarch, Pater Tim, suggests that the youth be imprisoned for a year to let him think on his crimes",
		options: [
			{
				text: "Let the youth go with a warning",
				run: () => {
					q.punishment = "lenient";
					q.law--;
					q.familyTies++;
					out("The youth is made to apologise in front of the village and then remanded to the care of his family. Mater Lyssa is not the only one who doubts that his apology was sincere.");
				}
			},
			{
				text: "Cut his hand off to make an example",
				run: () => {
					q.punishment = "mutilation";
					q.happy -= 5;
					q.law += 2;
					q.tradition++;
					out("The youth cries as he is led in front of the village hall and the butcher takes his hand. The elders approve - the people are few, and surrounded by danger, and cannot afford to be torn apart by crime.");
				}
			},
			{
				text: "Indenture the youth for four years",
				run: () => {
					q.punishment = "indenture";
					q.indenture++;
					q.law++;
					out("The youth is handed over to the Pawls, who make him wear rags and clean up after them.");
				}
			},
			{
				text: "Imprison the youth for a year",
				run: () => {
					q.punishment = "prison";
					q.law++;
					q.happy -= 5;
					q.arousal += 5;
					q.effectiveness -= 5;
					out("The villagers build a sturdy hut with a locking door near the village hall and imprison the youth. His shouts distract everyone, and he keeps on trying to escape. The people grumble that now they have a useless, troublesome mouth to feed.");
				}
			}
		]
	},
	{
		name: "the second crime, mutilation",
		check: () => { return q.punishment && q.punishment == "mutilation" && !q.twoThieves; },
		show: ["eshling", "gure"],
		text: "Another theft is brought before the council. This time, two Eshling siblings have conspired to break into Gure storerooms, making away with pelt coats and adornments, which they then foolishly wore, alerting the village to their crime.<br><br>Pater Sara of the Eshlings asks the council to be lenient: the siblings are known to be somewhat simple, and may not understand the magnitude of their crime.<br><br>Mater Alice of the Gure asks for the council to apply the established punishment: cutting off their hands.",
		options: [
			{
				text: "Let the two men go with a warning",
				success: () => { return q.law * 20 + q.gureHappy * 30 + q.happy / 2 - q.arousal / 4; },
				run: (success) => {
					q.twoThieves = true;
					if (success) {
						q.happy -= 5;
						q.effectiveness -= 10;
						q.punishment = "lenient";
						out("Mater Alice is incensed at this, but obeys the will of the council. In the following weeks, things keep going missing, and people take to locking and hiding away their valuables.");
					} else {
						q.happy -= 10;
						q.law -= 2;
						q.arousal += 15;
						q.gureHappy--;
						q.eshlingHappy--;
						out("The day after the council announces its verdict, the two thieves are found bound and gagged in the village hall, their right hands cut off. The Gures readily admit to taking matters into their own hands.");
					}
				}
			},
			{
				text: "Cut their hands off",
				run: () => {
					q.twoThieves = true;
					q.law++;
					q.tribe++;
					out("The two thieves are led in front of the village hall and their right hands are chopped off. Perhaps now would-be thieves will behave themselves.");
				}
			}
		]
	},
	{
		name: "the second crime, lenient",
		check: () => { return q.punishment && q.punishment == "lenient" && !q.twoThieves; },
		show: ["eshling", "gure"],
		text: "Another theft is brought before the council. This time, two Eshling siblings have conspired to break into Gure storerooms, making away with pelt coats and adornments, which they then foolishly wore, alerting the village to their crime.<br><br>Pater Sara of the Eshlings asks the council to be lenient: the siblings are known to be somewhat simple, and may not understand the magnitude of their crime.<br><br>Mater Alice of the Gure demands that the council do something to punish criminals.",
		options: [
			{
				text: "Let the two men go with a warning",
				run: (success) => {
					q.twoThieves = true;
					q.gureHappy--;
					q.effectiveness -= 10;
					out("Mater Alice is incensed at this, but obeys the will of the council. In the following weeks, things keep going missing, and people take to locking and hiding away their valuables.");
				}
			},
			{
				text: "Cut their hands off",
				run: () => {
					q.twoThieves = true;
					q.happy -= 5;
					q.tribe++;
					q.eshlingHappy--;
					out("The two thieves are led in front of the village hall and their right hands are chopped off. Perhaps now would-be thieves will behave themselves.<br><br>Pater Sara shows unity with the council in this decision, but the Eshlings are furious at the way that their people are - once again - treated more harshly than anyone else.");
				}
			}
		]
	},
	{
		name: "the second crime, indenture",
		check: () => { return q.punishment && q.punishment == "indenture" && !q.twoThieves; },
		show: ["eshling", "gure"],
		text: "Another theft is brought before the council. This time, two Eshling siblings have conspired to break into Gure storerooms, making away with pelt coats and adornments, which they then foolishly wore, alerting the village to their crime.<br><br>Pater Sara of the Eshlings asks the council to be lenient: the siblings are known to be somewhat simple, and may not understand the magnitude of their crime.<br><br>Mater Alice of the Gure asks for the council to apply the established punishment of indenture.",
		options: [
			{
				text: "Let the two men go with a warning",
				success: () => { return q.law * 20 + q.gureHappy * 30 + q.happy / 2 - q.arousal / 4; },
				run: (success) => {
					q.twoThieves = true;
					if (success) {
						q.happy -= 5;
						q.effectiveness -= 10;
						q.punishment = "lenient";
						out("Mater Alice is incensed at this, but obeys the will of the council. In the following weeks, things keep going missing, and people take to locking and hiding away their valuables.");
					} else {
						q.happy -= 10;
						q.law -= 2;
						q.arousal += 15;
						q.gureHappy--;
						q.eshlingHappy--;
						out("The day after the council announces its verdict, the two thieves are found bound and gagged in the village hall, their right hands cut off. The Gures readily admit to taking matters into their own hands.");
					}
				}
			},
			{
				text: "Cut their hands off",
				run: () => {
					q.twoThieves = true;
					q.punishment = "mutilation";
					q.eshlingHappy--;
					q.tribe++;
					out("The two thieves are led in front of the village hall and their right hands are chopped off. Perhaps now would-be thieves will behave themselves.<br><br>Pater Sara shows unity with the council in this decision, but the Eshlings are furious at the way that their people are - once again - treated more harshly than anyone else.");
				}
			},
			{
				text: "Indenture them to the Gure for three years",
				run: () => {
					q.twoThieves = true;
					q.punishment = "indenture";
					q.gureHappy++;
					q.indenture++;
					q.happy += 5;
					out("The thieves are given to the Gure, who put them to work doing menial tasks. They don't appear to mind that much, and the people are happy to have found a solution to crime that does not involve mutilation.");
				}
			}
		]
	},
	{
		name: "the second crime, prison",
		check: () => { return q.punishment && q.punishment == "prison" && !q.twoThieves; },
		show: ["eshling", "gure"],
		text: "Another theft is brought before the council. This time, two Eshling siblings have conspired to break into Gure storerooms, making away with pelt coats and adornments, which they then foolishly wore, alerting the village to their crime.<br><br>Pater Sara of the Eshlings asks the council to be lenient: the siblings are known to be somewhat simple, and may not understand the magnitude of their crime.<br><br>Mater Alice of the Gure asks for the council to apply the established punishment of imprisonment.",
		options: [
			{
				text: "Let the two men go with a warning",
				success: () => { return q.law * 20 + q.gureHappy * 30 + q.happy / 2 - q.arousal / 4; },
				run: (success) => {
					q.twoThieves = true;
					if (success) {
						q.happy -= 5;
						q.effectiveness -= 10;
						q.punishment = "lenient";
						out("Mater Alice is incensed at this, but obeys the will of the council. In the following weeks, things keep going missing, and people take to locking and hiding away their valuables.");
					} else {
						q.happy -= 10;
						q.law -= 2;
						q.arousal += 15;
						q.gureHappy--;
						q.eshlingHappy--;
						out("The day after the council announces its verdict, the two thieves are found bound and gagged in the village hall, their right hands cut off. The Gures readily admit to taking matters into their own hands.");
					}
				}
			},
			{
				text: "Cut their hands off",
				run: () => {
					q.twoThieves = true;
					q.punishment = "mutilation";
					q.eshlingHappy--;
					q.tribe++;
					out("The two thieves are led in front of the village hall and their right hands are chopped off. Perhaps now would-be thieves will behave themselves.<br><br>Pater Sara shows unity with the council in this decision, but the Eshlings are furious at the way that their people are - once again - treated more harshly than anyone else.");
				}
			},
			{
				text: "Imprison them",
				run: () => {
					q.twoThieves = true;
					q.punishment = "prison";
					q.gureHappy++;
					q.happy -= 5;
					q.effectiveness -= 5;
					out("The two men are put into the prison alongside the Aphal youth. They keep on breaking down the door, and a constant guard has to be posted to stop them from escaping. The people groan and complain that if the council had just punished them properly, or let them go, they wouldn't have to deal with all of this.");
				}
			}
		]
	},
	{
		name: "indenture becomes common",
		check: () => { return q.indenture >= 2 && q.turn >= 10; },
		important: () => { return q.indenture >= 3; },
		show: [],
		text: "With indenture established as the punishment for crime, it is soon applied to all kinds of situations. Minor slights are punished with a week's time. Some people keep on being re-indentured. The council suspects that offenses are being invented to settle scores, control malcontents, and profit from the labor of others.",
		options: [
			{
				text: "What is happening to our society?",
				run: () => { q.equality -= 2; q.effectiveness -= 10; q.happy -= 8; q.indentureCommon = true; done(); }
			}
		]
	},
	{
		name: "hoarding",
		check: () => { return q.food < q.population && q.houses; },
		show: ["gure"],
		text: "Food is getting scarce. Where once hunters and foragers would freely share their spoils, they now hurry to their homes and claim to have hardly found anything. The situation comes to a head when a Gure woman is discovered hoarding fruits and grains that clearly come from common fields, food meant for everyone. She pleads hunger. Her family insists that they knew nothing of this.",
		options: [
			{
				text: "Make her apologise and re-distribute the food to all the families",
				run: () => {
					q.food += 30;
					q.happy -= 5;
					out("She is appropriately tearful, and the families are glad to see a bit more food, but everyone privately doubts that this is the only case of such hoarding.");
				}
			},
			{
				text: "Rule that there is no law against stocking up on food",
				run: () => {
					q.law++;
					q.happy -= 10;
					q.effectiveness -= 5;
					out("The people are forced to agree to this point, but they are very angry about it.");
				}
			},
			{
				text: "Declare a one-time amnesty for hoarders",
				run: () => {
					q.law--;
					q.food += 50;
					out("The council declares that anyone hoarding food can bring it to the village hall tomorrow and not be punished, but that future hoarding will be punished as theft. And indeed, some food does appear the next day, but it's an open secret that others are still hoarding food.");
				}
			},
			{
				text: "Treat this act of hoarding as theft and chop off her hand",
				run: () => {
					q.food += 30;
					if (q.punishment == "mutilation") {
						q.law++;
						out("She is led in front of the village hall and punished appropriately, and her food is redistributed.");
					} else {
						q.gureHappy--;
						q.arousal += 5;
						out("She is led in front of the village hall and punished appropriately, and her food is redistributed.<br><br>The Gures are incensed that one of their people has been treated more harshly than previous thieves, and for a crime that is not even theft, exactly.");
					}
				}
			},
			{
				text: "Treat this act of hoarding as theft and imprison her",
				check: () => { return q.punishment == "prison"; },
				run: () => {
					q.law++;
					q.food += 30;
					q.effectiveness -= 3;
					q.happy -= 5;
					out("She is put into the increasingly full prison along with the other thieves and criminals. The people complain that all those idle hands are making the food crisis worse.");
				}
			},
			{
				text: "Indenture her to each of the families for a year",
				check: () => { return q.indenture; },
				run: () => {
					if (q.punishment == "indenture") {
						q.law++;
					}
					q.food += 30;
					q.indenture++;
					out("As is the custom for crimes against the whole village, she is given to each family for a year as an indentured servant. They delight in under-feeding and over-working her.");
				}
			},
		]
	},
	{
		name: "prison abolition",
		check: () => { return q.punishment == "prison" && q.turn > 8; },
		show: [],
		text: "A delegation of people from all five families comes before the council and asks them to let the imprisoned thieves go free. Yes, criminals need to be punished, but perhaps some whipping and public shaming would be enough, and the people would no longer have to endure the noise and stink of the prison, and the thieves could go back to doing useful things rather than rotting away.",
		options: [
			{
				text: "Agree with this proposal",
				run: () => {
					q.punishment = "lenient";
					q.law -= 2;
					q.effectiveness += 5;
					out("The prisoners are released back to their families and the prison is demolished. They are happy to be released, but some mutter that the council has gone soft, and that more crime is sure to follow this decision.");
				}
			},
			{
				text: "Disagree: thieves must be punished properly",
				run: () => {
					q.law++;
					q.happy -= 5;
					q.health -= 10;
					out("The delegation is forced to agree. The squalid prison continues to be an eyesore, and people complain it's making them sick.");
				}
			},
			{
				text: "Construct a larger, more secure, and more sanitary prison",
				run: () => {
					q.effectiveness -= 5;
					out("The delegation complains that this is not what they wanted, and that the council are making even more work for the village on behalf of criminals. Still, the new prison is built, off in a corner of the village, where it proves less bothersome.");
				}
			}
		]
	},
	{
		name: "first murder",
		check: () => { return q.punishment && q.hall && q.turn > 12; },
		show: ["jenet", "gure", "pawl", "aphal"],
		run: () => { q.population--; },
		text: "A Jenet man is dead at the hands of two others, a Gure and a Pawl. A council meeting is called. Supposedly, the Jenet man knew a secret of the Gure, and when the Gure and Pawl man got drunk one night, they got it into their heads that the other was going to use this secret for blackmail. So they waylaid him and beat him, supposedly only to scare him, but when they were done, he was dead on the ground.<br><br>Pater Tim of the Jenets speaks first. To him, the situation is simple: the murderers have admitted to their crime. A life for a life surely is fair. They must be put to death.<br><br>Ah, Pater Zeno of the Aphals interjects. Yes, one life for one life, but here no one knows who made the killing blow. You cannot have two murderers, so you cannot kill them.",
		options: [
			{
				text: "Execute them both",
				run: () => {
					q.jenetHappy++;
					q.law++;
					q.population -= 2;
					q.arousal += 8;
					out("The council rejects Aphal sophistry. They are both murderers, and so they are both put to death, decapitated before the assembled villagers.");
				}
			},
			{
				text: "Cut off their right hands",
				run: () => {
					q.effectiveness -= 2;
					out("A lesser punishment intended for thieves and rapists. One death is avenged with two mutilations. By and large, the people are content with this ruling.");
				}
			},
			{
				text: "Imprison them both for life",
				check: () => { return q.punishment == "prison"; },
				run: () => {
					q.population -= 3;
					q.happy -= 5;
					out("They are shut into prison, never again to see the sun. Both of them indicate that death would have been preferrable. Their shouts and cries disturb the village, until one morning, when they are found with their throats slit. A mercy?");
				}
			},
			{
				text: "Indenture them for life",
				check: () => { return q.indenture; },
				run: () => {
					q.jenetHappy++;
					q.indenture++;
					out("The two men are indentured for life to the Jenets, who beat and ill-treat them and work them hard.");
				}
			},
			{
				text: "Appeal to the ancestors for guidance as to the identity of the killer",
				success: () => { return q.tradition * 40; },
				run: (success) => {
					if (success) {
						q.population -= 1;
						q.jenetHappy++;
						q.gureHappy++;
						out("The priests are assembled to pray to the bones of the ancestors. After many hours of prayer, they emerge, stating that it was the Pawl man who did the lethal blow. He is then duly executed, while his friend goes free.");
					} else {
						q.population -= 2;
						q.happy -= 8;
						q.arousal += 8;
						q.law--;
						q.tradition--;
						out("The priests are assembled to pray to the bones of the ancestors. After many hours of prayer, they emerge, stating that it was the Pawl man who did the lethal blow. He is then duly executed, while his friend goes free.<br><br>Whispers in the village suggest that the priests were probably asleep for most of that time of prayer, and that the Pawl man was less well liked than his friend, which is why he was put to death. The people show their disdain of the priests and councillors in a hundred small ways.");
					}
				}
			}
		]
	},
	{
		name: "ineffectiveness",
		check: () => { return q.effectiveness < 95; },
		show: [],
		text: "The fields need tending, water needs fetching, roots and berries need finding, the floors need cleaning. There is so much work, and the elders complain that no one is putting in enough effort. Everyone thinks that someone else will do the work.",
		options: [
			{
				text: "Give each family a clear set of responsibilities",
				run: () => { q.effectiveness += 4; q.familyTies++; done(); }
			},
			{
				text: "Give each adult a specific responsibility",
				run: () => { q.effectiveness += 3; q.familyTies--; done(); }
			},
			{
				text: "Publicly humiliate the worst slackers",
				run: () => { q.effectiveness += 4; q.happy -= 5; done(); }
			},
			{
				text: "Promise a feast will be held each month in honour of the hardest workers",
				run: () => { q.effectiveness += 3; done(); }
			}
		]
	},
	{
		name: "mocking song",
		check: () => { return q.temple; },
		run: () => { q.songs++; },
		show: ["pawl"],
		text: "The people like to make up new songs to old tunes. Sometimes, the songs are spontaneous. Other times, they are carefully thought out. Some songs become very popular. Right now, the most popular song in the village mocks the love life of a conceited young Pawl woman who strung along her two suitors for so long that they both gave up and got married to other women, supposedly on the same day. The woman is not named in the song, but everyone knows - or thinks they know - who it is.<br><br>Mater Lyssa of Pawl brings this up in council and requests something be done before the young woman dies of shame.",
		options: [
			{
				text: "Forbid the singing of this song.",
				success: () => { return 20 + q.law * 30 + q.tribe * 20 - q.equality * 20; },
				run: (success) => {
					if (success) {
						out("The councillors give their families a stern talking-to. They've had their fun, but now they must be kind and stop humiliating their neighbour. The people sheepishly agree.");
					} else {
						q.tribe--;
						q.pawlHappy--;
						out("The councillors give their families a stern talking-to, but it's no use. Even without the words, the tune has now become so associated with the story that people have to merely hum it, following the lyrics in their head, laughing. The Pawl woman withdraws to the hearth room of her family, waiting for her humiliation to cease, one day.");
					}
				}
			},
			{
				text: "Announce a contest for the funniest, catchiest song, so as to hopefully displace it.",
				success: () => { return q.arousal / 2 + q.happy / 2 + q.tribe * 20; },
				run: (success) => {
					if (success) {
						q.happy += 5;
						q.pawlHappy++;
						out("The songwrights happily oblige, many of them inventing words to the same tune, mocking others or telling funny stories. Others make up entirely new tunes. The village is full of song, and soon the story of the Pawl woman and her suitors is forgotten.");
					} else {
						q.pawlHappy--;
						out("The songwrights happily oblige by competing to put into their songs the most oblique references to the story of the woman and her suitors. Some of them are so convoluted that it takes the council days to figure out the true meaning. The Pawl woman withdraws to the hearth room of her family, waiting for her humiliation to cease, one day.");
					}
				}
			},
			{
				text: "Suggest that if perhaps the young lady got married and settled down, the songwrights would find another topic.",
				run: () => {
					q.pawlHappy--;
					q.tradition++;
					out("Mater Lyssa is less than pleased about this. The Pawl woman withdraws to the hearth room of her family, waiting for her humiliation to cease, one day.");
				}
			}
		]
	},
	{
		name: "song of sorrow",
		check: () => { return q.population < 75; },
		show: [],
		text: "Many people have died since you arrived on the isle. Perhaps this place truly is cursed. A songwright, perhaps the best one of your people, creates a new tune and song lamenting the dead.",
		options: [
			{
				text: "It makes people weep with beauty and sorrow.",
				run: () => { q.happy += 5; q.arousal -= 5; q.songs++; done(); }
			}
		]
	},
	{
		name: "war song",
		check: () => { return q.fights > 2; },
		show: [],
		text: "Your people were not so warlike back in the old country, but here, on the Isle of Beasts, they have become potent warriors. Several songwrights have created martial songs to old and new tunes, commemorating the fierceness and the victories of your fighters.",
		options: [
			{
				text: "Hurrah!",
				run: () => { q.arousal += 15; q.happy += 5; q.songs++; done(); }
			}
		]
	},
	{
		name: "animal tune",
		check: () => { return q.animals > 3; },
		show: [],
		text: "The people like to make up new songs to old tunes, and sometimes new tunes also. A well-known Gure playwright has now invented a strange new tune that she says is based on the calls made by local animals she encountered while exploring. Some of the elders are less than pleased about this song imitating the cries of monsters.",
		options: [
			{
				text: "Ban the tune",
				run: () => { q.happy -= 5; q.tradition++; done(); }
			},
			{
				text: "Gently suggest that the tune might be a bit too avant-garde for the available audience",
				run: () => { done(); }
			},
			{
				text: "Do exactly nothing",
				run: () => { q.tradition--; q.songs++; done(); }
			}
		]
	},
	{
		name: "song grumbling",
		check: () => { return q.songs >= 2; },
		show: [],
		text: "With all the new songs composed in the village, there is hardly ever a moment of quiet. Youngsters often sing late into the night, and some of the older people have started grumbling about this.",
		options: [
			{
				text: "Ban singing after sunset, except for feasts",
				success: () => { return q.law * 20 + q.happy / 2 - q.arousal / 4; },
				run: (success) => {
					if (success) {
						q.happy += 3;
						out("The youngsters grumble but compensate by singing all the more loudly before sunset.");
					} else {
						q.happy -= 4;
						out("The youngsters simply ignore this ban. They say that there are only a few curmudgeons who want them to stop singing.");
					}
				}
			},
			{
				text: "Remind the older people that they were young once too",
				success: () => { return q.law * 20 + q.happy / 4 + q.arousal / 4 - q.tradition * 10; },
				run: (success) => {
					if (success) {
						q.happy += 4;
						q.arousal += 3;
						out("The oldsters nod their heads. Some of them even join in with the singing.");
					} else {
						q.happy -= 3;
						q.arousal += 3;
						out("The oldsters roll their eyes. They are sure that they were never so impolite when they were young.");
					}
				}
			},
		]
	},
	{
		name: "spindrake racing",
		check: () => { return q.spindrakes > 1 && q.spindrakeRiders && q.turn > 15; },
		show: [],
		text: "Spindrakes! Beautiful arrows of the skies. Elegant hunters. The youths of your tribe have taken to racing them, molding them to become ever faster, never mind any actual use they might have. The resulting displays are, admittedly, beautiful.",
		options: [
			{
				text: "Encourage this new sport.",
				success: () => { return 60 - q.tradition * 20; },
				run: (success) => {
					q.effectiveness -= 5;
					if (success) {
						q.happy += 10;
						q.arousal += 10;
						out("The spindrakes become ever faster and more agile, and the displays of aerial riding ever more daring.<br><br>Now this is a new thing, a beautiful thing, something unique to the isle, better than anything in the old country.");
					} else {
						out("Most of the villagers still scoff at the races and their waste of time and energy.");
					}
				}
			},
			{
				text: "Remind the youths that the drakes have more important functions than entertainment.",
				success: () => { return 20 + q.law * 20 + q.tradition * 30; },
				run: (success) => {
					if (success) {
						q.effectiveness += 5;
						out("The youths roll their eyes but obey. After a while, they lose interest in the sport as they find some new way to show off to each other.");
					} else {
						q.effectiveness -= 5;
						q.happy += 5;
						out("Still, sometimes, late at night, you can hear whooping and fluttering in the distance, and the village's spindrakes stay fast and sleek.");
					}
				}
			},
		]
	},
	{
		name: "starthing infestation",
		check: () => { return q.food > 500 && q.houses; },
		show: [],
		text: "Starthings are small starfish-like creatures with off-white plumage frequently found under rocks. Only now they are found in your homes, beds, and larders, in ever-greater numbers. They chew on your food stores and leave behind powdery droppings absolutely everywhere.",
		options: [
			{
				text: "Secure the larders and try to get used to them. Perhaps they will move on.",
				run: () => { q.effectiveness -= 8; q.health -= 8; q.happy -= 8; q.food -= 100; done(); }
			},
			{
				text: "Organize the whole tribe to find and kill every last one of them.",
				success: () => { return strength() / 4 + q.animals * 15; },
				run: (success) => {
					if (success) {
						q.health -= 5;
						q.food -= 50;
						out("It takes a great deal of effort to track down all the starthings, but eventually every nook and cranny has been inspected, and the pests are all dead.");
					} else {
						q.effectiveness -= 8; q.health -= 12; q.happy -= 12; q.food -= 100;
						out("The villagers do their best to track down and kill all the starthings, but no matter how much they try, more keep crawling out of nooks and crannies.");
					}
				}
			},
			{
				text: "Tell the children that they will be rewarded for each bucket that they collect.",
				success: () => { return 20 + q.animals * 15; },
				run: (success) => {
					if (success) {
						q.health -= 8;
						q.food -= 100;
						q.animals++;
						out("The children take to this game with great enthusiasm. At first, they easily bring back buckets and buckets of the creatures. As it becomes harder to find any, the children become crafty, luring them out with grains of corn, wriggling under furniture, using sticks to brush them out of cracks. In the end, the children are round with sweets and the starlings are all gone.");
					} else {
						q.effectiveness -= 8; q.health -= 15; q.happy -= 12; q.food -= 140;
						out("At first, the children enjoy the novelty of catching the pests, but as it becomes harder to do so, even their favourite treats cannot motivate them, and they go back to playing other games. Soon, there are as many starthings as there ever were.");
					}
				}
			},
			{
				text: "Convince your blademouths that they are edible.",
				check: () => { return q.blademouths; },
				success: () => { return 20 + q.shaping * 20 + q.animals * 10; },
				run: (success) => {
					if (success) {
						q.food -= 50;
						q.health -= 4;
						out("By waving captured starthings in front of blademouths and concentrating upon the idea that they're a favoured prey animal, the blademouths are minutely re-shaped and soon pursue the pests with great vigour. Soon, none are left in the village.");
					} else {
						q.effectiveness -= 8; q.health -= 8; q.happy -= 8; q.food -= 100;
						out("As much as the shapers and hunters try to interest them in the pests, the blademouths show a magnificent indifference to starthings, preferring to nap in front of the hearth.");
					}
				}
			},
		]
	},
	{
		name: "spindrake worship",
		check: () => { return q.spindrakes && q.tradition < 2 && q.animals > 2; },
		show: ["aphal", "pawl", "eshling"],
		text: "Some young people from the Aphal family have taken to wearing clothes meant to evoke kinship to spindrakes and incorporating references to them into temple songs. The elders worry that they are abandoning the ancestors in favour of worshipping the local beasts. The Pawls send their men to scold them, and a scuffle breaks out. The two groups are put before the council.<br><br>The Aphals argue that much as the animals of the isle change, the people must change as well, becoming part of the isle, if they are to survive.<br><br>Mater Lyssa of the Pawls rejects this as nonsense: of course the Aphals will deploy spurious arguments whenever they are caught out doing something wrong. This mode of dress surely offends the ancestors.<br><br>Pater Sara of the Eshlings makes a face at this - to the Pawls, everything offends the ancestors - including, he implies, some of the rituals particular to the Eshlings.",
		options: [
			{
				text: "Ban this new practice in the interests of unity.",
				run: () => { q.tribe++; done(); }
			},
			{
				text: "Intolerance was the cause of our exile. Let them worship how they want.",
				run: () => { q.tradition--; q.familyTies--; done(); }
			},
			{
				text: "Encourage these new beliefs.",
				run: () => { q.tradition -= 2; q.arousal += 8; done(); }
			}
		]
	},
	{
		name: "covered areas",
		check: () => { return q.turn > 40; },
		important: () => { return q.turn > 42; },
		show: [],
		text: "Foragers report that large areas of the isle have been covered in dense mats of sinous flesh covered with eyes, choking out all other life. The eyes are singularly interested in human beings.",
		options: [
			{
				text: "A disturbing development.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "everything is covered, neutral",
		check: () => { return q.turn > 46 && !q.robedOneEyes && !q.bimanePlague; },
		important: () => { return q.turn > 47; },
		show: [],
		text: "Large areas of the island are now covered with matted eye-stalk flesh. Foragers have attempted to hack through them, but the flesh moves to cover and devour them. The council is very worried.",
		options: [
			{
				text: "Prepare the people to fight this menace.",
				run: () => { q.weapons++; done(); }
			},
			{
				text: "Make sure to store plenty of food.",
				run: () => { q.food += 100; done(); }
			},
			{
				text: "Attempt to understand these fleshy growths.",
				run: () => { q.shaping++; done(); }
			}
		]
	},
	{
		name: "everything is covered, robed ones",
		check: () => { return q.turn > 46 && q.robedOneEyes; },
		important: () => { return q.turn > 47; },
		show: [],
		text: "Large areas of the island are now covered with matted eye-stalk flesh. Foragers have attempted to hack through them, but the flesh moves to cover and devour them. The council is very worried.<br><br>This must be the the eyes that the Robed Ones spoke of, sent forth by the isle to hunt your unshaped uncovered people.",
		options: [
			{
				text: "Prepare the people to fight this menace.",
				run: () => { q.weapons++; done(); }
			},
			{
				text: "Make sure to store plenty of food.",
				run: () => { q.food += 100; done(); }
			},
			{
				text: "Attempt to understand these fleshy growths.",
				run: () => { q.shaping++; done(); }
			}
		]
	},
	{
		name: "everything is covered, bimanes",
		check: () => { return q.turn > 46 && !q.robedOneEyes && q.bimanePlague; },
		important: () => { return q.turn > 47; },
		show: [],
		text: "Large areas of the island are now covered with matted eye-stalk flesh. Foragers have attempted to hack through them, but the flesh moves to cover and devour them. The council is very worried.<br><br>Perhaps this is the plague that the Bimanes spoke of that caused them to change their shape.",
		options: [
			{
				text: "Prepare the people to fight this menace.",
				run: () => { q.weapons++; done(); }
			},
			{
				text: "Make sure to store plenty of food.",
				run: () => { q.food += 100; done(); }
			},
			{
				text: "Attempt to understand these fleshy growths.",
				run: () => { q.shaping++; done(); }
			}
		]
	},
	{
		name: "pre-endgame",
		check: () => { return q.turn > 51 && q.population > 25; },
		important: () => { return q.turn > 51; },
		run: () => { q.population -= 3; q.forage = 0; q.canExplore = false; },
		show: [],
		text: "The foragers return in a panic. The eye-stalks have covered all of the island except for a small area around the village. Whenever they encounter someone, they seize them and rip them apart.",
		options: [
			{
				text: "We must brace ourselves to survive this, somehow.",
				run: () => { q.effectiveness += 5; done(); }
			}
		]
	},
	{
		name: "endgame",
		check: () => { return q.turn > 53; },
		important: () => { return q.turn > 53; },
		show: [],
		text: "The mats of riotous eye-stalks now abut the boundary of the village. The whole isle appears to be covered by it, threatening to extinguish all other life. The council debate what can be done against it.",
		options: [
			{
				text: "Wait it out within the walls.",
				success: () => { return -70 + q.food * 7 / q.population + q.defenses * 10; },
				check: () => { return q.walls; },
				run: (success) => {
					if (success) {
						win("It takes a long time, but your food stores are large enough. Eventually the eye-stalks sicken and wither, melting back into the ground. Normal plants and animals soon return, and your people venture outside. It seems that whatever monstrous creature was stalking you has been defeated.");
					} else {
						lose("You attempt to wait out the tide of flesh, but day after day it writhes outside the town walls, until your food stores run out. In the end, a few desperate starving villagers attempt to make it to the shore, but they all perish.");
					}
				}
			},
			{
				text: "Use weapons and fire to burn it away.",
				success: () => { return -100 + strength() / 2 + q.weapons * 15 + (q.spindrakeFire ? 30 : 0) + q.tools * 5 + (q.codgerFighters ? 10 + q.codgers * 5 : 0) + (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success) => {
					if (success) {
						var text = "Whatever this creature might be, it's made of flesh and blood, and your warriors have experience with killing monsters. They pour out of the village gates and hack at the writhing coils of flesh";
						if (q.spindrakeFire) {
							text += ", setting them aflame with spindrake fire";
						}
						if (q.codgerFighters) {
							text += ", with the codgers tearing them apart";
						}
						if (q.blademouthFighters) {
							text += ", with the blademouths tearing into them";
						}
						text += ".<br><br>Finally, they manage to inflict enough damage that the remaining stalks wither and retreat back into the ground. They have defeated the monstrous gaze of the isle. Your people are safe to thrive.";
						win(text);
					} else {
						lose("Your villagers pour forth from the gates with spears and torches, intent on beating back this monstrous carpet of eyes. They don't last long, as the fleshy stalks wrap around their limbs and tear them apart, then flood in through the gates into the village, killing everyone within.");
					}
				}
			},
			{
				text: "Don concealing robes to hide from the eyes.",
				check: () => { return q.robedOneEyes; },
				success: () => { return 10 + q.law * 30 - q.tradition * 10 + q.equality * 10; },
				run: (success) => {
					if (success) {
						win("As the Robed Ones explained, the eyes hate unshaped people, but they can be deceived. With a heavy heart, your people don concealing robes and wait. After a few hours, the eye-stalks start retreating, slithering back into the ground. Eventually, you get used to this way of living, hiding your forms, speaking in whispers, safe from the gaze of the isle.");
					} else {
						lose("The council tries to convince the people that they must cover up their forms to be safe from the eyes, but the people do not understand, and never do so quite properly. Eventually, the eye-stalks find a way into the village and spread rapidly, tearing people apart as they find them, until all have perished.");
					}
				}
			},
			{
				text: "Use shaping skills to re-shape the people into new forms.",
				success: () => { return 0 - q.tradition * 20 + q.animals * 10 + q.tribe * 20 + q.humanShaping * 5 + (q.selfShaping ? 20 : 0); },
				run: (success) => {
					if (success) {
						ev({
							text: "Faced with their extermination, and armed with the knowledge that they must change to survive, the people accept. But what shape should they take?",
							options: [
								{
									text: "Nimble creatures like blademouths",
									check: () => { return q.blademouths; },
									success: () => { return -50 + q.blademouths * 10 + q.shaping * 20 + q.humanShaping * 20; },
									run: (success) => {
										if (success) {
											win("The shapers confer and begin their art. The next day, the people wake up changed into slender furred beings, like beautiful horned monkeys. When they show themselves to the eye stalks, they waver and retreat.<br><br>Now begins a new era for the people, of running through the woods and playing and joy.");
										} else {
											lose("That night, the shapers set to work. But they have never attempted to shape humans before. The people's shapes waver and blur, and then horns and antlers and tentacles and scales erupt from their orifices, and their limbs contort and snap and their bodies give way as they writhe on the floor and die in agony.");
										}
									}
								},
								{
									text: "Tough burrowers like codgers",
									check: () => { return q.codgers; },
									success: () => { return -50 + q.codgers * 10 + q.shaping * 20 + q.humanShaping * 20; },
									run: (success) => {
										if (success) {
											win("The shapers confer and begin their art. The next day, the people wake up changed into large-clawed lizards. They burrow underground and wait for the eye stalks to wither, and when they resurface, the isle is again full of life.<br><br>Now begins a new era for the people, who now dwell underground in cosy tunnels with great hearths.");
										} else {
											lose("That night, the shapers set to work. But they have never attempted to shape humans before. The people's shapes waver and blur, and then horns and antlers and tentacles and scales erupt from their orifices, and their limbs contort and snap and their bodies give way as they writhe on the floor and die in agony.");
										}
									}
								},
								{
									text: "Gentle herbivores like woolmouths",
									check: () => { return q.woolmouths; },
									success: () => { return -50 + q.woolmouths * 10 + q.shaping * 20 + q.humanShaping * 20; },
									run: (success) => {
										if (success) {
											win("The shapers confer and begin their art. The next day, the people wake up changed into large feathered beasts of friendly countenance. They show themselves to the eye stalks, which gaze upon them and then retreat, allowing the people to spill out into the meadows.<br><br>Now begins a new era for the people, one of calm grazing and the singing of songs under the beautiful sun.");
										} else {
											lose("That night, the shapers set to work. But they have never attempted to shape humans before. The people's shapes waver and blur, and then horns and antlers and tentacles and scales erupt from their orifices, and their limbs contort and snap and their bodies give way as they writhe on the floor and die in agony.");
										}
									}
								},
								{
									text: "Elegant fliers like spindrakes",
									check: () => { return q.spindrakes; },
									success: () => { return -50 + q.spindrakes * 10 + q.shaping * 20 + q.humanShaping * 20; },
									run: (success) => {
										if (success) {
											win("The shapers confer and begin their art. The next day, the people wake up changed into large feathered bats. They take flight and leave for the safety of the mountaintops, waiting until the eye stalks wither and retreat.<br><br>Now begins a new era for the people, where they flit about in the air, glorying in acrobatic displays.");
										} else {
											lose("That night, the shapers set to work. But they have never attempted to shape humans before. The people's shapes waver and blur, and then horns and antlers and tentacles and scales erupt from their orifices, and their limbs contort and snap and their bodies give way as they writhe on the floor and die in agony.");
										}
									}
								},
								{
									text: "A shape that lets them keep their dexterity, like bimanes",
									check: () => { return q.bimanePlague; },
									success: () => { return -40 + q.shaping * 20 + q.humanShaping * 20; },
									run: (success) => {
										if (success) {
											win("The shapers confer and begin their art. The next day, the people wake up changed into spider-like beings with many dextrous limbs. They will have to make new clothes and adapt their tools a little, but they will be able to make art and machines the like of which have never been seen before. The eye stalks soon fade away now that they have no more unshaped humans to hunt.<br><br>Now begins a new era for the people, one of art and industry and ingenuity, where they will build great towers and plumb the secrets of creation.");
										} else {
											lose("That night, the shapers set to work. But they have never attempted to shape humans before. The people's shapes waver and blur, and then horns and antlers and tentacles and scales erupt from their orifices, and their limbs contort and snap and their bodies give way as they writhe on the floor and die in agony.");
										}
									}
								},
								{
									text: "A new, better shape, superior to everything",
									success: () => { return -40 + q.shaping * 12 + q.humanShaping * 12; },
									run: (success) => {
										if (success) {
											win("The shapers mutter that superiority can mean any number of things, but they confer, and then begin their art. The next day, the people wake up as scintillating many-eyed centaurs, fast and strong and wise - and the eye-stalks, seeing this, retreat back into the ground.<br><br>Now begins a new era for the people, one of resplendent glory on this magnificent isle.");
										} else {
											lose("That night, the shapers set to work. But they have never attempted to shape humans before. The people's shapes waver and blur, and then horns and antlers and tentacles and scales erupt from their orifices, and their limbs contort and snap and their bodies give way as they writhe on the floor and die in agony.");
										}
									}
								},
							]
						});
					} else {
						lose("As much as the council tries, the people refuse to countenance the idea. They say that they would rather die as humans than live as monsters. And so they do, as the eye-stalks boil over the village, covering everything, ripping them apart.");
					}
				}
			},
			{
				text: "Build a ship to escape the isle.",
				success: () => { return 5 + strength() / 2 + q.weapons * 15 + (q.spindrakeFire ? 15 : 0) + (q.codgerFighters ? 10 + q.codgers * 5 : 0) + (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success) => {
					if (success) {
						ev({
							text: "Your artisans put all their skills towards constructing a large, sturdy ship in the centre of the village, suspending it on rollers so that it can be conveyed to the sea.<br><br>Then the whole village sallies forth from the gate, fighting their way to the shore, warding off the eye-stalks with torches and spears. The ship is safely conveyed into the water, and the surviving people get aboard. There is supposedly another isolated island further north, away from the old country, and populated by ordinary creatures instead of monsters.",
							options: [
								{
									text: "Set sail towards it.",
									success: () => { return q.tools * 20 + q.effectiveness - 120; },
									run: (success) => {
										if (success) {
											win("It's slow going, as your people are not experienced seamen, but the ship is well-built, and after a few days travel, you arrive on the shores of the northern island. Normal plants and animals greet you. A chance to start anew, away from the oppression of the old country and the monsters of the Isle of Beasts.");
										} else {
											lose("Your people have no experience as seamen, and the hastily constructed ship turns out to be all but impossible to steer. The wind pushes it out to the open sea, where it drifts, slowly breaking apart, until it sinks. Your people have escaped the isle only to perish elsewhere.");
										}
									}
								}
							]
						});
					} else {
						lose("Your artisans put all their skills towards constructing a large, sturdy ship in the centre of the village, suspending it on rollers so that it can be conveyed to the sea.<br><br>Then the whole village sallies forth from the gate, attempting to fight their way to the shore - but there are too many eye-stalks, and the villagers are soon surrounded and torn apart.");
					}
				}
			},
		]
	},
	{
		name: "bimane attack 1",
		check: () => { return q.bimanesEncountered && q.bimaneRelations < 1 && q.bimaneStrength > 50; },
		show: [],
		text: "A war party of huge many-shaped bimanes attacks the village.",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 120 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.bimanePrevInteraction = "violent";
					q.fights++;
					q.bimaneAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						q.bimaneStrength += 5;
						out("The villagers attempt to defend against the monsters, but stand little chance. Many are killed or captured by the bimanes.");
					} else {
						q.arousal += 4;
						q.bimaneStrength -= 10;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "bimane attack 2",
		check: () => { return q.bimanesEncountered && q.bimaneRelations < 1 && q.turn > 10 && q.bimaneStrength > 50; },
		show: [],
		text: "A war party of huge many-shaped bimanes attacks the village.",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 130 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.bimanePrevInteraction = "violent";
					q.fights++;
					q.bimaneAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						q.bimaneStrength += 5;
						out("The villagers attempt to defend against the monsters, but stand little chance. Many are killed or captured by the bimanes.");
					} else {
						q.arousal += 4;
						q.bimaneStrength -= 10;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "bimane attack 3",
		check: () => { return q.bimanesEncountered && q.bimaneRelations < 1 && q.turn > 15 && q.bimaneStrength > 50; },
		show: [],
		text: "A war party of huge many-shaped bimanes attacks the village.",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 130 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.bimanePrevInteraction = "violent";
					q.fights++;
					q.bimaneAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						q.bimaneStrength += 5;
						out("The villagers attempt to defend against the monsters, but stand little chance. Many are killed or captured by the bimanes.");
					} else {
						q.arousal += 4;
						q.bimaneStrength -= 10;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "robed one attack 1",
		check: () => { return q.robedOnesEncountered && q.robedOnesRelations < 0 && q.robedOneStrength > 50; },
		show: [],
		text: "A war party of sword-wielding robed ones attacks the village.",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 120 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.robedOnePrevInteraction = "violent";
					q.fights++;
					q.robedOneAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						q.robedOneStrength += 5;
						out("The villagers attempt to defend against the attackers, but stand little chance. Many are killed or captured by the robed ones.");
					} else {
						q.arousal += 4;
						q.robedOneStrength -= 10;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "robed one attack 2",
		check: () => { return q.robedOnesEncountered && q.robedOnesRelations < -1 && q.robedOneStrength > 50 && q.turn > 12; },
		show: [],
		text: "A war party of sword-wielding robed ones attacks the village.",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 125 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.robedOnePrevInteraction = "violent";
					q.fights++;
					q.robedOneAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						q.robedOneStrength += 5;
						out("The villagers attempt to defend against the attackers, but stand little chance. Many are killed or captured by the robed ones.");
					} else {
						q.arousal += 4;
						q.robedOneStrength -= 10;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "robed one attack 3",
		check: () => { return q.robedOnesEncountered && q.robedOnesRelations < 0 && q.robedOneStrength > 50 && q.turn > 18; },
		show: [],
		text: "A war party of sword-wielding robed ones attacks the village.",
		options: [
			{
				text: "Defend the village",
				danger: () => { return 130 - q.weapons * 12 - q.defenses * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.robedOnePrevInteraction = "violent";
					q.fights++;
					q.robedOneAttacks++;
					if (harm) {
						q.population = Math.ceil(q.population * 3 / 4);
						q.happy -= 10;
						q.health -= 10;
						q.robedOneStrength += 5;
						out("The villagers attempt to defend against the attackers, but stand little chance. Many are killed or captured by the robed ones.");
					} else {
						q.arousal += 4;
						q.robedOneStrength -= 10;
						out("The village defenses hold fast, and the creatures are driven back.");
					}
				}
			}
		]
	},
	{
		name: "experienced fighters",
		check: () => { return q.fights + q.animalAttacks > 4; },
		important: () => { return q.fights + q.animalAttacks > 6; },
		show: [],
		text: "With the constant fighting against the monsters of the isle, your warriors have become hardened veterans, expert at all kinds of fighting.",
		options: [
			{
				text: "We are strong.",
				run: () => { q.weapons++; q.arousal += 10; done(); }
			}
		]
	},
	{
		name: "experienced raiders",
		check: () => { return q.raids >= 3; },
		important: () => { return q.raids >= 5; },
		show: [],
		text: "Raiding has become a part of the life of the people. The warriors have become tough, and experts at the tactics of surprise and manoeuver.",
		options: [
			{
				text: "War is what makes us strong.",
				run: () => { q.weapons++; q.arousal += 10; done(); }
			}
		]
	},
	{
		name: "spate of thefts",
		check: () => { return q.twoThieves && q.happy < 50 && q.valuables > 0; },
		show: [],
		text: "An epidemic of thefts plagues the village, and the families all blame each other for it, but no concrete culprits are ever found.",
		options: [
			{
				text: "An unfortunate turn of events.",
				run: () => { q.arousal += 10; q.valuables--; done(); }
			}
		]
	},
	{
		name: "drunkenness",
		check: () => { return q.happy < 40 && q.hall; },
		show: [],
		run: () => { q.health -= 15; q.effectiveness -= 5; },
		text: "It did not take very long for the people to figure out how to brew alcohol in this new place. And with the mood so low, more and more of them are turning to drinking at all times of the day, neglecting their duties, and getting into fights.",
		options: [
			{
				text: "An unseemly spectacle.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "a thriving village",
		check: () => { return q.happy > 70 && q.health > 90 && q.population > 85 && q.arousal > 40 && q.temple; },
		show: [],
		run: () => { q.effectiveness += 10; },
		text: "Everywhere you look in the village, you can see bustling activity. The people are thriving.",
		options: [
			{
				text: "We may yet survive this place.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "expert artisans",
		check: () => { return q.happy > 60 && q.arousal > 60 && q.tools > 0 && q.turn > 10; },
		show: [],
		run: () => { q.tools++; q.valuables++; q.effectiveness += 5; },
		text: "At first, the people's artisans struggled with a lack of tools and materials. Wood that is too soft or splits too easily, unfamiliar stone, unfamiliar clay, and a hundred other missing things that they had in the old country. But now they have figured out how to use the bounty of the isle.",
		options: [
			{
				text: "We can build a life here.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "the ancestors watch over us",
		check: () => { return q.happy > 70 && q.tradition >= 2 && q.health > 90 && q.turn > 6 && q.temple && q.population > 100; },
		show: [],
		run: () => {
			if (q.jenetHappy < 0) { q.jenetHappy++; }
			if (q.pawlHappy < 0) { q.pawlHappy++; }
			if (q.eshlingHappy < 0) { q.eshlingHappy++; }
			if (q.gureHappy < 0) { q.gureHappy++; }
			if (q.aphalHappy < 0) { q.aphalHappy++; }
		},
		text: "Despite the many dangers of the isle, the people can feel that the ancestors are keeping watch. Their bones are venerated, and in turn they keep away many evils and prevent discord between the families.",
		options: [
			{
				text: "It has always been so.",
				run: () => {
					done();
				}
			}
		]
	},
	{
		name: "egalitarian society",
		check: () => { return q.happy > 70 && q.equality >= 2 && q.turn > 4 && q.indenture < 2; },
		show: [],
		run: () => { q.effectiveness += 10; q.tradition--; },
		text: "When the people arrived on the isle, they were divided into families ruled by matriarchs and patriarchs, but in this new place, each man and woman is learning the freedom to do as they will, and the people are thriving.",
		options: [
			{
				text: "We have found freedom in exile.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "family society",
		check: () => { return q.familyTies >= 4 && q.happy > 70 && q.temple; },
		show: [],
		run: () => { q.tradition++; q.effectiveness += 4; q.arousal -= 5; q.health += 8; },
		text: "When the people were exiled to the isle, the intent was to break them, to destroy who they are. But they built their dwellings and their hearth-rooms, and through the guidance of the family matriarchs and patriarchs, they are thriving. Each man and woman knows that they have a place, and that they are loved.",
		options: [
			{
				text: "Let us sit by the fire and sing with our loved ones.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "tribal society",
		check: () => { return q.tribe >= 2 && q.familyTies < 3 && q.equality < 3 && q.happy > 70; },
		show: [],
		run: () => { q.effectiveness += 10; q.arousal += 5; },
		text: "Being exiled on the isle would have broken a lesser people, but it has made us strong. Each man and woman knows that the survival of the whole is at stake and makes tireless efforts to ensure it.",
		options: [
			{
				text: "Together we are strong.",
				run: () => { done(); }
			}
		]
	},
	{ // Hivetastic
		name: "brutal serfdom",
		check: () => { return q.indenture >= 2 && q.happy < 80 && q.indentureCommon && q.turn > 14; },
		show: [],
		run: () => { q.effectiveness += 12; q.equality -= 3; q.health -= 5; q.tradition--; },
		text: "The practice of indenture has now become so widespread that a large part of the people are held in that state. Many of them have accumulated so many years of service that they will never be free again. Indentured servants are openly traded between families, and ever flimsier pretexts are concocted to force more people into service. It is slavery by another name, but the well-to-do members of the families profit too much from it for it to be challenged.",
		options: [
			{
				text: "Is this what we imagined we would become?",
				run: () => { done(); }
			}
		]
	},
	{
		name: "serf revolt",
		check: () => { return q.indenture >= 2 && q.arousal > 40 && q.happy < 60 && q.indentureCommon && q.turn > 16; },
		important: () => { return q.arousal > 60 && q.happy < 40; },
		show: [],
		text: "As the practice of indenture has spread, an ever larger part of the people have found themselves forced into service for ever more spurious reasons, and treated as little more than slaves. At long last, their anger boils over. They assemble in a mob before the village hall and demand that the council abolish the practice and free them. The family heads, who have profited greatly from their servants, are loath to do so, but they are also afraid.",
		options: [
			{
				text: "Refuse to give in to the mob",
				success: () => { return q.law * 10 + q.familyTies * 10 - q.equality * 10; },
				run: (success, harm) => {
					if (success) {
						q.arousal -= 10;
						out("The council patiently explain to the assembled people the legal reasons behind indenture. Would they rather be mutilated as punishment for their crimes as in the old country? Eventually, the servants give up and disperse.");
					} else {
						q.arousal += 10;
						q.equality += 3;
						q.punishment = "lenient";
						q.law -= 3;
						q.familyTies -= 2;
						q.effectiveness -= 10;
						q.valuables = 0;
						q.indenture = 0;
						out("The people are not so easily cowed by the council, and they enter the council chamber and force the councillors to abolish indenture and compensate the victims. Afterwards, the council is allowed to continue to meet, but its power, and that of the families, is greatly diminished.");
					}
				}
			},
			{
				text: "Direct the warriors to disperse the mob",
				danger: () => { return 80 - q.weapons * 20; },
				run: (success, harm) => {
					if (harm) {
						q.arousal += 10;
						q.equality += 3;
						q.punishment = "lenient";
						q.law -= 3;
						q.familyTies -= 2;
						q.effectiveness -= 10;
						q.valuables = 0;
						q.population -= 13;
						q.health -= 18;
						q.indenture = 0;
						out("The council sends for the families' warriors to bring the unruly servants back under control - but they underestimate the anger of the mob, and their concealed knives. The warriors are overrun, dispersed and killed. The council is humiliated and forced to abolish indenture and compensate the victims. Afterwards, the council is allowed to continue to meet, but its power, and that of the families, is greatly diminished.")
					} else {
						q.equality -= 2;
						q.population -= 4;
						q.health -= 16;
						q.indenture++;
						out("The council sends for the families' warriors to bring the unruly servants back under control - and that they do, violently. Afterwards, the ringleaders are executed and the other rebels are indentured for life.");
					}
				}
			},
			{
				text: "Abolish the practice of indenture",
				success: () => { return 20 + q.law * 20 - q.familyTies * 10 + q.equality * 20; },
				run: (success) => {
					if (success) {
						q.happy += 10;
						q.punishment = "lenient";
						q.equality++;
						q.indenture = 0;
						out("Faced with this rebellion, the council deliberates and agrees to end the practice of indenture. Alternate punishments are devised for crimes that previously called for indenture. All servants are permitted to return to their families.");
					} else {
						q.punishment = "lenient";
						q.equality++;
						q.law -= 2;
						q.indenture = 0;
						out("The council reluctantly ends the practice of indenture, all the while complaining that this will only encourage crime and disorder.");
					}
				}
			},
			{
				text: "Regulate the practice of indenture",
				success: () => { return q.law * 20; },
				run: (success) => {
					if (success) {
						q.happy += 10;
						q.indenture = 1;
						q.law++;
						out("After some deliberation, the council agrees that the practice of indenture has gone out of hand. They introduce a number of new regulations, confining the practice to being a punishment for the worst crimes, banning the trade and mistreatment of servants. Finally, they commute the sentences of all but the worst offenders, freeing the majority of the servants.");
					} else {
						q.arousal += 10;
						q.equality += 3;
						q.punishment = "lenient";
						q.law -= 3;
						q.familyTies -= 2;
						q.effectiveness -= 10;
						q.valuables = 0;
						q.indenture = 0;
						out("After years of mistreatment, the assembled servants have little patience for the council's attempts at compromise. They enter the council chamber and force the councillors to abolish indenture and compensate the victims. Afterwards, the council is allowed to continue to meet, but its power, and that of the families, is greatly diminished.")
					}
				}
			},
		]
	},
	{
		name: "eshlings leave",
		check: () => { return q.eshlingHappy < -2 && q.happy < 80; },
		important: () => { return q.eshlingHappy < -3; },
		show: ["eshling"],
		text: "The Eshling family is packing up their things and leaving. They say that they have had enough of the hatred of the other families, and that they will set up their own village somewhere else on the isle, to live in peace.",
		options: [
			{
				text: "You have no choice but to let them go.",
				run: () => {
					q.eshlingGone = true;
					q.population = Math.ceil(q.population * 3 / 4);
					if (q.woolmouths > 3) {
						q.woolmouths--;
					}
					if (q.codgers > 3) {
						q.codgers--;
					}
					if (q.blademouths > 3) {
						q.blademouths--;
					}
					if (q.spindrakes > 3) {
						q.spindrakes--;
					}
					if (q.valuables > 3) {
						q.valuables--;
					}
					q.happy -= 10;
					q.arousal -= 10;
					done();
				}
			}
		]
	},
	{
		name: "pawls leave",
		check: () => { return q.pawlHappy < -2 && q.happy < 80; },
		important: () => { return q.pawlHappy < -3; },
		show: ["pawl"],
		text: "The Pawl family is packing up their things and leaving. They say that they have had enough of the hatred of the other families, and that they will set up their own village somewhere else on the isle, to live in peace.",
		options: [
			{
				text: "You have no choice but to let them go.",
				run: () => {
					q.pawlGone = true;
					q.population = Math.ceil(q.population * 4 / 5);
					if (q.woolmouths > 3) {
						q.woolmouths--;
					}
					if (q.codgers > 3) {
						q.codgers--;
					}
					if (q.blademouths > 3) {
						q.blademouths--;
					}
					if (q.spindrakes > 3) {
						q.spindrakes--;
					}
					if (q.valuables > 3) {
						q.valuables--;
					}
					q.happy -= 10;
					q.arousal -= 10;
					done();
				}
			}
		]
	},
	{
		name: "gures leave",
		check: () => { return q.gureHappy < -2 && q.happy < 80; },
		important: () => { return q.gureHappy < -3; },
		show: ["gure"],
		text: "The Gure family is packing up their things and leaving. They say that they have had enough of the hatred of the other families, and that they will set up their own village somewhere else on the isle, to live in peace.",
		options: [
			{
				text: "You have no choice but to let them go.",
				run: () => {
					q.gureGone = true;
					q.population = Math.ceil(q.population * 4 / 5);
					if (q.woolmouths > 3) {
						q.woolmouths--;
					}
					if (q.codgers > 3) {
						q.codgers--;
					}
					if (q.blademouths > 3) {
						q.blademouths--;
					}
					if (q.spindrakes > 3) {
						q.spindrakes--;
					}
					if (q.valuables > 3) {
						q.valuables--;
					}
					q.happy -= 10;
					q.arousal -= 10;
					done();
				}
			}
		]
	},
	{
		name: "aphals leave",
		check: () => { return q.aphalHappy < -2 && q.happy < 80; },
		important: () => { return q.aphalHappy < -3; },
		show: ["aphal"],
		text: "The Aphal family is packing up their things and leaving. They say that they have had enough of the hatred of the other families, and that they will set up their own village somewhere else on the isle, to live in peace.",
		options: [
			{
				text: "You have no choice but to let them go.",
				run: () => {
					q.aphalGone = true;
					q.population = Math.ceil(q.population * 4 / 5);
					if (q.woolmouths > 3) {
						q.woolmouths--;
					}
					if (q.codgers > 3) {
						q.codgers--;
					}
					if (q.blademouths > 3) {
						q.blademouths--;
					}
					if (q.spindrakes > 3) {
						q.spindrakes--;
					}
					if (q.valuables > 3) {
						q.valuables--;
					}
					q.happy -= 10;
					q.arousal -= 10;
					done();
				}
			}
		]
	},
	{
		name: "jenets leave",
		check: () => { return q.jenetHappy < -2 && q.happy < 80; },
		important: () => { return q.jenetHappy < -3; },
		show: ["jenet"],
		text: "The Jenet family is packing up their things and leaving. They say that they have had enough of the hatred of the other families, and that they will set up their own village somewhere else on the isle, to live in peace.",
		options: [
			{
				text: "You have no choice but to let them go.",
				run: () => {
					q.aphalGone = true;
					q.population = Math.ceil(q.population * 5 / 6);
					if (q.woolmouths > 3) {
						q.woolmouths--;
					}
					if (q.codgers > 3) {
						q.codgers--;
					}
					if (q.blademouths > 3) {
						q.blademouths--;
					}
					if (q.spindrakes > 3) {
						q.spindrakes--;
					}
					if (q.valuables > 3) {
						q.valuables--;
					}
					q.happy -= 10;
					q.arousal -= 10;
					done();
				}
			}
		]
	},
	{
		name: "symposium",
		check: () => { return q.shaping > 2; },
		text: "Now that shaping has become an established technique in the village, its foremost experts have convened a symposium. What questions should they focus on?",
		options: [
			{
				text: "How can shaping be made more reliable?",
				run: () => {
					q.shaping += 3;
					out("The shapers compare techniques and experiment to determine what works and what does not. In the end, they pronounce themselves significantly more able to safely reshape any kind of creature.");
				}
			},
			{
				text: "Can shaping be used for medical purposes?",
				run: () => {
					q.shaping++;
					q.medicine++;
					q.humanShaping++;
					out("The shapers consider this question and practice using their arts on human beings in subtle ways, so as to improve their health and cure ailments. It works.");
				}
			},
			{
				text: "Can shaping improve the health and fertility of our animals?",
				check: () => {
					return (q.blademouths > 0 && q.blademouths < 5) || (q.codgers > 0 && q.codgers < 5) || (q.woolmouths > 0 && q.woolmouths < 5) || (q.spindrakes > 0 && q.spindrakes < 5);
				},
				run: () => {
					q.shaping++;
					q.animals++;
					if (q.blademouths > 0 && q.blademouths < 5) {
						q.blademouths++;
					}
					if (q.codgers > 0 && q.codgers < 5) {
						q.codgers++;
					}
					if (q.woolmouths > 0 && q.woolmouths < 5) {
						q.woolmouths++;
					}
					if (q.spindrakes > 0 && q.spindrakes < 5) {
						q.spindrakes++;
					}
					out("The shapers confer and develop techniques for shaping-based animal care. Your herds soon prosper.");
				}
			},
			{
				text: "Is it possible to permanently reshape humans?",
				run: () => {
					q.shaping++;
					q.humanShaping += 3;
					out("The shapers are taken aback by this question, but soon they become intensely curious about it. After a lot of discussion and experimentation they agree that yes, it would be possible to turn the people into different beings altogether.");
				}
			},
		]
	},
	{
		name: "blossoms",
		check: () => { return q.turn > 2; },
		show: [],
		text: "The people wake up to find thousands of purple blossoms covering the ground. The isle is often terrifying, but occasionally, it's beautiful.",
		options: [
			{
				text: "Marvellous!",
				run: () => { q.happy += 6; done(); }
			}
		]
	},
	{
		name: "butterflies",
		check: () => { return q.houses; },
		show: [],
		text: "In the middle of the day, thousands of three-winged butterflies descend from the sky and settle on every available surface to preen and fight with each other. Each of them has an unique pattern on their wings, and the villagers delight in them. The next morning, they have gone again.",
		options: [
			{
				text: "Marvellous!",
				run: () => { q.happy += 6; done(); }
			}
		]
	},
	{
		name: "slime spires",
		check: () => { return q.houses; },
		show: [],
		text: "The people awake one morning to find tall spires of hardening black slime have sprung up near the village. Who made them, and for what purpose?",
		options: [
			{
				text: "No one knows.",
				run: () => { q.arousal -= 3; done(); }
			}
		]
	},
	{
		name: "braying",
		check: () => { return q.houses; },
		show: [],
		text: "The people are kept awake by the braying sounds of titanic animals somewhere out in the darkness. No one dares to try and find them. After a few nights, the noises stop.",
		options: [
			{
				text: "Thank the ancestors.",
				run: () => { q.happy -= 2; q.arousal -= 3; done(); }
			}
		]
	},
	{
		name: "cold",
		check: () => { return !q.houses && q.turn > 2; },
		show: [],
		text: "The nights are cold, and the people are huddled together, freezing.",
		options: [
			{
				text: "We need houses.",
				run: () => { q.health -= 4; done(); }
			}
		]
	},
	{
		name: "gentle giant",
		check: () => { return q.houses; },
		show: [],
		text: "One night, when everyone is abed, the people hear a curious loud snuffling outside. Opening their windows, they see snout, or an eye, or a huge expanse of matted hair. They rapidly close their windows again. Eventually, the sounds cease, and in the morning, they find strange star-shaped imprints in the ground - monstrous footsteps.",
		options: [
			{
				text: "At least this giant was not ill-disposed towards us.",
				run: () => { q.animals++; done(); }
			}
		]
	},
	{
		name: "gain hope",
		check: () => { return q.temple && q.watchtower && q.turn < 12; },
		show: [],
		text: "Now that the village is fully established and defended, life settles into something of a rhythm. There is shelter, food, water, and some measure of safety from the strange isle. The people gain hope.",
		options: [
			{
				text: "We are yet alive!",
				run: () => {
					q.health += 7;
					q.happy += 5;
					done();
				}
			}
		]
	},
	{
		name: "first song",
		check: () => { return q.hall && q.songs == 0; },
		show: [],
		text: "The people like to have a song for every occasion, and they love to make up new songs to old tunes. Now that they've settled in, the question arises of what the first new song on the isle should be.",
		options: [
			{
				text: "A lament for our exile.",
				run: () => {
					q.happy += 5;
					q.arousal -= 5;
					q.tradition++;
					q.familyTies++;
					q.songs++;
					out("The song is beautiful and stirs our hearts.");
				}
			},
			{
				text: "A working song.",
				run: () => {
					q.happy += 5;
					q.effectiveness += 8;
					q.songs++;
					out("A good song makes work easy.");
				}
			},
			{
				text: "A drinking song.",
				run: () => {
					q.happy += 8;
					q.arousal += 3;
					q.songs++;
					out("When the people get together in the hall, they sing and they drink, and then they drink and they sing, and they are happy.");
				}
			},
			{
				text: "A bawdy song.",
				run: () => {
					q.happy += 7;
					q.arousal += 5;
					q.songs++;
					q.tradition--;
					out("Never before or thereafter have so many double-entendres been stuffed into one song.");
				}
			}
		]
	},
	{
		name: "make one family happier",
		check: () => { return q.temple && q.jenetShown && q.gureShown && q.aphalShown && q.eshlingShown && q.pawlShown; },
		show: [],
		text: "It's a beautiful day, and the families come together in front of the hall to celebrate. They have been exiled, but yet survive. Which family should have the honor of the first song?",
		options: [
			{
				text: "Jenet",
				check: () => { return !q.jenetGone; },
				run: () => {
					q.jenetHappy++;
					q.effectiveness += 5;
					q.happy += 5;
					out("The Jenets sing an old working-song, a tune extolling the sweetness of labor in the service of your kin.");
				}
			},
			{
				text: "Gure",
				check: () => { return !q.gureGone; },
				run: () => {
					q.gureHappy++;
					q.tradition--;
					q.exploration++;
					q.happy += 6;
					out("The Gures sing a wandering-song, praising the beauty of the isle.");
				}
			},
			{
				text: "Aphal",
				check: () => { return !q.aphalGone; },
				run: () => {
					q.aphalHappy++;
					q.happy += 7;
					q.songs++;
					out("The Aphals sing a marvellous multi-layered tune, a new one of their own devising.");
				}
			},
			{
				text: "Eshling",
				check: () => { return !q.eshlingGone; },
				run: () => {
					q.eshlingHappy++;
					q.happy += 5;
					q.law++;
					out("The Eshlings sing an old song, from before the people even lived in the old country. It reminds the listener to speak truth and be fair in all their dealings.");
				}
			},
			{
				text: "Pawl",
				check: () => { return !q.pawlGone; },
				run: () => {
					q.pawlHappy++;
					q.happy += 9;
					q.tradition++;
					out("The Pawls sing a traditional song of the people, full of joy and hope.");
				}
			},
		]
	},
	{
		name: "insect peddler",
		check: () => { return q.houses && q.valuables; },
		show: [],
		text: "Out of nowhere, a man-shaped figure with the head of a beetle strides into the village. It's accompanied by giant segmented grubs with saddlebags. Using halting, clicking, archaic language and a profusion of gestures, it explains that it comes from deep below the ground, at the behest of its people, and that it's seeking to trade.",
		options: [
			{
				text: "Trade valuables for food.",
				run: () => {
					q.food += 200;
					q.valuables--;
					out("It provides you with masses of smoked meats and bread-like tubers. Then it walks off into the forest.");
				}
			},
			{
				text: "Trade valuables for weapons.",
				run: () => {
					q.weapons++;
					q.valuables--;
					out("It provides you with wicked hooked swords. Then it walks off into the forest.");
				}
			},
			{
				text: "Trade valuables for tools.",
				run: () => {
					q.tools++;
					q.valuables--;
					out("It provides you with strangely shaped but very sharp knives and awls. Then it walks off into the forest.");
				}
			},
			{
				text: "Exchange valuables",
				run: () => {
					q.valuables += 3;
					out("It's happy to trade beads and gems and other such things in exchange for a set of magnificent golden cups. Both sides are satisfied with this exchange. Then it walks off into the forest.");
				}
			},
			{
				text: "Give it gifts.",
				run: () => {
					q.valuables--;
					q.bimaneRelations++;
					q.robedOneRelations++;
					out("It thanks you graciously for your gifts and indicates that it will speak well of you to the others. What others? It does not say, and walks off.");
				}
			},
			{
				text: "Demand it hand over its goods.",
				run: () => {
					out("It chitters in laughter, and then it unfolds wings from its back and flies away.");
				}
			},
			{
				text: "Make no trade.",
				run: () => {
					out("You indicate that you do not wish to trade. It accepts this and moves on.");
				}
			}
		]
	},
	{
		name: "artworks",
		check: () => { return q.tradition > 2 && q.tools > 1 && q.turn > 10 && q.temple; },
		show: [],
		text: "In the old country, the people were well-known for their intricate stone figurines. It's taken some time for them to adapt their techniques to the local stone, but now they once again create beautiful works of art.",
		options: [
			{
				text: "Valuable trade goods, too.",
				run: () => { q.valuables++; done(); }
			}
		]
	},
	{
		name: "additional babies",
		check: () => { return q.houses && q.turn > 27 && q.health > 50 && q.happy > 40; },
		run: () => { q.population += 11; },
		show: [],
		text: "Good health and good cheer means that there are plenty of new babies in the village.",
		options: [
			{
				text: "Adorable!",
				run: () => { done(); }
			}
		]
	},
	{
		name: "wall guarding",
		check: () => { return q.walls; },
		important: () => { return q.turn > 14; },
		show: [],
		text: "The village is now encircled by walls, but to truly keep the people safe, they must be manned as well.",
		options: [
			{
				text: "Post a few lookouts.",
				run: () => {
					out("The lookouts will be able to rouse the people if a threat approaches.");
				}
			},
			{
				text: "Constantly man the wall with warriors.",
				run: () => {
					q.defenses++;
					q.arousal += 4;
					q.health -= 4;
					q.effectiveness -= 12;
					out("Keeping the wall defended like that means fewer people to do other work, but enemies will find it difficult to threaten the village.");
				}
			}
		]
	},
	{
		name: "gure happy",
		check: () => { return q.gureHappy > 1; },
		show: ["gure"],
		text: "The Gure family have been at the forefront of exploration since the first days on the isle. Now their scouts range across the land, bringing back food, valuable knowledge, and exciting tales.",
		run: () => {
			q.exploration++;
			q.animals++;
			q.forage++;
			q.happy += 4;
			q.arousal += 4;
		},
		options: [
			{
				text: "Astounding!",
				run: () => { done(); }
			}
		]
	},
	{
		name: "jenet happy",
		check: () => { return q.jenetHappy > 1; },
		show: ["jenet"],
		text: "The Jenet family have been hard at work making this new home a place where the people can stay and thrive. The village is clean, well-organised, and beautiful.",
		run: () => {
			q.effectiveness += 8;
			q.health += 10;
			q.happy += 4;
			q.arousal += 4;
		},
		options: [
			{
				text: "What would we do without them?",
				run: () => { done(); }
			}
		]
	},
	{
		name: "pawl happy",
		check: () => { return q.pawlHappy > 1; },
		show: ["pawl"],
		text: "The Pawls have busied themselves with a project to beautify the village hall with intricate carvings. At last, their work is complete, and the people rejoice.",
		run: () => {
			q.happy += 15;
			q.arousal += 4;
		},
		options: [
			{
				text: "Beauty makes the heart sing, and makes many things bearable.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "aphal happy",
		check: () => { return q.aphalHappy > 1; },
		show: ["aphal"],
		text: "The Aphal family have been busy studying the plants, animals, and minerals of the isle, and how to best make use of them. Now they have developed new tools and weapons to aid the people.",
		run: () => {
			q.tools++;
			q.weapons++;
		},
		options: [
			{
				text: "The people are grateful for this contribution.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "eshling happy",
		check: () => { return q.eshlingHappy > 1; },
		show: ["eshling"],
		text: "The Eshlings have busied themselves in the forests and village gardens, growing beds of new and old herbs for cooking and medical purposes.",
		run: () => {
			q.medicine++;
			q.health += 5;
		},
		options: [
			{
				text: "Never underestimate the Eshlings!",
				run: () => { done(); }
			}
		]
	},
	{
		name: "gure unhappy",
		check: () => { return q.gureHappy < -1; },
		show: ["gure"],
		text: "The Gures have always been difficult to deal with, but now they are in constant dispute with the other families. Gures are leaving on ever-longer scouting and foraging trips, preferring to camp out in the wilderness to spending time in the village.",
		run: () => {
			q.effectiveness -= 10;
			q.happy -= 5;
		},
		options: [
			{
				text: "Do they even wish to be part of the people?",
				run: () => { done(); }
			}
		]
	},
	{
		name: "jenet unhappy",
		check: () => { return q.jenetHappy < -1; },
		show: ["jenet"],
		text: "There is an air of desperation about the Jenets, who have responded to their bad luck since arriving on the isle by working themselves far too hard.",
		run: () => {
			q.effectiveness -= 3;
			q.health -= 12;
		},
		options: [
			{
				text: "Why are they so driven to destroy themselves?",
				run: () => { done(); }
			}
		]
	},
	{
		name: "pawl unhappy",
		check: () => { return q.pawlHappy < -1; },
		show: ["pawl"],
		text: "The Pawls are a high-handed family at the best of times, but now they have taken this to a new level. Pawls can be found everywhere, interfering, correcting, advising where no advice is needed.",
		run: () => {
			q.happy -= 12;
			q.arousal += 8;
		},
		options: [
			{
				text: "Why do they feel the need to insert themselves everywhere?",
				run: () => { done(); }
			}
		]
	},
	{
		name: "aphal unhappy",
		check: () => { return q.aphalHappy < -1; },
		show: ["aphal"],
		text: "The Aphals have dealt with their misfortune by becoming obsessed with the strange art of shaping. They neglect all other duties.",
		run: () => {
			q.effectiveness -= 10;
			q.shaping++;
			q.arousal -= 4;
		},
		options: [
			{
				text: "That's the problem with intellectuals.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "eshling unhappy",
		check: () => { return q.eshlingHappy < -1; },
		show: ["eshling"],
		text: "The Eshlings, downcast, are staying in their hearth-room whenever possible and barely acknowledge the other families anymore.",
		run: () => {
			q.effectiveness -= 4;
			q.happy -= 5;
			q.arousal -= 5;
			q.health -= 4;
		},
		options: [
			{
				text: "The Eshlings have always kept to themselves.",
				run: () => { done(); }
			}
		]
	},
	{
		name: "self-shaping children",
		check: () => { return q.shaping > 2; },
		show: [],
		text: "The council is convened to deal with a strange matter: some children have been observed using the shaping arts on themselves. They grow tails and antlers and additional fingers, make their skin change colour and texture, and more besides that, all to amuse themselves. The alterations are only temporary as their normal human shape reasserts itself quickly enough, but their parents are disturbed.",
		options: [
			{
				text: "Distorting the human form in this way is monstrous.",
				run: () => {
					q.tradition++;
					q.tribe++;
					q.arousal += 4;
					out("We are of the people, not monsters from the isle. The children must be taught this.");
				}
			},
			{
				text: "Shaping humans is a dangerous technique that should only be attempted by experienced shapers.",
				run: () => {
					q.shaping++;
					out("The children are forbidden to shape themselves lest they get hurt. Instead, the most experienced shapers begin careful experiments on this matter.");
				}
			},
			{
				text: "Self-shaping has potentially fascinating applications, and we should let this develop.",
				success: () => { return 45 - q.tradition * 20 + q.shaping * 15 + q.equality * 5;  },
				run: (success) => {
					q.selfShaping = true;
					if (success) {
						q.arousal += 5;
						q.happy += 5;
						q.tradition--;
						out("We are truly becoming a people of the isle. Imagine being able to grow gills, or wings, or claws, as needed!");
					} else {
						q.happy -= 3;
						q.arousal += 5;
						out("The people balk at these radical ideas coming from the council and tell their children to stop shaping themselves. Not all of them listen.");
					}
				}
			}
		]
	},
	{
		name: "self-shaping accident",
		check: () => { return q.selfShaping && q.shaping < 5; },
		run: () => {
			q.population--;
			q.happy -= 10;
			q.selfShaping = false;
		},
		show: [],
		text: "Horrible screams are heard throughout the village: One of the children has been playing at reshaping herself, and she evidently took it too far. Her mother wails over her twitching corpse, a mess of antlers and limbs. Fury soon finds its target in the council, who encouraged such dangerous behaviour.",
		options: [
			{
				text: "Apologise profusely.",
				success: () => { return 30 + q.law * 10 + q.tradition * 10 - q.equality * 10 - q.arousal / 4; },
				run: (success) => {
					if (success) {
						q.arousal -= 10;
						out("The whole council prostrate themselves in front of the mother and beg for her forgiveness. The people weep and bury the child.");
					} else {
						q.shaping = Math.max(1, q.shaping - 2);
						q.health -= 12;
						q.arousal += 20;
						out("The whole council prostrate themselves in front of the mother and beg for her forgiveness. They will have none of it, and savagely beat the councillors and any shapers they can find. Ever after, the shapers are afraid to practice their arts.")
					}
				}
			},
			{
				text: "Compensate the mother for her loss.",
				check: () => { return q.valuables > 1; },
				success: () => { return 20 + q.law * 10 - q.equality * 30 + q.indenture * 10; },
				run: (success) => {
					if (success) {
						q.valuables -= 2;
						out("The weeping mother accepts the payment and goes home to mourn.");
					} else {
						q.shaping = Math.max(1, q.shaping - 2);
						q.health -= 12;
						q.arousal += 20;
						out("The bereaved mother is incredulous at this offer of trinkets for the life of her child. The people savagely beat the councillors and any shapers they can find. Ever after, the shapers are afraid to practice their arts.")
					}
				}
			},
			{
				text: "Tightly restrict the practice of shaping.",
				run: () => {
					q.shaping = 1;
					out("The council, aghast, puts tight restrictions on the dangerous practice of shaping. The village's shapers know better than to protest.");
				}
			},
		]
	},
	{
		name: "warrior murder",
		check: () => { return q.weapons > 3; },
		show: ["gure"],
		text: "A great Gure hunter and warrior is found standing over the corpse of another man from a minor family. It turns out that he had paid this man to make a song extolling his strength, but he had instead made one that mocked him. The matter is brought before the council.<br><br>Mater Alice of Gure pleads with the council: this is a hero of the people, and he was insulted grievously.",
		run: () => {
			q.population--;
			q.happy -= 3;
		},
		options: [
			{
				text: "Execute him.",
				success: () => { return 50 + q.law * 25 - q.weapons * 10 + q.equality * 20 - q.familyTies * 10; },
				run: (success) => {
					q.population--;
					if (success) {
						q.law++;
						out("Hero of the people or not, the man is a murderer, and the law applies to everyone equally. The people respect the council's decision.");
					} else {
						q.happy -= 4;
						q.arousal += 12;
						out("Hero of the people or not, the man is a murderer, and the law applies to everyone equally. The people are angered that the council would so disrespect a man who has done so much for them.");
					}
				}
			},
			{
				text: "Cut off his hand.",
				run: () => {
					ev({
						text: "He insists that he would rather die than live as a cripple.",
						options: [
							{
								text: "Grant his wish.",
								run: () => {
									q.law--;
									q.population--;
									q.arousal += 6;
									out("He goes to the executioner's blade unbowed. The people revere him and disdain the council.");
								}
							},
							{
								text: "Cut off his hand.",
								success: () => { return 50 + q.law * 25 - q.weapons * 10 + q.equality * 20 - q.familyTies * 10; },
								run: (success) => {
									q.effectiveness -= 2;
									if (success) {
										out("The council replies that a criminal's wishes mean very little. He is parted from his hand. Thereafter he sinks into drinking and despair.");
									} else {
										q.law--;
										q.happy -= 4;
										q.arousal += 8;
										out("The council replies that a criminal's wishes mean very little. He is parted from his hand. Thereafter he sinks into drinking and despair. Somehow, the people blame the council for this.");
									}
								}
							}
						]
					});
				}
			},
			{
				text: "Let him go with a stern warning.",
				success: () => { return 20 + q.law * 20 + q.familyTies * 5 - q.weapons * 5; },
				run: (success) => {
					q.law--;
					if (success) {
						q.happy += 5;
						out("He prostrates himself before the council and thanks them for their wisdom. He pledges to live his life for the people from thereon. The people are pleased to have their hero returned to them.");
					} else {
						q.happy -= 4;
						q.arousal += 4;
						out("The warrior leaves the hall with a swagger. His hunting companions celebrate him, but many others mutter that the council is foolish.");
					}
				}
			},
			{
				text: "Indenture him to the victim's sister.",
				check: () => { return q.indenture; },
				success: () => { return 50 - q.familyTies * 5 - q.weapons * 5; },
				run: (success) => {
					q.indenture++;
					if (success) {
						out("The only family the victim had are his sister and her sons. The warrior is indentured to them, and can from then on be seen dressed in rags, fetching water.");
					} else {
						q.law--;
						q.health -= 3;
						out("The only family the victim had are his sister and her sons. They are unable to keep him under control, and he soon beats her up and escapes into the wilderness.");
					}
				}
			},
			{
				text: "Imprison him.",
				check: () => { return q.punishment == "prison"; },
				run: () => {
					q.population--;
					q.law--;
					out("He bows his head and goes to prison, but a few days later, he escapes and runs away into the wilderness. It's an open secret that his hunting companions engineered his escape.");
				}
			},
		]
	},
	{
		name: "nicer buildings",
		check: () => { return q.temple && q.walls && q.turn > 20; },
		show: [],
		text: "As the people settle into their lives on the isle, they find that the simple dwellings they built now feel somewhat cramped and ugly.",
		options: [
			{
				text: "The people should focus on survival, not vanity.",
				run: () => {
					q.happy -= 3;
					q.effectiveness += 5;
					out("The people grumble but accept this.");
				}
			},
			{
				text: "Construct new stone and wooden houses.",
				success: () => { return 20 + q.tools * 10; },
				run: (success) => {
					if (success) {
						q.happy += 8;
						out("The new dwellings are magnificent in comparison to the old hovels, with grand hearth-rooms and generous windows lighting up the upper stories.");
					} else {
						out("The new houses are larger and sturdier than the old ones. The people are satisfied, and life goes on.");
					}
				}
			},
			{
				text: "Construct houses made of woolmouth fibre.",
				check: () => { return q.woolmouths && q.woolmouthStrongWool; },
				success: () => { return 60 + q.tools * 5 + q.woolmouths * 10; },
				run: (success) => {
					if (success) {
						q.happy += 16;
						q.arousal += 5;
						out("The super-strong fibres exuded by the woolmouths offer architectural possibilities undreamt of in the old country. The people build enormeous hearth-halls and magnificent spires.");
					} else {
						out("Woolmouth weave is a promising material, but not an easy one to work with. Still, the new dwellings are prettier and roomier than the old ones. ");
					}
				}
			},
		]
	},
	{
		name: "debts",
		check: () => { return q.tools > 2 && q.valuables > 1 && q.temple && q.turn > 25; },
		show: ["eshling", "pawl"],
		text: "What started out as a few simple buildings to shelter from the elements has now turned into a quite beautiful little town. Houses sport elaborate ornaments, and the people are dressed in colourful garments. But this newfound wealth is not equally distributed: Despite starting from nothing, the Pawl family have quickly found themselves in a position of wealth and power again, whereas the Eshlings are impoverished, and owe increasing debts to the Pawls.",
		options: [
			{
				text: "Rule that such debts must be regularly forgiven.",
				success: () => { return 20 + q.law * 20 - q.familyTies * 10 + q.tradition * 10; },
				run: (success) => {
					if (success) {
						q.eshlingHappy++;
						q.equality++;
						out("It's not proper for the people to keep debts over years and lifetimes. The council convinces the Pawls of the truth of this, and the debts are forgiven.");
					} else {
						q.eshlingHappy++;
						q.pawlHappy--;
						out("It's not proper for the people to keep debts over years and lifetimes. The Pawls complain at length, but eventually obey.");
					}
				}
			},
			{
				text: "Convince the Pawls to be generous to their debtors.",
				success: () => { return 30 + q.pawlHappy * 40; },
				run: (success) => {
					q.familyTies++;
					if (success) {
						q.eshlingHappy++;
						out("The Pawls are amenable to flattery, and so they forgive many of the Eshlings' debts.");
					} else {
						q.eshlingHappy--;
						out("The Pawls refuse to give hand-outs to the lazy Eshlings.");
					}
				}
			},
			{
				text: "We are all one people, and we should hold all in common.",
				success: () => { return q.equality * 30 + q.tribe * 30 - q.familyTies * 40 - q.tradition * 10; },
				run: (success) => {
					if (success) {
						q.eshlingHappy++;
						q.effectiveness += 3;
						q.equality++;
						q.tribe++;
						q.familyTies--;
						out("The people agree: this idea of debts between people and families is absurd. The debts are abolished.");
					} else {
						q.eshlingHappy--;
						out("The people balk at this: each family should reap the rewards of their labor. With hard work, the Eshlings will be able to pay their debts in time.");
					}
				}
			},
			{
				text: "Do nothing.",
				run: () => {
					q.eshlingHappy--;
					out("The people arrived on the isle with hardly anything, and the Pawls can hardly be blamed for making the best of their situation. The Eshlings beg to disagree.");
				}
			}
		]
	}
];
