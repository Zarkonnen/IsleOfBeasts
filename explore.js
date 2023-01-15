var explore = [
	{
		name: "initial exploration",
		check: () => { return true; },
		important: () => { return true; },
		show: ["gure"],
		text: "The young people least affected by the crossing to the Isle soon strike out to explore beyond the bay where you were stranded. They are led by several eager members of the Gure family. They scramble up the vine-covered inclines surrounding the bay to find an expanse of white sand dotted with stands of grass and glossy green bushes that look like nests of serpents. Unfamiliar insects scuttle past, and there is the sound of what might be shore birds.<br><br>Further in, the land rises up and becomes forested. Stone pillars rise from in between the trees. The pillars become taller and more densely spaced in the distance until they turn into mountains.",
		options: [
			{
				text: "Go up a nearby hill to get a clearer idea of the surrounding landscape.",
				success: () => { return 80; },
				run: (success) => {
					if (success) {
						q.exploration += 2;
						out("The top of the hill affords an excellent view of a large part of the island. The explorers see lush meadows beyond the sand, with what might be herds of scintillating animals. In the forest, they spot sudden deep sinkholes and the movement of something massive through the trees.");
					} else {
						q.exploration++;
						q.health -= 5;
						out("It's an exhausting scramble to get up on the hill, and the final view is unfortunately obscured by fog. Still, the explorers can see hints of lush meadows beyond the sand.");
					}
				}
			},
			{
				text: "Try to find something edible nearby.",
				success: () => { return 40; },
				run: (success) => {
					if (success) {
						q.forage++;
						q.happy += 4;
						q.arousal += 4;
						q.food += 50;
						out("The explorers fan out and look for something edible in the dunes. They return, triumphantly, clutching mild-tasting roots dug out from in between the grasses.");
					} else {
						q.arousal -= 6;
						q.health -= 5;
						out("The explorers scour the sands for anything that might be edible. Some glossy black berries look promising, but they make all that try them violently ill.");
					}
				}
			},
			{
				text: "Explore along the coast to look for survivors of the missing ship.",
				success: () => { return 40; },
				run: (success) => {
					q.exploration++;
					if (success) {
						q.jenetHappy++;
						q.happy += 10;
						q.population += 7;
						out("Walking along the coast, the explorers come across a handful of survivors from the Jenet family.<br><br>They tell a harrowing tale of how their ship went off-course and aground on hidden rocks. They managed to grab ahold of some pieces of wood and stay afloat while everyone else was sucked down into the abyss. They curse the incompetent sailors who killed so many of them, but cry tears of relief when they hear that the other ships arrived safely.", "jenet");
					} else {
						q.happy -= 3;
						q.arousal -= 5;
						out("The explorers walk along the coast for a long time, harassed by sea birds. They find a few pieces of driftwood that might have come from the stricken vessel, but no survivors.")
					}
				}
			},
			{
				text: "Investigate the forest.",
				danger: () => { return 30; },
				run: (success, bad) => {
					q.exploration += 2;
					if (!bad) {
						q.animals++;
						q.arousal -= 5;
						q.aphalHappy++;
						out("The explorers make their way into the forest. They are soon surrounded by tall, unfamiliar trees. Small insect-birds with rotary wings swarm around them, and hidden animals chirrup and moan.<br><br>They move carefully and patiently, avoiding the sinkholes that dot the forest.<br><br>Their patience is rewarded when they come across a strange sight: a hollow sphere made of interwoven black threads silently rolls through the forest. Suddenly it stops, tilts, and sprays a jet of a sticky blue substance at a point between some leaves. The substance congeals near-instantly, leaving a thread connected to the sphere.<br><br>The sphere begins pulling the thread back in, revealing a small animal that looks like a feathered squirrel, vainly struggling to escape the congealed mess. The sphere draws the animal into itself, and devours it messily before rolling on.<br><br>The explorers relate this back to the council. Pater Zeno Aphal pronounces this to be \"fascinating\", while the others agree it is simply disgusting.", "aphal");
					} else {
						q.health -= 10;
						q.population--;
						q.arousal -= 10;
						q.happy -= 5;
						out("The explorers make their way into the forest. They are soon surrounded by tall, unfamiliar trees. Small insect-birds with rotary wings swarm around them, and hidden animals chirrup and moan.<br><br>Suddenly, one of the explorers, Rebecca Gure, screams and vanishes. Others topple and grab for roots and branches. A steep, overgrown sinkhole! The explorers scramble to safety and then carefully feel out the extent of the hole. Eventually, they find a place where they can peer down.<br><br>They see Rebecca sprawled far below them, her head bashed open.");
					}
				}
			}
		]
	},
	{
		name: "blademouths",
		check: () => { return true; },
		important: () => { return q.turn > 14; },
		show: [],
		text: "Your explorers realize that something is stalking them through the underbrush. They prepare their weapons and wait and strain their eyes. Eventually, they notice a furry cat-sized animal with huge sharp beetle mandibles crouched underneath a tree, watching them. It seems... interested. The explorers decide to call it a blademouth.",
		options: [
			{
				text: "Attempt to feed it some meat.",
				danger: () => { return 45 - q.animals * 20; },
				run: (success, harm) => {
					q.animals++;
					if (harm) {
						q.health -= 10;
						q.happy -= 3;
						q.arousal += 3;
						q.blademouthsTryAgain = true;
						out("The creature comes closer and tears the morsel of meat out of your explorer's hand. Then it discovers that the hand is also made of meat, and comes back for seconds. More of the creatures emerge from the bushes, and the explorers run away, cursing.");
					} else {
						q.blademouths = 1;
						out("The creature comes closer and enthusiastically grips the proferred bit of jerky in its pincers before gulping it down. More of them emerge from the bushes, eager for treats.<br><br>Unlike most other animals encountered on the isle so far, these seem almost domesticated, and they willingly follow your explorers home, settling into a life as pets and hunting companions.");
					}
				}
			},
			{
				text: "Make a noise it might interpret as friendly.",
				success: () => { return 30 + q.animals * 30; },
				danger: () => { return 30 + q.animals * 20; },
				run: (success, harm) => {
					q.animals++;
					if (success) {
						q.blademouths = 1;
						out("Your explorers make cooing and clicking sounds. The creature looks confused, but then comes closer and rubs its mandibles against the legs of one of the explorers. More of them emerge from the bushes, eager for treats.<br><br>Unlike most other animals encountered on the isle so far, these seem almost domesticated, and they willingly follow your explorers home, settling into a life as pets and hunting companions.");
					} else if (harm) {
						q.health -= 10;
						q.happy -= 3;
						q.arousal += 3;
						q.blademouthsTryAgain = true;
						out("Your explorers make cooing and clicking sounds. The creature looks confused, and then suddenly attacks one of the explorers. More of the creatures emerge from the bushes to join the fray. Your explorers retreat rapidly.");
					} else {
						q.blademouthsTryAgain = true;
						out("Your explorers make cooing and clicking sounds. The creature looks confused, then bored, and scampers away.");
					}
				}
			},
			{
				text: "Adopt a non-threatening posture.",
				success: () => { return 20 + q.animals * 15; },
				run: (success) => {
					if (success) {
						q.blademouths = 1;
						out("The creature looks confused, but then slinks towards one of the explorers and snuggles up to him. More of them emerge from the bushes, eager for treats.<br><br>Unlike most other animals encountered on the isle so far, these seem almost domesticated, and they willingly follow your explorers home, settling into a life as pets and hunting companions.");
					} else {
						q.blademouthsTryAgain = true;
						out("The creature looks confused, then bored, and scampers away.");
					}
				}
			},
		]
	},
	{
		name: "codgers",
		check: () => { return q.exploration > 0; },
		show: [],
		text: "Deep in the forest, your explorers notice uprooted trees and the entrance to large burrows beneath them. A creature that looks like a large badger with metallic scales and claws emerges from underground. It seems grumpy but interested in your people, who decide to call it a codger.",
		options: [
			{
				text: "Attempt to feed it some meat.",
				danger: () => { return 50 - q.animals * 15; },
				run: (success, harm) => {
					q.animals++;
					if (harm) {
						q.population--;
						q.happy -= 3;
						q.arousal -= 3;
						q.codgersTryAgain = true;
						out("The codger ambles up to the proferred bit of jerky and snuffles at it. Then it opens its large mouth full of metal teeth and bites down on the arm of the explorer. The others scream and run away as the unfortunate victim is devoured.");
					} else {
						q.codgers = 1;
						out("The codger ambles up to the proferred bit of jerky and snuffles at it. Then it gingerly takes it into its jaws and chews. More codgers and pups emerge from the sett.<br><br>Unlike most other animals encountered on the isle so far, these seem almost domesticated, and they willingly follow your explorers home.");
					}
				}
			},
			{
				text: "Make a noise it might interpret as friendly.",
				success: () => { return 20 + q.animals * 30; },
				danger: () => { return 40 + q.animals * 20; },
				run: (success, harm) => {
					q.animals++;
					if (success) {
						q.codgers = 1;
						out("Your explorers make cooing and clicking sounds. The codger looks a bit confused at first, but then ambles up to one of the explorers and rubs itself against her. More codgers and pups emerge from the sett.<br><br>Unlike most other animals encountered on the isle so far, these seem almost domesticated, and they willingly follow your explorers home.");
					} else if (harm) {
						q.population--;
						q.happy -= 3;
						q.arousal -= 3;
						q.codgersTryAgain = true;
						out("Your explorers make cooing and clicking sounds. The creature looks confused, and then it suddenly advances in a clash of metal plates, claws and teeth. It neatly disembowels the nearest explorer while the rest run away screaming.");
					} else {
						q.codgersTryAgain = true;
						out("Your explorers make cooing and clicking sounds. The creature looks confused, then frightened, and runs away.");
					}
				}
			},
			{
				text: "Adopt a non-threatening posture.",
				success: () => { return 20 + q.animals * 20; },
				run: (success) => {
					if (success) {
						q.codgers = 1;
						out("The creature slowly sidles up to the explorers and then rubs itself against them, its metal scales clicking. More codgers and pups emerge from the sett.<br><br>Unlike most other animals encountered on the isle so far, these seem almost domesticated, and they willingly follow your explorers home.");
					} else {
						q.codgersTryAgain = true;
						out("The creature stands there and then chooses to ignore the explorers and ambles off into the forest.");
					}
				}
			},
		]
	},
	{
		name: "woolmouths",
		check: () => { return q.exploration > 0 && q.woolmouths == 0; },
		important: () => { return q.turn > 21; },
		show: [],
		text: "Walking through the meadowlands, your explorers notice a group of animals that look like wooly frogs with giant mouths. They decide to call them woolmouths. They appear unperturbed by your people, bleating and humming and eating grass.",
		options: [
			{
				text: "Attempt to pet them",
				success: () => { return 45 + q.animals * 15 - q.weapons * 10; },
				run: (success) => {
					q.animals++;
					if (success) {
						q.woolmouths = 1;
						q.food += 20;
						out("The woolmouths readily accept being petted, and follow your explorers home to the village.<br><br>It seems that those creatures were previously domesticated by someone, as they readily follow your people home. Their wool turns out to be very useful - and so does their meat.");
					} else {
						q.woolmouthsTryAgain = true;
						out("When they see the explorers advancing on them, the woolmouths bleat and run away.");
					}
				}
			},
			{
				text: "Imitate their humming",
				success: () => { return 20 + q.songs * 30 + q.animals * 10; },
				run: (success) => {
					if (success) {
						q.woolmouths = 1;
						q.happy += 5;
						out("As the explorers start humming, the woolmouths become attentive and their humming increases in volume. Then their mouths open, and they begin to sing a beautiful tune. You sing together, and afterwards, the woolmouths follow the explorers home to stay. Both their wool and their songs are very welcome in the village.");
					} else {
						out("The explorers try to join in with the humming of the woolmouths, but it doesn't quite work. The creatures are startled and walk away.");
					}
				}
			},
		]
	},
	{
		name: "spindrakes",
		check: () => { return q.exploration > 2; },
		show: [],
		text: "Exploring the tall karst spires beyond the forest, strange flying creatures come to the attention of the explorers. The front and back halves of their bodies each have three wings, and the back half spins rapidly, propelling them through the sky. The explorers call them spindrakes. One of them notices your people and flutters closer, with evident interest.",
		options: [
			{
				text: "Attempt to feed it some meat",
				danger: () => { return 100 - q.animals * 20; },
				run: (success, harm) => {
					q.animals++;
					if (harm) {
						q.happy -= 5;
						q.arousal -= 5;
						q.population--;
						q.spindrakeTryAgain = true;
						out("The spindrake spots the piece of meat and dives towards it. It rips the meat out of the hand of the explorer holding it. More spindrakes dive down and start biting at the explorer, covering him in fluttering wings, tearing him apart. The other explorers run away.");
					} else {
						q.spindrakes = 1;
						out("The spindrake flutters around the piece of meat offered, and then settles on the arm of the explorer and picks at it. More spindrakes land and beg for treats. In the end, several of them come back to the village with your people and settle in as scouts and hunters.");
					}
				}
			},
			{
				text: "Coax one of them to land on you",
				success: () => { return 5 + q.animals * 15; },
				run: (success) => {
					if (success) {
						q.spindrakes = 1;
						out("One of the explorers stretches out his arm, imitating the body language of a falconer. The spindrake quickly settles down on his arm and coos at him. More explorers do the same, and more spindrakes land. In the end, several of them come back to the village with your people and settle in as scouts and hunters.");
					} else {
						q.spindrakeTryAgain = true;
						out("One of the explorers stretches out his arm, imitating the body language of a falconer. The spindrake flies past him a few times, confused, and then flutters off.");
					}
				}
			},
			{
				text: "Carefully observe the creatures",
				run: () => {
					q.animals += 2;
					q.spindrakeTryAgain = true;
					out("The explorers stay and watch the behaviour of the spindrakes, their magnificent aerial manoeuvres, their social interactions, their way of hunting. The Isle is truly full of terrifying wonders.");
				}
			}
		]
	},
	{
		name: "blademouths 2",
		check: () => { return q.blademouthsTryAgain && q.blademouths == 0; },
		show: [],
		text: "The explorers notice that some blademouths are following them. These are furry cat-sized animals with huge sharp beetle mandibles, and previous attempts at taming them failed.",
		options: [
			{
				text: "Attempt again to tame them",
				danger: () => { return 70 - q.animals * 20; },
				run: (success, harm) => {
					q.animals++;
					if (harm) {
						q.health -= 11;
						q.happy -= 5;
						q.arousal -= 5;
						out("The blademouths take this as a sign to attack, badly injuring several of your people before they can get away.");
					} else {
						q.blademouths = 1;
						q.happy += 3;
						out("The blademouths respond well to treats and are soon cuddling up to the explorers. They return home with your people and settle in, hunting vermin.");
					}
				}
			},
			{
				text: "Ignore them",
				run: () => {
					q.exploration++;
					q.animals++;
					out("Your explorers carry on.");
				}
			}
		]
	},
	{
		name: "codgers 2",
		check: () => { return q.codgersTryAgain && q.codgers == 0; },
		show: [],
		text: "In the forest, a group of codger pups cluster around a dead mother.",
		options: [
			{
				text: "Attempt to take them with you",
				success: () => { return 30 + q.animals * 20; },
				run: (success, harm) => {
					q.animals++;
					if (success) {
						q.happy += 3;
						q.arousal -= 3;
						q.codgers = 1;
						out("You take them in and they bond to your people. A while later, more adults appear to join you. They prove useful in hunting and digging tasks.");
					} else {
						q.happy -= 3;
						out("When the pups see your people, they run away.");
					}
				}
			},
			{
				text: "Ignore them",
				run: () => {
					q.exploration++;
					q.animals++;
					out("Your explorers carry on.");
				}
			}
		]
	},
	{
		name: "woolmouths 2",
		check: () => { return q.woolmouthsTryAgain && q.woolmouths == 0; },
		show: [],
		text: "Your explorers encounter another herd of woolmouths, creatures that look like large wooly frogs. The last attempt to tame them failed.",
		options: [
			{
				text: "Attempt again to tame them",
				success: () => { return 40 + q.animals * 20 + q.songs * 30; },
				run: (success, harm) => {
					q.animals++;
					if (success) {
						q.woolmouths = 1;
						out("The woolmouths are easily led back to the village, as if they are used to being husbanded.");
					} else {
						out("Despite your explorers' best efforts, the creatures run away.");
					}
				}
			},
			{
				text: "Ignore them",
				run: () => {
					q.exploration++;
					q.animals++;
					out("Your explorers carry on.");
				}
			}
		]
	},
	{
		name: "spindrakes 2",
		check: () => { return q.spindrakesTryAgain && q.spindrakes == 0; },
		show: [],
		text: "The explorers notice that some blademouths are following them. These are furry cat-sized animals with huge sharp beetle mandibles, and previous attempts at taming them failed.",
		options: [
			{
				text: "Attempt again to tame them",
				danger: () => { return 110 - q.animals * 25; },
				run: (success, harm) => {
					q.animals++;
					if (harm) {
						q.health -= 17;
						q.effectiveness -= 2;
						q.happy -= 5;
						q.arousal -= 5;
						out("Your explorers attempt to tame the creatures through gestures and by feeding them, but they take this as an opportunity to attack your people, maiming several of them.");
					} else {
						q.spindrakes = 1;
						out("By a careful process of feeding them lots of meat you build up a rapport with the spindrakes. They join your people and help them hunt.");
					}
				}
			},
			{
				text: "Ignore them",
				run: () => {
					q.exploration++;
					q.animals++;
					out("Your explorers carry on.");
				}
			}
		]
	},
	{
		name: "javelin tree",
		check: () => { return q.exploration > 2; },
		show: [],
		text: "In the deep forests, your explorers come across a glade of trees with huge, thin, razor-sharp thorns - perhaps suitable as weapons.",
		options: [
			{
				text: "Harvest the thorns with what tools you have",
				danger: () => { return 160 - strength() - q.tools * 25; },
				run: (success, harm) => {
					if (harm) {
						q.health -= 8;
						q.happy -= 2;
						out("The explorers try in vain to cut or break off the thorns, but they are simply too tough to yield. In the end, all they have to show for their efforts are various injuries.");
					} else {
						q.weapons++;
						out("The thorns are very tough, but enough patience and sawing and cutting eventually yields a number of formidable weapons.");
					}
				}
			},
			{
				text: "Get the blademouths to cut off some thorns with their mandibles",
				check: () => { return q.blademouths; },
				danger: () => { return 90 - q.blademouths * (q.blademouthFighters ? 30 : 20); },
				run: (success, harm) => {
					if (harm) {
						if (q.blademouths > 1) {
							q.blademouths--;
						}
						out("The thorns are simply too tough for the blademouths' mandibles, and the poor creatures over-exert and injure themselves in the attempt.");
					} else {
						q.weapons++;
						out("The thorns might be sharp, but the blademouths' mandibles are even sharper. Soon enough you have a number of formidable spears.");
					}
				}
			},
			{
				text: "Get the codgers to break off some thorns",
				check: () => { return q.codgers; },
				danger: () => { return 90 - q.codgers * (q.codgerWorkers || q.codgerFighters ? 30 : 20); },
				run: (success, harm) => {
					if (harm) {
						if (q.codgers > 1) {
							q.codgers--;
						}
						out("The codgers strain mightily against the thorns. Enraged, they bash themselves against them again and again, injuring themselves.");
					} else {
						q.weapons++;
						out("The thorns are no match for the powerful metal claws of the codgers, and soon you have a pile of thorn-spears.");
					}
				}
			},
			{
				text: "Ignore them",
				run: () => {
					q.exploration++;
					out("Your explorers carry on.");
				}
			}
		]
	},
	{
		name: "giant eggs",
		check: () => { return q.exploration > 0; },
		show: [],
		text: "Exploring along the shore, your people come across huge cliff-side nests with massive eggs. A great bounty if they can figure out a way to reach them.",
		options: [
			{
				text: "Climb up to get them",
				danger: () => { return 150 - strength(); },
				run: (success, harm) => {
					if (harm) {
						q.population -= 3;
						q.happy -= 7;
						out("The nimblest of the group attempt to climb the cliff, but misjudge their footholds, and plummet to the ground!");
					} else {
						q.food += 120;
						q.forage++;
						out("The nimblest of the group ascend the cliff to reach the eggs, and use ropes to lower them down.");
					}
				}
			},
			{
				text: "Instruct the blademouths to fetch them",
				check: () => { return q.blademouths; },
				success: () => { return q.blademouthScouts ? 80 : 35; },
				run: (success) => {
					if (success) {
						q.food += 120;
						q.forage++;
						out("The blademouths listen to your instructions intently, them swarm up the cliff. They gingerly grasp the eggs in their pincers and carry them down. Soon enough, you have dozens of them.");
					} else {
						q.blademouths++;
						out("The blademouths are perfectly willing to climb up to the eggs, but simply break them open and devour their insides. At least they are well fed.");
					}
				}
			},
			{
				text: "Instruct the spindrakes to get them",
				check: () => { return q.spindrakes; },
				success: () => { return q.spindrakeRiders ? 90 : 20; },
				run: (success) => {
					if (success) {
						q.food += 120;
						q.forage++;
						out("The spindrakes readily understand your instructions and launch into the air. The sheer size of the eggs poses some brief problems, but they figure out how to get them down safely.s");
					} else {
						out("The spindrakes are willing enough to fetch the eggs, but they are simply too large and heavy for them to hold on to. The result is a mess of yolk and white and shell, and no eggs.");
					}
				}
			},
			{
				text: "Ignore them",
				run: () => {
					q.exploration++;
					out("Your explorers carry on.");
				}
			}
		]
	},
	{
		name: "giant roots",
		check: () => { return true; },
		show: [],
		text: "In a remote corner of the dunes, the explorers find a stand of bushy plants that look like giant versions of the familiar dune tubers that are a staple of the people's diet. After a lot of digging, they partially expose the roots of one of the plants, and confirm that they are indeed giant dune tubers. But how to get them out of the ground?",
		options: [
			{
				text: "Set to digging",
				danger: () => { return 120 - strength() - q.tools * 20; },
				run: (success, harm) => {
					if (harm) {
						q.health -= 5;
						q.happy -= 3;
						q.population -= 3;
						out("As much as they try to dig, the loose soil keeps on collapsing in on itself, re-burying the roots. The explorers end up bruised and tired with nothing to show. A few are nearly buried alive.");
					} else {
						q.health -= 5;
						q.food += 130;
						q.forage++;
						out("It's exhausting work, but it yields a number of truly massive tubers, enough to feed the people for a long time.");
					}
				}
			},
			{
				text: "Instruct the codgers to dig up the roots",
				check: () => { return q.codgers; },
				danger: () => { return q.codgerDiggers ? 20 : 60; },
				run: (success, harm) => {
					if (harm) {
						if (q.codgers > 1) {
							q.codgers--;
						}
						out("The codgers attempt to dig into the soil, but it's too sandy and loose for them. At first, they appear to be making progress, but then their tunnels collapse. Not all of them make it back out.");
					} else {
						q.food += 130;
						q.forage++;
						out("The codgers set to work with their digging claws, vanishing under the surface of the earth. Soon, they return, dragging out huge tubers with their jaws - enough to feed the people for a long time.");
					}
				}
			},
			{
				text: "Move on",
				run: () => {
					q.exploration++;
					out("The roots represent a lot of food, but it's simply buried too deep. There are easier ways to find a meal.");
				}
			}
		]
	},
	{
		name: "medical herbs",
		check: () => { return q.robedOnesKnowledge; },
		show: [],
		text: "Your explorers find a stand of pungent herbs. Using knowledge gained from the Robed Ones, they are able to recognise them as powerful medicines.",
		options: [
			{
				text: "Collect a supply of them.",
				run: () => {
					q.medicine++;
					done();
				}
			}
		]
	},
	{
		name: "meadow song",
		check: () => { return q.exploration > 1 && !q.woolmouths; },
		show: [],
		text: "As the explorers stride across the wide meadows in the centre of the isle, they can suddenly hear singing. They recognize the tune - it's a well-known folk tune of the people. But who is singing? There is no one out here - certainly no one who'd know this tune.",
		options: [
			{
				text: "Attempt to find the singers",
				success: () => { return strength() / 4 + q.exploration * 10 + q.animals * 10; },
				run: (success) => {
					if (success) {
						q.woolmouths = 1;
						out("The singing turns out to come from a group of woolmouths, big, calm wooly frog-creatures. Your explorers hum along with their songs and easily convince them to come back to the village.");
					} else {
						out("Try as they might, the source of the singing eludes your explorers. Frustrated, they move on.");
					}
				}
			},
			{
				text: "Join in with the singing",
				success: () => { return q.songs * 30 + q.animals * 10; },
				run: (success) => {
					if (success) {
						q.woolmouths = 1;
						out("The explorers join in, and the music increases in volume. It turns out to come from a group of woolmouths, big, calm wooly frog-creatures. Your explorers hum along with their songs and easily convince them to come back to the village.");
					} else {
						q.happy += 5;
						out("The explorers join into the mysterious music. The Isle is perhaps not such a hostile place after all.");
					}
				}
			},
			{
				text: "This is the work of malicious ghosts - ignore the music",
				run: () => {
					q.exploration++;
					q.tradition++;
					out("Your explorers move on, paying no heed to the strange music.");
				}
			}
		]
	},
	{
		name: "strange statues",
		check: () => { return q.robedOnesEncountered && !q.robedOneEyes && q.exploration > 2; },
		show: [],
		text: "At the northern edge of the forest, where the trees grow spindly, the explorers come across what appears to be a group of Robed Ones. The figures are dressed in their distinctive stiff conical robes and hats, lavishly decorated with beads and panels, even more so than usual. None of them are moving.",
		options: [
			{
				text: "Greet them.",
				run: () => {
					ev({
						text: "They do not reply or acknowledge the explorers' presence in any way. Coming closer, they notice that some of them are covered in moss. One of them has a bird's nest within the fold of its robes. Are they asleep? Are they effigies? Statues?",
						options: [
							{
								text: "Take off the hat of one of them",
								run: () => {
									q.robedOneRelations--;
									q.happy -= 3;
									q.arousal -= 3;
									out("It's surprisingly difficult to do so, as the hat is heavy and attached to the robes with multiple cords. Eventually, it comes off, and reveals a mummified corpse. A human corpse? It's hard to tell. Your explorers recoil.");
								}
							},
							{
								text: "Try knocking them over",
								run: () => {
									q.robedOneRelations--;
									q.arousal += 5;
									out("One good shove, and the statues fall over, landing softly. They are not statues after all, but thick piles of robes.");
								}
							},
							{
								text: "Take some valuable-looking beads",
								run: () => {
									q.robedOneRelations--;
									q.valuables++;
									out("The statues are festooned with large, beautiful necklaces and medallions - valuable trade goods, if you can find someone to trade with.");
								}
							},
							{
								text: "Leave",
								run: () => {
									q.arousal -= 3;
									out("This is altogether too strange for your people to be mixed up in.");
								}
							}
						]
					});
				}
			},
			{
				text: "Avoid them.",
				run: () => {
					q.exploration++;
					out("The explorers give the statues a wide berth. Who knows who put them there, and what they signify.");
				}
			}
		]
	},
	{
		name: "stone tower",
		check: () => { return q.exploration > 0; },
		show: [],
		text: "The explorers come across a huge tower built from quarried stone that does not look native to the island. It's empty and long-abandoned, overlooking meadowlands that do not appear to contain anything especially worth guarding, or guarding against.",
		options: [
			{
				text: "Use the woolmouths as pack animals to move the stones to your village for use as building material",
				check: () => { return q.woolmouths; },
				danger: () => { return 40 + q.woolmouths * 15; },
				run: (success, harm) => {
					if (harm) {
						if (q.woolmouths > 1) {
							q.woolmouths--;
						}
						out("Your people attempt to use the woolmouths to carry the stones the tower is made of back to the village, but the stones are simply too heavy. Several woolmouths collapse under the weight, and the project has to be abandoned.");
					} else {
						q.tools++;
						out("The stones are small enough, and the mortar brittle enough. Over the coming weeks and months, the tower is slowly disassembled and carried to the village in pieces, to be repurposed for homes and halls and walls.");
					}
				}
			},
			{
				text: "Move the people into the tower",
				success: () => { return 100 - q.tradition * 20 - q.population / 4 + q.law * 10; },
				run: (success) => {
					if (success) {
						q.effectiveness -= 8;
						q.health -= 10;
						q.defenses = 4;
						q.walls = true;
						q.watchtower = true;
						q.reinforcedWalls = true;
						q.familyTies--;
						q.tribe++;
						out("The tower looks forbidding, but it is so large that your people fit into it, portioning off its large halls and rooms into smaller dwellings as needed. The surrounding meadowlands are fertile and pleasant, and the defensive position is formidable.");
					} else {
						out("When the idea is raised in council, the people refuse. Cramming everyone into this huge, ugly thing that's probably haunted? No.");
					}
				}
			},
			{
				text: "Move on",
				run: () => {
					q.exploration++;
					out("You don't know who built this impressive but pointless structure, but you want nothing to do with it.");
				}
			},
		]
	},
	{
		name: "landslide",
		check: () => { return true; },
		show: [],
		text: "Your explorers are scrambling along the coastal cliffs, looking for wreckage and seabird eggs, when suddenly a section of cliff collapses, burying several of them.",
		options: [
			{
				text: "Attempt to dig them out",
				danger: () => { return 100 - strength() / 2 - q.tools * 20; },
				run: (success, harm) => {
					if (harm) {
						q.health -= 11;
						q.population -= 4;
						q.happy -= 5;
						out("Those explorers that did not get buried get to work, frantically digging, listening for the muffled screams of the buried. They find a few survivors, but it's slow, exhausting work, and eventually they only find crushed and suffocated bodies.");
					} else {
						q.health -= 8;
						out("Those explorers that did not get buried get to work, frantically digging, listening for the muffled screams of the buried. In the end, as if by a miracle, everyone is saved.");
					}
				}
			},
			{
				text: "Instruct the codgers to dig them out",
				check: () => { return q.codgers; },
				danger: () => { return q.codgerDiggers ? 30 : 70; },
				run: (success, harm) => {
					if (harm) {
						q.population -= 4;
						out("The codgers start digging, but the loose earth keeps shifting and undoing their efforts. In the end, they save several people, but others have suffocated by the time they reach them.");
					} else {
						out("The codgers find and dig out the buried people with ease.");
					}
				}
			},
		]
	},
	{
		name: "lost",
		check: () => { return true; },
		show: [],
		text: "Your explorers delve deep into the forest, and in the twilight of the trees, they get utterly lost. And now the sky is darkening.",
		options: [
			{
				text: "Hunker down for the night",
				danger: () => { return 70 - q.exploration * 8; },
				run: (success, harm) => {
					if (harm) {
						q.population -= 3;
						q.happy -= 5;
						q.arousal -= 5;
						out("The explorers start a small fire and watch the forest in turns, uneasily. When morning comes, several of them have gone missing with no trace.");
					} else {
						q.health -= 3;
						out("The explorers start a small fire and watch the forest in turns, uneasily. When morning comes, they are cold and tired, but alive.");
					}
				}
			},
			{
				text: "Pray to the ancestors",
				success: () => { return 10 + q.tradition * 30; },
				danger: () => { return 70 - q.exploration * 8; },
				run: (success, harm) => {
					if (success) {
						if (harm) {
							q.population -= 3;
							q.happy -= 5;
							q.arousal -= 5;
							q.tradition--;
							out("The explorers start a small fire and gather around it to pray. But when morning comes, several people have gone missing without a trace. The survivors quail in fear - have the ancestors abandoned you? Are they unable to find you in this new place?");
						} else {
							q.happy += 5;
							out("The explorers start a small fire and gather around it to pray. The ancestors protect them, and when morning comes, they are warm and calm and ready to carry on.");
						}
					} else {
						if (harm) {
							q.population -= 3;
							q.happy -= 8;
							q.arousal -= 8;
							out("The explorers start a small fire and attempt to pray, but the dark forest and its strange noises prove too much for them. They fall silent and cower in fear. And in the morning, some of them have gone missing.");
						} else {
							q.happy -= 2;
							q.arousal -= 2;
							out("The explorers start a small fire and gather around it to pray - but the forest is dark, and the ancestors are far away, so they derive little comfort from prayer. Still, they make it through the night, unscathed somehow.");
						}
					}
				}
			},
			{
				text: "Tell the blademouths to guide them home",
				check: () => { return q.blademouths; },
				danger: () => { return q.blademouthScouts ? 10 : 50; },
				run: (success, harm) => {
					if (harm) {
						q.happy -= 5;
						q.arousal -= 5;
						q.health -= 9;
						q.population -= 4;
						out("The blademouths easily understand the idea of home - perhaps a bit too well, as they run off into the forest at high speed, leaving the explorers behind in the darkness, to curse and struggle through the forest. Some of them make it back to the village eventually, where the blademouths are waiting, looking pleased with themselves. Many of them never return.");
					} else {
						out("The blademouths readily understand the explorers' request, and set off into the forest, pausing frequently to make sure their masters are keeping up. Soon enough, the trees grow sparse and the landscape recognisable, and the lit-up village appears in the distance.");
					}
				}
			},
			{
				text: "Make a great fire from spindrake milk",
				check: () => { return q.spindrakes && q.spindrakeFire; },
				run: () => {
					out("The explorers gather wood and douse it in spindrake milk, and set it aflame. A column of fire rises into the night sky, bright as the sun. They keep it burning through the night, staying warm and watchful.");
				}
			}
		]
	},
	{
		name: "terrified",
		check: () => { return true; },
		show: [],
		text: "Your explorers are deep in the forest. Strange creatures stalk past them, each of them more impossible than the next. They are gripped with terror.",
		options: [
			{
				text: "Kill the next creature that comes by",
				danger: () => { return 100 - strength() / 4 - q.weapons * 16; },
				run: (success, harm) => {
					if (harm) {
						q.arousal -= 5;
						q.happy -= 5;
						q.population -= 4;
						out("The next creature the explorers encounter is a spiny monster with entirely too many eyes - and venomous fangs. Two of the explorers are felled instantly, and the rest run and scatter, overwhelmed with fear. Not all of them make it back to the village.");
					} else {
						q.arousal += 10;
						out("The next creature the explorers encounter is a spiny monster with entirely too many eyes. They set upon it with great enthusiasm and cut it down. With their valor proven, their fear leaves them.");
					}
				}
			},
			{
				text: "Pray to the ancestors",
				success: () => { return 10 + q.tradition * 25; },
				run: (success) => {
					if (success) {
						out("They kneel together and pray, and the familiarity of the words drives away the fear of this strange place.");
					} else {
						q.happy -= 3;
						q.arousal -= 5;
						q.tradition--;
						out("The explorers kneel and attempt to pray, but in this strange place, the words ring hollow. How would the ancestors find them on this isle, surrounded by trees and monsters. Their terror deepens, and they make haste back home.");
					}
				}
			},
			{
				text: "Make up a song mocking the ugliness of the creatures",
				success: () => { return 50 - q.tradition * 10 + q.songs * 15; },
				run: (success) => {
					if (success) {
						q.songs++;
						q.happy += 3;
						q.arousal += 5;
						out("The people like to make new songs of old tunes, and here is a tune suitable for mockery and disdain. They pour all their fear and disgust at the misshapen monsters of the isle into this new song, and they sing it as they walk, and they soon feel much better.");
					} else {
						q.happy -= 2;
						q.arousal -= 8;
						out("The people like to make new songs of old tunes, and here is a tune suitable for mockery and disdain. So they try to come up with new words for the tune to drive away their fear, to name and mock the strange creatures of the isle, but they are too indescribable, and the tune falters. The explorers wordlessly return to the village and cower next to their hearths.");
					}
				}
			},
			{
				text: "Seek shelter amongst the gently humming pack woolmouths",
				check: () => { return q.woolmouths; },
				success: () => { return q.woolmouthSinging ? 90 : 50; },
				run: (success) => {
					if (success) {
						q.arousal -= 4;
						out("The two woolmouths that accompany the explorers are unperturbed by the strangest creatures, and their gentle humming and singing calms the nerves. The explorers take a rest and huddle up with the woolmouths. They feel sheepish doing so, but at length, their terror fades.");
					} else {
						q.happy -= 3;
						q.arousal -= 10;
						out("The explorers stop walking and huddle up to the woolmouths, burying their faces in the creatures' sides, crying in terror and embarassment. It doesn't help. The forest is still there when they look up.");
					}
				}
			},
		]
	},
	{
		name: "bimane attack 1",
		check: () => { return q.bimanesEncountered && q.bimaneRelations < 2 && q.bimaneStrength > 50; },
		show: [],
		text: "Strange uneven shapes attack from in between the trees, wielding clubs and axes. Bimanes, strange monsters made from hands clasping one another.",
		options: [
			{
				text: "Fight",
				danger: () => { return q.bimaneStrength - 10 - q.weapons * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.bimanePrevInteraction = "violent";
					if (harm) {
						q.population -= 8;
						q.happy -= 12;
						out("The explorers valiantly attempt a counterattack, but they are swarmed by bimanes of all shapes and sizes, impossible to adapt and fight against, monstrously coordinated, and they are torn apart.");
					} else {
						q.fights++;
						q.health -= 5;
						q.arousal += 10;
						q.bimaneStrength -= 10;
						out("The explorers form up with their axes and spears and counterattack, slashing at the strange monsters. Those that are not killed break apart into smaller figures and scamper away into the undergrowth.");
					}
				}
			},
			{
				text: "Flee",
				danger: () => { return 70 - q.exploration * 10 - (q.blademouthScouts ? 30 : 0); },
				run: (success, harm) => {
					q.bimanePrevInteraction = "violent";
					if (harm) {
						q.population -= 6;
						q.happy -= 7;
						q.arousal -= 5;
						out("The explorers attempt to flee the bimanes, but most find themselves outflanked and surrounded and cut down.");
					} else {
						q.arousal -= 8;
						out("The explorers take flight, running between the trees. The bimanes attempt to give chase, but their ungainly shape is not so suitable for running, and they soon fall behind.");
					}
				}
			}
		]
	},
	{
		name: "bimane attack 2",
		check: () => { return q.bimanesEncountered && q.bimaneRelations < 1 && q.bimaneStrength > 50 && q.turn > 14; },
		show: [],
		text: "Strange uneven shapes attack from in between the trees, wielding clubs and axes. Bimanes, strange monsters made from hands clasping one another.",
		options: [
			{
				text: "Fight",
				danger: () => { return q.bimaneStrength - q.weapons * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.bimanePrevInteraction = "violent";
					if (harm) {
						q.population -= 8;
						q.happy -= 12;
						out("The explorers valiantly attempt a counterattack, but they are swarmed by bimanes of all shapes and sizes, impossible to adapt and fight against, monstrously coordinated, and they are torn apart.");
					} else {
						q.fights++;
						q.health -= 5;
						q.arousal += 10;
						q.bimaneStrength -= 10;
						out("The explorers form up with their axes and spears and counterattack, slashing at the strange monsters. Those that are not killed break apart into smaller figures and scamper away into the undergrowth.");
					}
				}
			},
			{
				text: "Flee",
				danger: () => { return 70 - q.exploration * 10 - (q.blademouthScouts ? 30 : 0); },
				run: (success, harm) => {
					q.bimanePrevInteraction = "violent";
					if (harm) {
						q.population -= 6;
						q.happy -= 7;
						q.arousal -= 5;
						out("The explorers attempt to flee the bimanes, but most find themselves outflanked and surrounded and cut down.");
					} else {
						q.arousal -= 8;
						out("The explorers take flight, running between the trees. The bimanes attempt to give chase, but their ungainly shape is not so suitable for running, and they soon fall behind.");
					}
				}
			}
		]
	},
	{
		name: "robed one attack 1",
		check: () => { return q.robedOnesEncountered && q.robedOneRelations < 0 && q.robedOneStrength > 50; },
		show: [],
		text: "Dozens of strange figures dressed in conical robes emerge from the fog. They surround your explorers. Long sleeves emerge from between folds and grasp at their swords.",
		options: [
			{
				text: "Fight",
				danger: () => { return q.robedOneStrength - q.weapons * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.robedOnePrevInteraction = "violent";
					if (harm) {
						q.population -= 8;
						q.happy -= 12;
						out("The explorers try to fight back, but stand little chance against the sharp swords of the robed ones.");
					} else {
						q.fights++;
						q.health -= 5;
						q.arousal += 10;
						q.robedOneStrength -= 10;
						out("The robed ones' swords are sharp, but their clothes prevent them from wielding them effectively. The explorers stab at them with spears until they retreat. The dead ones are stripped of their garments: beneath the robes, there are ordinary-looking human men.");
					}
				}
			},
			{
				text: "Flee",
				danger: () => { return 55 - q.exploration * 10 - (q.blademouthScouts ? 30 : 0); },
				run: (success, harm) => {
					q.robedOnePrevInteraction = "violent";
					if (harm) {
						q.population -= 8;
						q.happy -= 10;
						q.arousal -= 10;
						out("The explorers run away, and it seems like the robed ones will let them go, only for a second group to appear as if out of nowhere, blocking the path of escape. The explorers are surrounded and cut down.");
					} else {
						q.arousal -= 8;
						out("The explorers run away, and the robed ones make no attempt to pursue.");
					}
				}
			}
		]
	},
	{
		name: "ruins",
		check: () => { return true; },
		show: [],
		text: "Your explorers find the remains of a cluster of houses, drystone walls crumbling. The ruins of a previous settlement.",
		options: [
			{
				text: "Try to find out what killed them.",
				success: () => { return q.animals * 20; },
				run: (success) => {
					if (success) {
						q.animals++;
						q.arousal -= 5;
						out("Those great gauges in the walls, those ruddy stains - some monstrous creature tore apart the inhabitants of this place.");
					} else {
						q.arousal -= 5;
						out("Perhaps the inhabitants died, perhaps they left. No one can tell now.");
					}
				}
			},
			{
				text: "Look for valuables.",
				success: () => { return 50; },
				run: (success) => {
					if (success) {
						q.valuables++;
						out("Hidden under the floorboards of one house, the explorers find jewelry from the old country.");
					} else {
						q.arousal -= 5;
						out("The explorers spend some time looking for anything of value, but only find sodden, crumbling ruins.");
					}
				}
			},
			{
				text: "Pray for the souls of the departed.",
				run: () => { q.tradition++; q.happy += 3; q.arousal -= 3; done(); }
			},
			{
				text: "Avoid the place.",
				run: () => { q.exploration++; done(); }
			}
		]
	},
	{
		name: "glade of berries",
		check: () => { return true; },
		show: [],
		text: "Your explorers come across a glade of giant, glossy, delicious, red berries. Your foragers will benefit from this find.",
		options: [
			{
				text: "Fortuitous.",
				run: () => { q.forage++; q.food += 30; done(); }
			}
		]
	},
	{
		name: "obsidian",
		check: () => { return true; },
		show: [],
		text: "You find chips of sharp obsidian amongst the dunes. Something incredibly hot caused the sand to fuse into these useful rocks.",
		options: [
			{
				text: "Collect as much as you can.",
				run: () => {
					q.weapons++;
					q.tools++;
					out("Your foragers collect all the obsidian they can find. Many of the pieces are too small to be of much use, but the larger ones will make for excellent weapons and tools.");
				}
			},
			{
				text: "Instruct the codgers to dig for more.",
				check: () => { return q.codgers; },
				success: () => { return q.codgerDiggers ? 100 : 40 },
				run: (success) => {
					if (success) {
						q.weapons += 2;
						q.tools += 2;
						out("The codgers use their massive claws to dig and sift through the sand and discover more and larger pieces of obsidian, suitable for making into many weapons and tools.");
					} else {
						q.weapons++;
						q.tools++;
						out("The codgers attempt to dig into the sand to find more obsidian, but it shifts and flows back too quickly. Dispirited, you call off the codgers and collect a few bits of obsidian from the surface, which should make for a few good weapons and tools at least.");
					}
				}
			}
		]
	},
	{
		name: "copper",
		check: () => { return q.exploration > 2; },
		show: [],
		text: "Your explorers notice a greenish tinge to the limestone of a stone pillar in the forest. Copper! If it can be extracted, the people can make excellent tools and weapons from it.",
		options: [
			{
				text: "Use fiery spindrake milk to burn and crack the stone and extract the ore.",
				check: () => { return q.spindrakeFire; },
				run: () => {
					q.weapons += 2;
					q.tools += 2;
					q.health -= 4;
					out("The explorers apply volatile spindrake milk to the stone and set it aflame. Its intense heat cracks the stone and lets them easily harvest the ore.");
				}
			},
			{
				text: "Collect as much copper as you easily can.",
				check: () => { return !q.spindrakeFire; },
				run: () => {
					q.weapons++;
					q.tools++;
					out("The explorers chip away at the vein with sticks and axes and collect whatever ore they can find.");
				}
			},
			{
				text: "Make a great effort with the entire people to mine the copper.",
				check: () => { return !q.spindrakeFire; },
				success: () => { return strength() + q.tools * 20 - 70; },
				run: (success) => {
					if (success) {
						q.weapons += 2;
						q.tools += 2;
						q.health -= 17;
						out("It takes a vast effort by all the villagers, working in turns to chip and burn away at the copper vein, but in the end, you have a sizeable quantity of ore that can be purified and cast into weapons and tools.");
					} else {
						q.weapons++;
						q.tools++;
						q.health -= 23;
						out("The people to to great efforts to chip and burn away at the copper vein, but the stone is too tough, and the people end up exhausted and singed, with only a bit of copper to show for it. Still, it suffices for a few good tools and weapons.");
					}
				}
			},
			{
				text: "Direct the codgers to dig out the copper vein.",
				check: () => { return q.codgers && !q.spindrakeFire; },
				success: () => { return q.codgerDiggers ? 80 : 40 },
				run: (success) => {
					if (success) {
						q.weapons += 2;
						q.tools += 2;
						out("The codgers use their great steel claws to dig into the ore, breaking it up as if it was mere soil. The people collect the ore and make many new tools and weapons from it.");
					} else {
						q.weapons++;
						q.tools++;
						out("The codgers claw at the ore vein, but even their metal claws are too soft to make any real progress. They are reduced to whining and pawing at the rock. The people manage to collect a few bits or ore and make a few tools and weapons from it.");
					}
				}
			}
		]
	},
	{
		name: "medicinal herbs",
		check: () => { return q.exploration > 4; },
		show: [],
		text: "The explorers come across some herbs that, unusually, they recognise from the old country. What's more, they have useful medicinal qualities.",
		options: [
			{
				text: "An excellent find.",
				run: () => { q.medicine++; q.health += 8; done(); }
			}
		]
	},
	{
		name: "valuables from wreckage",
		check: () => { return true; },
		show: [],
		text: "You find a few boxes washed up on the shore, no doubt from a trade ship that was dashed against the rocks surrounding the isle. Most of the contents are rotted away, but you do find a number of beautiful necklaces.",
		options: [
			{
				text: "Beautiful and valuable.",
				run: () => { q.valuables++; q.exploration++; done(); }
			}
		]
	},
	{
		name: "entangling vines",
		check: () => { return q.exploration > 1; },
		show: [],
		text: "While scouring the forest for food, your explorers are stuck in entangling, constricting vines.",
		options: [
			{
				text: "Hack away at the vines.",
				danger: () => { return 170 - strength() - q.weapons * 15; },
				run: (success, harm) => {
					if (harm) {
						q.health -= 4;
						q.population -= 2;
						q.happy -= 5;
						out("For every vine that is cut, another two fall into place. In the end, not everyone makes it out alive.");
					} else {
						q.health -= 4;
						out("It's hard work, but eventually everyone is freed, and only somewhat bruised.");
					}
				}
			},
			{
				text: "Get the blademouths to cut the vines.",
				check: () => { return q.blademouths; },
				danger: () => { return q.blademouthFighters ? 30 : 40 - q.blademouths * 5; },
				run: (success, harm) => {
					if (harm) {
						q.population -= 2;
						q.happy -= 5;
						if (q.blademouths > 1) {
							q.blademouths--;
						}
						out("The blademouths start cutting away at the vines, which in turn begin entangling the animals. In the end, multiple humans and blademouths are killed.");
					} else {
						out("The blademouths spring into action and use their mandibles to rapidly cut through the vines.");
					}
				}
			},
			{
				text: "Get the codgers to tear away the vines.",
				check: () => { return q.codgers; },
				danger: () => { return 50 - q.codgers * 5; },
				run: (success, harm) => {
					if (harm) {
						q.population -= 2;
						q.happy -= 5;
						if (q.codgers > 1) {
							q.codgers--;
						}
						out("As the codgers attempt to tear away the vines, they respond by entangling the animals. In the end, multiple explorers and codgers are killed.");
					} else {
						out("The codgers use their claws and brute strength to tear the vines away, freeing the foragers.");
					}
				}
			}
		]
	},
	{
		name: "ptarmigant",
		check: () => { return true; },
		show: [],
		text: "While exploring the cliffs for eggs, your people are set upon by a ptarmigant, a carnivorous bird the size of a house.",
		options: [
			{
				text: "Fight it.",
				danger: () => { return 200 - strength() - q.weapons * 20; },
				run: (success, harm) => {
					if (harm) {
						q.population -= 7;
						q.health -= 11;
						q.happy -= 8;
						q.arousal += 4;
						out("The explorers form up and fire arrows at the creature, but they bounce off its thick coat of feathers. The ptarmigant strides towards them, and they scatter in a panic, only to be picked off by the monster one by one.");
					} else {
						q.food += 50;
						q.valuables++;
						q.health -= 7;
						q.arousal += 8;
						out("The explorers pepper the creature with arrows, and when it rushes towards them in a rage, they raise their spears just in time, and it impales itself on them. They return with a bounty of meat and the creature's beak as a trophy.");
					}
				}
			},
			{
				text: "Deploy the codgers to fight it.",
				check: () => { return q.codgers; },
				danger: () => { return q.codgerFighters ? (70 - q.codgers * 20) : (80 - q.codgers * 15); },
				run: (success, harm) => {
					if (harm) {
						q.codgers = Math.max(1, q.codgers - 2);
						out("The codgers rush towards the ptarmigant, which waits and then easily picks up one of them in its beak, crushing its skull. The others flee and are savaged by the monster.");
					} else {
						q.food += 50;
						q.valuables++;
						q.arousal += 5;
						out("The ptarmigant is a huge monstrous creature, but even so, it is no match for the claws of the codgers, and its beak pecks away at the codgers' armour to no avail. Soon it is dead, and the foragers return with a bounty of meat and the creature's beak as a trophy.");
					}
				}
			},
			{
				text: "Flee.",
				danger: () => { return 70 - q.exploration * 15; },
				run: (success, harm) => {
					if (harm) {
						q.population -= 5;
						q.health -= 3;
						q.happy -= 6;
						q.arousal -= 5;
						out("The explorers attempt to evade the monster, but it strides towards the stragglers and rips them apart with its massive beak.");
					} else {
						q.arousal -= 5;
						out("The explorers scatter before the monstrous bird. Miraculously, they all escape.");
					}
				}
			}
		]
	},
	{
		name: "slitherdeer",
		check: () => { return q.exploration > 1; },
		show: [],
		text: "Deep in the forest, the explorers are set upon by a huge slithering creature with glowing antlers.",
		options: [
			{
				text: "Fight it.",
				danger: () => { return 200 - strength() - q.weapons * 15; },
				run: (success, harm) => {
					if (harm) {
						q.population -= 7;
						q.health -= 11;
						q.happy -= 8;
						q.arousal += 4;
						out("The explorers form up and fire arrows at the creature, but it easily dodges them. As it slithers towards your people, they panic and scatter, and are devoured one by one.");
					} else {
						q.food += 50;
						q.valuables++;
						q.health -= 7;
						q.arousal += 8;
						out("The explorers pepper the creature with arrows, and when it rushes towards them in a rage, they raise their spears just in time, and it impales itself on them. They return with a bounty of meat and the creature's antlers as a trophy.");
					}
				}
			},
			{
				text: "Deploy the codgers to fight it.",
				check: () => { return q.codgers; },
				danger: () => { return q.codgerFighters ? (70 - q.codgers * 20) : (80 - q.codgers * 15); },
				run: (success, harm) => {
					if (harm) {
						q.codgers = Math.max(1, q.codgers - 2);
						out("The codgers rush towards the creature, which waits and then darts forward to swallow one of them whole. The others flee and are savaged by the monster.");
					} else {
						q.food += 50;
						q.valuables++;
						q.arousal += 5;
						out("This is a monstrous creature, but even so, it is no match for the claws of the codgers. Soon it is dead, and the foragers return with a bounty of meat and the creature's antlers as a trophy.");
					}
				}
			},
			{
				text: "Flee.",
				danger: () => { return 70 - q.exploration * 15; },
				run: (success, harm) => {
					if (harm) {
						q.population -= 5;
						q.health -= 3;
						q.happy -= 6;
						q.arousal -= 5;
						out("The explorers attempt to evade the monster, but it slithers towards the stragglers and devours them whole.");
					} else {
						q.arousal -= 5;
						out("The explorers scatter into the forest. Miraculously, they all escape.");
					}
				}
			}
		]
	},
	{
		name: "gemstones",
		check: () => { return q.exploration > 2; },
		show: [],
		text: "The explorers find beautiful gemstones glinting in a forest brook.",
		options: [
			{
				text: "Valuable trade items!",
				run: () => { q.valuables++; done(); }
			}
		]
	},
	{
		name: "coin stash",
		check: () => { return q.exploration > 3; },
		show: [],
		text: "Deep in the forest, the explorers find a hidden stash of gold coins from the old country.",
		options: [
			{
				text: "Perhaps a pirate's hoard?",
				run: () => { q.valuables++; done(); }
			}
		]
	},
	{
		name: "bimane first encounter",
		check: () => { return q.exploration > 1 || q.turn > 10; },
		important: () => { return q.turn > 20; },
		show: [],
		text: "There is movement amongst the trees, and then suddenly, your explorers are surrounded by strange figures of wildly varied shapes. Each of them is made of dozens of individual creatures that look like a short length of arm with a hand on either end. These hands grip each other in various constellations to create larger figures, wielding spears and clubs, and adorned with tattoos and beads.<br><br>They point their weapons at the explorers, but then one of them steps forward and holds up a hand in greeting.",
		extraText: () => {
			var text = "<br><br>Your explorers ";
			if (q.happy < 50) {
				if (q.arousal < 50) {
					text += "are terrified of these monsters.";
				} else {
					text += "grip their weapons, ready to fight these monsters.";
				}
			} else {
				if (q.animals > 3 && q.arousal > 40) {
					text += "are fascinated by those strange creatures.";
				} else {
					text += "are afraid, but stand their ground.";
				}
			}
			return text;
		},
		options: [
			{
				text: "Greet them and attempt to communicate.",
				success: () => { return 50 - q.tradition * 10 + q.animals * 5 + q.equality * 5 + q.bimaneRelations * 30; },
				run: (success) => {
					q.bimanesEncountered = true;
					if (success) {
						q.bimaneRelations++;
						q.bimanePrevInteraction = "friendly";
						out("As the leader of your explorers holds up his hand to reciprocate the greeting, the creatures surrounding them fractionally relax. Using gestures, the two sides convey that neither wishes the other and harm or disrespect. Finally, the explorers are handed a short chain of colourful beads, and the creatures fade back into the forest.");
					} else {
						q.arousal -= 4;
						q.bimanePrevInteraction = "tense";
						out("Your explorers attempt to use hand signals to communicate peaceful intent, but this appears to infuriate the creatures, who brandish their weapons. Your explorers retreat, attempting to not give any further offense by any accidental gestures.");
					}
				}
			},
			{
				text: "Greet them and attempt to placate them with gifts.",
				check: () => { return q.valuables; },
				success: () => { return 90 - q.tradition * 10 + q.animals * 5 + q.equality * 5 + q.bimaneRelations * 30; },
				run: (success) => {
					q.bimanesEncountered = true;
					if (success) {
						q.bimaneRelations++;
						q.valuables--;
						q.exploration++;
						q.bimanePrevInteraction = "friendly";
						out("As the leader of your explorers holds up his hand to reciprocate the greeting, the creatures surrounding them fractionally relax. She removes her earrings and presents them to the creatures' leader, who accepts them. A number of probably friendly gestures ensue, and then the creatures move back into the forest, letting your people pass.");
					} else {
						q.arousal -= 4;
						q.bimanePrevInteraction = "tense";
						out("The explorers' leader attempts to give her earrings as a placatory gift to the creature, but it either does not understand or refuses it. The creatures stand firm, clutching their weapons, and there is nothing left to do but to retreat in silence.");
					}
				}
			},
			{
				text: "Greet them and then retreat as quickly as possible.",
				success: () => { return 50 + q.animals * 10 - q.weapons * 10 + q.bimaneRelations * 30; },
				run: (success) => {
					q.bimanesEncountered = true;
					if (success) {
						q.bimanePrevInteraction = "tense";
						out("As the leader of your explorers holds up his hand to reciprocate the greeting, the creatures surrounding them fractionally relax. The explorers then turn around and walk away rapidly, and thank the ancestors that they are not pursued.");
					} else {
						q.bimaneRelations--;
						q.bimanePrevInteraction = "nearly violent";
						out("As the leader of your explorers holds up his hand to reciprocate the greeting, the creatures surrounding them fractionally relax. But as the explorers turn around to walk away, they appear to take offense and brandish their weapons. The explorers run away before it comes to a fight.");
					}
				}
			},
			{
				text: "Attack the creatures before they can do any harm.",
				danger: () => { return 90 - q.weapons * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.bimanesEncountered = true;
					q.bimaneRelations--;
					q.fights++;
					q.bimanePrevInteraction = "violent";
					if (harm) {
						q.population -= 7;
						q.health -= 7;
						q.happy -= 7;
						out("The explorers scream as they grasp their spears and knives and rush the monsters - but they are ready with their own weapons, moving in a dozen unexpected ways. Your people are confused by the multitude of shapes that attack them, and soon they are bludgeoned and cut down. Hardly any escape.");
					} else {
						q.bimaneStrength -= 10;
						q.arousal += 10;
						out("The explorers scream as they grasp their spears and knives and rush the monsters. Their strange lumbering shapes are easily cut down, and as they fall, they split into smaller figures that try to scamper away into the undergrowth, only to be pursued and hacked to pieces.");
					}
				}
			},
			{
				text: "Ignore them and walk past.",
				success: () => { return 20 + q.weapons * 12 + q.bimaneRelations * 30; },
				run: (success) => {
					q.bimanesEncountered = true;
					if (success) {
						q.exploration++;
						q.bimanePrevInteraction = "tense";
						out("The explorers choose to simply ignore the strangers and walk past them. The creatures do not attack.");
					} else {
						q.bimaneRelations--;
						q.bimanePrevInteraction = "nearly violent";
						out("The explorers attempt to ignore the creatures and walk past them, but they move to block their way and brandish their weapons. The explorers beat a hasty retreat.");
					}
				}
			}
		]
	},
	{
		name: "robed one first encounter",
		check: () => { return q.exploration > 2 || q.turn > 16; },
		important: () => { return q.exploration > 3; },
		show: [],
		text: "Your explorers are walking through swampy forest outskirts when they notice a number of cone-shaped figures emerging from the mist. The roughly human-sized figures are covered in massive ornate robes that completely hide their bodies. Beads and medallions clink against each other as they approach. Wicked-looking swords are belted to their sides, though no hands are visible to grasp them. They move up to the explorers as if to block their progress.",
		extraText: () => {
			var text = "<br><br>Your explorers ";
			if (q.happy < 50) {
				if (q.arousal < 50) {
					text += "are terrified of these figures.";
				} else {
					text += "grip their weapons, ready to fight these monsters.";
				}
			} else {
				if (q.animals > 3 && q.arousal > 40) {
					text += "are fascinated by those strange creatures.";
				} else {
					text += "are afraid, but stand their ground.";
				}
			}
			return text;
		},
		options: [
			{
				text: "Greet them and attempt to communicate.",
				success: () => { return 40 + q.tradition * 10 + q.robedOneRelations * 30; },
				run: (success) => {
					q.robedOnesEncountered = true;
					if (success) {
						q.robedOneRelations++;
						q.robedOnePrevInteraction = "friendly";
						out("One of the explorers takes a step forward, extends her arms, shows that her hands are empty, and speaks in greeting. The figures do not reply at first but simply incline themselves towards the speaker. Then one of them moves closer, and returns the greeting in an archaic accent.<br><br>A short conversation ensues: they are the robed ones, and this is their part of the forest. They welcome your people, but disapprove of their lack of sufficient clothing for some reason they refuse to disclose. They hint that they might be open to trade in the future, if you survive long enough. Then they leave, gliding off.");
					} else {
						q.arousal -= 4;
						q.robedOnePrevInteraction = "tense";
						out("One of the explorers takes a step forward, extends her arms, shows that her hands are empty, and speaks in greeting. The figures stand there, motionless and silent. Unnerved, your explorers retreat.");
					}
				}
			},
			{
				text: "Greet them and attempt to placate them with gifts.",
				check: () => { return q.valuables; },
				success: () => { return 70 + q.tradition * 10 + q.robedOneRelations * 30; },
				run: (success) => {
					q.robedOnesEncountered = true;
					if (success) {
						q.robedOneRelations++;
						q.valuables--;
						q.robedOnePrevInteraction = "friendly";
						out("One of the explorers steps forward, her fine copper axe on top of her outstretched hands. The figures sway, as if uncertain. She lays the axe down on the ground, bows, and retreats. One of the figures advances until its robes cover the axe, then it bobs down to take it, never showing any limbs. It speaks, thanking you for the gift in archaic language.<br><br>A short conversation ensues: they are the robed ones, and this is their part of the forest. They welcome your people, but disapprove of their lack of sufficient clothing for some reason they refuse to disclose. They hint that they might be open to trade in the future, if you survive long enough. Then they leave, gliding off.");
					} else {
						q.arousal -= 4;
						q.valuables--;
						q.robedOnePrevInteraction = "tense";
						out("One of the explorers steps forward, her fine copper axe on top of her outstretched hands. Upon seeing the axe, the figures flinch. A layer of robes is drawn back, and obsidian swords flash in warning. Your explorer quickly stoops down to put the axe on the ground, and then the whole group retreats, hoping that the creatures will eventually realise it was meant as a gift.");
					}
				}
			},
			{
				text: "Greet them and then retreat as quickly as possible.",
				run: () => {
					q.robedOnesEncountered = true;
					q.robedOnePrevInteraction = "tense";
					q.arousal -= 2;
					out("The strange figures stand silent and motionless as your explorers turn around and walk away.");
				}
			},
			{
				text: "Attack the creatures before they can do any harm.",
				danger: () => { return 100 - q.weapons * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.robedOnesEncountered = true;
					q.robedOneRelations--;
					q.fights++;
					q.robedOnePrevInteraction = "violent";
					if (harm) {
						q.population -= 8;
						q.happy -= 10;
						out("The explorers grip their spears and rush the figures, which respond by raising the swords they'd concealed within their robes. They wield their weapons with surprising speed and accuracy, and your people are cut down.");
					} else {
						q.robedOneStrength -= 15;
						q.arousal += 10;
						q.robedOneRelations--;
						q.valuables++;
						out("The explorers grip their spears and rush the figures, which attempt to fight back with swords they had concealed in between the folds of their robes. Still, they are taken by surprise and after a short battle, they are slaughtered and driven away. Curious, your people strip one of the dead ones and find a perfectly ordinary-looking human woman below the many layers. She is adorned with valuable jewels.");
					}
				}
			},
			{
				text: "Ignore them and walk past.",
				success: () => { return 20 + q.weapons * 12 + q.robedOneRelations * 30; },
				run: (success) => {
					q.robedOnesEncountered = true;
					if (success) {
						q.exploration++;
						q.robedOnePrevInteraction = "tense";
						out("The explorers choose to simply ignore the figures and carry on.");
					} else {
						q.arousal -= 4;
						q.robedOnePrevInteraction = "tense";
						out("The explorers attempt to move past the figures, but they move with surprising speed, blocking their way. Your people, cowed, retreat back to the village.");
					}
				}
			}
		]
	},
	{
		name: "bimane village",
		check: () => { return q.exploration > 2 && q.bimanesEncountered; },
		important: () => { return q.exploration > 5; },
		show: [],
		text: "Deep in the forest, your explorers come across a cleverly hidden weave-work of branches, and beyond it, a whole village of bimanes, those composite creatures they previously encountered. They have not yet noticed the explorers.",
		extraText: () => {
			return "<br><br>Your last encounter with them was " + q.bimanePrevInteraction + ".";
		},
		options: [
			{
				text: "Memorise the village's location and move on.",
				run: () => {
					q.exploration++;
					q.bimaneVillage = true;
					out("The explorers make sure they can find the village again and continue on.");
				}
			},
			{
				text: "Scout out the village in preparation for a future attack.",
				run: () => {
					q.bimaneVillage = true;
					q.bimaneAttackPrep = 1;
					out("Your scouts circle around the village's perimeter, peeking through the branches, taking note of the village's layout, its fields, watchtowers, and storerooms.");
				}
			},
			{
				text: "Approach them peacefully.",
				success: () => { return 40 + q.bimaneRelations * 50 + q.weapons * 10 + q.equality * 10 - q.tradition * 10; },
				run: (success) => {
					q.bimaneVillage = true;
					if (success) {
						q.bimaneRelations++;
						q.bimanePrevInteraction = "friendly";
						out("The explorers enter the village through a gap in the weave and slowly walk towards the largest houses, making gestures of peace. The bimanes, though clearly taken aback at having strangers enter their village, assemble to greet your people. Using gestures, they indicate that they are interested in further visits for the purposes of trade.");
					} else {
						q.bimanePrevInteraction = "tense";
						out("The explorers enter the village through a gap in the weave and slowly walk towards the largest houses, making gestures of peace. The bimanes, upon spying your people, are clearly shocked at this intrusion and waste no time assembling with weapons. Your explorers make placatory gestures and then rapidly retreat back into the forest before the bimanes attack.");
					}
				}
			},
			{
				text: "Approach them bearing gifts.",
				check: () => { return q.valuables; },
				success: () => { return 70 + q.bimaneRelations * 20 + q.weapons * 10 + q.equality * 10 - q.tradition * 5; },
				run: (success) => {
					q.bimaneVillage = true;
					if (success) {
						q.bimaneRelations++;
						q.valuables--;
						q.bimanePrevInteraction = "friendly";
						out("The explorers enter the village through a gap in the weave and slowly walk towards the largest houses, making gestures of peace and bearing gifts. The bimanes, though clearly taken aback at having strangers enter their village, assemble to greet your people and graciously accept their gifts. Using gestures, they indicate that they are interested in further visits for the purposes of trade.");
					} else {
						q.valuables--;
						q.bimanePrevInteraction = "tense";
						out("The explorers enter the village through a gap in the weave and slowly walk towards the largest houses, making gestures of peace and bearing gifts. The bimanes, upon spying your people, are clearly shocked at this intrusion and waste no time assembling with weapons. Your explorers make placatory gestures and put the gifts onto the ground, and then rapidly retreat back into the forest before the bimanes attack.");
					}
				}
			},
			{
				text: "Approach them and demand tribute.",
				danger: () => { return 100 + q.bimaneStrength * 2 - strength() * 2 - q.weapons * 18; },
				run: (success, harm) => {
					q.bimaneVillage = true;
					if (harm) {
						q.bimanePrevInteraction = "violent";
						q.population -= 6;
						q.happy -= 8;
						out("The explorers enter the village and stride to the largest cluster of houses. Once the bimanes assemble to greet them, they make it clear, through a series of threatening gestures, that the bimanes must pay your people a tribute.<br><br>The bimanes respond to your demands by attacking your explorers, killing many of them. The rest flee into the forest.");
					} else {
						q.bimanePrevInteraction = "tense";
						q.valuables++;
						q.food += 60;
						q.bimaneStrength -= 5;
						q.happy += 3;
						q.arousal += 10;
						out("The bimanes, cowed, accept this and provide your explorers with food and valuables.");
					}
				}
			},
			{
				text: "Attack the bimanes, seeking to kill as many as possible.",
				danger: () => { return q.bimaneStrength + 10 - q.weapons * 20 - strength() / 4 - (q.codgerFighters ? 10 + q.codgers * 5 : 0) - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.bimaneVillage = true;
					q.bimaneRelations--;
					q.bimanePrevInteraction = "violent";
					q.fights++;
					if (harm) {
						q.bimaneStrength -= 5;
						q.population -= 7;
						q.happy -= 5;
						q.health -= 7;
						out("Seeing an opportunity for attack, the explorers burst into the village and begin stabbing at whatever bimanes they can find. The creatures raise an alarm, a strange whistling sound, and dozens of heavily-armed bimanes converge on your people. Faced with such a robust response, the explorers attempt to flee, but many are cut down.");
					} else {
						q.bimaneStrength -= 20;
						out("Seeing an opportunity for attack, the explorers burst into the village and begin stabbing at whatever bimanes they can find. They slaughter many of them in their fields and houses, until at last some large bimane warriors appear. The explorers retreat back into the forest, confident that they have dealt those monsters a heavy blow.");
					}
				}
			},
		]
	},
	{
		name: "robed one village",
		check: () => { return q.exploration > 2 && q.robedOnesEncountered; },
		important: () => { return q.exploration > 4; },
		show: [],
		text: "At the edge of the forest, your explorers come across an underground warren populated by robed ones, those mysterious figures sometimes seen walking through the marshes.",
		extraText: () => {
			return "<br><br>Your last encounter with them was " + q.robedOnePrevInteraction + ".";
		},
		options: [
			{
				text: "Memorise the warren's location and move on.",
				run: () => {
					q.exploration++;
					q.robedOneVillage = true;
					out("The explorers make sure they can find the village again and continue on.");
				}
			},
			{
				text: "Approach them peacefully.",
				success: () => { return 60 + q.robedOneRelations * 50 + q.tradition * 10; },
				run: (success) => {
					q.robedOneVillage = true;
					if (success) {
						q.robedOneRelations++;
						q.robedOnePrevInteraction = "friendly";
						out("Your explorers enter the tunnels. When they encounter their first robed one, they ask for an audience with their leaders. After a considerable amount of time, four of the creatures, dressed even more elaborately than usual, emerge from a tunnel. In an archaic whisper, they thank your people and indicate that they are welcome to visit again.");
					} else {
						q.robedOnePrevInteraction = "tense";
						out("Your explorers enter the tunnels. When they encounter their first robed one, they ask for an audience with their leaders. The robed one scurries away and quickly returns with a party of heavily armed friends. Your explorers make placatory gestures and retreat before the encounter can erupt into violence.");
					}
				}
			},
			{
				text: "Approach them bearing gifts.",
				check: () => { return q.valuables; },
				success: () => { return 100 + q.robedOneRelations * 50 + q.tradition * 10; },
				run: (success) => {
					q.robedOneVillage = true;
					if (success) {
						q.robedOneRelations++;
						q.valuables--;
						q.robedOnePrevInteraction = "friendly";
						out("Your explorers enter the tunnels, bearing what gifts they can find. When they encounter their first robed one, they ask for an audience with their leaders. After a considerable amount of time, four of the creatures, dressed even more elaborately than usual, emerge from a tunnel, and accept the gifts. In an archaic whisper, they thank your people and indicate that they are welcome to visit again.");
					} else {
						q.robedOnePrevInteraction = "tense";
						out("Your explorers enter the tunnels, bearing what gifts they can find. When they encounter their first robed one, they ask for an audience with their leaders. The robed one scurries away and quickly returns with a party of heavily armed friends. Your explorers make placatory gestures and retreat before the encounter can erupt into violence.");
					}
				}
			},
			{
				text: "Approach them and demand tribute.",
				danger: () => { return 100 + q.robedOneStrength * 2 - strength() * 2 - q.weapons * 20; },
				run: (success, harm) => {
					q.robedOneVillage = true;
					q.robedOneRelations--;
					if (harm) {
						q.robedOnePrevInteraction = "violent";
						q.population -= 9;
						q.happy -= 11;
						out("Your explorers stride into the tunnels and seize upon the first robed one they encounter, threatening it and its kin with violence if they are not given tribute.<br><br>The robed ones respond to your demands by attacking your explorers, killing every last one of them.");
					} else {
						q.robedOnePrevInteraction = "tense";
						q.valuables++;
						q.tools++;
						q.robedOneStrength -= 5;
						q.happy += 3;
						q.arousal += 10;
						out("Your explorers stride into the tunnels and seize upon the first robed one they encounter, threatening it and its kin with violence if they are not given tribute.<br><br>The robed ones, cowed, accept this and provide your explorers with beads and copper tools.");
					}
				}
			},
			{
				text: "Attack the robed ones, seeking to kill as many as possible.",
				danger: () => { return q.robedOneStrength + 20 - q.weapons * 20 - strength() / 4 - q.codgers * 15 - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
				run: (success, harm) => {
					q.robedOneVillage = true;
					q.robedOneRelations--;
					q.robedOnePrevInteraction = "violent";
					q.fights++;
					if (harm) {
						q.robedOneStrength -= 5;
						q.population -= 9;
						q.happy -= 5;
						out("Your explorers venture into the tunnels, weapons ready. At first, they manage to surprise and kill several of the creatures, but as they round a corner, they encounter a heavily armed party of robed ones. They try to escape, but are cut off by more of the creatures emerging from side tunnels, and are slaughtered to a man.");
					} else {
						q.robedOneStrength -= 15;
						out("Your explorers venture into the tunnels, weapons ready, and stab and club any robed ones they encounter. By the time the creatures realise what is happening, more than a dozen lie dead. Your people retreat before the enemy can organise any resistance.");
					}
				}
			},
			{
				text: "Attack the robed ones, seeking to plunder their valuables.",
				danger: () => { return q.robedOneStrength - 20 - q.weapons * 10 - strength() / 8 - q.codgers * 5; },
				run: (success, harm) => {
					q.robedOneVillage = true;
					q.robedOneRelations--;
					q.robedOnePrevInteraction = "violent";
					q.fights++;
					if (harm) {
						q.population -= 9;
						q.happy -= 5;
						out("Your explorers sneak into the tunnels looking for loot. At first, they manage to surprise and kill several of the creatures, but as they round a corner, they encounter a heavily armed party of robed ones. They try to escape, but are cut off by more of the creatures emerging from side tunnels, and are slaughtered to a man.");
					} else {
						q.robedOneStrength -= 5;
						q.valuables++;
						q.tools++;
						out("Your explorers sneak into the tunnels looking for loot. They easily dispatch a few robed ones they catch unaware, and then find a large stash of copper ingots and obsidian tools, which they carry off.");
					}
				}
			},
		]
	},
	{
		name: "first eyestalk encounter",
		check: () => { return q.turn > 24; },
		show: [],
		text: "Deep in the forest, your explorers encounter a strange stalk of sinous flesh topped with multiple eyes. The eyes appear very very interested in the explorers.",
		options: [
			{
				text: "Gaze back into the eyes.",
				run: () => {
					q.eyestalksSeen = true;
					q.animals++;
					q.happy -= 3;
					out("The strange eyes and the explorers spend some time looking at each other.");
				}
			},
			{
				text: "Cut off the stalks.",
				check: () => { return q.shaping > 0; },
				success: () => { return 20 + q.tools * 20; },
				run: (success) => {
					q.eyestalksSeen = true;
					if (success) {
						q.arousal += 8;
						q.animals++;
						q.shaping++;
						out("One of the explorers gets out a knife and cuts through the stalk of flesh. It's tough going, but eventually the stalk is severed. The eyes wither away.<br><br>The stalk turns out to be of great interest to the village's shapers.");
					} else {
						out("The flesh-stalks are too tough and wriggly to cut through, so the explorers ultimately give up.");
					}
				}
			},
			{
				text: "Ignore them.",
				run: () => {
					q.eyestalksSeen = true;
					q.exploration++;
					out("The explorers walk past the strange stalks.");
				}
			},
		]
	},
	{
		name: "second eyestalk encounter",
		check: () => { return q.turn > 30 && q.eyestalksSeen; },
		show: [],
		text: "Walking through the meadows, your explorers encounter large clusters of flesh-stalk eyes. These are the same ones that they saw in the forest previously, but much more numerous.",
		options: [
			{
				text: "Ominous.",
				run: () => {
					done();
				}
			},
		]
	},
	{
		name: "map making",
		check: () => { return true; },
		show: [],
		text: "Your explorers have started to make maps of the isle. The south and west are mostly covered in forests while the east features chalky grasslands and cliffs. In the north, the land becomes swampy and unreliable. Karst spires rise from the forests, culminating in a small group of mountains on the western end of the isle.<br><br>They have found occasional signs of previous habitation, but no other living humans.<br><br>And the beasts of the isle are truly extraordinary: There are giant pitcher plants that can imitate human voices, vast swarms of feathered ants, snakes that look like leafy tree branches, translucent lizards, venom-spitting fish, and a thousand small skittering things in the undergrowth.",
		options: [
			{
				text: "We must explore every part of this isle to understand it.",
				run: () => {
					q.exploration += 2;
					q.arousal += 8;
					done();
				}
			},
			{
				text: "The creatures of this isle are truly magnificent.",
				run: () => {
					q.exploration++;
					q.animals++;
					q.happy += 4;
					done();
				}
			},
			{
				text: "This is a bountiful land ripe for settlement.",
				run: () => {
					q.exploration++;
					q.effectiveness += 5;
					q.arousal += 3;
					done();
				}
			},
			{
				text: "We must sharpen our spears so we can defend against these monsters.",
				run: () => {
					q.exploration++;
					q.happy -= 5;
					q.weapons++;
					done();
				}
			},
		]
	},
	{
		name: "bimane hunt",
		check: () => { return q.bimaneVillage && q.bimaneRelations >= 0; },
		show: [],
		text: "Your explorers come across a hunting party of bimanes, stalking scintillating deer-like creatures with spears and clubs.",
		options: [
			{
				text: "Observe them.",
				run: () => {
					q.weapons++;
					q.animals++;
					out("The bimanes use their many forms to their advantage, staying low to the ground to keep their prey unaware, feinting and splitting and reshaping themselves as needed. Humans cannot do these things, but the tactics on display are nevertheless very interesting.");
				}
			},
			{
				text: "Offer to help them hunt.",
				success: () => { return 10 + q.bimaneRelations * 30 + q.weapons * 5; },
				run: (success) => {
					if (success) {
						q.weapons++;
						q.animals++;
						q.food += 100;
						q.bimaneRelations++;
						out("The bimanes are happy to accept the help. They are stealthier and more flexible than humans, but your warriors are stronger and faster, and together, they take down much prey. They share the meat and part amicably, and your warriors agree that they have learned much about fighting.");
					} else {
						out("The bimanes are irritated at this suggestion and raise their spears, telling your people to withdraw before they spook their prey.");
					}
				}
			},
			{
				text: "Ignore them.",
				run: () => { q.exploration++; out("What the bimanes do is of little interest to the people. You carry on."); }
			}
		]
	},
	{
		name: "robed one funeral",
		check: () => { return q.robedOneVillage && q.robedOneRelations >= 0; },
		show: [],
		text: "In the remote, misty reaches of the forest, your explorers come across a party of robed ones. One of them is dressed in huge, elaborately decorated robes, and moves along slowly, supported by the others.",
		options: [
			{
				text: "Approach them.",
				success: () => { return q.robedOneRelations * 25 + q.tradition * 10; },
				run: (success) => {
					if (success) {
						out("The robed ones are apprehensive at first, but then decide that they are willing to let your people observe their ritual. It's not exactly a funeral. When one of them becomes very old, they are dressed in their finest robes, and brought to a spot in the forest. There they will meditate, and their people will come by to bring them tea and small amounts of powdered meat or honey, and ask them for their wisdom. As time goes on, they sink deeper into meditation, and eat and drink less, and answer fewer questions. It's clear to the explorers that at some point, the elder will die, but they know better than to raise this point with the robed ones, who assure them that for truly important questions, even the oldest elders can rouse themselves to give advice.");
					} else {
						out("The robed ones make it very clear that this is one of their mysteries that outsiders are not welcome to. Your explorers depart.");
					}
				}
			},
			{
				text: "Keep away.",
				run: () => { q.exploration++; out("Whatever strange thing the robed ones are up to, your people want no part in it."); }
			}
		]
	},
];


var robedOneDelegation = {
	text: "You send a delegation to the underground village of the robed ones.",
	extraText: () => {
		return "<br><br>Your last encounter with them was " + q.robedOnePrevInteraction + ".";
	},
	options: [
		{
			text: "Bring them gifts.",
			check: () => { return q.valuables; },
			success: () => { return 110 + q.robedOneRelations * 40 + q.tradition * 10; },
			run: (success) => {
				if (success) {
					q.robedOneRelations++;
					q.valuables--;
					q.robedOnePrevInteraction = "friendly";
					out("The robed ones are happy to receive your gifts, thanking you in an archaic whisper.");
				} else {
					q.robedOnePrevInteraction = "tense";
					out("Your delegation attempts to bring gifts to the robed ones, but they are chased away.");
				}
			}
		},
		{
			text: "Trade valuables for food.",
			check: () => { return q.valuables; },
			success: () => { return 80 + q.robedOneRelations * 60 + q.tradition * 10; },
			run: (success) => {
				if (success) {
					q.valuables--;
					q.food += 90;
					q.robedOnePrevInteraction = "friendly";
					out("The robed ones happily make this trade.");
				} else {
					q.robedOnePrevInteraction = "tense";
					if (q.robedOneRelations < -1) {
						out("The robed ones refuse to make this exchange, and indicate that you are not welcome.");
					} else {
						out("The robed ones refuse to make this exchange.");
					}
				}
			}
		},
		{
			text: "Trade food for valuables.",
			check: () => { return q.food >= 120; },
			success: () => { return 80 + q.robedOneRelations * 60 + q.tradition * 10; },
			run: (success) => {
				if (success) {
					q.valuables++;
					q.food -= 120;
					q.robedOnePrevInteraction = "friendly";
					out("The robed ones happily make this trade.");
				} else {
					q.robedOnePrevInteraction = "tense";
					if (q.robedOneRelations < -1) {
						out("The robed ones refuse to make this exchange, and indicate that you are not welcome.");
					} else {
						out("The robed ones refuse to make this exchange.");
					}
				}
			}
		},
		{
			text: "Trade valuables for tools.",
			check: () => { return q.valuables && q.tools < 4; },
			success: () => { return 50 + q.robedOneRelations * 30 + q.tradition * 10; },
			run: (success) => {
				if (success) {
					q.valuables--;
					q.tools++;
					q.robedOnePrevInteraction = "friendly";
					out("The robed ones happily make this trade.");
				} else {
					q.robedOnePrevInteraction = "tense";
					if (q.robedOneRelations < -1) {
						out("The robed ones refuse to make this exchange, and indicate that you are not welcome.");
					} else {
						out("The robed ones refuse to make this exchange.");
					}
				}
			}
		},
		{
			text: "Seek to exchange knowledge.",
			check: () => { return q.robedOnesKnowledge < 3 ; },
			success: () => { return q.robedOneRelations * 40 - q.robedOnesKnowledge * 20; },
			run: (success) => {
				if (success) {
					q.robedOneStrength += 5;
					q.robedOnePrevInteraction = "friendly";
					q.robedOnesKnowledge++;
					if (q.robedOnesKnowledge == 1) {
						q.exploration += 2;
						q.animals++;
						out("The robed ones are coaxed to part with some of their knowledge about the isle, telling you about the plants and animals that dwell therein.");
					} else if (q.robedOnesKnowledge == 2) {
						q.animals++;
						q.shaping += 2;
						out("The robed ones are coaxed to part with some of their knowledge about the isle, telling you about the mysteries of animal shaping.");
					} else {
						q.robedOneEyes = true;
						out("The robed ones say:<br><br>\"The isle hates all unshaped beings, including humans. It will send forth its eyes, and if it finds humans, the eyes will grow into a carpet of eyes that extinguishes everything until you are dead. That is why we hide our shape and never remove our robes, and we can only ask you to do the same.\"");
					}
				} else {
					q.robedOnePrevInteraction = "tense";
					out("The robed ones refuse to give up any of their secrets to outsiders.");
				}
			}
		},
		{
			text: "Demand tribute.",
			danger: () => { return 90 + q.robedOneStrength * 2 - strength() * 2 - q.weapons * 20; },
			run: (success, harm) => {
				q.robedOneRelations--;
				if (harm) {
					q.robedOnePrevInteraction = "violent";
					q.population -= 3;
					q.happy -= 5;
					out("The robed ones respond to your demands by attacking your delegation, killing every last one of them.");
				} else {
					q.robedOnePrevInteraction = "tense";
					q.valuables++;
					if (q.tools < 4) {
						q.tools++;
					} else {
						q.valuables++;
					}
					q.robedOneStrength -= 5;
					q.happy += 3;
					q.arousal += 5;
					out("The robed ones, cowed, provide your explorers with beads and copper tools.");
				}
			}
		},
	]
};

var robedOneRaid = {
	text: "You send a war party to raid the underground lair of the robed ones.",
	options: [
		{
			text: "Attack them, seeking to kill as many as possible.",
			danger: () => { return q.robedOneStrength + 80 - q.weapons * 15 - strength() - q.codgers * 15 - (q.blademouthFighters ? 5 + q.blademouths * 5 : 0); },
			run: (success, harm) => {
				q.robedOneRelations--;
				q.robedOnePrevInteraction = "violent";
				q.fights++;
				if (harm) {
					q.robedOneStrength -= 5;
					q.population -= 13;
					q.health -= 17;
					q.happy -= 5;
					out("Your war venture into the tunnels, weapons ready. At first, they manage to surprise and kill several of the creatures, but as they round a corner, they encounter a heavily armed party of robed ones. They try to escape, but are cut off by more of the creatures emerging from side tunnels. Many of them are slaughtered.");
				} else {
					if (q.spindrakeFire) {
						q.robedOneStrength -= 40;
						if (q.robedOneStrength <= 0) {
							q.robedOnesEncountered = false;
							q.robedOneVillage = false;
							out("Your war party use flammable spindrake milk to set fire to what's left of the robed ones' warrens, utterly wiping them out.");
						} else {
							out("Your war party use flammable spindrake milk to set fire to the robed ones' warrens, burning dozens of them, stabbing the ones that attempt to escape. Their tunnels collapse into smoldering wreckage. Perhaps some survived, but you have dealt them a heavy blow.");
						}
					} else {
						q.robedOneStrength -= 15;
						out("Your war party venture into the tunnels, weapons ready, and stab and club any robed ones they encounter. By the time the creatures realise what is happening, more than a dozen lie dead. Your people retreat before the enemy can organise any resistance.");
					}
				}
			}
		},
		{
			text: "Attack them, seeking to plunder their valuables.",
			danger: () => { return q.robedOneStrength + 50 - q.weapons * 15 - strength() - q.codgers * 10; },
			run: (success, harm) => {
				q.robedOneRelations--;
				q.robedOnePrevInteraction = "violent";
				q.fights++;
				if (harm) {
					q.population -= 9;
					q.happy -= 5;
					out("Your war party sneak into the tunnels looking for loot. At first, they manage to surprise and kill several of the creatures, but as they round a corner, they encounter a heavily armed party of robed ones. They try to escape, but are cut off by more of the creatures emerging from side tunnels. Many of them are slaughtered.");
				} else {
					q.robedOneStrength -= 5;
					q.valuables++;
					if (q.tools < 4) {
						q.tools++;
					} else {
						q.valuables++;
					}
					out("Your war party sneak into the tunnels looking for loot. They easily dispatch a few robed ones they catch unaware, and then find a large stash of copper ingots and obsidian tools, which they carry off.");
				}
			}
		},
		{
			text: "Seek to capture one of them for study.",
			check: () => { return q.robedOneEyes; },
			danger: () => { return q.robedOneStrength / 2 + 20 - strength() / 2; },
			run: (success, harm) => {
				q.robedOneRelations--;
				q.robedOnePrevInteraction = "violent";
				if (harm) {
					q.health -= 9;
					q.happy -= 2;
					out("Your war party sneaks into the tunnels and attempts to abduct a robed one, but they are discovered and chased off.");
				} else {
					q.robedOneEyes = true;
					q.robedOneRelations -= 2;
					out("Your war party sneaks into the tunnels and seizes the first robed one they can find. They bring it back to the village, and attempt to interrogate it, but it refuses to answer. Angered, they seek to satisfy their curiosity by stripping the robes off the figure. Beneath the robes, they find an ordinary-looking woman.<br><br>Now she speaks: \"We will not forgive you for this. And when the eyes come, they will kill you for your nakedness.\"<br><br>Then she seizes a dagger from one of the warriors and plunges it into her throat.");
				}
			}
		},
	]
};

var bimaneDelegation = {
	text: "You send a delegation to the hidden forest village of the bimanes.",
	extraText: () => {
		return "<br><br>Your last encounter with them was " + q.bimanePrevInteraction + ".";
	},
	options: [
		{
			text: "Bring them gifts.",
			check: () => { return q.valuables; },
			success: () => { return 80 + q.bimaneRelations * 25 - q.tradition * 10; },
			run: (success) => {
				if (success) {
					q.bimaneRelations++;
					q.valuables--;
					q.bimanePrevInteraction = "friendly";
					out("The bimanes are happy to receive your gifts.");
				} else {
					q.bimanePrevInteraction = "tense";
					out("Your delegation attempts to bring gifts to the bimanes, but they are chased away.");
				}
			}
		},
		{
			text: "Trade valuables for food.",
			check: () => { return q.valuables; },
			success: () => { return 70 + q.bimaneRelations * 30 - q.tradition * 10; },
			run: (success) => {
				if (success) {
					q.valuables--;
					q.food += 110;
					q.bimanePrevInteraction = "friendly";
					out("The bimanes happily make this trade.");
				} else {
					q.bimanePrevInteraction = "tense";
					if (q.bimaneRelations < -1) {
						out("The bimanes refuse to make this exchange, and indicate that you are not welcome.");
					} else {
						out("The bimanes refuse to make this exchange.");
					}
				}
			}
		},
		{
			text: "Trade food for valuables.",
			check: () => { return q.food >= 130; },
			success: () => { return 70 + q.bimaneRelations * 30 - q.tradition * 10; },
			run: (success) => {
				if (success) {
					q.valuables++;
					q.food -= 130;
					q.bimanePrevInteraction = "friendly";
					out("The bimanes happily make this trade.");
				} else {
					q.bimanePrevInteraction = "tense";
					if (q.bimaneRelations < -1) {
						out("The bimanes refuse to make this exchange, and indicate that you are not welcome.");
					} else {
						out("The bimanes refuse to make this exchange.");
					}
				}
			}
		},
		{
			text: "Trade valuables for woolmouths.",
			check: () => { return q.valuables &&  q.woolmouths && q.woolmouths < 5; },
			success: () => { return 70 + q.bimaneRelations * 30 - q.tradition * 10; },
			run: (success) => {
				if (success) {
					q.valuables--;
					q.woolmouths++;
					q.bimanePrevInteraction = "friendly";
					out("The bimanes happily make this trade.");
				} else {
					q.bimanePrevInteraction = "tense";
					if (q.bimaneRelations < -1) {
						out("The bimanes refuse to make this exchange, and indicate that you are not welcome.");
					} else {
						out("The bimanes refuse to make this exchange.");
					}
				}
			}
		},
		{
			text: "Seek to exchange knowledge.",
			check: () => { return q.bimanesKnowledge < 3 ; },
			success: () => { return 60 + q.bimaneRelations * 40 - q.bimanesKnowledge * 20; },
			run: (success) => {
				if (success) {
					q.bimaneStrength += 5;
					q.bimanePrevInteraction = "friendly";
					q.bimanesKnowledge++;
					if (q.bimanesKnowledge == 1) {
						q.exploration += 2;
						q.animals++;
						out("The bimanes are coaxed to part with some of their knowledge about the isle, telling you about the plants and animals that dwell therein.");
					} else if (q.bimanesKnowledge == 2) {
						q.animals++;
						q.shaping++;
						out("The bimanes are coaxed to part with some of their knowledge about the isle, telling you about the mysteries of animal shaping.");
					} else {
						q.bimanePlague = true;
						q.shaping++;
						out("The bimanes relate that they were human beings once, but there was a great crisis, some kind of plague, and they had to change or die, which is why they are the shape that they are now.");
					}
				} else {
					q.bimanePrevInteraction = "tense";
					out("The bimanes refuse to give up any of their secrets to outsiders.");
				}
			}
		},
		{
			text: "Demand tribute.",
			danger: () => { return 80 + q.bimaneStrength * 2 - strength() * 2 - q.weapons * 20; },
			run: (success, harm) => {
				if (harm) {
					q.bimanePrevInteraction = "violent";
					q.population -= 3;
					q.happy -= 5;
					out("The bimanes respond to your demands by attacking your delegation, killing every last one of them.");
				} else {
					q.bimaneRelations--;
					q.bimanePrevInteraction = "tense";
					q.bimaneStrength -= 5;
					q.happy += 3;
					q.arousal += 5;
					q.valuables++;
					if (q.woolmouths && q.woolmouths < 5) {
						q.woolmouths++;
						out("The bimanes give in to your demands and give up valuable beads and a herd of woolmouths");
					} else {
						out("The bimanes give in to your demands and give up many valuable beads.");
						q.valuables++;
					}
				}
			}
		},
	]
};

var bimaneRaid = {
	text: "You send a war party to attack the hidden forest lair of the bimanes.",
	options: [
		{
			text: "Seek to kill as many as possible.",
			danger: () => { return q.bimaneStrength + 60 - q.weapons * 15 - strength() - (q.codgerFighters ? q.codgers * 5 : 0) - (q.blademouthFighters ? 8 + q.blademouths * 8 : 0) - q.bimaneAttackPrep * 25; },
			run: (success, harm) => {
				q.bimaneAttackPrep = 0;
				q.bimaneRelations--;
				q.bimanePrevInteraction = "violent";
				q.fights++;
				if (harm) {
					q.bimaneStrength -= 5;
					q.population -= 13;
					q.health -= 17;
					q.happy -= 5;
					out("Your war party crash through the weave surrounding the village and advance, only to find themselves ambushed by hidden bimane warriors. The small size of the individual creatures allowed them to stay hidden in ditches, in bushes, behind tree stumps and animals, only to spring forth and assemble into formidable warriors. Your people attempt to retreat, but many are slaughtered.");
				} else {
					if (q.spindrakeFire) {
						q.bimaneStrength -= 35;
						if (q.bimaneStrength <= 0) {
							q.bimanesEncountered = false;
							q.bimaneVillage = false;
							out("Your war party use flammable spindrake milk to set fire to what's left of the bimanes' village, and make sure to kill every last one of them.");
						} else {
							out("Your war party use flammable spindrake milk to set fire to the bimanes' village', burning dozens of them, stabbing the ones that attempt to escape. Most likely some survive, but you have dealt them a heavy blow.");
						}
					} else {
						q.bimaneStrength -= 20;
						out("Your war party crash through the weave surrounding the village and advance, slaughtering bimanes as they encounter them in the fields. By the time the creatures manage to put together some sort of resistance, your people have killed hundreds and set fire to several buildings. They return to the forest before the bimanes can counterattack.");
					}
				}
			}
		},
		{
			text: "Seek to plunder their herds and valuables.",
			danger: () => { return q.bimaneStrength + 40 - q.weapons * 12 - strength() - (q.blademouthFighters ? 8 + q.blademouths * 8 : 0) - q.bimaneAttackPrep * 25; },
			run: (success, harm) => {
				q.bimaneAttackPrep = 0;
				q.bimaneRelations--;
				q.bimanePrevInteraction = "violent";
				q.fights++;
				if (harm) {
					q.population -= 9;
					q.happy -= 5;
					out("Your war party sneak into the village looking for loot. They don't get far before the creatures raise an alarm, a strange whistling sound, and dozens of heavily-armed bimanes converge on your people. Faced with such a robust response, the raiders attempt to flee, but many are cut down.");
				} else {
					q.bimaneStrength -= 5;
					if (q.woolmouths && q.woolmouths < 5) {
						q.woolmouths++;
						out("Your war party sneak into the village looking for loot. They encounter a herd of woolmouths guarded by just one small bimane figure, so they cut it down and herd away the beasts before anyone can raise an alarm.");
					} else {
						q.valuables++;
						out("Your war party sneak into the village looking for loot. They easily dispatch a few bimanes they catch unaware, and then find a large stash of valuable beads, which they carry off.");
					}
				}
			}
		},
		{
			text: "Seek to capture one of them for study.",
			check: () => { return !q.bimanePrisoner; },
			danger: () => { return q.bimaneStrength / 2 + 30 - strength() / 2 - q.weapons * 8; },
			run: (success, harm) => {
				q.bimanePrevInteraction = "nearly violent";
				if (harm) {
					q.health -= 4;
					q.happy -= 2;
					out("Your war party sneaks into the village and attempts to abduct a bimane, but they are discovered and chased off.");
				} else {
					q.bimanePrisoner = true;
					q.bimaneRelations--;
					q.shaping++;
					q.animals++;
					out("Your war party sneaks into the village and singles out a small bimane figure made of just a handful of the creatures. They attempt to grab it, but its hands let go of one another, and it scatters into its individual parts. Still, they manage to keep ahold of one, and quickly retreat back into the forest.<br><br>Back at the village, they put the creature into a cage and study it. It looks very much like a human forearm terminating in a hand at both ends, but there is a small mouth and eyes embedded in the wrist at one end, and an anus at the other. The creature makes angry whistling sounds and very rude gestures. Was this a human once, reshaped into this strange form, or is it a creature native to the isle that is somehow impersonating human anatomy? No one can tell.");
				}
			}
		},
	]
};
