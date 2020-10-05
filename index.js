const speedStep = 500;
const speedMax = speedStep * 10;
const speedMin = speedStep * 1;
const infectiousDayEarliestMin = 1;
const infectiousDayLatestMax = 30;
const infectiousPeriodDaysMin = 1;
const infectiousPeriodDaysMax = 14;
const infectiousProbMin = 10;
const infectiousProbMax = 100;
const infectiousProbStep = 5;
const maskReductProbMin = 10;
const maskReductProbMax = 90;
const maskReductProbStep = 5;

const arenaWidth = 1000;
const arenaHeight = 600;
const bubbleWidth = 140;
const personWidth = 20;

var speed = speedStep * 2;
var infectiousDayEarliest = 5;
var infectiousDayLatest = 14;
var infectiousPeriodDays = 7;
var infectiousProbability = 80;
var maskReductProbability = 50;

var peopleNodes = [];
var currentInfectedPeople = [];
var postInfectedPeople = [];

var currentDay = 0;
var currentlyInfectious = 0;
var totalAffected = 1;

var runScenario = true;

/*** HTML CONTROLS SECTION SETUP ***/
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

document.querySelector("#control-inf-period").min = infectiousPeriodDaysMin;
document.querySelector("#control-inf-period").max = infectiousPeriodDaysMax;
document.querySelector("#control-inf-period").step = 1;
document.querySelector("#control-inf-period").value = infectiousPeriodDays;
document
  .querySelector("#control-inf-period")
  .addEventListener("input", function (e) {
    if (e.target.type === "number") {
      let val = parseInt(e.target.value);
      if (val > infectiousPeriodDaysMax) {
        val = infectiousPeriodDaysMax;
      } else if (val < infectiousPeriodDaysMin) {
        val = infectiousPeriodDaysMin;
      }
      document.querySelector("#control-inf-period").value = val;
      infectiousPeriodDays = val;
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
      if (currentDay === 0) {
        prepareSimulation();
      }
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
  document.querySelector("#control-inf-period").disabled = disable;
  document.querySelector("#control-inf-prob").disabled = disable;
  document.querySelector("#control-mask-reduction").disabled = disable;
};

var changeMask = function (node) {
  let person = node.data.person;
  person.wearingMask = !person.wearingMask;
}

/*** VISUALIZATION SETUP ***/
var prepareVisualizationData = function () {
  var p = new Person(
    infectiousDayEarliest,
    infectiousDayLatest,
    infectiousPeriodDays,
    infectiousProbability,
    maskReductProbability,
    false
  );
  var n = new GraphNode({
    person: p,
    group: "bubble1",
  });
  peopleNodes.push(n);

  // first bubble
  for (let i = 1; i <= 5; i++) {
    p = new Person(
      infectiousDayEarliest,
      infectiousDayLatest,
      infectiousPeriodDays,
      infectiousProbability,
      maskReductProbability,
      false
    );
    n = new GraphNode({
      person: p,
      group: "bubble1",
    });
    peopleNodes.push(n);
  }

  for (let i = 0; i <= 5; i++) {
    for (let j = 0; j <= 5; j++) {
      if (i === j) {
        continue;
      }
      peopleNodes[i].addLink(peopleNodes[j]);
    }
  }

  // second bubble
  for (let i = 6; i <= 11; i++) {
    p = new Person(
      infectiousDayEarliest,
      infectiousDayLatest,
      infectiousPeriodDays,
      infectiousProbability,
      maskReductProbability,
      false
    );
    n = new GraphNode({
      person: p,
      group: "bubble2",
    });
    peopleNodes.push(n);
  }

  for (let i = 6; i <= 11; i++) {
    for (let j = 6; j <= 11; j++) {
      if (i === j) {
        continue;
      }
      peopleNodes[i].addLink(peopleNodes[j]);
    }
  }

  peopleNodes[1].addLink(peopleNodes[7]);
  peopleNodes[7].addLink(peopleNodes[1]);

  // third bubble
  for (let i = 12; i <= 15; i++) {
    p = new Person(
      infectiousDayEarliest,
      infectiousDayLatest,
      infectiousPeriodDays,
      infectiousProbability,
      maskReductProbability,
      false
    );
    n = new GraphNode({
      person: p,
      group: "bubble3",
    });
    peopleNodes.push(n);
  }

  for (let i = 12; i <= 15; i++) {
    for (let j = 12; j <= 15; j++) {
      if (i === j) {
        continue;
      }
      peopleNodes[i].addLink(peopleNodes[j]);
    }
  }

  peopleNodes[12].addLink(peopleNodes[5]);
  peopleNodes[5].addLink(peopleNodes[12]);

  // fourth bubble
  for (let i = 16; i <= 20; i++) {
    p = new Person(
      infectiousDayEarliest,
      infectiousDayLatest,
      infectiousPeriodDays,
      infectiousProbability,
      maskReductProbability,
      false
    );
    n = new GraphNode({
      person: p,
      group: "bubble4",
    });
    peopleNodes.push(n);
  }

  for (let i = 16; i <= 20; i++) {
    for (let j = 16; j <= 20; j++) {
      if (i === j) {
        continue;
      }
      peopleNodes[i].addLink(peopleNodes[j]);
    }
  }

  peopleNodes[2].addLink(peopleNodes[20]);
  peopleNodes[20].addLink(peopleNodes[2]);
  peopleNodes[17].addLink(peopleNodes[11]);
  peopleNodes[11].addLink(peopleNodes[17]);

  // fifth bubble
  for (let i = 21; i <= 27; i++) {
    p = new Person(
      infectiousDayEarliest,
      infectiousDayLatest,
      infectiousPeriodDays,
      infectiousProbability,
      maskReductProbability,
      false
    );
    n = new GraphNode({
      person: p,
      group: "bubble5",
    });
    peopleNodes.push(n);
  }
  for (let i = 21; i <= 26; i++) {
    peopleNodes[i].addLink(peopleNodes[i + 1]);
    peopleNodes[i + 1].addLink(peopleNodes[i]);
  }
  for (let x of [21, 22, 23, 25]) {
    peopleNodes[27].addLink(peopleNodes[x]);
    peopleNodes[x].addLink(peopleNodes[27]);
  }
  for (let x of [21, 25]) {
    peopleNodes[23].addLink(peopleNodes[x]);
    peopleNodes[x].addLink(peopleNodes[23]);
  }
  for (let x of [24, 26]) {
    peopleNodes[22].addLink(peopleNodes[x]);
    peopleNodes[x].addLink(peopleNodes[22]);
  }

  peopleNodes[21].addLink(peopleNodes[3]);
  peopleNodes[3].addLink(peopleNodes[21]);
  peopleNodes[22].addLink(peopleNodes[4]);
  peopleNodes[4].addLink(peopleNodes[22]);

  // sixth bubble
  for (let i = 28; i <= 32; i++) {
    p = new Person(
      infectiousDayEarliest,
      infectiousDayLatest,
      infectiousPeriodDays,
      infectiousProbability,
      maskReductProbability,
      false
    );
    n = new GraphNode({
      person: p,
      group: "bubble6",
    });
    peopleNodes.push(n);
  }
  for (let i = 28; i <= 31; i++) {
    peopleNodes[i].addLink(peopleNodes[i + 1]);
    peopleNodes[i + 1].addLink(peopleNodes[i]);
  }
  for (let x of [28, 29, 32]) {
    peopleNodes[31].addLink(peopleNodes[x]);
    peopleNodes[x].addLink(peopleNodes[31]);
  }
  for (let x of [28, 30]) {
    peopleNodes[32].addLink(peopleNodes[x]);
    peopleNodes[x].addLink(peopleNodes[32]);
  }

  peopleNodes[28].addLink(peopleNodes[26]);
  peopleNodes[26].addLink(peopleNodes[28]);

  // patient zero
  peopleNodes[0].data.person.startInfection();
  totalAffected += 1;
};

var updateVisualizationData = function () {
  for (n of peopleNodes) {
    n.data.person.updateInfection();
    if (n.data.person.infectionState === Person.infectionStates.INFECTIOUS) {
      if (!checkCurrentInfections(n.data.person)) {
        currentInfectedPeople.push(n.data.person);
        currentlyInfectious += 1;
      }
      for (let l of n.links) {
        if (
          l.data.person.infectionState === Person.infectionStates.CLEAN &&
          Math.random() <= n.data.person.transmissionProbability
        ) {
          l.data.person.startInfection();
          //console.log(`person ${l.data.person.id} infected`);
          totalAffected += 1;
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
  const arena = document.querySelector("#arena");

  var visualisationRenderingData = {
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
  };

  var renderBubble = function (
    origin,
    bubbleName
  ) {
    let element = document.createElement("div");
    element.id = bubbleName;
    element.style.position = `absolute`;
    element.style.left = `${origin.x}px`;
    element.style.top = `${origin.y}px`;
    element.style.width = `${bubbleWidth}px`;
    element.className = "bubble";
    arena.appendChild(element);
  };

  var renderPeople = function (
    origin,
    nodes,
    initAngle = 0,
    clockwise = true
  ) {
    let r = (bubbleWidth - bubbleWidth / nodes.length) / 3;
    let aDiff = 360 / nodes.length;
    let a = initAngle;
    let x, y;
    let tooltip;

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
      tooltip = `${n.data.person.id}`;

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
      e.style.width = `${20}px`;
      e.title = tooltip;

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

  var renderLink = function (startElement, endElement) {
    let l;
    let t;
    let w;
    let a;

    let sElementTop = parseFloat(startElement.style.top);
    let eElementTop = parseFloat(endElement.style.top);
    let sElementLeft = parseFloat(startElement.style.left);
    let eElementLeft = parseFloat(endElement.style.left);

    l = sElementLeft + parseFloat(startElement.style.width) / 2;
    t = sElementTop + parseFloat(startElement.style.width) / 2;

    w = Math.sqrt(
      Math.pow(sElementLeft - eElementLeft, 2) +
      Math.pow(sElementTop - eElementTop, 2)
    );

    // I ain't got no clue why I gotta add 180 here but it works and it's 2 in the morning.
    a =
      (Math.atan2(sElementTop - eElementTop, sElementLeft - eElementLeft) *
        180) /
      Math.PI +
      180;

    let link = document.createElement("div");
    arena.insertBefore(link, arena.firstChild);
    link.className = "link";

    link.style.position = `absolute`;
    link.style.left = `${l}px`;
    link.style.top = `${t}px`;
    link.style.width = `${w}px`;
    link.style.height = `0`;
    link.style.transformOrigin = `0 0`;
    link.style.transform = `rotate(${a}deg)`;

    //console.log(link, startElement, endElement);
  };

  for (let i = 1; i <= 6; i++) {
    let bubbleName = `bubble${i}`;
    let origin = {
      x: visualisationRenderingData[bubbleName].x,
      y: visualisationRenderingData[bubbleName].y,
    };
    let initAngle = visualisationRenderingData[bubbleName].initialAngle;
    let clockwise = visualisationRenderingData[bubbleName].distributeClockwise;
    let bubbleNodes = peopleNodes.filter(function (node) {
      return node.data.group === bubbleName;
    });
    renderBubble(origin, bubbleName);
    renderPeople(origin, bubbleNodes, initAngle, clockwise);
  }

  let linkedNodes = [];
  for (n of peopleNodes) {
    let links = n.links.filter(function (link) {
      return !linkedNodes.includes(link);
    });
    for (l of links) {
      if (!linkedNodes.includes(n)) {
        renderLink(n.element, l.element);
      }
    }
    linkedNodes.push(n);
  }
};

var renderUpdatedVisualization = function () {
  let e;
  let p;
  for (n of peopleNodes) {
    e = n.element;
    if (e.classList.contains("post-infection")) {
      continue;
    }
    p = n.data.person;
    if (
      n.data.person.infectionState === Person.infectionStates.POST_INFECTIOUS &&
      e.classList.contains("infectious")
    ) {
      // e.classList.remove("clean");
      // e.classList.remove("incubating");
      e.classList.remove("infectious");
      e.classList.add("post-infection");
    } else if (
      n.data.person.infectionState === Person.infectionStates.INFECTIOUS &&
      e.classList.contains("incubating")
    ) {
      // e.classList.remove("clean");
      e.classList.remove("incubating");
      e.classList.add("infectious");
      // e.classList.remove("post.infection");
    } else if (
      n.data.person.infectionState === Person.infectionStates.PRE_INFECTIOUS &&
      e.classList.contains("clean")
    ) {
      e.classList.remove("clean");
      e.classList.add("incubating");
      // e.classList.remove("infectious");
      // e.classList.remove("post.infection");
    } else if (
      n.data.person.infectionState === Person.infectionStates.CLEAN &&
      !e.classList.contains("clean")
    ) {
      e.classList.add("clean");
      // e.classList.remove("incubating");
      // e.classList.remove("infectious");
      // e.classList.remove("post.infection");
    }
    if (n.data.person.wearingMask) {
      e.classList.add("mask");
    } else {
      e.classList.remove("mask");
    }

    n.element = e;
  }
};

var renderResults = function () {
  document.querySelector("#results-day").innerHTML = currentDay;
  document.querySelector("#results-infected").innerHTML = currentlyInfectious;
  document.querySelector("#results-total").innerHTML = totalAffected;
};

// see `resetSimulation` for clearing Visualization Rendering

/*** SIMULATION MANAGEMENT ***/
var prepareSimulation = function () {
  prepareVisualizationData();
  renderInitialVisualization();
};

var startSimulation = function () {
  runScenario = true;
  mainLoop();
};

var stopSimulation = function () {
  runScenario = false;
};

var resetSimulation = function () {
  runScenario = false;
  document.querySelector("#arena").innerHTML = "";
  document.querySelector("#control-play-pause").innerHTML = "Play";
  setControlsDisabled(false);
  peopleNodes = [];
  currentDay = 0;
  currentlyInfectious = 0;
  totalAffected = 0;
  renderResults();
  Person.resetID();
  GraphNode.resetID();
};

/*** EVENT LOOP ***/
var mainLoop = function () {
  if (!runScenario) {
    return;
  }
  currentDay += 1;

  updateVisualizationData();
  renderUpdatedVisualization();
  renderResults();

  setTimeout(function () {
    mainLoop();
  }, speed);
};

/*** LOADING ***/
window.onload = function () {
  resetSimulation();
  let arena = document.querySelector("#arena");
  arena.style.width = `${arenaWidth}px`;
  arena.style.height = `${arenaHeight}px`;
};

window.onresize = function () {};