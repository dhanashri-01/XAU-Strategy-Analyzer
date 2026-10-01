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

        python.on("close", (code) => {

            if (code !== 0) {
                return reject(error);
            }

            try {

                            console.log("===== RAW PYTHON OUTPUT =====");
                console.log(result);
                console.log("=============================");

resolve(JSON.parse(result));
            } catch (err) {

                reject(err);

            }

        });

    });
}

module.exports = runPython;