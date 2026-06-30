# Developer setup
## Reverse proxy setup

For the local setup to work, YARP has to forward non api request to the react client. Add the following JSON to the appsettings.Developmnet.json

```json
"ReverseProxy": {
    "Routes": {
      "react": {
        "ClusterId": "react",
        "Match": {
          "Path": "{**catch-all}"
        }
      }
    },
    "Clusters": {
      "react": {
        "Destinations": {
          "react": {
            "Address": "http://localhost:5173/"
          }
        }
      }
    }
  }
```