/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-native" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}
