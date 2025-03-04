# Smart Home IoT Platform

![Smart Home IoT Platform](https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80)

A comprehensive voice-controlled smart home platform built with React Native and Expo. Control your smart devices, set up automations, and manage your home environment using natural language processing.

## Features

- **Voice Control**: Natural language processing for controlling devices with voice commands
- **Device Management**: Control lights, thermostats, locks, speakers, and more
- **Automations**: Create and manage automated routines based on time, location, or device states
- **Scenes**: Activate predefined settings for different activities or moods
- **Room-based Organization**: Manage devices by room for easier control
- **Energy Monitoring**: Track energy usage across your smart home
- **Cross-Platform**: Works on iOS, Android, and Web

## Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **UI Components**: Custom components with Lucide React Native icons
- **Animations**: React Native Reanimated
- **Voice Processing**: TensorFlow.js for speech recognition
- **Real-time Communication**: Socket.io for device communication

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-home-iot-platform.git
   cd smart-home-iot-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the app:
   - Web: Open the URL displayed in your terminal
   - iOS/Android: Scan the QR code with the Expo Go app

## Project Structure

```
smart-home-iot-platform/
├── app/                    # Expo Router app directory
│   ├── _layout.tsx         # Root layout
│   ├── +not-found.tsx      # 404 page
│   └── (tabs)/             # Tab-based navigation
│       ├── _layout.tsx     # Tab configuration
│       ├── index.tsx       # Home screen
│       ├── devices.tsx     # Devices screen
│       ├── voice.tsx       # Voice control screen
│       ├── automation.tsx  # Automations screen
│       └── settings.tsx    # Settings screen
├── assets/                 # Static assets
│   ├── fonts/              # Custom fonts
│   └── images/             # Images
├── components/             # Reusable components
│   ├── DeviceCard.tsx      # Device control card
│   ├── SmartHomeContext.tsx # Context for smart home state
│   ├── VoiceVisualizer.tsx # Voice visualization component
│   └── ...                 # Other components
├── data/                   # Mock data for development
├── .npmrc                  # npm configuration
├── app.json                # Expo configuration
├── babel.config.js         # Babel configuration
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

## Voice Commands

The platform supports a variety of voice commands, including:

- "Turn on/off [device name]"
- "Turn on/off all lights"
- "Set brightness to [value]%"
- "Set temperature to [value] degrees"
- "Lock/unlock the [door name]"
- "Activate [scene name] scene"
- "Turn on night mode"
- "Turn off all devices"

## Customization

### Adding New Devices

To add new device types, update the `SmartHomeContext.tsx` file:

1. Add the device to the `initialDevices` array
2. Implement the necessary control logic in the context methods
3. Create UI components to interact with the new device type

### Creating Custom Automations

Automations can be created by:

1. Adding new automation templates to the `automations` state in `SmartHomeContext.tsx`
2. Implementing the trigger logic for different conditions
3. Defining the actions to be executed when the automation is triggered

## Web Platform Considerations

This app is designed to work on web platforms with the following considerations:

- Voice recognition uses the Web Speech API when available
- TensorFlow.js is used for offline voice command processing
- UI is responsive and adapts to different screen sizes
- Platform-specific code is handled using `Platform.select()`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing React Native development platform
- [TensorFlow.js](https://www.tensorflow.org/js) for machine learning capabilities
- [Lucide Icons](https://lucide.dev/) for the beautiful icon set
- [Unsplash](https://unsplash.com/) for stock photos
