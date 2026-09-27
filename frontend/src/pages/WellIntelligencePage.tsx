import React, { useState } from 'react';
import { Well, Formation, SimilarWell } from '../types';
import { FormationCorrelation } from '../components/intelligence/FormationCorrelation';
import { WellComparisonMatrix } from '../components/intelligence/WellComparisonMatrix';
import { SimilarityWeightSliders } from '../components/intelligence/SimilarityWeightSliders';
import { Layers, Zap } from 'lucide-react';
import { api } from '../services/api';

interface WellIntelligencePageProps {
  targetWell: Well;
  currentDepth: number;
  formations: Formation[];
  analogues: SimilarWell[];
  onAnaloguesUpdated?: (wells: SimilarWell[]) => void;
}

export const WellIntelligencePage: React.FC<WellIntelligencePageProps> = ({
  targetWell,
  currentDepth,
  formations,
  analogues,
  onAnaloguesUpdated
}) => {
  const [weights, setWeights] = useState({
    geological: 0.35,
    spatial: 0.25,
    depth: 0.15,
    formation: 0.10,
    drilling_design: 0.10,
    historical_performance: 0.05
  });

  const handleWeightsChange = async (newWeights: any) => {
    setWeights(newWeights);
    try {
      const updated = await api.getSimilarWells(targetWell.well_id, newWeights);
      if (onAnaloguesUpdated) onAnaloguesUpdated(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetWeights = async () => {
    const defaultWeights = {
      geological: 0.35,
      spatial: 0.25,
      depth: 0.15,
      formation: 0.10,
      drilling_design: 0.10,
      historical_performance: 0.05
    };
    setWeights(defaultWeights);
    try {
      const updated = await api.getSimilarWells(targetWell.well_id, defaultWeights);
      if (onAnaloguesUpdated) onAnaloguesUpdated(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subsurface Stratigraphy Cross-Section */}
      <FormationCorrelation
        formations={formations}
        activeDepth={currentDepth}
        topWells={analogues}
      />

      {/* Side-by-Side Multi-Well Comparison Matrix */}
      <WellComparisonMatrix
        targetWell={targetWell}
        analogues={analogues}
      />

      {/* Similarity Engine Weight Tuner */}
      <SimilarityWeightSliders
        weights={weights}
        onChange={handleWeightsChange}
        onReset={handleResetWeights}
      />
    </div>
  );
};
