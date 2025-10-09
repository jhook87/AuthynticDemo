/// <reference types="vite/client" />

declare module '*.jpg?url' {
  const src: string;
  export default src;
}

declare module '*.wav?url' {
  const src: string;
  export default src;
}

declare module '*.mp4?url' {
  const src: string;
  export default src;
}

