# HSE-FLS – Human Stress–Environment Feedback Loop System

## Live Preview

[HSE-FLS – Live Preview] https://hse-fls.web.app/

---

## About the Project

**HSE-FLS (Human Stress–Environment Feedback Loop System)** is an IoT-based system designed to monitor physiological indicators associated with human stress and provide real-time environmental feedback.

The system combines an **ESP32 microcontroller**, physiological sensors, real-time data processing, and an interactive monitoring interface to detect changes in a user's stress-related signals and respond through environmental control.

The core concept is a **closed feedback loop**:

```text
Physiological Sensors
        ↓
     ESP32
        ↓
Data Collection & Processing
        ↓
 Stress Detection
        ↓
Environmental Response
        ↓
 Continuous Monitoring
        ↺
```

## Key Features

* **Real-Time Stress Monitoring** – Continuously collects physiological signals associated with stress.
* **HRV Monitoring** – Uses heart-rate-related data to identify changes in autonomic activity.
* **Skin Temperature Monitoring** – Tracks variations in skin temperature as an additional physiological indicator.
* **GSR Monitoring** – Measures changes in galvanic skin response associated with physiological arousal.
* **ESP32-Based IoT System** – Uses ESP32 as the central microcontroller for sensor integration and processing.
* **Environmental Feedback** – Provides an environmental response based on detected stress conditions.
* **Automatic Fan Control** – Controls the connected fan as part of the environmental feedback mechanism.
* **Real-Time Dashboard** – Provides a web-based interface for monitoring system information.
* **Sensor Data Visualization** – Displays collected physiological and system data in an understandable format.
* **Feedback Loop Architecture** – Continuously monitors the user's state and adapts the environment accordingly.

## System Workflow

```text
User
 ↓
Physiological Sensors
 ↓
ESP32 Microcontroller
 ↓
HRV / GSR / Temperature Data
 ↓
Stress Analysis
 ↓
Stress Level Detection
 ↓
Environmental Feedback
 ↓
Fan / Cooling Response
 ↓
User Environment
 ↓
Continuous Monitoring
```

## Hardware

* ESP32
* Heart Rate / HRV Sensor
* GSR Sensor
* Skin Temperature Sensor
* Fan
* Supporting electronic components

## Technology Stack

### Hardware & IoT

* ESP32
* Physiological Sensors
* IoT-based Data Collection
* Environmental Control

### Software

* React.js
* JavaScript
* HTML5
* CSS3

### Development & Simulation

* Wokwi
* ESP32 Simulation
* Sensor Data Processing

## Project Highlights

* IoT-based physiological monitoring
* Real-time stress-related signal analysis
* Multi-sensor data integration
* Automated environmental response
* ESP32-based hardware architecture
* Interactive web monitoring interface
* Closed-loop human–environment feedback system
* Designed as a prototype for intelligent stress-aware environments
