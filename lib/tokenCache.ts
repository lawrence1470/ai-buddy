import * as SecureStore from "expo-secure-store";

const createTokenCache = () => {
  return {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`Retrieved token for key: ${key}`);
        } else {
          console.log(`No token found for key: ${key}`);
        }
        return item;
      } catch (error) {
        console.error("SecureStore getItem error:", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    async saveToken(key: string, token: string) {
      try {
        await SecureStore.setItemAsync(key, token);
        console.log(`Saved token for key: ${key}`);
      } catch (error) {
        console.error("SecureStore setItem error:", error);
      }
    },
    async clearToken(key: string) {
      try {
        await SecureStore.deleteItemAsync(key);
        console.log(`Cleared token for key: ${key}`);
      } catch (error) {
        console.error("SecureStore deleteItem error:", error);
      }
    },
  };
};

export const tokenCache = createTokenCache();
