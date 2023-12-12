module.exports = {
  packagerConfig: {
    executableName: "Mypharma Notificador",
    icon: "./src/assets/win-logo.ico",
    extraResource: [
      "./src/assets"
    ]
  },
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      "platforms": [
        "win32",
      ],
      config: {
        repository: {
          owner: "mypharmabr",
          name: "sites-app-notificator"
        },
        draft: false,
        prerelease: false,
        authToken: "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"
      }
    },
    {
      name: "@electron-forge/publisher-s3",
      config: {
        "public": true,
        "region": "us-west-2",
        "bucket": "myp-public",
        "folder": "site-app-notificator",
        "accessKeyId": "AKIAJ2NVZA7FT3W4346Q",
        keyResolver: () => {
          return `site-app-notificator/artifacts/Mypharma-notificador.exe`;
        },
        "secretAccessKey": "4x/fUHvGricTN5oy8UDbm8dLh+AND87Q1MfXH0l/",
        authToken: "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",
      }
    }
  ],
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        setupIcon: "./src/assets/win-logo.ico",
        iconUrl: "https://myp-public.s3.us-west-2.amazonaws.com/mockups/win-logo_1.ico",
        authors: "Mypharma",
        owners: "Mypharma",
        skipUpdateIcon: true
      }
    }
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack/webpack.main.config.js",
        devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'",
        renderer: {
          config: "./webpack/webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/public/index.html",
              js: "./src/index.tsx",
              name: "main_window",
              preload: {
                "js": "./electron/bridge.ts"
              }
            }
          ]
        }
      }
    }
  ]
}