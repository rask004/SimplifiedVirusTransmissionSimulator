const infectionDistributions = {
  UNIFORM: "Uniform",
  LINEAR: "Linear",
  CURVED: "Curved",
}

const maskTransmissionRoutes = {
  RECEIVED: "Received",
  TRANSMITTED: "Passed on",
  BOTH: "Received and Passed on",
}

const incrementStep = 50;
const speedStep = 10 * incrementStep;
const speedMax = speedStep * 10;
const speedMin = speedStep * 1;
const infectiousDayEarliestMin = 1;
const infectiousDayLatestMax = 30;
const symptomsPeriodDaysMin = 1;
const symptomsPeriodDaysMax = 28;
const infectiousProbMin = 0;
const infectiousProbMax = 100;
const infectiousProbStep = 5;
const maskReductProbMin = 0;
const maskReductProbMax = 100;
const maskReductProbStep = 5;

const arenaWidth = 1000;
const arenaHeight = 600;
const bubbleWidth = 140;
const personWidth = 20;

var speed = speedStep * 2;
var _increment = speed;
var infectiousDayEarliest = 5;
var infectiousDayLatest = 14;
var symptomsPeriodDays = 7;
var infectionDistribution = infectionDistributions.UNIFORM;
var infectiousProbability = 80;
var maskTransmissionRoute = maskTransmissionRoutes.TRANSMITTED;
var maskReductProbability = 50;

var peopleNodes = [];
var currentInfectedPeople = [];
var postInfectedPeople = [];

var newInfectionLinks = [];

var currentDay = 0;
var currentlyInfectious = 0;
var totalAffected = 1;

var runScenario = true;

/*** VISUALISATION DATA 
 *  Format:
 *    - bubbles
 *      x, y:                                 coordinates for the visualisation HTML container.
 *      initialAngle, distributeClockwise:    control parameters for auto distribution of person nodes in the bubble.
 * 
 *    - people      (list of people objects)
 *      name:                                 name of person. Acts as an object id.
 *      bubble:                               key/id of the bubble the person belongs in.
 * 
 *    - links       (list of links between people)
 *      [name1, name2]:                       array, two items, represents a two way link/connection between the people with these names.
 * 
 *    - patientZero:
 *        name                                name of person who is initially infected.
 * ***/
const visualisationData = {
  bubbles: {
    bubble1: {
      x: 0.4 * arenaWidth - bubbleWidth / 2 + 10,
      y: 0.5 * arenaHeight - bubbleWidth / 2 + 10,
      initialAngle: 270,
      distributeClockwise: true,
    },
    bubble2: {
      x: 0.2 * arenaWidth - bubbleWidth / 2 + 10,
      y: 0.2 * arenaHeight - bubbleWidth / 2 + 10,
      initialAngle: 90,
      distributeClockwise: true,
    },
    bubble3: {
      x: 0.21 * arenaWidth - bubbleWidth / 2 + 10,
      y: 0.81 * arenaHeight - bubbleWidth / 2 + 10,
      initialAngle: 180,
      distributeClockwise: true,
    },
    bubble4: {
      x: 0.6 * arenaWidth - bubbleWidth / 2 + 10,
      y: 0.2 * arenaHeight - bubbleWidth / 2 + 10,
      initialAngle: 270,
      distributeClockwise: true,
    },
    bubble5: {
      x: 0.6 * arenaWidth - bubbleWidth / 2 + 10,
      y: 0.8 * arenaHeight - bubbleWidth / 2 + 10,
      initialAngle: 180,
      distributeClockwise: false,
    },
    bubble6: {
      x: 0.8 * arenaWidth - bubbleWidth / 2 + 10,
      y: 0.5 * arenaHeight - bubbleWidth / 2 + 10,
      initialAngle: 0,
      distributeClockwise: true,
    },
  },
  people: [{
      name: "P1",
      bubble: "bubble1"
    },
    {
      name: "P2",
      bubble: "bubble1"
    },
    {
      name: "P3",
      bubble: "bubble1"
    },
    {
      name: "P4",
      bubble: "bubble1"
    },
    {
      name: "P5",
      bubble: "bubble1"
    },
    {
      name: "P6",
      bubble: "bubble1"
    },
    {
      name: "P7",
      bubble: "bubble2"
    },
    {
      name: "P8",
      bubble: "bubble2"
    },
    {
      name: "P9",
      bubble: "bubble2"
    },
    {
      name: "P10",
      bubble: "bubble2"
    },
    {
      name: "P11",
      bubble: "bubble2"
    },
    {
      name: "P12",
      bubble: "bubble2"
    },
    {
      name: "P13",
      bubble: "bubble3"
    },
    {
      name: "P14",
      bubble: "bubble3"
    },
    {
      name: "P15",
      bubble: "bubble3"
    },
    {
      name: "P16",
      bubble: "bubble3"
    },
    {
      name: "P17",
      bubble: "bubble4"
    },
    {
      name: "P18",
      bubble: "bubble4"
    },
    {
      name: "P19",
      bubble: "bubble4"
    },
    {
      name: "P20",
      bubble: "bubble4"
    },
    {
      name: "P21",
      bubble: "bubble4"
    },
    {
      name: "P22",
      bubble: "bubble5"
    },
    {
      name: "P23",
      bubble: "bubble5"
    },
    {
      name: "P24",
      bubble: "bubble5"
    },
    {
      name: "P25",
      bubble: "bubble5"
    },
    {
      name: "P26",
      bubble: "bubble5"
    },
    {
      name: "P27",
      bubble: "bubble5"
    },
    {
      name: "P28",
      bubble: "bubble5"
    },
    {
      name: "P29",
      bubble: "bubble6"
    },
    {
      name: "P30",
      bubble: "bubble6"
    },
    {
      name: "P31",
      bubble: "bubble6"
    },
    {
      name: "P32",
      bubble: "bubble6"
    },
    {
      name: "P33",
      bubble: "bubble6"
    },
  ],
  links: [
    ["P1", "P2"],
    ["P1", "P3"],
    ["P1", "P4"],
    ["P1", "P5"],
    ["P1", "P6"],
    ["P2", "P3"],
    ["P2", "P4"],
    ["P2", "P5"],
    ["P2", "P6"],
    ["P3", "P4"],
    ["P3", "P5"],
    ["P3", "P6"],
    ["P4", "P5"],
    ["P4", "P6"],
    ["P5", "P6"],
    ["P2", "P8"],
    ["P3", "P21"],
    ["P4", "P22"],
    ["P5", "P23"],
    ["P6", "P13"],
    ["P7", "P8"],
    ["P7", "P9"],
    ["P7", "P10"],
    ["P7", "P11"],
    ["P7", "P12"],
    ["P8", "P9"],
    ["P8", "P10"],
    ["P8", "P11"],
    ["P8", "P12"],
    ["P9", "P10"],
    ["P9", "P11"],
    ["P9", "P12"],
    ["P10", "P11"],
    ["P10", "P12"],
    ["P11", "P12"],
    ["P12", "P18"],
    ["P13", "P14"],
    ["P13", "P15"],
    ["P13", "P16"],
    ["P14", "P15"],
    ["P14", "P16"],
    ["P15", "P16"],
    ["P17", "P18"],
    ["P17", "P19"],
    ["P17", "P20"],
    ["P17", "P21"],
    ["P18", "P19"],
    ["P18", "P20"],
    ["P18", "P21"],
    ["P19", "P20"],
    ["P19", "P21"],
    ["P20", "P21"],
    ["P22", "P23"],
    ["P22", "P24"],
    ["P22", "P28"],
    ["P23", "P24"],
    ["P23", "P27"],
    ["P23", "P28"],
    ["P24", "P25"],
    ["P24", "P26"],
    ["P24", "P28"],
    ["P25", "P26"],
    ["P25", "P27"],
    ["P26", "P27"],
    ["P26", "P28"],
    ["P27", "P28"],
    ["P27", "P29"],
    ["P29", "P30"],
    ["P30", "P31"],
    ["P31", "P32"],
    ["P32", "P29"],
    ["P32", "P33"],
    ["P33", "P29"],
    ["P33", "P31"],
  ],
  patientZero: "P1",
};

/*** HTML CONTROLS SECTION SETUP ***/
for (const [key, option] of Object.entries(infectionDistributions)) {
  let element = document.createElement("option");
  element.value = option;
  element.innerHTML = option;
  document.querySelector("#control-inf-dist").add(element);
}
document.querySelector("#control-inf-dist").value = infectionDistributions.LINEAR;
document
  .querySelector("#control-inf-dist")
  .addEventListener("click", function (e) {
    console.log(e);
    let val = e.target.selectedOptions[0].value;
    infectionDistribution = val;
    //console.log(infectionDistribution);
  });

for (const [key, option] of Object.entries(maskTransmissionRoutes)) {
  let element = document.createElement("option");
  element.value = option;
  element.innerHTML = option;
  document.querySelector("#control-mask-trans").add(element);
}
document.querySelector("#control-mask-trans").value = maskTransmissionRoutes.TRANSMITTED;
document
  .querySelector("#control-mask-trans")
  .addEventListener("click", function (e) {
    let val = e.target.selectedOptions[0].value;
    maskTransmissionRoute = val;
    //console.log(maskTransmissionRoute);
  });

document.querySelector("#control-speed").min = speedMin;
document.querySelector("#control-speed").max = speedMax;
document.querySelector("#control-speed").step = speedStep;
document.querySelector("#control-speed").value = speed;
document
  .querySelector("#control-speed")
  .addEventListener("input", function (e) {
    if (e.target.type === "number") {
      let val = parseInt(e.target.value);
      if (val > speedMax) {
        val = speedMax;
      } else if (val < speedMin) {
        val = speedMin;
      }
      document.querySelector("#control-speed").value = val;
      speed = val;
    }
  });

document.querySelector("#control-inc-min").min = infectiousDayEarliestMin;
document.querySelector("#control-inc-min").max = infectiousDayLatest - 1;
document.querySelector("#control-inc-min").step = 1;
document.querySelector("#control-inc-min").value = infectiousDayEarliest;
document.querySelector("#control-inc-max").min = infectiousDayEarliest + 1;
document.querySelector("#control-inc-max").max = infectiousDayLatestMax;
document.querySelector("#control-inc-max").step = 1;
document.querySelector("#control-inc-max").value = infectiousDayLatest;
const incubationControlsListener = function (e) {
  if (e.target === document.querySelector("#control-inc-min")) {
    let val = parseInt(e.target.value);
    if (val > infectiousDayLatest - 1) {
      val = infectiousDayLatest - 1;
    } else if (val < infectiousDayEarliestMin) {
      val = infectiousDayEarliestMin;
    }
    document.querySelector("#control-inc-min").value = val;
    infectiousDayEarliest = val;
  } else if (e.target === document.querySelector("#control-inc-max")) {
    let val = parseInt(e.target.value);
    if (val > infectiousDayLatestMax) {
      val = infectiousDayLatestMax;
    } else if (val < infectiousDayEarliest + 1) {
      val = infectiousDayEarliest + 1;
    }
    document.querySelector("#control-inc-max").value = val;
    infectiousDayLatest = val;
  }
  document.querySelector("#control-inc-min").max = infectiousDayLatest - 1;
  document.querySelector("#control-inc-max").min = infectiousDayEarliest + 1;
};
document
  .querySelector("#control-inc-min")
  .addEventListener("input", incubationControlsListener);
document
  .querySelector("#control-inc-max")
  .addEventListener("input", incubationControlsListener);

document.querySelector("#control-sympt-period").min = symptomsPeriodDaysMin;
document.querySelector("#control-sympt-period").max = symptomsPeriodDaysMax;
document.querySelector("#control-sympt-period").step = 1;
document.querySelector("#control-sympt-period").value = symptomsPeriodDays;
document
  .querySelector("#control-sympt-period")
  .addEventListener("input", function (e) {
    if (e.target.type === "number") {
      let val = parseInt(e.target.value);
      if (val > symptomsPeriodDaysMax) {
        val = symptomsPeriodDaysMax;
      } else if (val < symptomsPeriodDaysMin) {
        val = symptomsPeriodDaysMin;
      }
      document.querySelector("#control-sympt-period").value = val;
      symptomsPeriodDays = val;
    }
  });

document.querySelector("#control-inf-prob").min = infectiousProbMin;
document.querySelector("#control-inf-prob").max = infectiousProbMax;
document.querySelector("#control-inf-prob").step = infectiousProbStep;
document.querySelector("#control-inf-prob").value = infectiousProbability;
document
  .querySelector("#control-inf-prob")
  .addEventListener("input", function (e) {
    if (e.target.type === "number") {
      let val = parseInt(e.target.value);
      if (val > infectiousProbMax) {
        val = infectiousProbMax;
      } else if (val < infectiousProbMin) {
        val = infectiousProbMin;
      }
      document.querySelector("#control-inf-prob").value = val;
      infectiousProbability = val;
    }
  });

document.querySelector("#control-mask-reduction").min = maskReductProbMin;
document.querySelector("#control-mask-reduction").max = maskReductProbMax;
document.querySelector("#control-mask-reduction").step = maskReductProbStep;
document.querySelector("#control-mask-reduction").value = maskReductProbability;
document
  .querySelector("#control-mask-reduction")
  .addEventListener("input", function (e) {
    if (e.target.type === "number") {
      let val = parseInt(e.target.value);
      if (val > maskReductProbMax) {
        val = maskReductProbMax;
      } else if (val < maskReductProbMin) {
        val = maskReductProbMin;
      }
      document.querySelector("#control-mask-reduction").value = val;
      maskReductProbability = val;
    }
  });

document
  .querySelector("#control-play-pause")
  .addEventListener("click", function (e) {
    if (!runScenario) {
      startSimulation();
      document.querySelector("#control-play-pause").innerHTML = "Pause";
      setControlsDisabled(true);
    } else {
      stopSimulation();
      document.querySelector("#control-play-pause").innerHTML = "Play";
    }
  });

document
  .querySelector("#control-reset")
  .addEventListener("click", function (e) {
    resetSimulation();
  });

var setControlsDisabled = function (disable) {
  document.querySelector("#control-inc-min").disabled = disable;
  document.querySelector("#control-inc-max").disabled = disable;
  document.querySelector("#control-sympt-period").disabled = disable;
  document.querySelector("#control-inf-prob").disabled = disable;
  document.querySelector("#control-mask-reduction").disabled = disable;
};

var changeMask = function (node) {
  let person = node.data.person;
  person.wearingMask = !person.wearingMask;
  node.element.blur();
};

var setMaskControlsDisabled = function (disable) {
  for (let node of peopleNodes) {
    node.nodeElement.disabled = disable;
  }
}

/*** VISUALIZATION SETUP ***/
var prepareVisualizationData = function () {
  var peopleData = visualisationData.people;
  var linksData = visualisationData.links;
  var p, n;
  for (let item of peopleData) {
    p = new Person(
      infectiousDayEarliest,
      infectiousDayLatest,
      symptomsPeriodDays,
      infectiousProbability,
      maskReductProbability,
      false,
      item.name
    );
    n = new GraphNode({
      person: p,
      group: item.bubble,
    });
    peopleNodes.push(n);
    //console.log(`added node: ${n.id}, person ${n.data.person.id}`);
  }

  for (let l of linksData) {
    //console.log(l);
    let nodes = peopleNodes.filter(function (item) {
      //console.log(l, item.data.person.id);
      return l.includes(item.data.person.id);
    });
    if (nodes.length >= 2) {
      let g = new GraphLink(nodes[0], nodes[1]);
      nodes[0].addLink(g);
      nodes[1].addLink(g);
      //console.log(`new link: ${g.id}, ${g.nodes}`);
    }
  }

  //console.log(peopleNodes);
};

var updateVisualizationData = function () {
  newInfectionLinks = [];
  let target;
  for (let n of peopleNodes) {
    n.data.person.updateInfection();
    if (n.data.person.infectionState === Person.infectionStates.INFECTIOUS) {
      if (!checkCurrentInfections(n.data.person)) {
        currentInfectedPeople.push(n.data.person);
        currentlyInfectious += 1;
      }
      for (let l of n.links) {
        for (x of l.nodes) {
          //console.log(`linked person ${x}`);
          target = x.data.person;
          if (
            target.infectionState === Person.infectionStates.CLEAN &&
            Math.random() <= n.data.person.transmissionProbability
          ) {
            target.startInfection();
            newInfectionLinks.push(l);
            //console.log(`person ${target.id} infected`);
            totalAffected += 1;
          }
        }
      }
    } else if (
      n.data.person.infectionState === Person.infectionStates.POST_INFECTIOUS &&
      !checkPostInfected(n.data.person)
    ) {
      postInfectedPeople.push(n.data.person);
      currentlyInfectious -= 1;
    }
  }

  //console.log(newInfectionLinks);
};

var checkCurrentInfections = function (person) {
  for (let x of currentInfectedPeople) {
    if (person.equals(x)) {
      return true;
    }
  }
  return false;
};

var checkPostInfected = function (person) {
  for (let x of postInfectedPeople) {
    if (person.equals(x)) {
      return true;
    }
  }
  return false;
};

// see `resetSimulation` for clearing Visualization Data

/*** RENDERING AND DRAWING ***/
var renderInitialVisualization = function () {
  const arena = document.querySelector("#visualization");

  var bubbleData = visualisationData.bubbles;

  var renderBubble = function (origin, bubbleName) {
    let element = document.createElement("div");
    element.id = bubbleName;
    element.style.position = `absolute`;
    element.style.left = `${origin.x}px`;
    element.style.top = `${origin.y}px`;
    element.style.width = `${bubbleWidth}px`;
    element.className = "bubble";
    arena.appendChild(element);
  };

  var renderPeople = function (origin, nodes, initAngle = 0, clockwise = true) {
    let r = (bubbleWidth - bubbleWidth / nodes.length) / 3;
    let aDiff = 360 / nodes.length;
    let a = initAngle;
    let x, y;

    for (let n of nodes) {
      x =
        r * Math.sin((a * Math.PI) / 180) +
        origin.x +
        bubbleWidth / 2 -
        personWidth / 2;
      y =
        r * Math.cos((a * Math.PI) / 180) +
        origin.y +
        bubbleWidth / 2 -
        personWidth / 2;

      let e = document.createElement("button");
      e.classList.add("circle");
      if (
        n.data.person.infectionState === Person.infectionStates.PRE_INFECTIOUS
      ) {
        e.classList.add("incubating");
      } else {
        e.classList.add("clean");
      }
      if (n.data.person.wearingMask) {
        e.classList.add("mask");
      } else {
        e.classList.remove("mask");
      }
      e.id = n.id;
      e.style.position = "absolute";
      e.style.left = `${x}px`;
      e.style.top = `${y}px`;
      e.style.width = `${personWidth}px`;
      e.title = `${n.data.person.id}`;

      e.onclick = function () {
        changeMask(n);
        //console.log(n.data.person);
      };

      n.element = e;
      arena.appendChild(e);

      if (clockwise) {
        a -= aDiff;
        if (a <= 0) {
          a += 360;
        }
      } else {
        a += aDiff;
        if (a >= 360) {
          a -= 360;
        }
      }
    }
  };

  var renderLink = function (link) {
    let l, t, w, a;

    let startElement = link.nodes[0].element;
    let endElement = link.nodes[1].element;

    let sElementTop = parseFloat(startElement.style.top);
    let eElementTop = parseFloat(endElement.style.top);
    let sElementLeft = parseFloat(startElement.style.left);
    let eElementLeft = parseFloat(endElement.style.left);

    l = sElementLeft + parseFloat(startElement.style.width) / 2;
    t = sElementTop + parseFloat(startElement.style.width) / 2;

    //console.log(sElementTop, eElementTop, sElementLeft, eElementLeft, startElement.style.width);

    w = Math.sqrt(
      Math.pow(sElementLeft - eElementLeft, 2) +
      Math.pow(sElementTop - eElementTop, 2)
    );

    // I ain't got no clue why I gotta add 180 here but it works and it's 2 in the morning.
    a =
      (Math.atan2(sElementTop - eElementTop, sElementLeft - eElementLeft) *
        180) / Math.PI + 180;

    let e = link.element;
    arena.insertBefore(e, arena.firstChild);
    e.classList.add("link");

    e.style.position = `absolute`;
    e.style.left = `${l}px`;
    e.style.top = `${t}px`;
    e.style.width = `${w}px`;
    e.style.height = `0`;
    e.style.transformOrigin = `0 0`;
    e.style.transform = `rotate(${a}deg)`;


    //console.log(link, startElement, endElement);
  };

  for (let i = 1; i <= 6; i++) {
    let bubbleName = `bubble${i}`;
    let origin = {
      x: bubbleData[bubbleName].x,
      y: bubbleData[bubbleName].y,
    };
    let initAngle = bubbleData[bubbleName].initialAngle;
    let clockwise = bubbleData[bubbleName].distributeClockwise;
    let bubbleNodes = peopleNodes.filter(function (node) {
      return node.data.group === bubbleName;
    });
    renderBubble(origin, bubbleName);
    renderPeople(origin, bubbleNodes, initAngle, clockwise);
  }

  let linkedNodes = [];
  for (let n of peopleNodes) {
    let links = n.links.filter(function (link) {
      return !linkedNodes.includes(link);
    });
    for (let l of links) {
      if (!linkedNodes.includes(n)) {
        renderLink(l);
      }
    }
    linkedNodes.push(n);
  }
};

var renderUpdatedVisualization = function () {
  let e;
  for (let n of peopleNodes) {
    e = n.element;
    if (e.classList.contains("post-infection")) {
      continue;
    } else if (
      n.data.person.infectionState === Person.infectionStates.POST_INFECTIOUS &&
      e.classList.contains("infectious")
    ) {
      // e.classList.remove("clean");
      // e.classList.remove("incubating");
      e.classList.remove("infectious");
      e.classList.add("post-infection");
      e.title = `${n.data.person.id} recovering`;
    } else if (
      n.data.person.infectionState === Person.infectionStates.INFECTIOUS &&
      e.classList.contains("incubating")
    ) {
      // e.classList.remove("clean");
      e.classList.remove("incubating");
      e.classList.add("infectious");
      // e.classList.remove("post.infection");
      e.title = `${n.data.person.id} infectious`;
    } else if (
      n.data.person.infectionState === Person.infectionStates.PRE_INFECTIOUS &&
      e.classList.contains("clean")
    ) {
      e.classList.remove("clean");
      e.classList.add("incubating");
      // e.classList.remove("infectious");
      // e.classList.remove("post.infection");
      e.title = `${n.data.person.id} incubating...`;
    } else if (
      n.data.person.infectionState === Person.infectionStates.CLEAN &&
      !e.classList.contains("clean")
    ) {
      e.classList.add("clean");
      e.classList.remove("incubating");
      e.classList.remove("infectious");
      e.classList.remove("post.infection");
      e.title = `${n.data.person.id}`;
    }
    if (n.data.person.wearingMask) {
      e.classList.add("mask");
    } else {
      e.classList.remove("mask");
    }
  }

  for (let l of newInfectionLinks) {
    l.element.classList.add("infection");
  }
};

var renderResults = function () {
  document.querySelector("#results-day").innerHTML = currentDay;
  document.querySelector("#results-infected").innerHTML = currentlyInfectious;
  document.querySelector("#results-total").innerHTML = totalAffected;
};

// see `resetSimulation` for clearing Visualization Rendering

/*** SIMULATION MANAGEMENT ***/

var startSimulation = function () {
  runScenario = true;
  if (currentDay === 0) {
    // prepare patient zero
    peopleNodes[0].data.person.startInfection();
    totalAffected += 1;
    //console.log(`nodes: ${peopleNodes}`);
  }
  setMaskControlsDisabled(true);
};

var stopSimulation = function () {
  runScenario = false;
};

var resetSimulation = function () {
  runScenario = false;
  document.querySelector("#visualization").innerHTML = "";
  document.querySelector("#control-play-pause").innerHTML = "Play";
  setControlsDisabled(false);
  setMaskControlsDisabled(false);
  peopleNodes = [];
  currentDay = 0;
  currentlyInfectious = 0;
  totalAffected = 0;
  renderResults();
  Person.resetID();
  GraphNode.resetID();
  prepareVisualizationData();
  renderInitialVisualization();
};

/*** EVENT LOOP ***/
var mainLoop = function () {
  _increment -= incrementStep;
  if (_increment <= 0) {
    if (runScenario) {
      currentDay += 1;
      updateVisualizationData();
    }
    _increment = speed;
  }

  renderUpdatedVisualization();
  renderResults();

  //console.log("Day:", currentDay);

  setTimeout(function () {
    mainLoop();
  }, incrementStep);
};

/*** LOADING ***/
window.onload = function () {
  resetSimulation();
  mainLoop();
};