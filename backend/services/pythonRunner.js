const { spawn } = require("child_process");
const fs = require("fs/promises");
const path = require("path");

async function runPython(csvPath, settings) {
    let csvContents;
    try {
        csvContents = await fs.readFile(csvPath);
    } catch (error) {
        throw new Error(`The uploaded CSV could not be read by the backend: ${error.message}. Upload the file again and check that backend/uploads is writable.`);
    }

    return new Promise((resolve, reject) => {
        const pythonFile = path.join(__dirname, "../python/stat.py");
        const python = spawn("python", [pythonFile, "-", JSON.stringify(settings)], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        let result = "";
        let error = "";
        let settled = false;
        const fail = (cause) => {
            if (settled) return;
            settled = true;
            reject(cause);
        };

        python.stdout.on("data", (data) => { result += data.toString(); });
        python.stderr.on("data", (data) => { error += data.toString(); });
        python.on("error", (spawnError) => {
            fail(new Error(`Could not start Python (${spawnError.message}). Install Python 3 and make sure it is available on PATH.`));
        });
        python.stdin.on("error", (stdinError) => {
            if (stdinError.code !== "EPIPE") fail(new Error(`Could not send the CSV data to Python: ${stdinError.message}`));
        });
        python.on("close", (code) => {
            if (settled) return;
            if (code !== 0) {
                return fail(new Error(error.trim() || `Python exited with status ${code}.`));
            }

            try {
                const parsedResult = JSON.parse(result);
                settled = true;
                resolve(parsedResult);
            } catch (parseError) {
                fail(new Error(`Python returned invalid result data: ${parseError.message}`));
            }
        });

        python.stdin.end(csvContents);
    });
}

module.exports = runPython;
