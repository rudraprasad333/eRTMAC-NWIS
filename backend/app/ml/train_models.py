import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from app.config import MODELS_DIR

def generate_training_data(n_samples=2500):
    np.random.seed(42)
    
    # Feature columns:
    # 0: depth (m)
    # 1: rop (m/hr)
    # 2: wob (klbs)
    # 3: rpm (rpm)
    # 4: torque (kft-lbs)
    # 5: mud_weight (ppg)
    # 6: pressure (psi)
    # 7: formation_code (0: Alluvium, 1: Thumbli, 2: Dharvi Dungar, 3: Barmer Hill, 4: Fatehgarh Upper, 5: Fatehgarh Lower, 6: Nagana)
    # 8: offset_event_density (0.0 to 1.0)
    # 9: geological_similarity (0.0 to 1.0)

    depths = np.random.uniform(500, 3500, n_samples)
    
    formation_codes = []
    for d in depths:
        if d < 350: formation_codes.append(0)
        elif d < 1150: formation_codes.append(1)
        elif d < 1950: formation_codes.append(2)
        elif d < 2650: formation_codes.append(3)
        elif d < 2700: formation_codes.append(4)
        elif d < 2850: formation_codes.append(5) # Fatehgarh Lower
        else: formation_codes.append(6)
    formation_codes = np.array(formation_codes)

    # Correlated drilling physics
    rops = np.where(formation_codes == 5, np.random.uniform(4, 12, n_samples), np.random.uniform(12, 28, n_samples))
    wobs = np.where(formation_codes == 5, np.random.uniform(18, 30, n_samples), np.random.uniform(10, 22, n_samples))
    rpms = np.where(formation_codes == 5, np.random.uniform(80, 110, n_samples), np.random.uniform(100, 140, n_samples))
    torques = np.where(formation_codes == 5, np.random.uniform(20, 35, n_samples), np.random.uniform(8, 18, n_samples))
    mud_weights = np.where(formation_codes == 5, np.random.uniform(10.5, 11.5, n_samples), np.random.uniform(9.0, 10.2, n_samples))
    pressures = 2000 + depths * 0.45 + np.random.normal(0, 50, n_samples)
    offset_event_densities = np.where(formation_codes == 5, np.random.uniform(0.6, 0.95, n_samples), np.random.uniform(0.05, 0.35, n_samples))
    geological_similarities = np.random.uniform(0.7, 0.98, n_samples)

    X = np.column_stack([
        depths, rops, wobs, rpms, torques, mud_weights, pressures,
        formation_codes, offset_event_densities, geological_similarities
    ])

    # Labels with clear physical triggers:
    # 1. Stuck Pipe: (Fatehgarh Lower OR Barmer Hill) AND High Torque AND Low ROP AND High Mud Weight
    stuck_pipe_prob = (
        0.45 * (formation_codes == 5) +
        0.20 * (torques > 22.0) +
        0.15 * (rops < 10.0) +
        0.10 * (offset_event_densities > 0.6) +
        np.random.uniform(0, 0.1, n_samples)
    )
    y_stuck_pipe = (stuck_pipe_prob > 0.55).astype(int)

    # 2. Lost Circulation: (Fatehgarh Lower OR Alluvium) AND High Mud Weight AND Overpressure
    lost_circ_prob = (
        0.40 * (formation_codes == 5) +
        0.25 * (mud_weights > 10.8) +
        0.15 * (torques > 20.0) +
        0.10 * (offset_event_densities > 0.5) +
        np.random.uniform(0, 0.1, n_samples)
    )
    y_lost_circ = (lost_circ_prob > 0.50).astype(int)

    # 3. Kick: Fatehgarh Lower AND Low Mud Weight OR Pressure Spike
    kick_prob = (
        0.35 * (formation_codes == 5) +
        0.25 * (pressures > 3300) +
        0.20 * (mud_weights < 10.4) +
        np.random.uniform(0, 0.1, n_samples)
    )
    y_kick = (kick_prob > 0.55).astype(int)

    # 4. High Torque: Torques > 22.0 or formation == 5 or formation == 6
    high_torque_prob = (
        0.40 * (torques > 21.0) +
        0.30 * (formation_codes >= 5) +
        0.15 * (wobs > 20.0) +
        np.random.uniform(0, 0.1, n_samples)
    )
    y_high_torque = (high_torque_prob > 0.50).astype(int)

    # 5. NPT: High risk of any of the above
    y_npt = ((y_stuck_pipe | y_lost_circ | y_kick | y_high_torque) & (np.random.uniform(0, 1, n_samples) > 0.15)).astype(int)

    return X, {
        "stuck_pipe": y_stuck_pipe,
        "lost_circulation": y_lost_circ,
        "kick": y_kick,
        "high_torque": y_high_torque,
        "npt": y_npt
    }

def train_and_save_models():
    print("Generating synthetic drilling physics training dataset...")
    X, targets = generate_training_data()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    trained_models = {}
    feature_names = [
        "depth", "rop", "wob", "rpm", "torque", "mud_weight",
        "pressure", "formation_code", "offset_event_density", "geological_similarity"
    ]

    for name, y in targets.items():
        print(f"Training ML Model for {name.upper()} risk...")
        clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
        clf.fit(X_scaled, y)
        trained_models[name] = clf
        
        # Save individual model
        joblib.dump(clf, MODELS_DIR / f"{name}_model.joblib")

    joblib.dump(scaler, MODELS_DIR / "feature_scaler.joblib")
    joblib.dump(feature_names, MODELS_DIR / "feature_names.joblib")
    print("All ML risk models and scalers trained and saved to models/ directory successfully!")

if __name__ == "__main__":
    train_and_save_models()
