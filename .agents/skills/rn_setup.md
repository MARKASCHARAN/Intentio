# Skill: React Native Project Setup

## Objective
Setup a complete React Native project with Agora SDK for Intentio.

## Rules of Engagement
- Always use TypeScript template
- Install react-native-agora
- Configure Android permissions in AndroidManifest.xml
- Create all required source files

## Instructions
1. Initialize project: `npx react-native init Intentio --template react-native-template-typescript`
2. Install dependencies: `yarn add react-native-agora`
3. Create folder structure under `src/`
4. Configure Android permissions (RECORD_AUDIO, BLUETOOTH_CONNECT, INTERNET)
5. Create `src/utils/constants.ts` with Agora App ID placeholder
6. Create basic `App.tsx` with Agora engine initialization
