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
    PRE_INFECTIOUS: 1,
    INFECTIOUS: 2,
    POST_INFECTIOUS: 3,
  }

  id;
  infected = Person.infectionStates.CLEAN;
  mask;
  infectedDays = 0;
  transmissionDays = 0;
  infectionEarliestDay;
  infectionLatestDay;
  infectiousPeriod;
  maxInfProb;
  maskReductProb;
  _maxInfectiousDay;


  constructor(earliestInfectiousDay, latestInfectiousDay, infectiousDays,
    maxInfectiousProb, maskReductionProb, isWearingMask) {
    this.id = Person.defaultID();
    this.infectionEarliestDay = earliestInfectiousDay;
    this.infectionLatestDay = latestInfectiousDay;
    this.infectiousPeriod = infectiousDays;
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

  startInfection() {
    if (this.infected === Person.infectionStates.CLEAN) {
      this.infected = Person.infectionStates.PRE_INFECTIOUS;
    }
  }

  get wearingMask() {
    return this.mask;
  }

  set wearingMask(isWearingMask) {
    this.mask = isWearingMask;
  }

  updateInfection() {
    if (this.infected !== Person.infectionStates.CLEAN) {
      this.infectedDays += 1;
      if (this.infected === Person.infectionStates.PRE_INFECTIOUS &&
        this.infectedDays >= this.infectionEarliestDay &&
        this.infectedDays < this.infectionLatestDay) {
        let changeProbability = (this.infectedDays - this.infectionEarliestDay) / (this.infectionLatestDay - this.infectionEarliestDay);
        let check = Math.random();
        if (check <= changeProbability) {
          this.infected = Person.infectionStates.INFECTIOUS;
        }
      } else if (this.infected === Person.infectionStates.PRE_INFECTIOUS &&
        this.infectedDays >= this.infectionLatestDay) {
        this.infected = Person.infectionStates.INFECTIOUS
      } else if (this.infected === Person.infectionStates.INFECTIOUS &&
        this.transmissionDays <= this.infectiousPeriod) {
        this.transmissionDays += 1;
      } else if (this.infected === Person.infectionStates.INFECTIOUS &&
        this.transmissionDays > this.infectiousPeriod) {
        this.infected = Person.infectionStates.POST_INFECTIOUS
      }
    }
  }

  get transmissionProbability() {
    let c = (this.infectiousPeriod + 1) / 2;
    let prob;
    if (this.transmissionDays === c) {
      prob = this.maxInfProb;
    } else if (this.transmissionDays > c) {
      prob = this.maxInfProb * ((2 * c - this.transmissionDays) / c);
    } else if (this.transmissionDays < c) {
      prob = this.maxInfProb * (this.transmissionDays / c);
    } else {
      prob = 0;
    }
    if (this.mask) {
      prob *= (1 - this.maskReductProb);
    }

    return prob / 100;
  }
}