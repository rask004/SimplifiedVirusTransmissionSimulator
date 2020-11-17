class TransmissionManager {

    static infectionDistributions = {
        UNIFORM: "uniform",
        LINEAR: "linear",
        CURVED: "curved",
    }

    static maskTransmissionRoutes = {
        RECEIVE: "receive",
        TRANSMIT: "pass on",
        BOTH: "receive and pass on",
    }
    static calculateTransmissionProbability(maxInfectionProb, infectionProbPattern, maskReductionPattern, transmitterHasMask, transmitterMaskReductionProb, receiverHasMask, receiverMaskReductionProb, infectionPatternData = []
    ) {
        let prob;
        if (infectionProbPattern === this.infectionDistributions.UNIFORM) {
            prob = maxInfectionProb;
            //console.log(`UNIFORM probability: ${prob}`);
        }
        else if (infectionProbPattern === this.infectionDistributions.LINEAR) {
            let firstDay = infectionPatternData[0];
            let maxProbDay = infectionPatternData[1];
            let lastDay = infectionPatternData[2];
            let currentDay = infectionPatternData[3];

            if (currentDay <= firstDay || currentDay >= lastDay) {
                prob = 0;
            }
            else if (currentDay == maxProbDay) {
                prob = maxInfectionProb;
            }
            else if (currentDay < maxProbDay) {
                prob = ((currentDay - firstDay) / (maxProbDay - firstDay)) * maxInfectionProb;
            }
            else {
                prob = (1 - (currentDay - maxProbDay) / (lastDay - maxProbDay)) * maxInfectionProb;
            }
            //console.log(`LINEAR probability: ${prob}`);
        }
        else if (infectionProbPattern === this.infectionDistributions.CURVED) {
            let firstDay = infectionPatternData[0];
            let maxProbDay = infectionPatternData[1];
            let lastDay = infectionPatternData[2];
            let currentDay = infectionPatternData[3];

            if (currentDay <= firstDay || currentDay >= lastDay) {
                prob = 0;
            }
            else if (currentDay == maxProbDay) {
                prob = maxInfectionProb;
            }
            else if (currentDay < maxProbDay) {
                prob = -1 * maxInfectionProb / Math.pow(maxProbDay - firstDay, 2) * Math.pow(maxProbDay - currentDay, 2) + maxInfectionProb;
            }
            else {
                prob = -1 * maxInfectionProb / Math.pow(lastDay - maxProbDay, 2) * Math.pow(maxProbDay - currentDay, 2) + maxInfectionProb;
            }
            //console.log(`CURVED probability: ${prob}`);
        }
        else {
            prob = maxInfectionProb;
            //console.log(`DEFAULT probability: ${prob}`);
        }
        
        if (receiverHasMask && (maskReductionPattern === this.maskTransmissionRoutes.RECEIVE || maskReductionPattern === this.maskTransmissionRoutes.BOTH)) {
            prob *= (1 - receiverMaskReductionProb / 100);
            //console.log(`Reduced risk: receiving, by ${receiverMaskReductionProb / 100} to ${prob}`);
        }
        if (transmitterHasMask && (maskReductionPattern === this.maskTransmissionRoutes.TRANSMIT || maskReductionPattern === this.maskTransmissionRoutes.BOTH)) {
            prob *= (1 - transmitterMaskReductionProb / 100);
            //console.log(`Reduced risk: transmitting, by ${transmitterMaskReductionProb / 100} to ${prob}`);
        }

        return prob / 100;
    }
}