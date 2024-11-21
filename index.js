window.ipc = new Proxy({}, {
    get(target, varKey) {
        return new Proxy({}, {
            get(target, methodKey) {
                return (...args) => {
                    return new Promise((resolve, reject) => {
                        const uuid = crypto.randomUUID();
                        const eventListener = (message) => {
                            if (message.data.uuid === uuid) {
                                window.chrome.webview.removeEventListener('message', eventListener);
                                if ("error" in message.data) {
                                    reject(message.data.error);
                                } else {
                                    resolve(message.data.data);
                                }
                            }
                        };
                        window.chrome.webview.addEventListener('message', eventListener);
                        window.chrome.webview.postMessage({uuid, instance: varKey, method: methodKey, args});
                    });
                };
            }
        });
    }
});
export {}