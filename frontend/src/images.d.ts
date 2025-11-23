declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

export {};

// Explicit declaration for importing from ../public path used in components
declare module "../public/seatrium_logo_white.png" {
  const value: string;
  export default value;
}
