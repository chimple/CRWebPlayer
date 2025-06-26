export class Utils{
  public static isRespect: boolean = false;
}

//**************** Android bridge interface and declarations */
interface AndroidBridge {
  sendDataToContainer: (key: string, data: any) => void; // Method to send data to Android container
  requestDataFromContainer: (data: any) => any; // Method to request data from Android container
  sendInstalledAppInfoToJS: () => void; //New Method for sending InstalledApppInfo from Android
  // Add more methods as needed for the JavaScript interface from Android
}

declare global {
  interface Window {
    Android?: AndroidBridge;
    _callbacks: CallbackMap; //_callbacks needs to be global in order to get accesssed by window._callbacks
  }
}

type CallbackMap = {
  [key: string]: (data: any) => void;
};

// Assigning with type safety
window._callbacks = window._callbacks || {};
const _callbacks: CallbackMap = window._callbacks;

export const AndroidBridge = {
  sendDataToContainer(key: string, data: any) {
    try {
      // console.log(`Attempting to send ${key} to container:`, JSON.stringify(data));
      if (window.Android !== undefined) {
        // Stringify the data before sending to avoid [object Object] issues
        const jsonData = typeof data === "object" ? JSON.stringify(data) : data;
        window.Android.sendDataToContainer(key, jsonData);
      } else {
        console.warn("Android bridge not available: sendDataToContainer");
      }
    } catch (error) {
      console.error("Error sending data to container:", error);
    }
  },

  requestDataFromContainer(type: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (window.Android !== undefined) {
          _callbacks[type] = resolve; // store callback by type
          window.Android.requestDataFromContainer(type);
        } else {
          reject("Android bridge not available: In requestDataFromContainer");
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  requestInstalledAppInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (window.Android !== undefined) {
          _callbacks["installedAppInfo"] = resolve;

          window.Android.sendInstalledAppInfoToJS();
        } else {
          reject("Android bridge not available: In requestInstalledAppInfo");
        }
      } catch (error) {
        reject(error);
      }
    });
  },

    _handleDataFromAndroid(responseJson: string) {
    try {
      const data = JSON.parse(responseJson);
      const type = data?.type;

      if (type && _callbacks[type]) {
        _callbacks[type](data); // Resolve the Promise
        delete _callbacks[type]; // Clean up after resolving
      } else {
        console.warn("No callback found for type:", type);
      }
    } catch (e) {
      console.error("Failed to parse data from Android:", e);
    }
  },

};