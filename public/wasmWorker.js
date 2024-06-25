self.onmessage = async (event) => {
  try {
    const wasmCode = new Uint8Array(event.data);
    const module = await WebAssembly.compile(wasmCode);
    postMessage({ module });
  } catch (error) {
    console.error('Compilation failed in worker:', error);
    postMessage({ error: error.message });
  }
};