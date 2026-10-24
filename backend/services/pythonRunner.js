const { spawn } = require("child_process");
const path = require("path");

function runPython(csvPath, settings) {
    return new Promise((resolve, reject) => {

        const pythonFile = path.join(__dirname, "../python/stat.py");

        const python = spawn("python", [
            pythonFile,
            csvPath,
            JSON.stringify(settings)
        ]);

        let result = "";
        let error = "";

        python.stdout.on("data", (data) => {
            result += data.toString();
        });

        python.stderr.on("data", (data) => {
            error += data.toString();
        });

        python.on("error", (spawnError) => {
            reject(new Error(`Could not start Python (${spawnError.message}). Install Python 3 and make sure it is available on PATH.`));
        });

        python.on("close", (code) => {

            if (code !== 0) {
                return reject(new Error(error.trim() || `Python exited with status ${code}.`));
            }

            try {

                resolve(JSON.parse(result));
            } catch (err) {
                reject(new Error(`Python returned invalid result data: ${err.message}`));
            }

        });

    });
}

module.exports = runPython;
