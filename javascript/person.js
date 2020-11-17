class Person {

  static id_count = 0;

  static defaultID() {
    this.id_count += 1;
    return `P${this.id_count}`;
  }

  static resetID() {
    this.id_count = 0;
  }

  static infectionStates = {
    CLEAN: 0,
    INCUBATING: 1,
    SYMPTOMATIC: 2,
    POST_INFECTIOUS: 3,
  }

  // TODO: modify this to remove the calculate infection probability function.
  // have the day of max infectiousness, the incubation period, and the symptomatic period.
  // there should be getters to get the current day of infection, the first day of infection, the day of max infection, and the last day of infection.
  // the getter for current infection day should return 0 if the person is not infectious.

  id;
  infected = Person.infectionStates.CLEAN;
  mask;
  maxInfProb;
  maskReductProb;
  
  infectedDays = 0;

  incubationPeriod; // Days
  symptomaticPeriod; // Days
  dayOfMaxInfectiousProbability;


  constructor(incubationPeriodDays, symptomaticPeriodDays, symptomaticDayOfMaxProbInfection, maxInfectiousProb, maskReductionProb, isWearingMask, id = undefined) {
    if (id === undefined) {
      this.id = Person.defaultID();
    } else {
      this.id = id;
    }
    
    this.incubationPeriod = incubationPeriodDays;
    this.dayOfMaxInfectiousProbability = symptomaticDayOfMaxProbInfection;
    this.symptomaticPeriod = symptomaticPeriodDays;
    this.maxInfProb = maxInfectiousProb;
    this.maskReductProb = maskReductionProb;
    this.mask = isWearingMask;
  }

  get id() {
    return this.id();
  }

  equals(person) {
    if (person instanceof Person && person.id === this.id) {
      return true;
    }
    return false;
  }

  get infectionState() {
    return this.infected;
  }

  get isWearingMask() {
    return this.mask;
  }

  set isWearingMask(x) {
    this.mask = x;
  }

  startInfection() {
    if (this.infected === Person.infectionStates.CLEAN) {
      this.infected = Person.infectionStates.INCUBATING;
    }
  }

  updateInfection() {
    if (this.infected !== Person.infectionStates.CLEAN) {
      this.infectedDays += 1;
      if (this.infectedDays > (this.incubationPeriod + this.symptomaticPeriod) && this.infected != Person.infectionStates.POST_INFECTIOUS) {
        this.infected = Person.infectionStates.POST_INFECTIOUS;
      }
      else if (this.infectedDays <= (this.incubationPeriod + this.symptomaticPeriod) && this.infectedDays > this.incubationPeriod && this.infected != Person.infectionStates.SYMPTOMATIC) {
        this.infected = Person.infectionStates.SYMPTOMATIC;
      }
    }
  }

  get maximumInfectionProbability() {
    return this.maxInfProb;
  }

  set maximumInfectionProbability(x) {
    this.maxInfProb = x;
  }

  get maskInfectionReductionProbability() {
    return this.maskReductProb;
  }

  set maskInfectionReductionProbability(x) {
    this.maskReductProb = x;
  }

  get infectionPeriodInDays() {
    return this.incubationPeriod;
  }

  set infectionPeriodInDays(x) {
    this.incubationPeriod = x;
  }

  get symptomsPeriodDays() {
    return this.symptomaticPeriod;
  }

  set symptomsPeriodDays(x) {
    this.symptomaticPeriod = x;
  }

  get symptomsDayOfPeakInfectionRisk() {
    return this.dayOfMaxInfectiousProbability;
  }

  set symptomsDayOfPeakInfectionRisk(x) {
    this.dayOfMaxInfectiousProbability = x;
  }

  get lengthOfInfectionInDays() {
    return this.infectedDays;
  }

  set lengthOfInfectionInDays(x) {
    this.infectedDays = x;
  }
}
