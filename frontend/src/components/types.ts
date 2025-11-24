export interface Connection {
  id: string;
  host: string;
  port: number;
  username: string;
  password: string;
  connected: boolean;
  connecting: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prevState?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  error?: string;
}