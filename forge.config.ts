import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import path from 'path';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon', 
    executableName: "MehrLocalChat",
    appCopyright: "Copyright (C) 2024 Maux Platform",
    win32metadata: {
      CompanyName: "Maux Platform",
      FileDescription: "Mehr|Local Chat - Your Local AI Chat Application",
      OriginalFilename: "MehrLocalChat.exe",
      ProductName: "Mehr|Local Chat",
      InternalName: "MehrLocalChat",
    }
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl: path.resolve(__dirname, 'assets', 'icon.ico'),
      setupIcon: path.resolve(__dirname, 'assets', 'icon.ico'),
      loadingGif: path.resolve(__dirname, 'assets', 'install.png'),
      name: "MehrLocalChat",
      authors: "Maux Platform",
      description: "Mehr|Local Chat - Your Local AI Chat Application",
      setupExe: "MehrLocalChat-Setup.exe",
      exe: "MehrLocalChat.exe",
      
      noMsi: true,
    }),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new VitePlugin({
     
      build: [
        {
     
          entry: "src/main.ts",
          config: "vite.main.config.ts",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.ts",
          target: "preload",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.mts",
        },
      ],
    }),
   
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
