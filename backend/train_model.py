import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, root_mean_squared_error
import joblib

print("Generating synthetic historical dataset for Delhi NCR...")
# Simulate 1000 days of data for the hackathon demo
np.random.seed(42)

days = 1000
# Features:
# - lag_aqi: Previous day's AQI (highly correlated with today's AQI)
# - wind_speed: Wind speed in km/h (higher wind = lower AQI usually, dispersion)
# - fire_count: Number of NASA FIRMS active hotspots detected (higher fires = higher AQI)
# - month: To capture seasonal patterns (Oct-Nov higher)

months = np.random.randint(1, 13, days)
lag_aqi = np.random.normal(200, 80, days)
lag_aqi = np.clip(lag_aqi, 50, 500)

wind_speed = np.random.normal(10, 5, days)
wind_speed = np.clip(wind_speed, 0, 30)

# Simulate higher fire counts in Oct/Nov
fire_count = np.where(
    np.isin(months, [10, 11]), 
    np.random.normal(500, 200, days), # High fires
    np.random.normal(50, 20, days)    # Low fires
)
fire_count = np.clip(fire_count, 0, 1500)

# Target: Next day AQI
# Function: base + (lag_aqi * 0.5) - (wind_speed * 4) + (fire_count * 0.15) + noise
target_aqi = 50 + (lag_aqi * 0.5) - (wind_speed * 4) + (fire_count * 0.15) + np.random.normal(0, 20, days)
target_aqi = np.clip(target_aqi, 20, 500)

df = pd.DataFrame({
    'lag_aqi': lag_aqi,
    'wind_speed': wind_speed,
    'fire_count': fire_count,
    'month': months,
    'target_aqi': target_aqi
})

X = df[['lag_aqi', 'wind_speed', 'fire_count', 'month']]
y = df['target_aqi']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training Gradient Boosting Regressor...")
model = GradientBoostingRegressor(
    n_estimators=150, 
    learning_rate=0.05, 
    max_depth=4, 
    random_state=42
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
rmse = root_mean_squared_error(y_test, y_pred)

print(f"Model Training Complete!")
print(f"Validation R2 Score: {r2:.2f}")
print(f"Validation MAE: {mae:.2f}")
print(f"Validation RMSE: {rmse:.2f}")

# Save the model
joblib.dump(model, 'model.pkl')
print("Model saved to 'model.pkl'")
